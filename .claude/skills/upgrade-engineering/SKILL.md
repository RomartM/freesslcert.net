---
name: upgrade-engineering
description: >
  Zero-downtime upgrades, backward compatibility, and migration ordering.
  Trigger for any upgrade strategy, compatibility, or migration ordering work.
---

# Upgrade Engineering

## Key Patterns
- **Zero-downtime**: Rolling deployments; old and new versions must coexist during transition
- **Backward compatibility**: New code reads old data format; old code ignores new fields
- **Database migrations**: Additive first (add column), then code deploy, then cleanup (remove old column)
- **Migration ordering**: Schema changes → deploy new code → data backfill → cleanup old schema
- **API versioning**: Support N and N-1 simultaneously; deprecation warnings for N-1
- **Feature flags**: Gate new features behind flags; enable after full rollout verified
- **Health checks**: New version must pass health checks before receiving traffic
- **Rollback trigger**: Automatic rollback if error rate exceeds threshold within N minutes
- **State migration**: Stateful services need explicit state migration plan (cache, sessions, queues)
- **Testing**: Upgrade path tested in staging with production-like data volume

## Anti-Patterns
- Do NOT make breaking schema changes in a single deploy; use expand-contract pattern
- Do NOT remove API fields without a deprecation period
- Do NOT assume zero traffic during deployment windows
- Do NOT skip testing rollback; if you haven't tested it, it doesn't work
- Do NOT deploy database migrations and code changes simultaneously
