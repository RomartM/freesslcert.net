#!/usr/bin/env python3
"""
Inspect URLs in Google Search Console using the URL Inspection API.
Checks locale variants and main English pages for canonical/indexing issues.
"""

import json
import time
from google.oauth2 import service_account
from googleapiclient.discovery import build

SERVICE_ACCOUNT_FILE = "/Users/dev/Downloads/updl-490718-6ac63a60d724.json"
SITE_URL = "sc-domain:freesslcert.net"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

# URLs to inspect
LOCALE_VARIANT_URLS = [
    "https://freesslcert.net/es/",
    "https://freesslcert.net/ar/",
    "https://freesslcert.net/zh/",
    "https://freesslcert.net/fr/",
    "https://freesslcert.net/de/",
    "https://freesslcert.net/ja/",
    "https://freesslcert.net/es/about",
    "https://freesslcert.net/es/faq",
    "https://freesslcert.net/es/guides/nginx-ssl",
    "https://www.freesslcert.net/",
    "http://www.freesslcert.net/",
    "http://freesslcert.net/",
]

MAIN_ENGLISH_URLS = [
    "https://freesslcert.net/",
    "https://freesslcert.net/about",
    "https://freesslcert.net/faq",
    "https://freesslcert.net/blog",
    "https://freesslcert.net/ssl-checker",
    "https://freesslcert.net/guides/nginx-ssl",
]


def get_service():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    return build("searchconsole", "v1", credentials=credentials)


def inspect_url(service, url):
    """Inspect a single URL and return structured results."""
    try:
        result = service.urlInspection().index().inspect(
            body={
                "inspectionUrl": url,
                "siteUrl": SITE_URL,
            }
        ).execute()

        inspection = result.get("inspectionResult", {})
        index_status = inspection.get("indexStatusResult", {})

        return {
            "url": url,
            "verdict": index_status.get("verdict", "N/A"),
            "coverageState": index_status.get("coverageState", "N/A"),
            "googleCanonical": index_status.get("googleCanonical", "N/A"),
            "userCanonical": index_status.get("userCanonical", "N/A"),
            "crawledAs": index_status.get("crawledAs", "N/A"),
            "lastCrawlTime": index_status.get("lastCrawlTime", "N/A"),
            "robotsTxtState": index_status.get("robotsTxtState", "N/A"),
            "indexingState": index_status.get("indexingState", "N/A"),
            "pageFetchState": index_status.get("pageFetchState", "N/A"),
            "error": None,
        }
    except Exception as e:
        return {
            "url": url,
            "verdict": "ERROR",
            "coverageState": str(e),
            "googleCanonical": "N/A",
            "userCanonical": "N/A",
            "crawledAs": "N/A",
            "lastCrawlTime": "N/A",
            "robotsTxtState": "N/A",
            "indexingState": "N/A",
            "pageFetchState": "N/A",
            "error": str(e),
        }


def print_table(title, results):
    """Print results in a clear table format."""
    print("\n" + "=" * 120)
    print(f"  {title}")
    print("=" * 120)

    for r in results:
        print(f"\n  URL: {r['url']}")
        print(f"  {'─' * 100}")
        print(f"  {'Verdict:':<25} {r['verdict']}")
        print(f"  {'Coverage State:':<25} {r['coverageState']}")
        print(f"  {'Google Canonical:':<25} {r['googleCanonical']}")
        print(f"  {'User Canonical:':<25} {r['userCanonical']}")
        print(f"  {'Crawled As:':<25} {r['crawledAs']}")
        print(f"  {'Last Crawl Time:':<25} {r['lastCrawlTime']}")
        print(f"  {'Robots.txt State:':<25} {r['robotsTxtState']}")
        print(f"  {'Indexing State:':<25} {r['indexingState']}")
        print(f"  {'Page Fetch State:':<25} {r['pageFetchState']}")
        if r["error"]:
            print(f"  {'ERROR:':<25} {r['error']}")
    print()


def print_summary(all_results):
    """Print a compact summary table of all results."""
    print("\n" + "=" * 160)
    print("  SUMMARY TABLE")
    print("=" * 160)
    header = f"  {'URL':<50} {'Verdict':<15} {'Coverage State':<45} {'Google Canonical':<45}"
    print(header)
    print(f"  {'─' * 155}")
    for r in all_results:
        url_short = r["url"] if len(r["url"]) <= 48 else r["url"][:48] + ".."
        verdict = r["verdict"][:13] if len(r["verdict"]) > 13 else r["verdict"]
        coverage = r["coverageState"][:43] if len(r["coverageState"]) > 43 else r["coverageState"]
        canonical = (r["googleCanonical"][:43] if len(r["googleCanonical"]) > 43
                     else r["googleCanonical"])
        print(f"  {url_short:<50} {verdict:<15} {coverage:<45} {canonical:<45}")
    print()


def main():
    print("Authenticating with Google Search Console API...")
    service = get_service()
    print("Authenticated successfully.\n")

    # Inspect locale variant URLs
    print("Inspecting locale variant URLs...")
    locale_results = []
    for url in LOCALE_VARIANT_URLS:
        print(f"  Inspecting: {url}")
        result = inspect_url(service, url)
        locale_results.append(result)
        time.sleep(1.2)  # Rate limit: ~1 request per second

    # Inspect main English URLs
    print("\nInspecting main English URLs...")
    english_results = []
    for url in MAIN_ENGLISH_URLS:
        print(f"  Inspecting: {url}")
        result = inspect_url(service, url)
        english_results.append(result)
        time.sleep(1.2)

    # Print detailed results
    print_table("LOCALE VARIANT URLS - Detailed Results", locale_results)
    print_table("MAIN ENGLISH URLS - Detailed Results", english_results)

    # Print summary
    all_results = locale_results + english_results
    print_summary(all_results)

    # Highlight problematic pages
    alternate_pages = [r for r in all_results
                       if "alternate" in r["coverageState"].lower()
                       or "canonical" in r["coverageState"].lower()]
    if alternate_pages:
        print("\n" + "!" * 120)
        print("  PAGES FLAGGED AS 'ALTERNATE WITH PROPER CANONICAL'")
        print("!" * 120)
        for r in alternate_pages:
            print(f"\n  URL:              {r['url']}")
            print(f"  Coverage:         {r['coverageState']}")
            print(f"  Google Canonical: {r['googleCanonical']}")
            print(f"  User Canonical:   {r['userCanonical']}")
        print()
    else:
        print("\n  No pages flagged as 'Alternate page with proper canonical tag'.\n")

    # Also dump raw JSON for reference
    print("\n" + "=" * 120)
    print("  RAW JSON RESULTS (for debugging)")
    print("=" * 120)
    print(json.dumps({"locale_variants": locale_results, "english_pages": english_results},
                     indent=2, default=str))


if __name__ == "__main__":
    main()
