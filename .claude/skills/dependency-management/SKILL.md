---
name: dependency-management
description: >
  Dependency auditing, license compliance, SBOM generation, and supply chain
  security. Trigger for any package addition, update, or audit work.
---

# Dependency Management

## Official Documentation
- [Go Modules](https://go.dev/ref/mod)
- [npm audit](https://docs.npmjs.com/cli/commands/npm-audit)
- [SPDX License List](https://spdx.org/licenses/)

## Key Patterns
- **License audit**: Verify all dependencies use compatible licenses (MIT, Apache-2.0, BSD)
- **SBOM**: Generate Software Bill of Materials for each release (SPDX or CycloneDX format)
- **Go modules**: Pin versions in `go.mod`; run `go mod tidy` after changes; review `go.sum`
- **npm/pnpm**: Use lockfile; run `npm audit` / `pnpm audit` in CI; fix critical/high vulns
- **Version pinning**: Pin exact versions for production dependencies; ranges okay for dev deps
- **Update cadence**: Review dependency updates weekly; apply security patches immediately
- **Minimal dependencies**: Prefer stdlib over third-party when capability is comparable
- **Vendoring**: Consider `go mod vendor` for reproducible builds in air-gapped environments
- **Supply chain**: Verify package integrity; use checksums; beware of typosquatting

## Anti-Patterns
- Do NOT add dependencies without checking their license compatibility
- Do NOT ignore `npm audit` / `go vuln` warnings in CI
- Do NOT use abandoned packages (no commits in 12+ months, unresolved security issues)
- Do NOT add a dependency for trivial functionality (e.g., `is-odd`)
- Do NOT update major versions without reviewing changelogs and testing
