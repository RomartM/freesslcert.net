# Metrics Queries for freesslcert.net

All domain request metadata is persisted in the `domain_log` table indefinitely.
Sensitive data (private keys, certificates) is purged from `certificate_orders`
after 24 hours by the hourly purge loop in `cmd/server/main.go` — see
`PurgeSensitiveData` and `DeleteExpired` in `internal/repository/certificate.go`.

Every certificate request produces at least one `domain_log` row per domain
with `status = 'pending'`, followed by either a `'failed'` row (with a
`failure_reason` classification) or an `'issued'` row (with `issued_at` and
`expires_at`). The `region` column identifies which deployment region handled
the request; `country` is populated from the Cloudflare `CF-IPCountry` header
on the initial pending row only.

## Schema

```sql
CREATE TABLE domain_log (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id         TEXT,
  domain           TEXT NOT NULL,
  certificate_type TEXT NOT NULL,
  key_type         TEXT,
  status           TEXT NOT NULL,     -- pending | issued | failed
  failure_reason   TEXT,              -- only set when status = failed
  country          TEXT,              -- ISO-3166 from CF-IPCountry
  region           TEXT,              -- deployment region tag
  issued_at        DATETIME,          -- only set when status = issued
  expires_at       DATETIME,          -- only set when status = issued
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Indexes: `created_at`, `status`, `country`.

## Common queries (run via `turso db shell <db-name>`)

### Total requests by status

```sql
SELECT status, COUNT(*) FROM domain_log GROUP BY status;
```

### Top countries

```sql
SELECT country, COUNT(*)
FROM domain_log
WHERE country IS NOT NULL AND country != ''
GROUP BY country
ORDER BY 2 DESC
LIMIT 20;
```

### Daily volume trend

```sql
SELECT DATE(created_at) AS day, COUNT(*) AS requests
FROM domain_log
GROUP BY day
ORDER BY day DESC
LIMIT 30;
```

### Failure breakdown

```sql
SELECT failure_reason, COUNT(*)
FROM domain_log
WHERE status = 'failed'
GROUP BY failure_reason
ORDER BY 2 DESC;
```

### By certificate type

```sql
SELECT certificate_type, COUNT(*)
FROM domain_log
GROUP BY certificate_type;
```

### By region (which server handled)

```sql
SELECT region, COUNT(*)
FROM domain_log
GROUP BY region
ORDER BY 2 DESC;
```

### Success rate by day

```sql
SELECT DATE(created_at) AS day,
       SUM(CASE WHEN status = 'issued'  THEN 1 ELSE 0 END) AS issued,
       SUM(CASE WHEN status = 'failed'  THEN 1 ELSE 0 END) AS failed,
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
       COUNT(*) AS total
FROM domain_log
GROUP BY day
ORDER BY day DESC
LIMIT 30;
```

### Key type popularity

```sql
SELECT key_type, COUNT(*)
FROM domain_log
WHERE status = 'issued'
GROUP BY key_type
ORDER BY 2 DESC;
```

### Orphaned pending rows (investigate)

Pending rows that were never followed by an `issued` or `failed` row for
the same `order_id`. These indicate either in-flight orders or crashed
goroutines.

```sql
SELECT dl.order_id, dl.domain, dl.created_at
FROM domain_log dl
WHERE dl.status = 'pending'
  AND dl.created_at < datetime('now', '-1 hour')
  AND NOT EXISTS (
    SELECT 1 FROM domain_log dl2
    WHERE dl2.order_id = dl.order_id
      AND dl2.status IN ('issued', 'failed')
  )
ORDER BY dl.created_at DESC
LIMIT 50;
```
