---
name: documentation-standards
description: >
  Documentation standards for user manuals, admin guides, installation guides, API docs,
  troubleshooting guides, and all human-facing documentation. Use whenever writing or reviewing
  documentation. Triggers on: manual, guide, docs, help, FAQ, troubleshooting, knowledge base,
  or documentation quality.
---

# Documentation Standards Skill

## Official References
- Apple Documentation Style: https://support.apple.com/guide/applestyleguide/
- Microsoft Style Guide: https://learn.microsoft.com/en-us/style-guide/
- Google Developer Docs Style: https://developers.google.com/style

## Document Types
1. **User Guide** — Task-oriented, friendly tone, no assumed tech knowledge
2. **Admin Guide** — Technical, step-by-step, assumes sysadmin basics
3. **Installation Guide** — Exact commands, expected outputs, failure recovery
4. **API Documentation** — OpenAPI spec + examples + error documentation
5. **Troubleshooting Guide** — Symptom → Diagnosis → Fix format
6. **Release Notes** — What's new, changed, fixed, security patches

## Writing Rules
- Task-oriented headings ("How to export data" not "Export feature")
- Max 3-4 sentences per paragraph
- Every command in a code block, copy-pasteable
- Define acronyms on first use
- Use the exact UI labels when referencing interface elements
- Test every procedure before publishing

## README Structure
- Purpose → Quick Start → Configuration → Development → Deployment → Contributing

## ADR Format
- Architecture Decision Records in `docs/adr/`
- Numbered, with Status/Context/Decision/Consequences

## Per-Release Tasks
- [ ] User guide updated for new features
- [ ] Admin guide updated for new config
- [ ] Screenshots match current version
- [ ] API docs match actual API behavior
- [ ] Release notes written
- [ ] All procedures tested by non-author

Read `references/writing-style-guide.md` for tone and voice guidelines.
Read `references/doc-templates.md` for document templates.
