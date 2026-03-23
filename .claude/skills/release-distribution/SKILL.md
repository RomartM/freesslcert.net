---
name: release-distribution
description: >
  Software release packaging, distribution, on-premise delivery, update mechanisms, rollback
  procedures, and artifact management. Use whenever discussing releases, deployment packages,
  installers, or software delivery. Triggers on: release, distribute, package, installer, update,
  rollback, artifact, registry, or delivery.
---

# Release & Distribution Skill

## Official Documentation (ALWAYS check first)
- Semantic Versioning: https://semver.org/
- Docker Registry: https://docs.docker.com/registry/
- cosign (image signing): https://docs.sigstore.dev/cosign/
- SLSA (supply chain security): https://slsa.dev/

## Release Checklist
1. [ ] Version bumped (semver)
2. [ ] Changelog updated
3. [ ] All CI checks pass
4. [ ] Docker images built and tagged
5. [ ] Images signed and checksummed
6. [ ] SBOM generated
7. [ ] Security scan clean
8. [ ] Upgrade path tested (N-1 to N)
9. [ ] Rollback tested
10. [ ] Release notes written
11. [ ] Documentation updated

## On-Premise Package Structure
```
release-vX.Y.Z/
  docker-compose.yml
  images/              <- Pre-built Docker images (tar.gz)
  migrations/          <- Database migration scripts
  config/              <- Configuration templates
  scripts/             <- install.sh, upgrade.sh, rollback.sh, backup.sh
  CHANGELOG.md
  CHECKSUMS.sha256
  README.md
```

## Rollback Rules
- Every release must have a tested rollback procedure
- Database migrations must be reversible
- Previous Docker images retained for 3 releases minimum
- Rollback triggered automatically if health checks fail 3x

## Anti-Patterns
- Do NOT release without tested rollback procedures
- Do NOT skip release notes; every version needs documented changes
- Do NOT assume upgrade paths work without testing them
- Do NOT bundle dev dependencies or debug artifacts in release packages
- Do NOT release on Fridays or before holidays without on-call coverage
