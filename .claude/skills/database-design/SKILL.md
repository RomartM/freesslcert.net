---
name: database-design
description: >
  Database schema design, query optimization, migration strategy, and indexing patterns for
  PostgreSQL and MariaDB. Use whenever designing schemas, writing queries, or optimizing database
  performance. Triggers on: SQL, schema, migration, index, query, PostgreSQL, MariaDB, or
  database design discussions.
---

# Database Design Skill

## Official Documentation (ALWAYS check first)
- PostgreSQL: https://www.postgresql.org/docs/current/
- MariaDB: https://mariadb.com/kb/en/documentation/
- EF Core Migrations: https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/
- golang-migrate: https://github.com/golang-migrate/migrate
- sqlc: https://docs.sqlc.dev/

## Schema Design Rules

1. **Normalize to 3NF** by default. Denormalize with measurement.
2. **Every table**: `id`, `created_at`, `updated_at`, `deleted_at` (soft delete).
3. **Foreign keys enforced** at database level.
4. **Indexes**: All FKs, all WHERE/JOIN/ORDER BY columns.
5. **Naming**: snake_case, plural tables, singular columns.
6. **UUIDs** for public-facing IDs, bigserial for internal IDs.

## Migration Rules
- Numbered, sequential, never edit deployed migrations.
- Every migration must be reversible (up + down).
- Test against production-like data volumes.
- No DDL locks on large tables — use online migration tools.

## Query Performance Rules
- No `SELECT *` — specify columns.
- `EXPLAIN ANALYZE` for any query taking > 50ms.
- Use CTEs for readability, not performance (PostgreSQL materializes them).
- Batch operations for bulk inserts/updates.

## GORM-Specific Patterns
- Use `model.JSONRawMessage` for JSONB with SQLite compat.
- Use `pq.StringArray` for PostgreSQL `TEXT[]` fields.
- `ILIKE` for case-insensitive search (PostgreSQL only, not SQLite).
- `GREATEST()` not `MAX()` for scalar min-floor operations.
- Always use `.WithContext(ctx)` for cancellation support.
- Explicit `Preload("Relation")` — never lazy load.

Read `references/schema-patterns.md` for common schema design patterns.
Read `references/query-optimization.md` for performance tuning guide.
