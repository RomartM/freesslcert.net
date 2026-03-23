---
name: data-migration
description: >
  Data migration, ETL processes, legacy onboarding, and integrity validation.
  Trigger for any data import, export, transformation, or migration work.
---

# Data Migration

## Key Patterns
- **Migration phases**: Extract → Validate → Transform → Load → Verify (never skip verify)
- **Idempotency**: Every migration must be safely re-runnable; use upserts or skip-if-exists
- **Rollback plan**: Document how to reverse every migration before executing
- **Integrity validation**: Row counts, checksum comparisons, foreign key verification post-migration
- **Batch processing**: Process in configurable batches (default 1000); avoid loading all into memory
- **Logging**: Log progress every N records; log all skipped/failed records with reasons
- **Dry-run mode**: Support `--dry-run` flag that validates without writing
- **Legacy data**: Map old schemas to new; document every field mapping in migration code
- **Encoding**: Handle UTF-8 conversion; detect and fix encoding issues before insert
- **Audit trail**: Record migration run metadata (start, end, counts, errors) in audit table

## Anti-Patterns
- Do NOT run migrations without a tested rollback plan
- Do NOT load entire datasets into memory; stream or batch
- Do NOT skip data validation before and after migration
- Do NOT run production migrations without a dry-run first
- Do NOT truncate tables as a migration strategy; use incremental approaches
