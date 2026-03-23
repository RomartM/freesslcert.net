---
name: error-architecture
description: >
  Error taxonomy, propagation patterns, resilience strategies, and user-facing
  error messages. Trigger for any error handling, retry, or resilience work.
---

# Error Architecture

## Key Patterns
- **Error taxonomy**: Operational (expected, handle gracefully) vs Programmer (bugs, fix in code)
- **Error propagation**: Wrap with context at each layer (`fmt.Errorf("creating user: %w", err)`)
- **User messages**: Every error tells the user what happened AND what to do next
- **HTTP mapping**: Service errors → appropriate HTTP status codes in handler layer
- **Error codes**: Machine-readable codes alongside human messages (e.g., `AUTH_TOKEN_EXPIRED`)
- **Validation errors**: Return all field errors at once, not one at a time; 422 status
- **Retry strategy**: Exponential backoff with jitter for transient failures; circuit breaker for cascading
- **Logging**: Log full error chain server-side; return sanitized message to client
- **Sentinel errors**: Define package-level error variables (`var ErrNotFound = errors.New(...)`)
- **Panic recovery**: Middleware catches panics; logs stack trace; returns 500 to client

## Anti-Patterns
- Do NOT expose stack traces or internal details to clients
- Do NOT swallow errors silently; always log or propagate
- Do NOT use generic "something went wrong" messages; be specific
- Do NOT retry non-idempotent operations without confirmation
- Do NOT use error strings for control flow; use typed errors or sentinel values
