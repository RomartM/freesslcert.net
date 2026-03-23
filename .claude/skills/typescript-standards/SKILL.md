---
name: typescript-standards
description: >
  TypeScript strict-mode coding standards, type design, utility types, and patterns for both
  frontend and shared packages. Use whenever writing TypeScript, designing types, or configuring
  tsconfig. Triggers on: TypeScript, type, interface, generic, tsconfig, strict mode, Zod schema,
  or type narrowing discussions.
---

# TypeScript Standards Skill

## Official Documentation (ALWAYS check first)
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/
- TSConfig Reference: https://www.typescriptlang.org/tsconfig
- Utility Types: https://www.typescriptlang.org/docs/handbook/utility-types.html

## tsconfig.json Strict Settings (non-negotiable)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## Type Design Rules

1. **Prefer `interface` for objects** that may be extended. Use `type` for unions, intersections, and mapped types.
2. **No `any`** — use `unknown` and narrow. If truly unavoidable, add `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a comment explaining why.
3. **No `as` type assertions** unless you've verified at runtime. Use type guards instead.
4. **No `!` non-null assertions** — handle the null case explicitly.
5. **Discriminated unions** for state machines and polymorphic types.
6. **Zod schemas** for runtime validation at API boundaries. Infer types from schemas.

```typescript
// Schema-first approach
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'viewer']),
});
type User = z.infer<typeof UserSchema>;
```

## Utility Type Patterns

```typescript
// Pick only what you need
type CreateUserInput = Pick<User, 'email' | 'role'>;

// Omit sensitive fields for API responses
type PublicUser = Omit<User, 'passwordHash'>;

// Make fields optional for PATCH operations
type UpdateUserInput = Partial<Pick<User, 'email' | 'role'>>;

// Require at least one field
type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> }[keyof T];
```

## Naming Conventions

- **PascalCase**: Types, interfaces, enums, components
- **camelCase**: Variables, functions, methods, properties
- **UPPER_SNAKE**: Constants
- **Prefix interfaces with context, not `I`**: `UserService` not `IUserService` (TypeScript convention, not C#)

## Anti-Patterns
- Do NOT use `any`; use `unknown` and narrow with type guards
- Do NOT use `@ts-ignore`; use `@ts-expect-error` with explanation if truly needed
- Do NOT define types inline in component props; extract to named interfaces
- Do NOT use `as` type assertions for API responses; validate with Zod
- Do NOT mix runtime and compile-time validation; Zod handles both
