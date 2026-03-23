package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
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

// CertificateRepository defines persistence operations for certificate orders.
type CertificateRepository interface {
	Create(ctx context.Context, order *model.CertificateOrder) error
	GetByID(ctx context.Context, id string) (*model.CertificateOrder, error)
	UpdateStatus(ctx context.Context, id string, status string) error
	UpdateCertificate(ctx context.Context, order *model.CertificateOrder) error
	UpdateChallenges(ctx context.Context, id string, challenges []model.Challenge) error
	DeleteExpired(ctx context.Context) (int64, error)
}

type certificateRepository struct {
	db *sql.DB
}

// NewCertificateRepository creates the repository and ensures the schema exists.
func NewCertificateRepository(ctx context.Context, db *sql.DB) (CertificateRepository, error) {
	if _, err := db.ExecContext(ctx, createTableSQL); err != nil {
		return nil, fmt.Errorf("create certificate_orders table: %w", err)
	}
	return &certificateRepository{db: db}, nil
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

func (r *certificateRepository) Create(ctx context.Context, order *model.CertificateOrder) error {
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

func (r *certificateRepository) GetByID(ctx context.Context, id string) (*model.CertificateOrder, error) {
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

func (r *certificateRepository) UpdateStatus(ctx context.Context, id string, status string) error {
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

func (r *certificateRepository) UpdateCertificate(ctx context.Context, order *model.CertificateOrder) error {
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

func (r *certificateRepository) UpdateChallenges(ctx context.Context, id string, challenges []model.Challenge) error {
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

func (r *certificateRepository) DeleteExpired(ctx context.Context) (int64, error) {
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
