---
name: environment-config
description: >
  Environment configuration, feature flags, secrets management, and multi-tenant
  settings. Trigger for any config, feature flag, or environment work.
---

# Environment Configuration

## Key Patterns
- **Config hierarchy**: Defaults → config file → env vars → CLI flags (last wins)
- **Feature flags**: Database-backed `feature_settings` table; `middleware.FeatureGate()` for route-level gating
- **Secrets**: Environment variables for secrets; never in config files or code
- **Env files**: `.env` for local dev only; `.env.example` committed with placeholder values
- **Typed config**: Go structs with `envconfig` tags; TypeScript with Zod validation
- **Multi-tenant**: Tenant ID in context; config can be per-tenant or global
- **Defaults**: Every config value has a sensible default; app starts without any env vars in dev
- **Validation**: Validate all required config at startup; fail fast with clear error messages
- **Documentation**: Every env var documented in `.env.example` with description and type
- **Runtime changes**: Feature flags changeable at runtime; app config requires restart

## Anti-Patterns
- Do NOT commit `.env` files; only commit `.env.example`
- Do NOT use config files for secrets; always environment variables
- Do NOT hardcode environment-specific values (URLs, ports, credentials)
- Do NOT silently use defaults for required production config; fail explicitly
- Do NOT scatter config reads throughout the code; centralize in a config package
