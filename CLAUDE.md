# CLAUDE.md - Project Context for AI Agents

## Project Overview
**freesslcert.net** - Free SSL certificate generator powered by Let's Encrypt ACME protocol. Browser-based tool that generates SSL certificates in 60 seconds with no signup required.

## Tech Stack
- **Frontend:** React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + shadcn/ui
- **Backend:** Go 1.25 + Gin + ACME (lego) + Turso/libSQL
- **Infrastructure:** Docker + Traefik reverse proxy, multi-region deployment (6 regions)
- **Hosting:** Static frontend with `_redirects` and `_headers` files (Netlify-style)

## Project Structure
```
frontend/
  src/
    pages/          # Route page components
    components/
      layout/       # Header, Footer
      marketing/    # FaqSection, HowItWorks, etc.
      seo/          # StructuredData component
      ui/           # shadcn/ui primitives
  public/           # Static assets, robots.txt, sitemap.xml, _headers, _redirects
  index.html        # Entry point with static SEO fallback content + JSON-LD schemas
backend/            # Go API server
```

## SEO Architecture (Updated 2026-03-29)

### Pages & Routes
| Route | Page | Priority | Meta Tags | Structured Data |
|-------|------|----------|-----------|-----------------|
| `/` | HomePage | 1.0 | Dynamic (Helmet) | WebApplication, FAQPage, HowTo, BreadcrumbList, Organization |
| `/about` | AboutPage | 0.7 | Dynamic (Helmet) | BreadcrumbList |
| `/faq` | FAQPage | 0.8 | Dynamic (Helmet) | FAQPage (20 Q&As), BreadcrumbList |
| `/guides/nginx-ssl` | NginxSSLGuidePage | 0.8 | Dynamic (Helmet) | HowTo, BreadcrumbList |
| `/guides/apache-ssl` | ApacheSSLGuidePage | 0.8 | Dynamic (Helmet) | HowTo, BreadcrumbList |
| `/guides/wordpress-ssl` | WordPressSSLGuidePage | 0.8 | Dynamic (Helmet) | HowTo, BreadcrumbList |
| `/guides/nodejs-ssl` | NodejsSSLGuidePage | 0.8 | Dynamic (Helmet) | HowTo, BreadcrumbList |
| `/ssl-vs-tls` | SSLvsTLSPage | 0.7 | Dynamic (Helmet) | Article, BreadcrumbList |
| `/ssl-checker` | SSLCheckerPage | 0.9 | Dynamic (Helmet) | WebApplication, BreadcrumbList |
| `/blog` | BlogIndexPage | 0.8 | Dynamic (Helmet) | Blog, BreadcrumbList |
| `/blog/why-https-matters-2026` | WhyHTTPSMatters | 0.7 | Dynamic (Helmet) | Article, BreadcrumbList |
| `/blog/lets-encrypt-guide` | LetsEncryptGuide | 0.7 | Dynamic (Helmet) | Article, BreadcrumbList |
| `/blog/ssl-certificate-types-explained` | SSLCertificateTypes | 0.7 | Dynamic (Helmet) | Article, BreadcrumbList |
| `/privacy` | PrivacyPage | 0.3 | Dynamic (Helmet) | BreadcrumbList |
| `/terms` | TermsPage | 0.3 | Dynamic (Helmet) | BreadcrumbList |
| `*` | NotFoundPage | - | noindex,follow | None |

### SEO Components & Patterns
- **`react-helmet-async`** - Every page sets unique title, description, canonical, OG, and Twitter tags via `<Helmet>`
- **`HelmetProvider`** wraps the app in `main.tsx`
- **`StructuredData` component** (`src/components/seo/StructuredData.tsx`) - Reusable JSON-LD renderer
- **Static fallback content** in `index.html` for crawlers before React hydrates (includes hero, features, FAQ, how-it-works)
- **JSON-LD schemas** in `index.html` head: WebApplication, FAQPage (11 Q&As), HowTo (3 steps), BreadcrumbList, Organization
- **Pre-rendering** - `scripts/prerender.mjs` generates 14 route-specific HTML files at build time with correct meta tags, OG tags, structured data, and content. Served directly by Cloudflare Pages before SPA fallback
- **BlogPost component** (`src/components/blog/BlogPost.tsx`) - Reusable blog layout with Helmet, Article JSON-LD, breadcrumbs, related posts, CTA
- **Blog data** (`src/data/blogPosts.ts`) - Blog post metadata array with helper functions
- **IndexNow** - Key file at `/public/{key}.txt` for Bing/Yandex/Seznam instant indexing; submission script at `submit-indexnow.py`

### Redirects & Canonicals
- All `http://`, `http://www.`, `https://www.` variants 301-redirect to `https://freesslcert.net/`
- HSTS enabled with preload (`max-age=31536000; includeSubDomains; preload`)
- Each page has self-referencing canonical URL via Helmet
- 404 pages are `noindex, follow`

### Sitemap & Robots
- `sitemap.xml` at `/public/sitemap.xml` - 15 URLs with priorities
- `robots.txt` allows all crawlers, disallows `/api/`, references sitemap

### Performance
- Routes code-split with `React.lazy` (all pages except HomePage are lazy-loaded)
- Vendor chunks: `vendor` (react+react-dom, 57KB gz), `router` (react-router-dom, 17KB gz)
- App chunk: ~101KB gz
- CSS: 11KB gz
- Asset fingerprinting with immutable cache headers (1 year)
- HTML: `must-revalidate` (no cache)

### Internal Linking Strategy
- Footer: Home, About, FAQ, Nginx Guide, Apache Guide, Privacy, Terms, Let's Encrypt (external)
- FaqSection: links to full `/faq` page
- HowItWorks: links to Nginx and Apache guides
- Content pages cross-link to each other and to the homepage tool

## Key Files for SEO Changes
- `frontend/index.html` - Static fallback content + global JSON-LD schemas
- `frontend/public/sitemap.xml` - Sitemap (update when adding pages)
- `frontend/public/robots.txt` - Crawler directives
- `frontend/public/_redirects` - URL redirect rules
- `frontend/public/_headers` - HTTP response headers (HSTS, cache, X-Robots-Tag)
- `frontend/src/components/seo/StructuredData.tsx` - Reusable JSON-LD component
- `frontend/src/App.tsx` - Route definitions (add new routes here)
- `frontend/src/components/layout/Footer.tsx` - Footer navigation links

## Google API Access
- Service account: `seo-automation@updl-490718.iam.gserviceaccount.com`
- Credentials: `/Users/dev/Downloads/updl-490718-6ac63a60d724.json`
- Access to: Google Search Console (`sc-domain:freesslcert.net`) + GA4 (Property ID: 529693668)

## Current SEO Status (as of 2026-03-29)
- Site launched ~March 24, 2026 (very new)
- 74 Search Console impressions, 0 clicks, avg position ~58-62
- Homepage indexed; subpages not yet indexed
- 1,991 GA4 sessions (mostly launch day spike), 97.84% engagement rate
- Primary keywords: "free SSL certificate", "SSL certificate generator", "Let's Encrypt"
- Best ranking: "wildcard ssl" at position 11, "tls certificate free" at position 3 (Thailand)
