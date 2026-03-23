---
name: docker-containerization
description: >
  Docker containerization, multi-stage builds, Docker Compose, and container security.
  Use whenever writing Dockerfiles, docker-compose configs, or discussing container strategy.
  Triggers on: Docker, Dockerfile, container, docker-compose, image, multi-stage build, or
  containerization discussions.
---

# Docker Containerization Skill

## Official Documentation (ALWAYS check first)
- Docker Docs: https://docs.docker.com
- Dockerfile Reference: https://docs.docker.com/reference/dockerfile/
- Docker Compose: https://docs.docker.com/compose/
- Best Practices: https://docs.docker.com/build/building/best-practices/

## Multi-Stage Build Template

Every service must use multi-stage builds:
1. **Builder stage**: Install dependencies, compile, run tests
2. **Production stage**: Minimal base image, copy only artifacts

## Container Security Checklist
- [ ] Non-root USER directive
- [ ] Specific image version tags (no `latest`)
- [ ] `.dockerignore` excludes: `.git`, `node_modules`, `.env`, `*.md`
- [ ] HEALTHCHECK defined
- [ ] No secrets in build args or env
- [ ] Minimal base image (alpine where possible)
- [ ] Read-only root filesystem where possible

## Docker Compose for Development
- Use `depends_on` with `condition: service_healthy`
- Use `.env` files for configuration (never commit real secrets)
- Use named volumes for database persistence
- Use build context, not pre-built images for development
- Health checks on all services with proper dependency ordering

## Image Sizing Targets
- Backend Go binary: statically linked (`CGO_ENABLED=0`), final image < 50MB
- Frontend nginx: built assets + nginx config, final image < 30MB

Read `references/dockerfile-templates.md` for language-specific Dockerfile templates.
