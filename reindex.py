#!/usr/bin/env python3
"""
Resubmit sitemap, request indexing for new pages, and inspect URLs
for freesslcert.net via Google Search Console & Indexing APIs.
"""

import json
import sys
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# ── Configuration ──────────────────────────────────────────────────
CREDENTIALS_FILE = "/Users/dev/Downloads/updl-490718-6ac63a60d724.json"
SITE_URL = "sc-domain:freesslcert.net"
SITEMAP_URL = "https://freesslcert.net/sitemap.xml"

NEW_URLS = [
    "https://freesslcert.net/about",
    "https://freesslcert.net/faq",
    "https://freesslcert.net/guides/nginx-ssl",
    "https://freesslcert.net/guides/apache-ssl",
]

ALL_URLS = [
    "https://freesslcert.net/",
    "https://freesslcert.net/about",
    "https://freesslcert.net/faq",
    "https://freesslcert.net/guides/nginx-ssl",
    "https://freesslcert.net/guides/apache-ssl",
    "https://freesslcert.net/privacy",
    "https://freesslcert.net/terms",
]

SCOPES = [
    "https://www.googleapis.com/auth/webmasters",
    "https://www.googleapis.com/auth/indexing",
]

# ── Helpers ────────────────────────────────────────────────────────
def separator(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def build_credentials():
    return service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE, scopes=SCOPES
    )

# ── 1. Resubmit the sitemap ───────────────────────────────────────
def resubmit_sitemap(webmasters_service):
    separator("STEP 1: Resubmit Sitemap")
    try:
        webmasters_service.sitemaps().submit(
            siteUrl=SITE_URL, feedpath=SITEMAP_URL
        ).execute()
        print(f"[OK] Sitemap submitted: {SITEMAP_URL}")
    except HttpError as e:
        print(f"[ERROR] Sitemap submission failed: {e}")
    except Exception as e:
        print(f"[ERROR] Unexpected error during sitemap submission: {e}")

# ── 2. Request indexing for new URLs ──────────────────────────────
def request_indexing(indexing_service):
    separator("STEP 2: Request Indexing for New URLs (Indexing API)")
    for url in NEW_URLS:
        try:
            body = {"url": url, "type": "URL_UPDATED"}
            result = indexing_service.urlNotifications().publish(body=body).execute()
            print(f"[OK] Indexing requested: {url}")
            print(f"     Notification: {json.dumps(result, indent=6)}")
        except HttpError as e:
            error_content = e.content.decode("utf-8") if e.content else str(e)
            print(f"[ERROR] Indexing API failed for {url}: {e.status_code}")
            print(f"        {error_content}")
            # If 403/permission denied, note that Indexing API may not work
            # for this property type — URL Inspection can still report status.
        except Exception as e:
            print(f"[ERROR] Unexpected error for {url}: {e}")

# ── 3. Check sitemap status ───────────────────────────────────────
def check_sitemap_status(webmasters_service):
    separator("STEP 3: Check Sitemap Status")
    try:
        result = webmasters_service.sitemaps().get(
            siteUrl=SITE_URL, feedpath=SITEMAP_URL
        ).execute()
        print(f"Sitemap:        {result.get('path')}")
        print(f"Last submitted: {result.get('lastSubmitted', 'N/A')}")
        print(f"Last downloaded:{result.get('lastDownloaded', 'N/A')}")
        print(f"Is pending:     {result.get('isPending', 'N/A')}")
        print(f"Warnings:       {result.get('warnings', 0)}")
        print(f"Errors:         {result.get('errors', 0)}")
        contents = result.get("contents", [])
        if contents:
            print("Contents:")
            for c in contents:
                print(f"  Type: {c.get('type')}, "
                      f"Submitted: {c.get('submitted')}, "
                      f"Indexed: {c.get('indexed')}")
        print(f"\n[OK] Sitemap is accepted and being processed.")
    except HttpError as e:
        print(f"[ERROR] Sitemap status check failed: {e}")
    except Exception as e:
        print(f"[ERROR] Unexpected error checking sitemap: {e}")

# ── 4. Inspect all URLs ──────────────────────────────────────────
def inspect_urls(webmasters_service):
    separator("STEP 4: URL Inspection (all 7 URLs)")
    for url in ALL_URLS:
        print(f"--- Inspecting: {url}")
        try:
            body = {
                "inspectionUrl": url,
                "siteUrl": SITE_URL,
            }
            result = webmasters_service.urlInspection().index().inspect(
                body=body
            ).execute()
            inspection = result.get("inspectionResult", {})
            index_status = inspection.get("indexStatusResult", {})
            crawl_status = inspection.get("crawlStatusResult", {})
            mobile = inspection.get("mobileUsabilityResult", {})

            verdict = index_status.get("verdict", "N/A")
            coverage = index_status.get("coverageState", "N/A")
            crawled = index_status.get("lastCrawlTime", "N/A")
            crawl_state = index_status.get("crawledAs", "N/A")
            indexing_state = index_status.get("indexingState", "N/A")
            page_fetch = index_status.get("pageFetchState", "N/A")
            robots = index_status.get("robotsTxtState", "N/A")
            referring_urls = index_status.get("referringUrls", [])
            sitemap_urls = index_status.get("sitemap", [])

            print(f"  Verdict:         {verdict}")
            print(f"  Coverage state:  {coverage}")
            print(f"  Indexing state:  {indexing_state}")
            print(f"  Last crawled:    {crawled}")
            print(f"  Crawled as:      {crawl_state}")
            print(f"  Page fetch:      {page_fetch}")
            print(f"  Robots.txt:      {robots}")
            if referring_urls:
                print(f"  Referring URLs:  {referring_urls}")
            if sitemap_urls:
                print(f"  In sitemaps:     {sitemap_urls}")
            if mobile:
                print(f"  Mobile:          {mobile.get('verdict', 'N/A')}")
            print()

        except HttpError as e:
            error_content = e.content.decode("utf-8") if e.content else str(e)
            print(f"  [ERROR] Inspection failed ({e.status_code}): {error_content}\n")
        except Exception as e:
            print(f"  [ERROR] Unexpected error: {e}\n")

# ── Main ──────────────────────────────────────────────────────────
def main():
    print("Building credentials from service account...")
    credentials = build_credentials()

    print("Building Search Console (webmasters v3) service...")
    webmasters = build("searchconsole", "v1", credentials=credentials)

    print("Building Indexing API service...")
    indexing = build("indexing", "v3", credentials=credentials)

    # Step 1 — Resubmit sitemap
    resubmit_sitemap(webmasters)

    # Step 2 — Request indexing for new URLs
    request_indexing(indexing)

    # Step 3 — Check sitemap status
    check_sitemap_status(webmasters)

    # Step 4 — Inspect all 7 URLs
    inspect_urls(webmasters)

    separator("DONE")
    print("All operations completed. Review output above for any errors.")

if __name__ == "__main__":
    main()
