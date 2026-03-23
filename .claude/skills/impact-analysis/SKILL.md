---
name: impact-analysis
description: >
  Implementation impact analysis framework for evaluating feature requests, architectural decisions,
  and technical changes. Covers positive/negative impact, hidden assumptions, alternatives,
  edge cases, and effort-value assessment. Use BEFORE any implementation begins. Triggers on:
  any feature request, "should we", "let's build", "I want to add", architectural decision,
  technology choice, or when evaluating trade-offs.
---

# Impact Analysis Skill

## Framework

Every significant change must be evaluated:

### 1. Intent Clarification
- What problem does this solve?
- Who benefits?
- How do we measure success?
- Is this the real requirement or a solution disguised as a requirement?

### 2. Impact Matrix
```
| Dimension | Positive | Negative | Net |
|-----------|----------|----------|-----|
| User Value | | | |
| Business Value | | | |
| Technical Quality | | | |
| Security Posture | | | |
| Operational Load | | | |
| Maintenance Cost | | | |
```

### 3. Assumptions Audit
List every assumption. For each: Is it validated? What if it's wrong?

### 4. Alternatives (minimum 2)
| Approach | Pros | Cons | Effort | Risk |
|----------|------|------|--------|------|

### 5. Edge Cases & Failure Modes
List every way this could fail or produce unexpected results.

### 6. Effort-Value Verdict
```
PROCEED / PROCEED WITH MODIFICATIONS / DEFER / REJECT
```

## Decision Tools
- **Why 5 Times**: Drill to root cause before solutioning
- **Delete Test**: What's the simplest 80% solution?
- **New Hire Test**: Will a new dev understand this in 5 minutes?
- **Newspaper Test**: Is this defensible in a post-mortem?
- **YAGNI Check**: Do we need this NOW or MAYBE later?

## Anti-Patterns
- Do NOT start implementation without understanding the blast radius
- Do NOT make irreversible changes without explicit stakeholder approval
- Do NOT skip alternative analysis for large changes (more than 1 day effort)
- Do NOT assume a change is low-risk without checking all affected systems
- Do NOT conflate effort with value; high-effort changes are not inherently high-value
