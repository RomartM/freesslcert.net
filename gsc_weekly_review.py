#!/usr/bin/env python3
"""
Weekly SEO Review — Google Search Console Data Pull
freesslcert.net | 2026-04-05
"""

import json
import sys
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

# ── Config ──────────────────────────────────────────────────────────────────
CREDENTIALS_FILE = "/Users/dev/Downloads/Security/gcp-service-account-seo-automation.json"
PROPERTY = "sc-domain:freesslcert.net"
SITE_URL = "https://freesslcert.net"

SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/webmasters",
]

URLS_TO_INSPECT = [
    "https://freesslcert.net/",
    "https://freesslcert.net/about",
    "https://freesslcert.net/faq",
    "https://freesslcert.net/guides/nginx-ssl",
    "https://freesslcert.net/guides/apache-ssl",
    "https://freesslcert.net/guides/wordpress-ssl",
    "https://freesslcert.net/guides/nodejs-ssl",
    "https://freesslcert.net/ssl-vs-tls",
    "https://freesslcert.net/ssl-checker",
    "https://freesslcert.net/blog",
    "https://freesslcert.net/blog/why-https-matters-2026",
    "https://freesslcert.net/blog/lets-encrypt-guide",
    "https://freesslcert.net/blog/ssl-certificate-types-explained",
    "https://freesslcert.net/privacy",
    "https://freesslcert.net/terms",
]

TODAY = datetime.now().date()
# GSC data has a ~3-day lag
DATA_END = TODAY - timedelta(days=3)  # 2026-04-02

# Periods
LAST_7_END = DATA_END
LAST_7_START = DATA_END - timedelta(days=6)
PREV_7_END = LAST_7_START - timedelta(days=1)
PREV_7_START = PREV_7_END - timedelta(days=6)

LAST_28_END = DATA_END
LAST_28_START = DATA_END - timedelta(days=27)

LAST_14_END = DATA_END
LAST_14_START = DATA_END - timedelta(days=13)


def fmt_pct(val):
    return f"{val * 100:.2f}%"


def fmt_pos(val):
    return f"{val:.1f}"


def fmt_delta(current, previous, is_pct=False, is_pos=False):
    if previous == 0 and current == 0:
        return "—"
    if is_pos:
        delta = previous - current  # lower position = better, so invert
        sign = "+" if delta >= 0 else ""
        return f"{sign}{delta:.1f} pos"
    if is_pct:
        delta = (current - previous) * 100
        sign = "+" if delta >= 0 else ""
        return f"{sign}{delta:.2f}pp"
    delta = current - previous
    sign = "+" if delta >= 0 else ""
    if previous != 0:
        pct_change = ((current - previous) / previous) * 100
        return f"{sign}{delta:.0f} ({sign}{pct_change:.1f}%)"
    return f"{sign}{delta:.0f}"


def search_analytics_query(service, start, end, dimensions=None, row_limit=25000, dim_filter_groups=None):
    body = {
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "rowLimit": row_limit,
    }
    if dimensions:
        body["dimensions"] = dimensions
    if dim_filter_groups:
        body["dimensionFilterGroups"] = dim_filter_groups
    resp = service.searchanalytics().query(siteUrl=PROPERTY, body=body).execute()
    return resp


def print_separator(title):
    width = 100
    print(f"\n{'=' * width}")
    print(f"  {title}")
    print(f"{'=' * width}")


def main():
    # ── Auth ────────────────────────────────────────────────────────────────
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE, scopes=SCOPES
    )
    service = build("searchconsole", "v1", credentials=credentials)

    print("=" * 100)
    print("  WEEKLY SEO REVIEW — freesslcert.net")
    print(f"  Report generated: {TODAY.isoformat()}")
    print(f"  Data available through: {DATA_END.isoformat()}")
    print("=" * 100)

    # ════════════════════════════════════════════════════════════════════════
    # 1. OVERALL PERFORMANCE — last 7 days vs previous 7 days
    # ════════════════════════════════════════════════════════════════════════
    print_separator("1. OVERALL PERFORMANCE — Week-over-Week Comparison")

    current = search_analytics_query(service, LAST_7_START, LAST_7_END)
    previous = search_analytics_query(service, PREV_7_START, PREV_7_END)

    def extract_totals(resp):
        rows = resp.get("rows", [])
        if rows:
            r = rows[0]
            return r.get("clicks", 0), r.get("impressions", 0), r.get("ctr", 0), r.get("position", 0)
        return 0, 0, 0, 0

    c_clicks, c_imp, c_ctr, c_pos = extract_totals(current)
    p_clicks, p_imp, p_ctr, p_pos = extract_totals(previous)

    print(f"\n  Period:  Current = {LAST_7_START} to {LAST_7_END}")
    print(f"           Previous = {PREV_7_START} to {PREV_7_END}")
    print()
    print(f"  {'Metric':<20} {'Current':>12} {'Previous':>12} {'Delta':>20}")
    print(f"  {'-'*20} {'-'*12} {'-'*12} {'-'*20}")
    print(f"  {'Clicks':<20} {c_clicks:>12.0f} {p_clicks:>12.0f} {fmt_delta(c_clicks, p_clicks):>20}")
    print(f"  {'Impressions':<20} {c_imp:>12.0f} {p_imp:>12.0f} {fmt_delta(c_imp, p_imp):>20}")
    print(f"  {'CTR':<20} {fmt_pct(c_ctr):>12} {fmt_pct(p_ctr):>12} {fmt_delta(c_ctr, p_ctr, is_pct=True):>20}")
    print(f"  {'Avg Position':<20} {fmt_pos(c_pos):>12} {fmt_pos(p_pos):>12} {fmt_delta(c_pos, p_pos, is_pos=True):>20}")

    # ════════════════════════════════════════════════════════════════════════
    # 2. TOP QUERIES — last 28 days, all queries
    # ════════════════════════════════════════════════════════════════════════
    print_separator("2. TOP QUERIES — Last 28 Days (sorted by impressions)")

    queries = search_analytics_query(service, LAST_28_START, LAST_28_END, dimensions=["query"], row_limit=25000)
    query_rows = queries.get("rows", [])
    query_rows.sort(key=lambda r: r["impressions"], reverse=True)

    print(f"\n  Total unique queries: {len(query_rows)}")
    print()
    print(f"  {'#':<5} {'Query':<55} {'Clicks':>7} {'Impr':>7} {'CTR':>8} {'Pos':>6}")
    print(f"  {'-'*5} {'-'*55} {'-'*7} {'-'*7} {'-'*8} {'-'*6}")

    for i, row in enumerate(query_rows, 1):
        q = row["keys"][0]
        if len(q) > 53:
            q = q[:50] + "..."
        print(f"  {i:<5} {q:<55} {row['clicks']:>7.0f} {row['impressions']:>7.0f} {fmt_pct(row['ctr']):>8} {fmt_pos(row['position']):>6}")

    # ════════════════════════════════════════════════════════════════════════
    # 3. TOP PAGES — last 28 days, all pages
    # ════════════════════════════════════════════════════════════════════════
    print_separator("3. TOP PAGES — Last 28 Days (sorted by impressions)")

    pages = search_analytics_query(service, LAST_28_START, LAST_28_END, dimensions=["page"], row_limit=25000)
    page_rows = pages.get("rows", [])
    page_rows.sort(key=lambda r: r["impressions"], reverse=True)

    print(f"\n  Total pages with data: {len(page_rows)}")
    print()
    print(f"  {'#':<4} {'Page URL':<60} {'Clicks':>7} {'Impr':>7} {'CTR':>8} {'Pos':>6}")
    print(f"  {'-'*4} {'-'*60} {'-'*7} {'-'*7} {'-'*8} {'-'*6}")

    for i, row in enumerate(page_rows, 1):
        url = row["keys"][0].replace("https://freesslcert.net", "")
        if not url:
            url = "/"
        if len(url) > 58:
            url = url[:55] + "..."
        print(f"  {i:<4} {url:<60} {row['clicks']:>7.0f} {row['impressions']:>7.0f} {fmt_pct(row['ctr']):>8} {fmt_pos(row['position']):>6}")

    # ════════════════════════════════════════════════════════════════════════
    # 4. PERFORMANCE BY COUNTRY — last 28 days, top 20
    # ════════════════════════════════════════════════════════════════════════
    print_separator("4. PERFORMANCE BY COUNTRY — Last 28 Days (Top 20)")

    countries = search_analytics_query(service, LAST_28_START, LAST_28_END, dimensions=["country"], row_limit=25000)
    country_rows = countries.get("rows", [])
    country_rows.sort(key=lambda r: r["impressions"], reverse=True)

    print()
    print(f"  {'#':<4} {'Country':<20} {'Clicks':>7} {'Impr':>7} {'CTR':>8} {'Pos':>6}")
    print(f"  {'-'*4} {'-'*20} {'-'*7} {'-'*7} {'-'*8} {'-'*6}")

    for i, row in enumerate(country_rows[:20], 1):
        print(f"  {i:<4} {row['keys'][0]:<20} {row['clicks']:>7.0f} {row['impressions']:>7.0f} {fmt_pct(row['ctr']):>8} {fmt_pos(row['position']):>6}")

    if len(country_rows) > 20:
        print(f"\n  ... and {len(country_rows) - 20} more countries")

    # ════════════════════════════════════════════════════════════════════════
    # 5. PERFORMANCE BY DEVICE — last 28 days
    # ════════════════════════════════════════════════════════════════════════
    print_separator("5. PERFORMANCE BY DEVICE — Last 28 Days")

    devices = search_analytics_query(service, LAST_28_START, LAST_28_END, dimensions=["device"])
    device_rows = devices.get("rows", [])
    device_rows.sort(key=lambda r: r["impressions"], reverse=True)

    print()
    print(f"  {'Device':<15} {'Clicks':>7} {'Impr':>7} {'CTR':>8} {'Pos':>6}")
    print(f"  {'-'*15} {'-'*7} {'-'*7} {'-'*8} {'-'*6}")

    for row in device_rows:
        print(f"  {row['keys'][0]:<15} {row['clicks']:>7.0f} {row['impressions']:>7.0f} {fmt_pct(row['ctr']):>8} {fmt_pos(row['position']):>6}")

    # ════════════════════════════════════════════════════════════════════════
    # 6. URL INSPECTION — all 15 pages
    # ════════════════════════════════════════════════════════════════════════
    print_separator("6. URL INSPECTION — All 15 Pages")
    print()

    for url in URLS_TO_INSPECT:
        try:
            result = service.urlInspection().index().inspect(
                body={
                    "inspectionUrl": url,
                    "siteUrl": PROPERTY,
                }
            ).execute()

            inspection = result.get("inspectionResult", {})
            index_status = inspection.get("indexStatusResult", {})
            rich_results = inspection.get("richResultsResult", {})

            verdict = index_status.get("verdict", "N/A")
            indexing_state = index_status.get("indexingState", "N/A")
            coverage_state = index_status.get("coverageState", "N/A")
            last_crawl = index_status.get("lastCrawlTime", "N/A")
            google_canonical = index_status.get("googleCanonical", "N/A")
            user_canonical = index_status.get("userCanonical", "N/A")
            page_fetch_state = index_status.get("pageFetchState", "N/A")
            crawled_as = index_status.get("crawledAs", "N/A")
            robots_txt_state = index_status.get("robotsTxtState", "N/A")

            # Rich results
            rich_verdict = rich_results.get("verdict", "N/A")
            rich_items = rich_results.get("detectedItems", [])
            rich_types = [item.get("richResultType", "unknown") for item in rich_items] if rich_items else []

            path = url.replace("https://freesslcert.net", "") or "/"
            print(f"  URL: {path}")
            print(f"    Verdict:          {verdict}")
            print(f"    Indexing State:   {indexing_state}")
            print(f"    Coverage State:   {coverage_state}")
            print(f"    Page Fetch:       {page_fetch_state}")
            print(f"    Crawled As:       {crawled_as}")
            print(f"    Robots.txt:       {robots_txt_state}")
            print(f"    Last Crawl:       {last_crawl}")
            print(f"    Google Canonical: {google_canonical}")
            print(f"    User Canonical:   {user_canonical}")
            print(f"    Rich Results:     {rich_verdict}", end="")
            if rich_types:
                print(f" — Types: {', '.join(rich_types)}")
            else:
                print()
            print()

        except Exception as e:
            path = url.replace("https://freesslcert.net", "") or "/"
            print(f"  URL: {path}")
            print(f"    ERROR: {e}")
            print()

    # ════════════════════════════════════════════════════════════════════════
    # 7. SITEMAP STATUS
    # ════════════════════════════════════════════════════════════════════════
    print_separator("7. SITEMAP STATUS")
    print()

    try:
        sitemaps = service.sitemaps().list(siteUrl=PROPERTY).execute()
        sitemap_list = sitemaps.get("sitemap", [])

        if not sitemap_list:
            print("  No sitemaps found.")
        else:
            for sm in sitemap_list:
                print(f"  Path:           {sm.get('path', 'N/A')}")
                print(f"  Type:           {sm.get('type', 'N/A')}")
                print(f"  Last Submitted: {sm.get('lastSubmitted', 'N/A')}")
                print(f"  Last Downloaded:{sm.get('lastDownloaded', 'N/A')}")
                print(f"  Is Pending:     {sm.get('isPending', 'N/A')}")
                print(f"  Warnings:       {sm.get('warnings', 0)}")
                print(f"  Errors:         {sm.get('errors', 0)}")

                contents = sm.get("contents", [])
                for c in contents:
                    print(f"    Content Type: {c.get('type', 'N/A')}, Submitted: {c.get('submitted', 'N/A')}, Indexed: {c.get('indexed', 'N/A')}")
                print()

    except Exception as e:
        print(f"  ERROR: {e}")

    # ════════════════════════════════════════════════════════════════════════
    # 8. DAILY PERFORMANCE TREND — last 14 days
    # ════════════════════════════════════════════════════════════════════════
    print_separator("8. DAILY PERFORMANCE TREND — Last 14 Days")

    daily = search_analytics_query(service, LAST_14_START, LAST_14_END, dimensions=["date"])
    daily_rows = daily.get("rows", [])
    daily_rows.sort(key=lambda r: r["keys"][0])

    print()
    print(f"  {'Date':<14} {'Clicks':>7} {'Impr':>7} {'CTR':>8} {'Pos':>6}  {'Clicks Bar'}")
    print(f"  {'-'*14} {'-'*7} {'-'*7} {'-'*8} {'-'*6}  {'-'*30}")

    max_imp = max((r["impressions"] for r in daily_rows), default=1)

    for row in daily_rows:
        date = row["keys"][0]
        clicks = row["clicks"]
        imps = row["impressions"]
        ctr = row["ctr"]
        pos = row["position"]
        bar_len = int((imps / max_imp) * 30) if max_imp > 0 else 0
        click_bar_len = int((clicks / max(max_imp, 1)) * 30)
        bar = "#" * bar_len
        click_bar = "*" * click_bar_len
        print(f"  {date:<14} {clicks:>7.0f} {imps:>7.0f} {fmt_pct(ctr):>8} {fmt_pos(pos):>6}  {click_bar}{'|'}{bar}")

    print()
    print("  Legend: * = clicks, # = impressions (scaled to max)")

    # ════════════════════════════════════════════════════════════════════════
    # SUMMARY
    # ════════════════════════════════════════════════════════════════════════
    print_separator("SUMMARY")

    total_clicks_28d = sum(r["clicks"] for r in daily_rows)
    total_imp_28d = sum(r["impressions"] for r in daily_rows)

    # Count indexed pages
    # (We already printed URL inspection above, but let's recount)
    print(f"""
  Site: freesslcert.net
  Report Date: {TODAY.isoformat()}
  Data Through: {DATA_END.isoformat()}

  Last 7 Days:
    Clicks:      {c_clicks:.0f}  (prev: {p_clicks:.0f}, delta: {fmt_delta(c_clicks, p_clicks)})
    Impressions: {c_imp:.0f}  (prev: {p_imp:.0f}, delta: {fmt_delta(c_imp, p_imp)})
    CTR:         {fmt_pct(c_ctr)}  (prev: {fmt_pct(p_ctr)})
    Avg Position:{fmt_pos(c_pos)}  (prev: {fmt_pos(p_pos)})

  Last 14 Days (from trend):
    Total Clicks:      {total_clicks_28d:.0f}
    Total Impressions: {total_imp_28d:.0f}

  Unique Queries (28d): {len(query_rows)}
  Pages with Data (28d): {len(page_rows)}
  Countries (28d): {len(country_rows)}
""")

    print("=" * 100)
    print("  END OF REPORT")
    print("=" * 100)


if __name__ == "__main__":
    main()
