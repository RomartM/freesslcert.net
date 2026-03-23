---
name: api-design
description: >
  REST API design, OpenAPI specification, versioning, error handling, pagination, and inter-service
  communication patterns. Use whenever designing or reviewing API endpoints.
  Triggers on: API, endpoint, REST, OpenAPI, Swagger, status code, pagination, or API contract.
---

# API Design Skill

## Official Documentation (ALWAYS check first)
- OpenAPI Specification: https://spec.openapis.org/oas/latest.html
- HTTP Semantics RFC 9110: https://httpwg.org/specs/rfc9110.html
- JSON:API: https://jsonapi.org/

## Design Rules

1. **Resources are nouns**: `/users`, `/orders/{id}/items`
2. **HTTP methods are verbs**: GET, POST, PUT, PATCH, DELETE
3. **Consistent responses**: Same error format everywhere
4. **Version from day one**: `/api/v1/`
5. **Paginate collections**: Cursor-based for large sets
6. **Document everything**: OpenAPI spec is source of truth

## Response Envelope

### Success
```json
{
  "success": true,
  "data": { ... },
  "message": "Entity created successfully"
}
```

### Paginated
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 142
  }
}
```

## Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": [{"field": "email", "message": "required"}],
    "request_id": "req_abc123"
  }
}
```

## URL Conventions
- Plural nouns for resources: `/users`, `/donations`
- Kebab-case for multi-word: `/audit-logs`, `/donation-campaigns`
- No verbs except actions: `POST /users/:id/activate`
- Static paths before dynamic params in route registration
- Max 2 levels of nesting: `/users/:id/posts` (not deeper)

## Pagination Query Parameters
| Parameter | Default | Description |
|-----------|---------|-------------|
| `page` | 1 | Page number |
| `per_page` | 20 | Items per page (max 100) |
| `search` | "" | Full-text search |
| `sort_by` | "created_at" | Sort column (validated against allowlist) |
| `sort_order` | "desc" | "asc" or "desc" |

## Bulk Action Pattern
```json
{ "action": "delete", "ids": ["uuid1", "uuid2"] }
```
Validate action against whitelist. Loop and collect errors. Return partial success.

Read `references/openapi-template.md` for OpenAPI spec templates.
Read `references/status-codes.md` for HTTP status code usage guide.
