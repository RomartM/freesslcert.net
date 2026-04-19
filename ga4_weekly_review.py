#!/usr/bin/env python3
"""
GA4 Weekly Review for freesslcert.net
Compares last 7 days vs previous 7 days after SEO overhaul.
"""

import os
import json
from datetime import date, timedelta
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest, DateRange, Dimension, Metric, OrderBy, FilterExpression,
    Filter, FilterExpressionList
)

# Configuration
CREDENTIALS_PATH = "/Users/dev/Downloads/Security/gcp-service-account-seo-automation.json"
PROPERTY_ID = "529693668"

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = CREDENTIALS_PATH
client = BetaAnalyticsDataClient()

today = date.today()
# Last 7 days: yesterday back 7 days
end_current = today - timedelta(days=1)
start_current = end_current - timedelta(days=6)
# Previous 7 days
end_previous = start_current - timedelta(days=1)
start_previous = end_previous - timedelta(days=6)
# 14-day range for daily trend
start_14d = end_current - timedelta(days=13)

def fmt(val, is_pct=False, is_dur=False):
    """Format a metric value for display."""
    try:
        v = float(val)
    except (ValueError, TypeError):
        return str(val)
    if is_pct:
        return f"{v*100:.1f}%" if v <= 1.0 else f"{v:.1f}%"
    if is_dur:
        mins = int(v) // 60
        secs = int(v) % 60
        return f"{mins}m {secs}s"
    if v == int(v):
        return f"{int(v):,}"
    return f"{v:,.2f}"

def delta(current, previous, is_pct=False):
    """Calculate and format delta between two values."""
    try:
        c, p = float(current), float(previous)
    except (ValueError, TypeError):
        return "N/A"
    if p == 0:
        return "+inf" if c > 0 else "0"
    change = ((c - p) / abs(p)) * 100
    sign = "+" if change >= 0 else ""
    if is_pct:
        # For percentages, show absolute point change
        diff = (c - p) * 100 if c <= 1.0 and p <= 1.0 else c - p
        return f"{'+' if diff >= 0 else ''}{diff:.1f}pp ({sign}{change:.1f}%)"
    return f"{sign}{change:.1f}%"

def run_report(dimensions, metrics, date_ranges, order_by=None, limit=0, dim_filter=None):
    """Run a GA4 report."""
    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name=d) for d in dimensions],
        metrics=[Metric(name=m) for m in metrics],
        date_ranges=date_ranges,
        limit=limit if limit > 0 else 10000,
    )
    if order_by:
        request.order_bys = order_by
    if dim_filter:
        request.dimension_filter = dim_filter
    return client.run_report(request)

print("=" * 80)
print(f"  GA4 WEEKLY REVIEW — freesslcert.net")
print(f"  Report date: {today.strftime('%Y-%m-%d')}")
print(f"  Current period:  {start_current} to {end_current}")
print(f"  Previous period: {start_previous} to {end_previous}")
print("=" * 80)

# ============================================================================
# 1. OVERALL METRICS: LAST 7 DAYS vs PREVIOUS 7 DAYS
# ============================================================================
print("\n" + "=" * 80)
print("  1. OVERALL METRICS (7-day comparison)")
print("=" * 80)

overall_metrics = [
    ("sessions", "Sessions", False, False),
    ("totalUsers", "Users", False, False),
    ("screenPageViews", "Page Views", False, False),
    ("engagementRate", "Engagement Rate", True, False),
    ("bounceRate", "Bounce Rate", True, False),
    ("averageSessionDuration", "Avg Session Duration", False, True),
    ("sessionsPerUser", "Sessions/User", False, False),
    ("screenPageViewsPerSession", "Pages/Session", False, False),
    ("newUsers", "New Users", False, False),
    ("eventCount", "Total Events", False, False),
]

metric_names = [m[0] for m in overall_metrics]

# Run two separate requests — GA4's multi-date-range row ordering is unreliable
resp_current = run_report(
    dimensions=[],
    metrics=metric_names,
    date_ranges=[DateRange(start_date=str(start_current), end_date=str(end_current))],
)
resp_previous = run_report(
    dimensions=[],
    metrics=metric_names,
    date_ranges=[DateRange(start_date=str(start_previous), end_date=str(end_previous))],
)

current_vals = {}
previous_vals = {}
if resp_current.rows:
    for i, mv in enumerate(resp_current.rows[0].metric_values):
        current_vals[metric_names[i]] = mv.value
if resp_previous.rows:
    for i, mv in enumerate(resp_previous.rows[0].metric_values):
        previous_vals[metric_names[i]] = mv.value

print(f"\n{'Metric':<25} {'Current 7d':>15} {'Previous 7d':>15} {'Change':>25}")
print("-" * 80)
for key, label, is_pct, is_dur in overall_metrics:
    cv = current_vals.get(key, "0")
    pv = previous_vals.get(key, "0")
    d = delta(cv, pv, is_pct)
    print(f"{label:<25} {fmt(cv, is_pct, is_dur):>15} {fmt(pv, is_pct, is_dur):>15} {d:>25}")

# ============================================================================
# 2. TOP PAGES BY SESSIONS (LAST 7 DAYS)
# ============================================================================
print("\n" + "=" * 80)
print("  2. TOP PAGES BY SESSIONS (last 7 days)")
print("=" * 80)

response = run_report(
    dimensions=["pagePath"],
    metrics=["sessions", "screenPageViews", "engagementRate", "averageSessionDuration"],
    date_ranges=[DateRange(start_date=str(start_current), end_date=str(end_current))],
    order_by=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
    limit=50,
)

print(f"\n{'#':<4} {'Page Path':<45} {'Sessions':>10} {'Views':>10} {'Eng Rate':>10} {'Avg Dur':>10}")
print("-" * 89)
for i, row in enumerate(response.rows, 1):
    path = row.dimension_values[0].value
    sessions = row.metric_values[0].value
    views = row.metric_values[1].value
    eng = row.metric_values[2].value
    dur = row.metric_values[3].value
    if int(float(sessions)) == 0:
        continue
    print(f"{i:<4} {path:<45} {fmt(sessions):>10} {fmt(views):>10} {fmt(eng, True):>10} {fmt(dur, is_dur=True):>10}")

# ============================================================================
# 3. TRAFFIC SOURCES (LAST 7 DAYS)
# ============================================================================
print("\n" + "=" * 80)
print("  3. TRAFFIC SOURCES (last 7 days)")
print("=" * 80)

response = run_report(
    dimensions=["sessionDefaultChannelGroup"],
    metrics=["sessions", "totalUsers", "engagementRate", "averageSessionDuration"],
    date_ranges=[DateRange(start_date=str(start_current), end_date=str(end_current))],
    order_by=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
)

total_sessions = sum(int(float(r.metric_values[0].value)) for r in response.rows)
print(f"\n{'Channel':<30} {'Sessions':>10} {'%':>8} {'Users':>10} {'Eng Rate':>10} {'Avg Dur':>10}")
print("-" * 78)
for row in response.rows:
    channel = row.dimension_values[0].value
    sessions = row.metric_values[0].value
    users = row.metric_values[1].value
    eng = row.metric_values[2].value
    dur = row.metric_values[3].value
    pct = (float(sessions) / total_sessions * 100) if total_sessions > 0 else 0
    print(f"{channel:<30} {fmt(sessions):>10} {pct:>7.1f}% {fmt(users):>10} {fmt(eng, True):>10} {fmt(dur, is_dur=True):>10}")

# Also show source/medium detail
print("\n  Detailed Source/Medium breakdown:")
response = run_report(
    dimensions=["sessionSourceMedium"],
    metrics=["sessions", "totalUsers"],
    date_ranges=[DateRange(start_date=str(start_current), end_date=str(end_current))],
    order_by=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
    limit=20,
)
print(f"\n{'Source / Medium':<45} {'Sessions':>10} {'Users':>10}")
print("-" * 65)
for row in response.rows:
    src = row.dimension_values[0].value
    sessions = row.metric_values[0].value
    users = row.metric_values[1].value
    if int(float(sessions)) == 0:
        continue
    print(f"{src:<45} {fmt(sessions):>10} {fmt(users):>10}")

# ============================================================================
# 4. TOP COUNTRIES (LAST 7 DAYS)
# ============================================================================
print("\n" + "=" * 80)
print("  4. TOP COUNTRIES (last 7 days)")
print("=" * 80)

response = run_report(
    dimensions=["country"],
    metrics=["sessions", "totalUsers", "engagementRate"],
    date_ranges=[DateRange(start_date=str(start_current), end_date=str(end_current))],
    order_by=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
    limit=20,
)

print(f"\n{'#':<4} {'Country':<30} {'Sessions':>10} {'Users':>10} {'Eng Rate':>10}")
print("-" * 64)
for i, row in enumerate(response.rows, 1):
    country = row.dimension_values[0].value
    sessions = row.metric_values[0].value
    users = row.metric_values[1].value
    eng = row.metric_values[2].value
    print(f"{i:<4} {country:<30} {fmt(sessions):>10} {fmt(users):>10} {fmt(eng, True):>10}")

# ============================================================================
# 5. DEVICE BREAKDOWN (LAST 7 DAYS)
# ============================================================================
print("\n" + "=" * 80)
print("  5. DEVICE BREAKDOWN (last 7 days)")
print("=" * 80)

response = run_report(
    dimensions=["deviceCategory"],
    metrics=["sessions", "totalUsers", "engagementRate", "averageSessionDuration", "screenPageViewsPerSession"],
    date_ranges=[DateRange(start_date=str(start_current), end_date=str(end_current))],
    order_by=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
)

total_sessions = sum(int(float(r.metric_values[0].value)) for r in response.rows)
print(f"\n{'Device':<15} {'Sessions':>10} {'%':>8} {'Users':>10} {'Eng Rate':>10} {'Avg Dur':>10} {'Pages/Sess':>10}")
print("-" * 73)
for row in response.rows:
    device = row.dimension_values[0].value
    sessions = row.metric_values[0].value
    users = row.metric_values[1].value
    eng = row.metric_values[2].value
    dur = row.metric_values[3].value
    pps = row.metric_values[4].value
    pct = (float(sessions) / total_sessions * 100) if total_sessions > 0 else 0
    print(f"{device:<15} {fmt(sessions):>10} {pct:>7.1f}% {fmt(users):>10} {fmt(eng, True):>10} {fmt(dur, is_dur=True):>10} {fmt(pps):>10}")

# ============================================================================
# 6. DAILY TREND (LAST 14 DAYS)
# ============================================================================
print("\n" + "=" * 80)
print("  6. DAILY TREND (last 14 days)")
print("=" * 80)

response = run_report(
    dimensions=["date"],
    metrics=["sessions", "totalUsers", "screenPageViews", "newUsers"],
    date_ranges=[DateRange(start_date=str(start_14d), end_date=str(end_current))],
    order_by=[OrderBy(dimension=OrderBy.DimensionOrderBy(dimension_name="date"), desc=False)],
)

print(f"\n{'Date':<12} {'Day':<5} {'Sessions':>10} {'Users':>10} {'Views':>10} {'New Users':>10}  {'Trend'}")
print("-" * 80)

max_sessions = max(int(float(r.metric_values[0].value)) for r in response.rows) if response.rows else 1
for row in response.rows:
    dt_str = row.dimension_values[0].value  # YYYYMMDD
    dt = date(int(dt_str[:4]), int(dt_str[4:6]), int(dt_str[6:8]))
    day_name = dt.strftime("%a")
    sessions = row.metric_values[0].value
    users = row.metric_values[1].value
    views = row.metric_values[2].value
    new_users = row.metric_values[3].value
    bar_len = int((float(sessions) / max_sessions) * 30) if max_sessions > 0 else 0
    bar = "#" * bar_len
    # Mark the dividing line between previous and current period
    marker = " <-- period split" if dt == start_current else ""
    print(f"{dt.strftime('%Y-%m-%d'):<12} {day_name:<5} {fmt(sessions):>10} {fmt(users):>10} {fmt(views):>10} {fmt(new_users):>10}  {bar}{marker}")

# ============================================================================
# 7. TOP LANDING PAGES (LAST 7 DAYS)
# ============================================================================
print("\n" + "=" * 80)
print("  7. TOP LANDING PAGES (last 7 days)")
print("=" * 80)

response = run_report(
    dimensions=["landingPagePlusQueryString"],
    metrics=["sessions", "totalUsers", "engagementRate", "bounceRate", "averageSessionDuration"],
    date_ranges=[DateRange(start_date=str(start_current), end_date=str(end_current))],
    order_by=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
    limit=30,
)

print(f"\n{'#':<4} {'Landing Page':<45} {'Sessions':>10} {'Users':>10} {'Bounce':>10} {'Avg Dur':>10}")
print("-" * 89)
for i, row in enumerate(response.rows, 1):
    page = row.dimension_values[0].value
    sessions = row.metric_values[0].value
    users = row.metric_values[1].value
    eng = row.metric_values[2].value
    bounce = row.metric_values[3].value
    dur = row.metric_values[4].value
    if int(float(sessions)) == 0:
        continue
    print(f"{i:<4} {page:<45} {fmt(sessions):>10} {fmt(users):>10} {fmt(bounce, True):>10} {fmt(dur, is_dur=True):>10}")

# ============================================================================
# 8. NEW vs RETURNING USERS (LAST 7 DAYS)
# ============================================================================
print("\n" + "=" * 80)
print("  8. NEW vs RETURNING USERS (last 7 days)")
print("=" * 80)

# Run two separate requests for new vs returning comparison
nvr_metrics = ["sessions", "totalUsers", "engagementRate", "averageSessionDuration", "screenPageViewsPerSession"]

def fetch_new_vs_returning(start, end):
    r = run_report(
        dimensions=["newVsReturning"],
        metrics=nvr_metrics,
        date_ranges=[DateRange(start_date=str(start), end_date=str(end))],
    )
    out = {}
    for row in r.rows:
        utype = row.dimension_values[0].value
        out[utype] = {
            "sessions": row.metric_values[0].value,
            "users": row.metric_values[1].value,
            "eng": row.metric_values[2].value,
            "dur": row.metric_values[3].value,
            "pps": row.metric_values[4].value,
        }
    return out

current_data = fetch_new_vs_returning(start_current, end_current)
previous_data = fetch_new_vs_returning(start_previous, end_previous)

print(f"\n{'User Type':<15} {'Sessions':>10} {'Users':>10} {'Eng Rate':>10} {'Avg Dur':>10} {'Pages/Sess':>10}")
print("-" * 65)
for utype in ["new", "returning"]:
    if utype in current_data:
        d = current_data[utype]
        print(f"{utype.capitalize():<15} {fmt(d['sessions']):>10} {fmt(d['users']):>10} {fmt(d['eng'], True):>10} {fmt(d['dur'], is_dur=True):>10} {fmt(d['pps']):>10}")

# Show comparison
if previous_data:
    print(f"\n  Comparison with previous 7 days:")
    print(f"  {'User Type':<15} {'Curr Sessions':>15} {'Prev Sessions':>15} {'Change':>15}")
    print(f"  " + "-" * 60)
    for utype in ["new", "returning"]:
        cs = current_data.get(utype, {}).get("sessions", "0")
        ps = previous_data.get(utype, {}).get("sessions", "0")
        print(f"  {utype.capitalize():<15} {fmt(cs):>15} {fmt(ps):>15} {delta(cs, ps):>15}")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("  SUMMARY & INSIGHTS")
print("=" * 80)

cs = float(current_vals.get("sessions", 0))
ps = float(previous_vals.get("sessions", 0))
cu = float(current_vals.get("totalUsers", 0))
pu = float(previous_vals.get("totalUsers", 0))
cpv = float(current_vals.get("screenPageViews", 0))
ppv = float(previous_vals.get("screenPageViews", 0))
cer = float(current_vals.get("engagementRate", 0))

print(f"""
  Sessions:    {int(cs):,} (was {int(ps):,}) — {delta(cs, ps)} change
  Users:       {int(cu):,} (was {int(pu):,}) — {delta(cu, pu)} change
  Page Views:  {int(cpv):,} (was {int(ppv):,}) — {delta(cpv, ppv)} change
  Engagement:  {cer*100:.1f}%

  SEO overhaul was deployed around March 29, 2026.
  Current period: {start_current} to {end_current}
  Previous period: {start_previous} to {end_previous}
""")

print("=" * 80)
print("  End of report")
print("=" * 80)
