---
name: react-frontend
description: >
  React 18+ with TypeScript development patterns, component architecture, hooks, state management,
  and accessibility. Use whenever building or reviewing React components, discussing component
  architecture, or implementing frontend features. Triggers on: React, JSX, TSX, hooks, useState,
  useEffect, component, props, Tailwind, CSS Modules, or frontend architecture.
---

# React Frontend Development Skill

## Official Documentation Sources (ALWAYS check these first)
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs/
- React Router: https://reactrouter.com/
- TanStack Query: https://tanstack.com/query/latest
- TanStack Table: https://tanstack.com/table/latest
- TanStack Form: https://tanstack.com/form/latest
- React Helmet Async: https://github.com/staylor/react-helmet-async
- Zod: https://zod.dev/
- Vitest: https://vitest.dev/
- Playwright: https://playwright.dev/

## Component Rules

1. **Functional components only** — no class components.
2. **TypeScript strict mode** — no `any`, explicit return types on exports.
3. **Props interfaces** defined above the component, exported if shared.
4. **Default exports** for page components, **named exports** for shared components.
5. **Co-locate** tests, styles, and types with components.
6. **Max 150 lines** per component file — split if larger.

## State Management Hierarchy

1. **Local state** (`useState`) — component-specific UI state
2. **Derived state** — compute during render, no extra state needed
3. **Lifted state** — share between siblings via parent
4. **Context** — theme, auth, locale (rarely changing)
5. **Server state** — TanStack Query for API data
6. **Global client state** — Zustand (only if Context doesn't suffice)

## Hook Rules

- Never call hooks conditionally or in loops.
- Custom hooks must start with `use` and compose other hooks.
- `useEffect` is for synchronization with external systems, not derived state.
- `useMemo`/`useCallback` only when profiler shows re-render cost.
- Cleanup effects properly to prevent memory leaks.

## TanStack Form Integration

- Use TanStack Form for complex forms with validation.
- Integrate with Zod schemas for type-safe validation.
- Prefer controlled forms with field-level validation.

## Error Handling

- `ErrorBoundary` wrapping each route/feature section.
- TanStack Query handles loading/error states for server data.
- User-friendly error messages with retry actions.
- Console errors logged to monitoring service in production.

## Shared Component Library

- `AdminListPage` — wrapper for admin list pages
- `AdminDetailPage<T>` — wrapper with query, skeleton, not-found
- `DetailHeader` — icon/image + title + badges + actions
- `StatCards` — grid of stat cards (icon in CardHeader)
- `RowActions` — standardized dropdown row actions
- `SettingsForm<T>` — settings tab scaffolding
- `DataTable` + `DataTableColumnHeader` + `BatchActionBar`
- `useAdminTabs` — tab state (mode: 'url' for list, 'state' for detail)

Read `references/component-patterns.md` for detailed code examples.
Read `references/testing-patterns.md` for frontend testing strategies.
