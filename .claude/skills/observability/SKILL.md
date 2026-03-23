---
name: observability
description: >
  Observability covering structured logging, distributed tracing, metrics, and
  alerting. Trigger for any logging, monitoring, or instrumentation work.
---

# Observability

## Official Documentation
- [OpenTelemetry](https://opentelemetry.io/docs/)
- [Structured Logging (Go slog)](https://pkg.go.dev/log/slog)
- [Prometheus](https://prometheus.io/docs/)

## Key Patterns
- **Three pillars**: Logs (events) + Metrics (aggregates) + Traces (request flows)
- **Structured logging**: JSON format; include `request_id`, `user_id`, `service`, `method`
- **Log levels**: ERROR (action needed), WARN (unexpected but handled), INFO (key events), DEBUG (dev only)
- **Request tracing**: Propagate trace ID through all service calls; correlate logs to traces
- **Metrics**: RED method — Rate, Errors, Duration for every endpoint
- **Health endpoints**: `/health` (liveness), `/ready` (readiness); include dependency checks in readiness
- **Alerting**: Alert on symptoms (error rate, latency) not causes; escalation tiers match severity
- **Dashboards**: One overview dashboard per service; drill-down dashboards for subsystems
- **Retention**: Logs 30 days hot / 90 days cold; metrics 1 year; traces 7 days
- **Sensitive data**: Never log PII, passwords, tokens, or full request bodies with sensitive fields

## Anti-Patterns
- Do NOT log at DEBUG level in production; use INFO as the floor
- Do NOT create alerts that trigger frequently without action (alert fatigue)
- Do NOT log unstructured strings; always use key-value pairs
- Do NOT skip request ID propagation; it makes debugging impossible
- Do NOT instrument everything; focus on boundaries, errors, and latency-sensitive paths
