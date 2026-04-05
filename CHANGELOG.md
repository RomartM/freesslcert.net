# Changelog

All notable changes to freesslcert.net will be documented in this file.

## [Unreleased] - 2026-04-05

### Domain Metrics Persistence (critical)
- **`domain_log` now records every outcome** — pending, issued, and failed. Previously only successful issuances were logged, and since no certificate had ever successfully issued, the table was empty.
- **Schema extended** with `status`, `failure_reason`, `country`, `region` columns and supporting indexes. Migration uses `PRAGMA table_info` + `ALTER TABLE ADD COLUMN` so existing tables are upgraded in place.
- **`LogDomainEvent(ctx, DomainLogEvent)`** replaces the old `LogDomain` method. Called at three points in `acme.go`: immediately after order creation (`pending`), on successful issuance (`issued`), and on obtain failure (`failed`).
- **`classifyACMEError`** maps ACME/lego errors into a small enum (`challenge_timeout`, `dns_failed`, `rate_limited`, `acme_server_error`, `invalid_domain`, `other`) for failure analytics.
- **Country captured** from the `CF-IPCountry` header on every request.
- **Region captured** from a new `REGION` environment variable so we can break down usage by serving region (`us-east`, `eu-west`, `uk`, `sg`, `jp`, `au-syd`).
- **`DeleteExpired` explicitly does not touch `domain_log`** — added a code comment and a regression test (`TestDeleteExpiredDoesNotTouchDomainLog`).
- **`classifyACMEError` unit tests** — 11 table-driven cases covering every bucket and the fallback.
- **Metrics queries documented** at `backend/docs/metrics-queries.md` (total by status, top countries, daily trend, failure breakdown, success rate).

### SEO Fixes from Weekly Audit
- **www → apex 301 redirect** via new Cloudflare Worker at `infrastructure/worker/freesslcert-www-redirect/`. Cloudflare Pages' `_redirects` does not apply to custom domain aliases, so `https://www.freesslcert.net/` was serving 200 directly and Google was indexing it as a separate canonical. Verified: `curl -I https://www.freesslcert.net/` now returns `HTTP/2 301` to apex with path + query preserved.
- **Trailing slash canonicalization** — all non-root URLs now use trailing slashes (sitemap, canonicals, hreflangs, internal links). Eliminates the 308 redirect hop Cloudflare Pages was issuing for directory-based prerendered files (`dist/about/index.html`).
  - `ensureTrailingSlash()` helper in `useLocaleUrl.ts`, applied centrally in `useCanonicalUrl`, `useHreflangUrls`, and `useLocalePath`.
  - `sitemap.xml` — 15 `<loc>` URLs and 240 `<xhtml:link>` alternates updated.
  - `prerender.mjs` — `routeUrl()` helper ensures all canonical, OG, Twitter, and structured-data URLs carry trailing slashes.
  - 20+ page/component files swept to update `<Link to>` props and hardcoded breadcrumb URLs.
- **Internal linking boost** for `/ssl-vs-tls/` and `/ssl-checker/` — Google had not discovered these pages because they were only linked from the footer.
  - New `RelatedTools.tsx` component on the homepage with two prominent clickable cards.
  - `HowItWorks.tsx` extended with an inline paragraph linking to both pages.
  - Static fallback content in `index.html` updated so crawlers see the links even before hydration.
- **Trust badge honesty** — `TrustSection.tsx` badge changed from "No Data Stored" to **"Keys Auto-Purged"** to accurately reflect that private keys/certs are purged at 24h but non-sensitive domain metadata is retained for analytics.
- **Privacy policy disclosure** — new "What We Retain for Analytics" section in `PrivacyPage.tsx` listing exactly what's logged (domain, cert type, country, timestamp, status) and what's never retained (keys, certs, emails, IPs).
- **Stale credentials path** — `CLAUDE.md` and memory updated from `/Users/dev/Downloads/updl-490718-6ac63a60d724.json` to `/Users/dev/Downloads/Security/gcp-service-account-seo-automation.json`.

### Post-deploy Operations (2026-04-05)

Actions taken after the initial deploy to complete verification and fix issues discovered in production:

- **`REGION` env var set on all 6 production servers** — the new `Region` config field defaulted to `"unknown"` because no `REGION` was set in any server's `.env`. Set `REGION=us-east`, `eu-west`, `uk`, `sg`, `jp`, `au-syd` on `/opt/freesslcert/.env` (via deploy user Tailscale SSH), then `docker compose up -d --force-recreate` on each to reload. Verified `region=<region>` appears in the startup log.
- **Schema migration bug discovered and fixed** — the pre-existing `domain_log` table on the production Turso DB was created with `issued_at DATETIME NOT NULL`. The migration helper (`addColumnIfMissing`) only adds new columns via `ALTER TABLE ADD COLUMN`; it does not relax `NOT NULL` constraints on existing columns. First test insert failed with `NOT NULL constraint failed: domain_log.issued_at`. Fix: since the table was empty (0 rows, confirmed), dropped and recreated via Turso HTTP pipeline with the correct nullable schema. Next backend restart would have done the same via `CREATE TABLE IF NOT EXISTS`, but the direct fix avoided a restart cycle.
- **End-to-end metrics verification** — triggered a test order with `CF-IPCountry: PH` for an invalid TLD (`test-metrics-audit-2.example`). Confirmed two rows written to `domain_log`:
  - Row 1: `status=pending`, `country=PH`, `region=sg`
  - Row 2: `status=failed`, `failure_reason=invalid_domain`, `region=sg`
  - Test rows cleaned up afterward, final count: 0.
- **Google Search Console resubmission** — resubmitted sitemap + URL-inspected all 15 trailing-slash URLs. Two key wins:
  - `/ssl-vs-tls/` and `/ssl-checker/` transitioned from **"URL unknown to Google"** to **"Discovered - currently not indexed"** — the new homepage `RelatedTools` section and HowItWorks links successfully gave Google enough link equity to discover these pages.
  - `https://www.freesslcert.net/` now reports **"Alternate page with proper canonical tag"** (canonical = apex), and `http://www.freesslcert.net/` reports **"Page with redirect"** — confirming the new Cloudflare Worker is correctly consolidating authority.
- **IndexNow resubmission** — all 4 endpoints (api.indexnow.org, Bing, Yandex, Seznam) returned 200/202 for all 15 trailing-slash URLs.

## [Unreleased] - 2026-03-29

### Internationalization (i18n) — 15 Languages
- **i18next infrastructure** installed: `i18next`, `react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`
- **15 languages supported**: English, Spanish, Chinese, Portuguese, French, German, Hindi, Arabic, Bengali, Russian, Urdu, Japanese, Thai, Vietnamese, Korean
- **Locale-based routing**: `/:lang/page` pattern (e.g., `/es/about`, `/ar/faq`). English served at root without prefix
- **RTL support**: Automatic `dir="rtl"` on `<html>` for Arabic and Urdu
- **Language switcher**: Globe icon dropdown in header, navigates to equivalent page in selected language
- **Translation files**: 15 `common.json` files at `public/locales/{lang}/common.json` with 99 translated keys each
- **useLocalePath hook**: All internal links use locale-aware paths
- **hreflang tags**: Added to `index.html` (16 alternate links) and `sitemap.xml` (240 hreflang links across 15 URLs)
- **Sitemap updated**: Added `xmlns:xhtml` namespace with full hreflang annotations per infrastructure standards
- **LocaleLayout component**: Syncs i18next language from URL, sets document direction and lang attribute
- **Footer and Header**: Fully internationalized using translation keys

### Functional SSL Checker Tool
- **`GET /api/ssl-check?domain={domain}`** - New backend API endpoint (Go) that connects to any domain on port 443, inspects the TLS certificate, and returns structured JSON with: CN, SANs, issuer, validity dates, days until expiry, protocol version, signature algorithm, certificate chain, and validity status
- **SSRF protection** - Blocks localhost, .local, .internal, private IP ranges; validates domain format; rejects bare IPs
- **SSL Checker UI** - Fully functional frontend with domain input, loading skeleton, color-coded results display (valid/warning/expired), certificate details table, SAN tags, chain visualization, and CTA for expired certs

### Blog Section
- **`/blog`** - Blog index page with responsive card grid layout
- **`/blog/why-https-matters-2026`** - "Why HTTPS Matters in 2026: Security, SEO, and Trust" (~1200 words)
- **`/blog/lets-encrypt-guide`** - "Let's Encrypt Explained: How Free SSL Certificates Work" (~1200 words)
- **`/blog/ssl-certificate-types-explained`** - "SSL Certificate Types Explained: DV, OV, EV" (~1200 words)
- **Reusable `BlogPost` component** with Helmet meta tags, Article + BreadcrumbList JSON-LD, related posts, and CTA

### Pre-rendering (SSG)
- **14 routes pre-rendered at build time** - Each page now has its own HTML file with correct meta tags, structured data, and content skeleton served directly by Cloudflare Pages
- **Post-build script** (`scripts/prerender.mjs`) generates route-specific HTML with page titles, descriptions, OG tags, and JSON-LD
- **Massive SEO improvement** - Crawlers now receive fully formed HTML instead of generic SPA fallback

### IndexNow Integration
- **IndexNow key file** deployed for Bing, Yandex, Seznam instant indexing notifications
- **Submission script** (`submit-indexnow.py`) for future URL submissions

### SEO & Visibility Overhaul

#### New Content Pages
- **`/about`** - About page explaining what the service does, why it was built, how it works technically, and trust/security guarantees (~500 words, Organization-style content)
- **`/faq`** - Comprehensive standalone FAQ page with 20 detailed Q&As covering SSL/TLS fundamentals, certificate types (DV/OV/EV), wildcards, SANs, renewal, rate limits, HSTS, mixed content, certificate chains, CSR, key formats (PEM/PFX/DER), and installation (~3000 words, FAQPage JSON-LD schema)
- **`/guides/nginx-ssl`** - Step-by-step guide for installing free SSL certificates on Nginx with complete config examples, troubleshooting section (~2000 words, HowTo + BreadcrumbList JSON-LD schemas)
- **`/guides/apache-ssl`** - Step-by-step guide for installing free SSL certificates on Apache with VirtualHost config examples for Ubuntu/Debian and CentOS/RHEL (~2000 words, HowTo + BreadcrumbList JSON-LD schemas)
- **`/guides/wordpress-ssl`** - Step-by-step guide for installing SSL on WordPress via cPanel, with .htaccess and wp-config.php code blocks, mixed content fixes, troubleshooting (~2000 words, HowTo + BreadcrumbList JSON-LD schemas)
- **`/guides/nodejs-ssl`** - Step-by-step guide for setting up HTTPS with Node.js and Express.js, with code blocks for https.createServer, Express SSL, HTTP redirect, SNICallback reload (~2000 words, HowTo + BreadcrumbList JSON-LD schemas)
- **`/ssl-vs-tls`** - Educational explainer on SSL vs TLS differences, protocol version history, TLS handshake, comparison table with color-coded status badges (~1500 words, Article + BreadcrumbList JSON-LD schemas)
- **`/ssl-checker`** - SSL certificate checker tool page with domain input form (UI-only for now), informational content on common SSL problems and fixes (~1000 words, WebApplication + BreadcrumbList JSON-LD schemas)

#### IndexNow Integration
- **IndexNow key file** deployed at site root for Bing, Yandex, Seznam instant indexing
- **Reusable submission script** at `submit-indexnow.py`
- All URLs submitted to api.indexnow.org, Bing, and Yandex (202 Accepted)

#### Technical SEO Fixes
- **Canonical mismatch resolved** - Added 301! redirects for all non-canonical URL variants:
  - `http://www.freesslcert.net/*` -> `https://freesslcert.net/:splat`
  - `https://www.freesslcert.net/*` -> `https://freesslcert.net/:splat`
  - `http://freesslcert.net/*` -> `https://freesslcert.net/:splat`
- **HSTS header added** - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- **Dynamic per-page meta tags** - Installed `react-helmet-async`; every route now has unique title, description, canonical URL, Open Graph tags, and Twitter Card tags
- **404 page noindex** - NotFoundPage now includes `<meta name="robots" content="noindex, follow" />`
- **robots.txt updated** - Added `Disallow: /api/` to prevent API endpoint indexing

#### Structured Data Expansion
- **Organization schema** added globally in `index.html`
- **BreadcrumbList schema** added to `/privacy` and `/terms` pages via `StructuredData` component
- **FAQPage schema** on `/faq` with 20 Q&A pairs for rich search results
- **HowTo schema** on `/guides/nginx-ssl` and `/guides/apache-ssl` for how-to rich results
- **BreadcrumbList schema** on all guide pages (Home > Guides > Page)
- New reusable `StructuredData` component at `src/components/seo/StructuredData.tsx`

#### Sitemap & Indexing
- **Sitemap expanded** from 3 URLs to 7 URLs with proper priority values:
  - `/` (1.0), `/faq` (0.8), `/guides/nginx-ssl` (0.8), `/guides/apache-ssl` (0.8), `/about` (0.7), `/privacy` (0.3), `/terms` (0.3)
- All lastmod dates updated to 2026-03-29

#### Performance Optimization
- **Route code-splitting** - `/privacy`, `/terms`, `/about`, `/faq`, `/guides/*`, and 404 pages are lazy-loaded via `React.lazy` + `Suspense`
- **Vendor chunk splitting** - React+ReactDOM (57KB gz) and React Router (17KB gz) split into separate long-term cached chunks
- **DNS prefetch hints** added for `fonts.googleapis.com` and `fonts.gstatic.com`
- Initial monolithic bundle (172KB gz) split into: vendor (57KB) + router (17KB) + app (101KB)

#### Internal Linking
- Footer navigation expanded with links to About, FAQ, Nginx Guide, Apache Guide
- FaqSection component links to full `/faq` page ("View all frequently asked questions")
- HowItWorks component links to Nginx and Apache installation guides
- All content pages cross-link to each other and back to the homepage tool

### Dependencies Added
- `react-helmet-async` - Dynamic per-page `<head>` management

---

## Previous Releases

### 2026-03-24
- feat: disable Google Analytics when localStorage devx=true
- fix: change 'Auto-Purged 24h' badge to 'No Data Stored'
- fix: remove unused imports to fix CI build
- style: change main heading to green
- feat: SSL certificate expiry email notifications via Resend
