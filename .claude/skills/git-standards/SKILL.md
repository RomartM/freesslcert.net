---
name: git-standards
description: >
  Git workflow standards including Conventional Commits, branch naming, PR templates, semantic
  versioning, changelog generation, and merge strategies. Use whenever discussing or enforcing
  git practices. Triggers on: git, commit, branch, merge, PR, tag, release, changelog, or
  version control.
---

# Git Standards Skill

## Official Documentation (ALWAYS check first)
- Conventional Commits: https://www.conventionalcommits.org/
- Semantic Versioning: https://semver.org/
- Git: https://git-scm.com/doc

## Commit Format
```
<type>(<scope>): <imperative subject max 72 chars>
```
Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
Scopes: frontend, api-go, api-csharp, docker, ci, db, license, docs

## Branch Format
```
feature/TICKET-short-description
fix/TICKET-short-description
hotfix/TICKET-short-description
chore/short-description
release/vX.Y.Z
```

## PR Requirements
- Descriptive title matching commit convention
- Linked issue/ticket
- Self-review before requesting review
- CI passing + 1 approval minimum
- Squash merge to develop, merge commit to main

## Semantic Versioning
```
vMAJOR.MINOR.PATCH
MAJOR — Breaking changes (API contract changes)
MINOR — New features (backward compatible)
PATCH — Bug fixes (backward compatible)
Pre-release: -alpha.1, -beta.1, -rc.1
```

## Changelog Format (Keep a Changelog)
Sections: Added, Changed, Deprecated, Removed, Fixed, Security
Auto-generate from Conventional Commits between tags.

Read `references/pr-template.md` for the full PR template.
Read `references/branch-strategy.md` for the complete branching strategy.
