package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

const createAcmeAccountTableSQL = `
CREATE TABLE IF NOT EXISTS acme_account (
    id TEXT PRIMARY KEY DEFAULT 'default',
    email TEXT NOT NULL,
    private_key_pem TEXT NOT NULL,
    registration_json TEXT,
    created_at DATETIME NOT NULL
);
`

// AcmeAccount holds persisted ACME account state.
type AcmeAccount struct {
	ID               string
	Email            string
	PrivateKeyPEM    string
	RegistrationJSON string
	CreatedAt        time.Time
}

// AcmeAccountRepository defines persistence operations for ACME accounts.
type AcmeAccountRepository interface {
	GetAccount(ctx context.Context) (*AcmeAccount, error)
	SaveAccount(ctx context.Context, account *AcmeAccount) error
}

type acmeAccountRepository struct {
	db *sql.DB
}

// NewAcmeAccountRepository creates the repository and ensures the schema exists.
func NewAcmeAccountRepository(ctx context.Context, db *sql.DB) (AcmeAccountRepository, error) {
	if _, err := db.ExecContext(ctx, createAcmeAccountTableSQL); err != nil {
		return nil, fmt.Errorf("create acme_account table: %w", err)
	}
	return &acmeAccountRepository{db: db}, nil
}

func (r *acmeAccountRepository) GetAccount(ctx context.Context) (*AcmeAccount, error) {
	query := `SELECT id, email, private_key_pem, registration_json, created_at FROM acme_account WHERE id = 'default'`
	row := r.db.QueryRowContext(ctx, query)

	var account AcmeAccount
	var regJSON sql.NullString
	var createdAtStr string

	err := row.Scan(&account.ID, &account.Email, &account.PrivateKeyPEM, &regJSON, &createdAtStr)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("scan acme account: %w", err)
	}

	if regJSON.Valid {
		account.RegistrationJSON = regJSON.String
	}

	if t, parseErr := time.Parse(time.RFC3339, createdAtStr); parseErr == nil {
		account.CreatedAt = t
	}

	return &account, nil
}

func (r *acmeAccountRepository) SaveAccount(ctx context.Context, account *AcmeAccount) error {
	query := `
		INSERT INTO acme_account (id, email, private_key_pem, registration_json, created_at)
		VALUES ('default', ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			email = excluded.email,
			private_key_pem = excluded.private_key_pem,
			registration_json = excluded.registration_json
	`
	_, err := r.db.ExecContext(ctx, query,
		account.Email,
		account.PrivateKeyPEM,
		account.RegistrationJSON,
		account.CreatedAt.UTC().Format(time.RFC3339),
	)
	if err != nil {
		return fmt.Errorf("save acme account: %w", err)
	}
	return nil
}
