---
name: security-hardening
description: >
  Application security patterns, OWASP compliance, authentication, authorization, input validation,
  and secrets management across all stack layers. Use whenever security is a concern.
  Triggers on: security, auth, OWASP, XSS, CSRF, injection, encryption, secrets, CORS, CSP,
  or vulnerability discussions.
---

# Security Hardening Skill

## Official Documentation (ALWAYS check first)
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Cheat Sheets: https://cheatsheetseries.owasp.org/
- ASP.NET Security: https://learn.microsoft.com/en-us/aspnet/core/security/
- React Security: https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
- Docker Security: https://docs.docker.com/engine/security/

## Security Layers

### 1. Network Layer
- TLS 1.2+ everywhere
- HSTS headers with long max-age
- CSP headers (strict, no unsafe-inline in production)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

### 2. Authentication
- OAuth2/OIDC with proven providers (not custom auth)
- bcrypt/argon2id for password hashing
- Short-lived JWTs (15min) + rotating refresh tokens
- MFA for sensitive operations

### 3. Authorization
- RBAC at minimum, ABAC if complex permissions needed
- Server-side enforcement (client-side is UX only)
- Principle of least privilege

### 4. Input Validation
- Validate at the boundary (controller/handler layer)
- Whitelist valid patterns, don't blacklist dangerous ones
- Parameterized queries for ALL database operations
- File upload: validate type, size, and content

### 5. Secrets Management
- Environment variables for configuration
- Never in source code, Docker images, or logs
- Rotate secrets on schedule
- Use vault/key manager in production

### 6. Dependency Security
- Dependabot / Renovate for automated updates
- `npm audit`, `go vet`, `dotnet list package --vulnerable`
- Trivy or Docker Scout for container images
- Pin dependency versions

## Anti-Patterns
- Do NOT store JWTs in localStorage or sessionStorage
- Do NOT log sensitive data (passwords, tokens, PII)
- Do NOT hardcode secrets; use environment variables or secret managers
- Do NOT trust client-side role checks alone; always enforce server-side
- Do NOT disable HTTPS in production; enforce TLS everywhere
