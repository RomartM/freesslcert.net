#!/usr/bin/env python3
"""
Combined reindex script for freesslcert.net — 2026-03-29
Resubmits sitemap + inspects 4 new URLs via Google Search Console,
then submits all 15 URLs to IndexNow (4 endpoints).
"""

import json
import urllib.request
import urllib.error
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# ── Configuration ─────────────────────────────────────────────────
CREDENTIALS_FILE = "/Users/dev/Downloads/updl-490718-6ac63a60d724.json"
SITE_URL = "sc-domain:freesslcert.net"
SITEMAP_URL = "https://freesslcert.net/sitemap.xml"

# 4 new URLs to inspect via Search Console
NEW_URLS = [
    "https://freesslcert.net/blog",
    "https://freesslcert.net/blog/why-https-matters-2026",
    "https://freesslcert.net/blog/lets-encrypt-guide",
    "https://freesslcert.net/blog/ssl-certificate-types-explained",
]

# All 15 URLs for IndexNow
ALL_URLS = [
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

SCOPES = [
    "https://www.googleapis.com/auth/webmasters",
]

INDEXNOW_KEY = "ff301284-b496-4a6b-b188-85209424c75b"
INDEXNOW_HOST = "freesslcert.net"
INDEXNOW_KEY_LOCATION = f"https://{INDEXNOW_HOST}/{INDEXNOW_KEY}.txt"

INDEXNOW_ENDPOINTS = [
    ("IndexNow (api.indexnow.org)", "https://api.indexnow.org/indexnow"),
    ("Bing (www.bing.com)",         "https://www.bing.com/indexnow"),
    ("Yandex (yandex.com)",         "https://yandex.com/indexnow"),
    ("Seznam (search.seznam.cz)",   "https://search.seznam.cz/indexnow"),
]


def separator(title):
    print(f"\n{'='*64}")
    print(f"  {title}")
    print(f"{'='*64}\n")


# ══════════════════════════════════════════════════════════════════
# PART 1 — Google Search Console
# ══════════════════════════════════════════════════════════════════

def gsc_resubmit_sitemap(svc):
    separator("GSC STEP 1: Resubmit Sitemap")
    try:
        svc.sitemaps().submit(siteUrl=SITE_URL, feedpath=SITEMAP_URL).execute()
        print(f"[OK] Sitemap submitted: {SITEMAP_URL}")
    except HttpError as e:
        print(f"[ERROR] Sitemap submission failed: {e}")

    # Check status
    try:
        result = svc.sitemaps().get(siteUrl=SITE_URL, feedpath=SITEMAP_URL).execute()
        print(f"  Last submitted:  {result.get('lastSubmitted', 'N/A')}")
        print(f"  Last downloaded: {result.get('lastDownloaded', 'N/A')}")
        print(f"  Is pending:      {result.get('isPending', 'N/A')}")
        print(f"  Warnings:        {result.get('warnings', 0)}")
        print(f"  Errors:          {result.get('errors', 0)}")
        for c in result.get("contents", []):
            print(f"  Content — type: {c.get('type')}, "
                  f"submitted: {c.get('submitted')}, "
                  f"indexed: {c.get('indexed')}")
    except HttpError as e:
        print(f"[WARN] Could not fetch sitemap status: {e}")


def gsc_inspect_urls(svc, urls, label):
    separator(f"GSC STEP 2: URL Inspection — {label} ({len(urls)} URLs)")
    for url in urls:
        print(f"--- {url}")
        try:
            body = {"inspectionUrl": url, "siteUrl": SITE_URL}
            result = svc.urlInspection().index().inspect(body=body).execute()
            ix = result.get("inspectionResult", {}).get("indexStatusResult", {})
            mob = result.get("inspectionResult", {}).get("mobileUsabilityResult", {})

            print(f"  Verdict:        {ix.get('verdict', 'N/A')}")
            print(f"  Coverage:       {ix.get('coverageState', 'N/A')}")
            print(f"  Indexing state: {ix.get('indexingState', 'N/A')}")
            print(f"  Last crawled:   {ix.get('lastCrawlTime', 'N/A')}")
            print(f"  Crawled as:     {ix.get('crawledAs', 'N/A')}")
            print(f"  Page fetch:     {ix.get('pageFetchState', 'N/A')}")
            print(f"  Robots.txt:     {ix.get('robotsTxtState', 'N/A')}")
            refs = ix.get("referringUrls", [])
            if refs:
                print(f"  Referring URLs: {refs}")
            sms = ix.get("sitemap", [])
            if sms:
                print(f"  In sitemaps:    {sms}")
            if mob:
                print(f"  Mobile:         {mob.get('verdict', 'N/A')}")
            print()

        except HttpError as e:
            body_text = e.content.decode("utf-8") if e.content else str(e)
            print(f"  [ERROR] {e.status_code}: {body_text}\n")
        except Exception as e:
            print(f"  [ERROR] {e}\n")


# ══════════════════════════════════════════════════════════════════
# PART 2 — IndexNow
# ══════════════════════════════════════════════════════════════════

def indexnow_submit_all():
    separator(f"INDEXNOW: Submitting {len(ALL_URLS)} URLs to {len(INDEXNOW_ENDPOINTS)} endpoints")

    payload = {
        "host": INDEXNOW_HOST,
        "key": INDEXNOW_KEY,
        "keyLocation": INDEXNOW_KEY_LOCATION,
        "urlList": ALL_URLS,
    }

    print(f"Key:          {INDEXNOW_KEY}")
    print(f"Key location: {INDEXNOW_KEY_LOCATION}")
    print(f"URLs ({len(ALL_URLS)}):")
    for u in ALL_URLS:
        print(f"  - {u}")

    for name, endpoint in INDEXNOW_ENDPOINTS:
        print(f"\n{'- '*32}")
        print(f"Endpoint: {name}")
        print(f"URL:      {endpoint}")
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            endpoint,
            data=data,
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                body = resp.read().decode("utf-8", errors="replace")
                print(f"Status:   {resp.status} {resp.reason}")
                if body.strip():
                    print(f"Body:     {body.strip()}")
                print("[OK] Submitted successfully.")
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            print(f"HTTP {e.code} {e.reason}")
            if body.strip():
                print(f"Body:     {body.strip()}")
            # 200/202 = success, 202 = accepted
            if e.code in (200, 202):
                print("[OK] Accepted.")
            else:
                print(f"[WARN] Non-success status {e.code}.")
        except Exception as e:
            print(f"[ERROR] {e}")


# ══════════════════════════════════════════════════════════════════
# Main
# ══════════════════════════════════════════════════════════════════

def main():
    separator("freesslcert.net — Full Reindex (2026-03-29)")
    print(f"Service account: {CREDENTIALS_FILE}")
    print(f"GSC property:    {SITE_URL}")
    print(f"New URLs:        {len(NEW_URLS)}")
    print(f"Total URLs:      {len(ALL_URLS)}")

    # Build GSC service
    print("\nAuthenticating with Google...")
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE, scopes=SCOPES
    )
    svc = build("searchconsole", "v1", credentials=credentials)
    print("[OK] Authenticated.\n")

    # Part 1a — Resubmit sitemap
    gsc_resubmit_sitemap(svc)

    # Part 1b — Inspect the 4 new URLs
    gsc_inspect_urls(svc, NEW_URLS, "4 new blog URLs")

    # Part 2 — IndexNow
    indexnow_submit_all()

    separator("ALL DONE")
    print("Google Search Console: sitemap resubmitted, 4 new URLs inspected.")
    print("IndexNow:              15 URLs submitted to 4 endpoints.")
    print("Review output above for any errors or warnings.")


if __name__ == "__main__":
    main()
