#!/usr/bin/env python3
"""
Reindex script for freesslcert.net — 2026-04-05
Post-deploy: trailing-slash canonicalization, new internal links, www->apex Cloudflare Worker.

Steps:
  1. Resubmit sitemap via Google Search Console API.
  2. URL inspection for all 15 trailing-slash URLs.
  3. Inspect www variants to verify 301 visibility.
  4. Submit all 15 URLs to IndexNow (4 endpoints).
  5. Print a clean summary table at the end.
"""

import json
import sys
import urllib.request
import urllib.error

try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError as e:
    print(f"[FATAL] Missing Google API libraries: {e}")
    sys.exit(1)

# ── Configuration ─────────────────────────────────────────────────
CREDENTIALS_FILE = "/Users/dev/Downloads/Security/gcp-service-account-seo-automation.json"
SITE_URL = "sc-domain:freesslcert.net"
SITEMAP_URL = "https://freesslcert.net/sitemap.xml"

# All 15 canonical URLs (trailing slash) for GSC inspection + IndexNow
ALL_URLS = [
    "https://freesslcert.net/",
    "https://freesslcert.net/about/",
    "https://freesslcert.net/faq/",
    "https://freesslcert.net/blog/",
    "https://freesslcert.net/ssl-checker/",
    "https://freesslcert.net/ssl-vs-tls/",
    "https://freesslcert.net/guides/nginx-ssl/",
    "https://freesslcert.net/guides/apache-ssl/",
    "https://freesslcert.net/guides/wordpress-ssl/",
    "https://freesslcert.net/guides/nodejs-ssl/",
    "https://freesslcert.net/blog/why-https-matters-2026/",
    "https://freesslcert.net/blog/lets-encrypt-guide/",
    "https://freesslcert.net/blog/ssl-certificate-types-explained/",
    "https://freesslcert.net/privacy/",
    "https://freesslcert.net/terms/",
]

# www variants — check redirect visibility (GSC only, not IndexNow)
WWW_URLS = [
    "https://www.freesslcert.net/",
    "http://www.freesslcert.net/",
]

SCOPES = ["https://www.googleapis.com/auth/webmasters"]

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
    print(f"\n{'='*72}")
    print(f"  {title}")
    print(f"{'='*72}\n")


# ══════════════════════════════════════════════════════════════════
# PART 1 — Google Search Console
# ══════════════════════════════════════════════════════════════════

def gsc_resubmit_sitemap(svc):
    separator("GSC STEP 1: Resubmit Sitemap")
    ok = False
    try:
        svc.sitemaps().submit(siteUrl=SITE_URL, feedpath=SITEMAP_URL).execute()
        print(f"[OK] Sitemap submitted: {SITEMAP_URL}")
        ok = True
    except HttpError as e:
        print(f"[ERROR] Sitemap submission failed: {e}")
    except Exception as e:
        print(f"[ERROR] Sitemap submission failed: {e}")

    try:
        result = svc.sitemaps().get(siteUrl=SITE_URL, feedpath=SITEMAP_URL).execute()
        print(f"  Last submitted:  {result.get('lastSubmitted', 'N/A')}")
        print(f"  Last downloaded: {result.get('lastDownloaded', 'N/A')}")
        print(f"  Is pending:      {result.get('isPending', 'N/A')}")
        print(f"  Is sitemap idx:  {result.get('isSitemapsIndex', 'N/A')}")
        print(f"  Warnings:        {result.get('warnings', 0)}")
        print(f"  Errors:          {result.get('errors', 0)}")
        for c in result.get("contents", []):
            print(f"  Content — type: {c.get('type')}, "
                  f"submitted: {c.get('submitted')}, "
                  f"indexed: {c.get('indexed')}")
    except HttpError as e:
        print(f"[WARN] Could not fetch sitemap status: {e}")
    except Exception as e:
        print(f"[WARN] Could not fetch sitemap status: {e}")
    return ok


def inspect_one(svc, url):
    """Inspect a single URL; return a dict of fields (or error)."""
    try:
        body = {"inspectionUrl": url, "siteUrl": SITE_URL}
        result = svc.urlInspection().index().inspect(body=body).execute()
        ir = result.get("inspectionResult", {})
        ix = ir.get("indexStatusResult", {})
        return {
            "ok": True,
            "verdict":       ix.get("verdict", "N/A"),
            "coverage":      ix.get("coverageState", "N/A"),
            "indexing":      ix.get("indexingState", "N/A"),
            "last_crawl":    ix.get("lastCrawlTime", "N/A"),
            "crawled_as":    ix.get("crawledAs", "N/A"),
            "page_fetch":    ix.get("pageFetchState", "N/A"),
            "robots":        ix.get("robotsTxtState", "N/A"),
            "google_canon":  ix.get("googleCanonical", "N/A"),
            "user_canon":    ix.get("userCanonical", "N/A"),
            "sitemap":       ix.get("sitemap", []),
            "referring":     ix.get("referringUrls", []),
        }
    except HttpError as e:
        body_text = e.content.decode("utf-8", errors="replace") if e.content else str(e)
        return {"ok": False, "error": f"HTTP {e.status_code}: {body_text}"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def gsc_inspect_urls(svc, urls, label):
    separator(f"GSC STEP 2: URL Inspection — {label} ({len(urls)} URLs)")
    results = {}
    for url in urls:
        print(f"--- {url}")
        r = inspect_one(svc, url)
        results[url] = r
        if not r["ok"]:
            print(f"  [ERROR] {r['error']}\n")
            continue
        print(f"  Verdict:        {r['verdict']}")
        print(f"  Coverage:       {r['coverage']}")
        print(f"  Indexing state: {r['indexing']}")
        print(f"  Last crawled:   {r['last_crawl']}")
        print(f"  Crawled as:     {r['crawled_as']}")
        print(f"  Page fetch:     {r['page_fetch']}")
        print(f"  Robots.txt:     {r['robots']}")
        print(f"  Google canon:   {r['google_canon']}")
        print(f"  User canon:     {r['user_canon']}")
        if r['sitemap']:
            print(f"  In sitemaps:    {r['sitemap']}")
        if r['referring']:
            print(f"  Referring URLs: {r['referring'][:3]}"
                  f"{' ...' if len(r['referring']) > 3 else ''}")
        print()
    return results


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

    results = []
    for name, endpoint in INDEXNOW_ENDPOINTS:
        print(f"\n{'- '*36}")
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
            with urllib.request.urlopen(req, timeout=25) as resp:
                body = resp.read().decode("utf-8", errors="replace")
                print(f"Status:   {resp.status} {resp.reason}")
                if body.strip():
                    print(f"Body:     {body.strip()}")
                print("[OK] Submitted successfully.")
                results.append((name, f"{resp.status} {resp.reason}", True))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            print(f"HTTP {e.code} {e.reason}")
            if body.strip():
                print(f"Body:     {body.strip()}")
            if e.code in (200, 202):
                print("[OK] Accepted.")
                results.append((name, f"{e.code} {e.reason}", True))
            else:
                print(f"[WARN] Non-success status {e.code}.")
                results.append((name, f"{e.code} {e.reason}", False))
        except Exception as e:
            print(f"[ERROR] {e}")
            results.append((name, f"ERROR: {e}", False))
    return results


# ══════════════════════════════════════════════════════════════════
# Summary
# ══════════════════════════════════════════════════════════════════

def print_summary(sitemap_ok, gsc_results, www_results, indexnow_results):
    separator("SUMMARY")

    print(f"Sitemap resubmission: {'OK' if sitemap_ok else 'FAILED'}")
    print()

    # Main URLs table
    print("Per-URL GSC Inspection (15 canonical URLs):")
    header = f"{'#':<3} {'URL':<56} {'Verdict':<14} {'Coverage'}"
    print(header)
    print("-" * len(header))
    for i, url in enumerate(ALL_URLS, 1):
        r = gsc_results.get(url, {})
        if not r.get("ok"):
            verdict = "ERROR"
            coverage = (r.get("error") or "")[:32]
        else:
            verdict = str(r.get("verdict", "N/A"))[:13]
            coverage = str(r.get("coverage", "N/A"))
        short_url = url.replace("https://freesslcert.net", "") or "/"
        print(f"{i:<3} {short_url:<56} {verdict:<14} {coverage}")
    print()

    # www variants
    print("www/http variant inspection (redirect visibility):")
    header = f"{'URL':<46} {'Verdict':<14} {'Coverage'}"
    print(header)
    print("-" * len(header))
    for url in WWW_URLS:
        r = www_results.get(url, {})
        if not r.get("ok"):
            verdict = "ERROR"
            coverage = (r.get("error") or "")[:32]
        else:
            verdict = str(r.get("verdict", "N/A"))[:13]
            coverage = str(r.get("coverage", "N/A"))
        print(f"{url:<46} {verdict:<14} {coverage}")
    print()

    # Special focus pages
    print("Focus pages (previously 'URL is unknown to Google'):")
    for target in ["https://freesslcert.net/ssl-vs-tls/", "https://freesslcert.net/ssl-checker/"]:
        r = gsc_results.get(target, {})
        if r.get("ok"):
            print(f"  {target}")
            print(f"    Verdict:  {r.get('verdict')}")
            print(f"    Coverage: {r.get('coverage')}")
            print(f"    Referring URLs: {len(r.get('referring', []))}")
        else:
            print(f"  {target} — ERROR: {r.get('error', 'unknown')}")
    print()

    # IndexNow table
    print("IndexNow submissions:")
    for name, status, ok in indexnow_results:
        marker = "OK " if ok else "!! "
        print(f"  {marker}{name:<36} {status}")
    print()


# ══════════════════════════════════════════════════════════════════
# Main
# ══════════════════════════════════════════════════════════════════

def main():
    separator("freesslcert.net — Full Reindex (2026-04-05)")
    print(f"Service account: {CREDENTIALS_FILE}")
    print(f"GSC property:    {SITE_URL}")
    print(f"Canonical URLs:  {len(ALL_URLS)} (all with trailing slash)")
    print(f"www variants:    {len(WWW_URLS)}")

    # Auth
    print("\nAuthenticating with Google...")
    try:
        credentials = service_account.Credentials.from_service_account_file(
            CREDENTIALS_FILE, scopes=SCOPES
        )
        svc = build("searchconsole", "v1", credentials=credentials)
        print("[OK] Authenticated.")
    except FileNotFoundError as e:
        print(f"[FATAL] Credentials file not found: {e}")
        print("        GSC steps will be skipped. IndexNow will still run.")
        svc = None
    except Exception as e:
        print(f"[FATAL] Authentication failed: {e}")
        print("        GSC steps will be skipped. IndexNow will still run.")
        svc = None

    sitemap_ok = False
    gsc_results = {}
    www_results = {}

    if svc is not None:
        # Part 1a — Resubmit sitemap
        sitemap_ok = gsc_resubmit_sitemap(svc)
        # Part 1b — Inspect all 15 canonical URLs
        gsc_results = gsc_inspect_urls(svc, ALL_URLS, "15 canonical URLs")
        # Part 1c — Inspect www variants
        www_results = gsc_inspect_urls(svc, WWW_URLS, "www/http variants")
    else:
        separator("GSC SKIPPED (no credentials / auth failed)")

    # Part 2 — IndexNow (runs regardless of GSC state)
    indexnow_results = indexnow_submit_all()

    # Summary
    print_summary(sitemap_ok, gsc_results, www_results, indexnow_results)

    separator("ALL DONE")


if __name__ == "__main__":
    main()
