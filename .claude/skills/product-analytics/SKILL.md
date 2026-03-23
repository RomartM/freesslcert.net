---
name: product-analytics
description: >
  Analytics instrumentation, event taxonomy, and KPI tracking. Trigger for any
  analytics event, tracking, or product metrics work.
---

# Product Analytics

## Key Patterns
- **Event taxonomy**: `object.action` format (e.g., `survey.submitted`, `donation.completed`)
- **Event properties**: Include context (user_id, session_id, page, referrer) + domain-specific fields
- **KPI definitions**: Document calculation formula, data source, and refresh frequency
- **Funnel tracking**: Define funnel steps explicitly; track drop-off at each stage
- **User segmentation**: Segment by role, tier, org, activity level; avoid PII in segment definitions
- **Privacy**: Consent-based tracking; anonymize before analysis; respect Do Not Track
- **A/B testing**: Feature flags for variants; track conversion metrics per variant
- **Data quality**: Validate events at ingestion; monitor for missing or malformed events
- **Dashboards**: Business KPIs separate from engineering metrics; stakeholder-friendly labels
- **Instrumentation**: Centralized analytics service/hook; never scatter tracking calls in components

## Anti-Patterns
- Do NOT track everything; define a tracking plan before instrumenting
- Do NOT include PII in analytics events
- Do NOT rely on client-side tracking alone; validate with server-side events
- Do NOT create metrics without defining what action they drive
- Do NOT change event names/schemas without a migration plan for historical data
