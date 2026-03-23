---
name: devops-ci-cd
description: >
  CI/CD pipeline design, GitHub Actions workflows, Docker builds, deployment strategies, and
  infrastructure automation. Use whenever setting up or modifying build pipelines, deployments,
  or infrastructure. Triggers on: CI, CD, pipeline, GitHub Actions, deploy, build, release, or
  infrastructure automation.
---

# DevOps & CI/CD Skill

## Official Documentation (ALWAYS check first)
- GitHub Actions: https://docs.github.com/en/actions
- Docker Build: https://docs.docker.com/build/
- Docker Compose: https://docs.docker.com/compose/
- Nginx: https://nginx.org/en/docs/

## CI Pipeline Stages

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  lint:        # Parallel: linters for each language
  test-unit:   # Parallel: unit tests per service
  build:       # Sequential: Docker builds
  test-integ:  # Sequential: integration tests
  scan:        # Sequential: security scanning
  deploy:      # Conditional: only on main/release
```

## Pipeline Rules
1. **Fail fast** — lint before test, test before build.
2. **Parallel where possible** — services test independently.
3. **Cache aggressively** — npm cache, Go module cache, Docker layers.
4. **Never skip security scans** — even on feature branches.
5. **Deploy immutable artifacts** — same image from CI to production.

## Deployment Strategy
- **Development**: Docker Compose, auto-deploy on push to `develop`
- **Staging**: Mirror of production, deploy on PR merge to `main`
- **Production**: Manual approval gate, tagged releases

## Environment Configuration
- `.env.example` — committed, template with placeholder values
- `.env` — gitignored, local overrides
- CI secrets — GitHub Secrets / Vault for pipeline
- Production — environment variables injected at runtime

## Anti-Patterns
- Do NOT allow direct pushes to `main`; enforce branch protection
- Do NOT skip tests to speed up CI; fix slow tests instead
- Do NOT store secrets in workflow files; use GitHub Secrets
- Do NOT use `latest` as the only tag; always include version tags
- Do NOT run deploy steps on PR branches; only on `main` or release tags
