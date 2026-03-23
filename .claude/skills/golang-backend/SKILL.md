---
name: golang-backend
description: >
  Go backend development patterns, project structure, error handling, concurrency, and HTTP service
  design. Use whenever writing Go code, designing Go services, or reviewing Go patterns.
  Triggers on: Go, golang, .go, go.mod, goroutine, channel, net/http, Gin, GORM, Chi, sqlc, or Go project structure.
---

# Go Backend Development Skill

## Official Documentation (ALWAYS check first)
- Go Standard Library: https://pkg.go.dev/std
- Effective Go: https://go.dev/doc/effective_go
- Go Blog: https://go.dev/blog
- Go Wiki: https://go.dev/wiki
- Go Security: https://go.dev/doc/security/
- sqlc: https://docs.sqlc.dev/

## Project Layout

Follow https://go.dev/doc/modules/layout for module structure.

```
cmd/api/main.go           # Wiring only — no business logic
internal/                  # Private application code
  config/                  # Environment/config loading
  handler/                 # HTTP handlers (thin, delegate to services)
  service/                 # Business logic (testable, no HTTP concerns)
  repository/              # Data access (SQL queries, caches)
  model/                   # Domain types and value objects
  middleware/              # HTTP middleware (auth, logging, CORS)
  pkg/                    # Internal shared utilities
migrations/               # Database migration files
```

## Error Handling Pattern

```go
// Define domain errors as sentinel values
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
    ErrConflict     = errors.New("conflict")
)

// Wrap with context at each layer
return fmt.Errorf("get user %s: %w", id, err)

// Check with errors.Is at boundaries
if errors.Is(err, ErrNotFound) {
    http.Error(w, "not found", http.StatusNotFound)
    return
}
```

## Dependency Injection (constructor-based)

```go
type UserService struct {
    repo   UserRepository
    logger *slog.Logger
}

func NewUserService(repo UserRepository, logger *slog.Logger) *UserService {
    return &UserService{repo: repo, logger: logger}
}
```

## Interface Design

- Accept interfaces, return structs.
- Define interfaces where they're used, not where they're implemented.
- Keep interfaces small (1-3 methods).

## Testing

- Table-driven tests for all business logic.
- `httptest` for handler tests.
- Interfaces for dependency mocking.
- `testcontainers-go` for integration tests with real databases.

## Anti-Patterns
- Do NOT import `net/http` or `gin` in service or repository layers
- Do NOT use `panic` for control flow; always return errors
- Do NOT use raw SQL in repositories unless the ORM cannot express the query
- Do NOT skip `context.Context` propagation through the call chain
- Do NOT put business logic in handlers; they are thin translation layers
