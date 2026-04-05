package repository

import (
	"context"
	"database/sql"
	"slices"
	"testing"
	"time"

	"github.com/freesslcert/freesslcert/internal/model"
)

// TestDeleteExpiredDoesNotTouchDomainLog verifies that expiring
// certificate_orders rows does not cascade into the domain_log table.
//
// domain_log is the permanent record of every certificate request (pending,
// failed, or issued) and is used for usage metrics. Certificate material is
// purged from certificate_orders after 24 hours, but the metric rows must be
// retained indefinitely.
//
// This test requires a SQLite driver registered under the name "sqlite" or
// "sqlite3". Since this module does not depend on a CGo-free sqlite driver
// in production (Turso/libSQL is used instead), the test is skipped by
// default. To run it locally:
//
//	go get modernc.org/sqlite
//	go test -run TestDeleteExpiredDoesNotTouchDomainLog ./internal/repository/...
//
// Then add a blank import such as `_ "modernc.org/sqlite"` to a file in this
// package (for example in a file guarded by a build tag) so the driver is
// registered before the test runs. Once the Go module graph can tolerate the
// extra dependency, this test can be wired into CI directly.
func TestDeleteExpiredDoesNotTouchDomainLog(t *testing.T) {
	t.Parallel()

	driverName, ok := pickSQLiteDriver()
	if !ok {
		t.Skip("no sqlite/sqlite3 driver registered; see test comment for local setup")
	}

	db, err := sql.Open(driverName, ":memory:")
	if err != nil {
		t.Fatalf("open in-memory db: %v", err)
	}
	defer db.Close()

	ctx := context.Background()

	repoIface, err := NewCertificateRepository(ctx, db)
	if err != nil {
		t.Fatalf("init repository: %v", err)
	}

	// Insert a domain_log row directly so we can prove it survives.
	if err := repoIface.LogDomainEvent(ctx, DomainLogEvent{
		OrderID:         "order-metrics-1",
		Domain:          "metrics.example.com",
		CertificateType: "single",
		KeyType:         "rsa-2048",
		Status:          model.StatusIssued,
		Region:          "test",
	}); err != nil {
		t.Fatalf("log domain event: %v", err)
	}

	// Insert an expired certificate_orders row (purge_after in the past).
	expired := &model.CertificateOrder{
		ID:              "order-to-purge",
		Domains:         []string{"purge.example.com"},
		CertificateType: "single",
		KeyType:         "rsa-2048",
		Status:          model.StatusIssued,
		CreatedAt:       time.Now().UTC().Add(-48 * time.Hour),
		PurgeAfter:      time.Now().UTC().Add(-24 * time.Hour),
	}
	if err := repoIface.Create(ctx, expired); err != nil {
		t.Fatalf("create expired order: %v", err)
	}

	// Run the purge.
	deleted, err := repoIface.DeleteExpired(ctx)
	if err != nil {
		t.Fatalf("delete expired: %v", err)
	}
	if deleted != 1 {
		t.Errorf("expected 1 row deleted from certificate_orders, got %d", deleted)
	}

	// certificate_orders must now be empty.
	var orderCount int
	if err := db.QueryRowContext(ctx, "SELECT COUNT(*) FROM certificate_orders").Scan(&orderCount); err != nil {
		t.Fatalf("count certificate_orders: %v", err)
	}
	if orderCount != 0 {
		t.Errorf("expected 0 rows in certificate_orders, got %d", orderCount)
	}

	// domain_log must still contain the row we inserted.
	var logCount int
	if err := db.QueryRowContext(ctx, "SELECT COUNT(*) FROM domain_log").Scan(&logCount); err != nil {
		t.Fatalf("count domain_log: %v", err)
	}
	if logCount != 1 {
		t.Errorf("expected 1 row in domain_log after purge, got %d", logCount)
	}
}

// pickSQLiteDriver returns the first registered driver that can open an
// in-memory SQLite database. Both "sqlite" (modernc.org/sqlite) and "sqlite3"
// (mattn/go-sqlite3) are accepted.
func pickSQLiteDriver() (string, bool) {
	registered := sql.Drivers()
	for _, name := range []string{"sqlite", "sqlite3"} {
		if slices.Contains(registered, name) {
			return name, true
		}
	}
	return "", false
}
