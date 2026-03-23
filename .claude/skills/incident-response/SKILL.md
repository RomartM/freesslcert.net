---
name: incident-response
description: >
  Incident triage, severity classification, post-mortems, and corrective actions.
  Trigger for any production incident, outage, or post-mortem work.
---

# Incident Response

## Key Patterns
- **Severity levels**: P1 (service down) → P2 (degraded) → P3 (minor impact) → P4 (cosmetic)
- **Triage**: Identify scope → assess severity → assign responder → communicate status
- **Communication**: Status page updated within 15 min of P1/P2; stakeholder notification template
- **Mitigation first**: Restore service before root cause analysis; rollback if faster than forward-fix
- **Timeline**: Maintain a running incident timeline with timestamps and actions taken
- **Post-mortem**: Blameless; focus on systemic causes; required for all P1/P2 incidents
- **Post-mortem format**: Summary → Impact → Timeline → Root Cause → Contributing Factors → Action Items
- **Action items**: Each has an owner, due date, and priority; tracked to completion
- **Runbooks**: Pre-written procedures for known failure modes; referenced during incidents
- **Learning**: Share post-mortems team-wide; update runbooks based on findings

## Anti-Patterns
- Do NOT assign blame to individuals in post-mortems
- Do NOT skip post-mortems for "small" incidents that recur
- Do NOT leave action items untracked after the post-mortem meeting
- Do NOT delay communication hoping the issue resolves itself
- Do NOT make untested changes during an active incident without a rollback plan
