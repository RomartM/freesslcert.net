---
name: testing-quality
description: >
  Testing strategy, test writing patterns, coverage targets, and quality gates across all stacks.
  Use whenever writing tests, designing test strategy, or discussing quality assurance.
  Triggers on: test, spec, coverage, assertion, mock, fixture, E2E, Vitest, Playwright,
  xUnit, Go testing, or quality discussions.
---

# Testing & Quality Skill

## Official Documentation (ALWAYS check first)
- Vitest: https://vitest.dev/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Playwright: https://playwright.dev/docs/intro
- Go testing: https://pkg.go.dev/testing
- xUnit: https://xunit.net/docs/getting-started/v3/cmdline
- testify: https://github.com/stretchr/testify

## Testing Pyramid

```
     E2E (Playwright)        -> 10% — Critical user flows only
    Integration               -> 30% — API contracts, DB queries
   Unit                       -> 60% — Business logic, utilities
```

## Test Quality Rules

1. **Test behavior, not implementation** — tests should survive refactors.
2. **Arrange-Act-Assert** — clear structure in every test.
3. **One concept per test** — test name describes what's being verified.
4. **No logic in tests** — no conditionals, loops, or try-catch in test bodies.
5. **Deterministic** — no flaky tests in CI. Fix or quarantine immediately.
6. **Fast** — unit tests complete in seconds. Integration in minutes.
7. **Independent** — tests don't depend on execution order.

## Coverage Targets

| Layer | Minimum | Ideal |
|-------|---------|-------|
| Domain/Business Logic | 85% | 95% |
| Service Layer | 75% | 85% |
| API Handlers | 65% | 75% |
| UI Components | 65% | 80% |
| E2E Critical Paths | Happy paths | + error paths |

## Bug Fix Rule
Every bug fix MUST include a regression test that:
1. Fails before the fix
2. Passes after the fix
3. Describes the bug scenario in its name

## Anti-Patterns
- Do NOT test implementation details (internal state, private methods)
- Do NOT share mutable state between tests
- Do NOT skip error case tests; test unhappy paths thoroughly
- Do NOT mock what you don't own; use integration tests for third-party code
- Do NOT write tests that depend on execution order
