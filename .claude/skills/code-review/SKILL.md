---
name: code-review
description: >
  Multi-stack code review patterns and checklists. Use when reviewing code changes, pull requests,
  or evaluating code quality. Triggers on: review, PR, pull request, code quality, diff, or
  after code generation to verify quality.
---

# Code Review Skill

## Review Checklist (all languages)

### Correctness
- Does the code do what it's supposed to?
- Are edge cases handled?
- Are error conditions handled?
- Are there race conditions or concurrency issues?

### Security
- Is all input validated?
- Are queries parameterized?
- Are secrets properly managed?
- Is authentication/authorization enforced?

### Design
- Does each class/function have a single responsibility?
- Are dependencies injected, not hard-coded?
- Is the abstraction level appropriate (not over/under-engineered)?
- Is the code DRY without premature abstraction?

### Maintainability
- Can a new team member understand this in 5 minutes?
- Are names clear and descriptive?
- Is there appropriate error handling and logging?
- Are there tests covering the changed behavior?

### Performance
- Any obvious N+1 queries?
- Any unnecessary allocations or computations?
- Any missing indexes for new queries?
- Any unbounded data loading?

## Review Output Format

```markdown
## Review: [Change Description]
**Risk**: Low / Medium / High
**Verdict**: Approve / Changes Requested / Block

### Critical (must fix)
### Important (should fix)
### Suggestions (consider)
### Good patterns (reinforce)
```

## Anti-Patterns
- Do NOT approve with unresolved critical issues
- Do NOT nitpick formatting that linters should catch
- Do NOT rubber-stamp reviews; every file deserves attention
- Do NOT block on style preferences; defer to established conventions
- Do NOT review without pulling the branch and testing locally for complex changes
