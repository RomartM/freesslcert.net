package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log/slog"
	"strings"
	"time"

	"github.com/freesslcert/freesslcert/internal/model"
)

const createTableSQL = `
CREATE TABLE IF NOT EXISTS certificate_orders (
    id TEXT PRIMARY KEY,
    domains TEXT NOT NULL,
    certificate_type TEXT NOT NULL,
    key_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    certificate TEXT,
    private_key TEXT,
    ca_bundle TEXT,
    challenges TEXT,
    issued_at DATETIME,
    expires_at DATETIME,
    created_at DATETIME NOT NULL,
    purge_after DATETIME NOT NULL
);
`

// createDomainLogTableSQL defines the current domain_log schema. This table is
// retained indefinitely for usage metrics; only the sensitive certificate data
// in certificate_orders is purged after 24 hours. See LogDomainEvent for
// insertions and DeleteExpired for the purge semantics.
const createDomainLogTableSQL = `
CREATE TABLE IF NOT EXISTS domain_log (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id         TEXT,
    domain           TEXT NOT NULL,
    certificate_type TEXT NOT NULL,
    key_type         TEXT,
    status           TEXT NOT NULL DEFAULT 'issued',
    failure_reason   TEXT,
    country          TEXT,
    region           TEXT,
    issued_at        DATETIME,
    expires_at       DATETIME,
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`

var domainLogIndexes = []string{
	`CREATE INDEX IF NOT EXISTS idx_domain_log_created_at ON domain_log(created_at)`,
	`CREATE INDEX IF NOT EXISTS idx_domain_log_status ON domain_log(status)`,
	`CREATE INDEX IF NOT EXISTS idx_domain_log_country ON domain_log(country)`,
}

// domainLogMigrations lists columns that older deployments may be missing.
// Each entry is applied only when the column is absent (see addColumnIfMissing).
// This lets us evolve the schema in place without destroying existing rows.
var domainLogMigrations = []struct {
	column string
	ddl    string
}{
	{"status", "ALTER TABLE domain_log ADD COLUMN status TEXT NOT NULL DEFAULT 'issued'"},
	{"failure_reason", "ALTER TABLE domain_log ADD COLUMN failure_reason TEXT"},
	{"country", "ALTER TABLE domain_log ADD COLUMN country TEXT"},
	{"region", "ALTER TABLE domain_log ADD COLUMN region TEXT"},
	{"key_type", "ALTER TABLE domain_log ADD COLUMN key_type TEXT"},
	{"issued_at", "ALTER TABLE domain_log ADD COLUMN issued_at DATETIME"},
	{"expires_at", "ALTER TABLE domain_log ADD COLUMN expires_at DATETIME"},
	{"order_id", "ALTER TABLE domain_log ADD COLUMN order_id TEXT"},
}

// DomainLogEvent captures a single persistence event for a domain/order pair.
// It is used to record every outcome (pending, failed, issued) so we can
// compute usage metrics even after the sensitive certificate data has been
// purged from certificate_orders.
type DomainLogEvent struct {
	OrderID         string
	Domain          string
	CertificateType string
	KeyType         string
	Status          string
	FailureReason   string
	Country         string
	Region          string
	IssuedAt        *time.Time
	ExpiresAt       *time.Time
}

// CertificateRepository defines persistence operations for certificate orders.
type CertificateRepository interface {
	Create(ctx context.Context, order *model.CertificateOrder) error
	GetByID(ctx context.Context, id string) (*model.CertificateOrder, error)
	UpdateStatus(ctx context.Context, id string, status string) error
	UpdateCertificate(ctx context.Context, order *model.CertificateOrder) error
	UpdateChallenges(ctx context.Context, id string, challenges []model.Challenge) error
	DeleteExpired(ctx context.Context) (int64, error)
	LogDomainEvent(ctx context.Context, event DomainLogEvent) error
	PurgeSensitiveData(ctx context.Context) (int64, error)
}

// CertificateRepositoryImpl is the concrete SQL-backed repository.
// Tests in this package reference the concrete type to exercise migration
// helpers without leaking them through the interface.
type CertificateRepositoryImpl struct {
	db *sql.DB
}

// NewCertificateRepository creates the repository and ensures the schema
// exists, applying additive migrations on the domain_log table if needed.
func NewCertificateRepository(ctx context.Context, db *sql.DB) (CertificateRepository, error) {
	if _, err := db.ExecContext(ctx, createTableSQL); err != nil {
		return nil, fmt.Errorf("create certificate_orders table: %w", err)
	}
	if _, err := db.ExecContext(ctx, createDomainLogTableSQL); err != nil {
		return nil, fmt.Errorf("create domain_log table: %w", err)
	}

	r := &CertificateRepositoryImpl{db: db}

	// Apply additive migrations for older deployments whose domain_log table
	// was created before the metrics schema existed.
	for _, m := range domainLogMigrations {
		if err := r.addColumnIfMissing(ctx, "domain_log", m.column, m.ddl); err != nil {
			return nil, fmt.Errorf("migrate domain_log.%s: %w", m.column, err)
		}
	}

	// Indexes are created after migrations so the columns they reference exist.
	for _, idx := range domainLogIndexes {
		if _, err := db.ExecContext(ctx, idx); err != nil {
			return nil, fmt.Errorf("create domain_log index: %w", err)
		}
	}

	return r, nil
}

// addColumnIfMissing queries PRAGMA table_info(table) and executes ddl only
// when the target column does not already exist. This makes schema migrations
// idempotent and tolerant of partially-migrated databases.
func (r *CertificateRepositoryImpl) addColumnIfMissing(ctx context.Context, table, column, ddl string) error {
	rows, err := r.db.QueryContext(ctx, fmt.Sprintf("PRAGMA table_info(%s)", table))
	if err != nil {
		return fmt.Errorf("pragma table_info %s: %w", table, err)
	}
	defer rows.Close()

	exists := false
	for rows.Next() {
		var (
			cid          int
			name         string
			colType      sql.NullString
			notnull      int
			defaultValue sql.NullString
			pk           int
		)
		if err := rows.Scan(&cid, &name, &colType, &notnull, &defaultValue, &pk); err != nil {
			return fmt.Errorf("scan pragma row: %w", err)
		}
		if name == column {
			exists = true
		}
	}
	if err := rows.Err(); err != nil {
		return fmt.Errorf("iterate pragma rows: %w", err)
	}

	if exists {
		return nil
	}

	if _, err := r.db.ExecContext(ctx, ddl); err != nil {
		// Tolerate "duplicate column" races where another process added it
		// between the PRAGMA and the ALTER. SQLite surfaces this as a generic
		// error message so we match on substring.
		if strings.Contains(strings.ToLower(err.Error()), "duplicate column") {
			slog.Default().Debug("column already present, skipping alter",
				"table", table, "column", column)
			return nil
		}
		return fmt.Errorf("alter table %s add column %s: %w", table, column, err)
	}

	slog.Default().Info("applied domain_log migration", "column", column)
	return nil
}

// parseTime attempts to parse a time string using multiple common formats.
// This handles both RFC3339 timestamps written by Go and the
// "YYYY-MM-DD HH:MM:SS" format that SQLite's CURRENT_TIMESTAMP produces.
func parseTime(s string) (time.Time, error) {
	formats := []string{
		time.RFC3339,
		"2006-01-02 15:04:05",
		"2006-01-02T15:04:05Z",
	}
	for _, f := range formats {
		if t, err := time.Parse(f, s); err == nil {
			return t, nil
		}
	}
	return time.Time{}, fmt.Errorf("cannot parse time: %s", s)
}

func (r *CertificateRepositoryImpl) Create(ctx context.Context, order *model.CertificateOrder) error {
	domainsJSON, err := json.Marshal(order.Domains)
	if err != nil {
		return fmt.Errorf("marshal domains: %w", err)
	}

	challengesJSON, err := json.Marshal(order.Challenges)
	if err != nil {
		return fmt.Errorf("marshal challenges: %w", err)
	}

	query := `
		INSERT INTO certificate_orders
			(id, domains, certificate_type, key_type, status, challenges, created_at, purge_after)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`
	_, err = r.db.ExecContext(ctx, query,
		order.ID,
		string(domainsJSON),
		order.CertificateType,
		order.KeyType,
		order.Status,
		string(challengesJSON),
		order.CreatedAt.UTC().Format(time.RFC3339),
		order.PurgeAfter.UTC().Format(time.RFC3339),
	)
	if err != nil {
		return fmt.Errorf("insert certificate order: %w", err)
	}
	return nil
}

func (r *CertificateRepositoryImpl) GetByID(ctx context.Context, id string) (*model.CertificateOrder, error) {
	query := `
		SELECT id, domains, certificate_type, key_type, status,
		       certificate, private_key, ca_bundle, challenges,
		       issued_at, expires_at, created_at, purge_after
		FROM certificate_orders
		WHERE id = ?
	`
	row := r.db.QueryRowContext(ctx, query, id)

	var order model.CertificateOrder
	var domainsJSON, challengesJSON string
	var cert, privKey, caBundle sql.NullString
	var issuedAt, expiresAt sql.NullString
	var createdAtStr, purgeAfterStr string

	err := row.Scan(
		&order.ID,
		&domainsJSON,
		&order.CertificateType,
		&order.KeyType,
		&order.Status,
		&cert,
		&privKey,
		&caBundle,
		&challengesJSON,
		&issuedAt,
		&expiresAt,
		&createdAtStr,
		&purgeAfterStr,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("get certificate order %s: %w", id, model.ErrNotFound)
		}
		return nil, fmt.Errorf("scan certificate order: %w", err)
	}

	if err := json.Unmarshal([]byte(domainsJSON), &order.Domains); err != nil {
		return nil, fmt.Errorf("unmarshal domains: %w", err)
	}
	if challengesJSON != "" {
		if err := json.Unmarshal([]byte(challengesJSON), &order.Challenges); err != nil {
			return nil, fmt.Errorf("unmarshal challenges: %w", err)
		}
	}

	if cert.Valid {
		order.Certificate = cert.String
	}
	if privKey.Valid {
		order.PrivateKey = privKey.String
	}
	if caBundle.Valid {
		order.CABundle = caBundle.String
	}

	if issuedAt.Valid {
		t, err := parseTime(issuedAt.String)
		if err == nil {
			order.IssuedAt = &t
		}
	}
	if expiresAt.Valid {
		t, err := parseTime(expiresAt.String)
		if err == nil {
			order.ExpiresAt = &t
		}
	}

	if t, err := parseTime(createdAtStr); err == nil {
		order.CreatedAt = t
	}
	if t, err := parseTime(purgeAfterStr); err == nil {
		order.PurgeAfter = t
	}

	return &order, nil
}

func (r *CertificateRepositoryImpl) UpdateStatus(ctx context.Context, id string, status string) error {
	query := `UPDATE certificate_orders SET status = ? WHERE id = ?`
	res, err := r.db.ExecContext(ctx, query, status, id)
	if err != nil {
		return fmt.Errorf("update status for %s: %w", id, err)
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("rows affected for %s: %w", id, err)
	}
	if rows == 0 {
		return fmt.Errorf("update status for %s: %w", id, model.ErrNotFound)
	}
	return nil
}

func (r *CertificateRepositoryImpl) UpdateCertificate(ctx context.Context, order *model.CertificateOrder) error {
	query := `
		UPDATE certificate_orders
		SET status = ?, certificate = ?, private_key = ?, ca_bundle = ?,
		    issued_at = ?, expires_at = ?
		WHERE id = ?
	`
	var issuedAtStr, expiresAtStr *string
	if order.IssuedAt != nil {
		s := order.IssuedAt.UTC().Format(time.RFC3339)
		issuedAtStr = &s
	}
	if order.ExpiresAt != nil {
		s := order.ExpiresAt.UTC().Format(time.RFC3339)
		expiresAtStr = &s
	}

	res, err := r.db.ExecContext(ctx, query,
		order.Status,
		order.Certificate,
		order.PrivateKey,
		order.CABundle,
		issuedAtStr,
		expiresAtStr,
		order.ID,
	)
	if err != nil {
		return fmt.Errorf("update certificate for %s: %w", order.ID, err)
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("rows affected for %s: %w", order.ID, err)
	}
	if rows == 0 {
		return fmt.Errorf("update certificate for %s: %w", order.ID, model.ErrNotFound)
	}
	return nil
}

func (r *CertificateRepositoryImpl) UpdateChallenges(ctx context.Context, id string, challenges []model.Challenge) error {
	challengesJSON, err := json.Marshal(challenges)
	if err != nil {
		return fmt.Errorf("marshal challenges: %w", err)
	}
	query := `UPDATE certificate_orders SET challenges = ? WHERE id = ?`
	res, err := r.db.ExecContext(ctx, query, string(challengesJSON), id)
	if err != nil {
		return fmt.Errorf("update challenges for %s: %w", id, err)
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("rows affected for %s: %w", id, err)
	}
	if rows == 0 {
		return fmt.Errorf("update challenges for %s: %w", id, model.ErrNotFound)
	}
	return nil
}

// DeleteExpired hard-deletes expired rows from certificate_orders.
// It intentionally DOES NOT touch the domain_log table, which is retained
// indefinitely for usage metrics. See LogDomainEvent for the insertion path
// and the hourly purge loop in cmd/server/main.go for invocation.
func (r *CertificateRepositoryImpl) DeleteExpired(ctx context.Context) (int64, error) {
	query := `DELETE FROM certificate_orders WHERE purge_after < ?`
	res, err := r.db.ExecContext(ctx, query, time.Now().UTC().Format(time.RFC3339))
	if err != nil {
		return 0, fmt.Errorf("delete expired orders: %w", err)
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("rows affected for delete expired: %w", err)
	}
	return rows, nil
}

// LogDomainEvent inserts a single row into domain_log capturing the outcome
// of a certificate request for a single domain. Empty string fields are
// stored as NULL so queries can distinguish "not supplied" from "blank".
//
// This method is called from three sites in service/acme.go:
//   - immediately after the order is created (status="pending")
//   - from the background Obtain goroutine on success (status="issued")
//   - from the background Obtain goroutine on failure (status="failed")
//
// The domain_log table is the source of truth for all usage metrics and is
// never purged. Only sensitive material (certs, keys) is purged after 24h.
func (r *CertificateRepositoryImpl) LogDomainEvent(ctx context.Context, event DomainLogEvent) error {
	query := `
		INSERT INTO domain_log (
			order_id, domain, certificate_type, key_type,
			status, failure_reason, country, region,
			issued_at, expires_at
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	var issuedAt, expiresAt sql.NullTime
	if event.IssuedAt != nil {
		issuedAt = sql.NullTime{Time: event.IssuedAt.UTC(), Valid: true}
	}
	if event.ExpiresAt != nil {
		expiresAt = sql.NullTime{Time: event.ExpiresAt.UTC(), Valid: true}
	}

	_, err := r.db.ExecContext(ctx, query,
		nullableString(event.OrderID),
		event.Domain,
		event.CertificateType,
		nullableString(event.KeyType),
		event.Status,
		nullableString(event.FailureReason),
		nullableString(event.Country),
		nullableString(event.Region),
		issuedAt,
		expiresAt,
	)
	if err != nil {
		return fmt.Errorf("insert domain_log row for %s: %w", event.Domain, err)
	}
	return nil
}

// nullableString converts an empty string to a NULL SQL value. Non-empty
// strings are passed through as sql.NullString with Valid=true.
func nullableString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{}
	}
	return sql.NullString{String: s, Valid: true}
}

func (r *CertificateRepositoryImpl) PurgeSensitiveData(ctx context.Context) (int64, error) {
	query := `
		UPDATE certificate_orders
		SET certificate = NULL, private_key = NULL, ca_bundle = NULL
		WHERE status = 'issued'
		  AND certificate IS NOT NULL
		  AND issued_at < ?
	`
	cutoff := time.Now().UTC().Add(-24 * time.Hour).Format(time.RFC3339)
	res, err := r.db.ExecContext(ctx, query, cutoff)
	if err != nil {
		return 0, fmt.Errorf("purge sensitive data: %w", err)
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("rows affected for purge sensitive: %w", err)
	}
	return rows, nil
}
