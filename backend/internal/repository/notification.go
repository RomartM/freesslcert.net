package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
)

const createNotificationTableSQL = `
CREATE TABLE IF NOT EXISTS notification_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    order_id TEXT NOT NULL,
    domain TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    notified_14d_at DATETIME,
    notified_7d_at DATETIME,
    unsubscribe_token TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`

// NotificationSubscription represents a single expiry notification subscription.
type NotificationSubscription struct {
	ID               int64
	Email            string
	OrderID          string
	Domain           string
	ExpiresAt        time.Time
	UnsubscribeToken string
}

// NotificationRepository defines persistence operations for notification subscriptions.
type NotificationRepository interface {
	Subscribe(ctx context.Context, email, orderID, domain, expiresAt string) (string, error)
	GetDueNotifications(ctx context.Context, daysBeforeExpiry int) ([]NotificationSubscription, error)
	MarkNotified(ctx context.Context, id int64, days int) error
	Unsubscribe(ctx context.Context, token string) error
}

type notificationRepository struct {
	db *sql.DB
}

// NewNotificationRepository creates the repository and ensures the schema exists.
func NewNotificationRepository(ctx context.Context, db *sql.DB) (NotificationRepository, error) {
	if _, err := db.ExecContext(ctx, createNotificationTableSQL); err != nil {
		return nil, fmt.Errorf("create notification_subscriptions table: %w", err)
	}
	return &notificationRepository{db: db}, nil
}

// Subscribe inserts a new notification subscription and returns the unsubscribe token.
func (r *notificationRepository) Subscribe(ctx context.Context, email, orderID, domain, expiresAt string) (string, error) {
	token := uuid.New().String()

	query := `
		INSERT INTO notification_subscriptions
			(email, order_id, domain, expires_at, unsubscribe_token)
		VALUES (?, ?, ?, ?, ?)
	`
	_, err := r.db.ExecContext(ctx, query, email, orderID, domain, expiresAt, token)
	if err != nil {
		return "", fmt.Errorf("insert notification subscription: %w", err)
	}
	return token, nil
}

// GetDueNotifications finds subscriptions where expires_at is within the given
// number of days from now AND the corresponding notified field is NULL.
func (r *notificationRepository) GetDueNotifications(ctx context.Context, daysBeforeExpiry int) ([]NotificationSubscription, error) {
	var column string
	switch daysBeforeExpiry {
	case 14:
		column = "notified_14d_at"
	case 7:
		column = "notified_7d_at"
	default:
		return nil, fmt.Errorf("unsupported daysBeforeExpiry: %d", daysBeforeExpiry)
	}

	deadline := time.Now().UTC().Add(time.Duration(daysBeforeExpiry) * 24 * time.Hour)

	query := fmt.Sprintf(`
		SELECT id, email, order_id, domain, expires_at, unsubscribe_token
		FROM notification_subscriptions
		WHERE expires_at <= ?
		  AND expires_at > ?
		  AND %s IS NULL
	`, column)

	rows, err := r.db.QueryContext(ctx, query,
		deadline.Format(time.RFC3339),
		time.Now().UTC().Format(time.RFC3339),
	)
	if err != nil {
		return nil, fmt.Errorf("query due notifications (%dd): %w", daysBeforeExpiry, err)
	}
	defer rows.Close()

	var subs []NotificationSubscription
	for rows.Next() {
		var sub NotificationSubscription
		var expiresAtStr string
		if err := rows.Scan(&sub.ID, &sub.Email, &sub.OrderID, &sub.Domain, &expiresAtStr, &sub.UnsubscribeToken); err != nil {
			return nil, fmt.Errorf("scan notification subscription: %w", err)
		}
		t, err := parseTime(expiresAtStr)
		if err != nil {
			return nil, fmt.Errorf("parse expires_at: %w", err)
		}
		sub.ExpiresAt = t
		subs = append(subs, sub)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate notification rows: %w", err)
	}
	return subs, nil
}

// MarkNotified sets the notified_14d_at or notified_7d_at column to the current time.
func (r *notificationRepository) MarkNotified(ctx context.Context, id int64, days int) error {
	var column string
	switch days {
	case 14:
		column = "notified_14d_at"
	case 7:
		column = "notified_7d_at"
	default:
		return fmt.Errorf("unsupported days value: %d", days)
	}

	query := fmt.Sprintf(`UPDATE notification_subscriptions SET %s = ? WHERE id = ?`, column)
	_, err := r.db.ExecContext(ctx, query, time.Now().UTC().Format(time.RFC3339), id)
	if err != nil {
		return fmt.Errorf("mark notified (%dd) for id %d: %w", days, id, err)
	}
	return nil
}

// Unsubscribe deletes a notification subscription by its unsubscribe token.
func (r *notificationRepository) Unsubscribe(ctx context.Context, token string) error {
	query := `DELETE FROM notification_subscriptions WHERE unsubscribe_token = ?`
	_, err := r.db.ExecContext(ctx, query, token)
	if err != nil {
		return fmt.Errorf("unsubscribe token %s: %w", token, err)
	}
	return nil
}
