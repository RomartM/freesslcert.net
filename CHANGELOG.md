# Changelog

All notable changes to freesslcert.net will be documented in this file.

## [Unreleased] - 2026-03-29

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
