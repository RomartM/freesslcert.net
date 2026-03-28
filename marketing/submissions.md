# Backlink Submission Content for freesslcert.net

Ready-to-use submission content for each platform. Copy-paste directly into submission forms.

---

## 1. Product Hunt

**Name:** freesslcert.net

**Tagline (60 chars max):**
Free SSL certificates in 60s. No signup. No cost.

**Short Description (260 chars max):**
Generate free SSL/TLS certificates powered by Let's Encrypt directly in your browser. Supports single-domain, wildcard, and multi-domain SAN certificates. No account creation, no server-side key storage. Just enter your domain, verify ownership, and download your cert files.

**Longer Description:**
freesslcert.net is a browser-based SSL certificate generator that removes the complexity from obtaining HTTPS certificates.

The problem: Getting a free SSL certificate traditionally requires SSH access, command-line tools like Certbot, and technical knowledge that many website owners don't have. Paid alternatives charge $10-200/year for something that should be free.

Our solution: A visual, guided interface that handles the entire ACME protocol workflow. You enter your domain, verify ownership through HTTP file or DNS TXT record validation, and download your certificate, private key, and CA bundle -- all in about 60 seconds.

Key details:
- Certificates issued by Let's Encrypt (trusted by 99.9% of browsers)
- Supports single-domain, wildcard (*.example.com), and multi-domain SAN certificates
- No data stored on our servers -- private keys are never retained
- No signup or account creation required
- Includes step-by-step installation guides for Nginx, Apache, WordPress, and Node.js
- Built-in SSL checker tool to verify your installation
- Free email notifications before your certificate expires (90-day renewal cycle)

Tech stack: React + TypeScript frontend, Go backend implementing the ACME protocol, deployed across 6 regions.

**Topics/Tags:**
- Web Development
- Security
- Developer Tools
- Open Source
- DevOps

**First Comment (as maker):**
Hey Product Hunt! I built freesslcert.net because I was tired of the friction involved in getting SSL certificates for side projects and client sites.

Certbot is great if you have SSH access and are comfortable with the terminal, but a lot of people I work with -- designers running WordPress sites, small business owners on shared hosting, students learning web development -- just want to get a certificate and install it without learning a new CLI tool.

freesslcert.net handles the full ACME protocol flow through a browser interface. You enter your domain, prove you own it (via an HTTP file or DNS record), and download the cert files. The entire process takes about a minute.

A few things I'm particularly careful about:
- Private keys are never stored on our servers
- No account/signup wall -- just go to the site and use it
- Installation guides for Nginx, Apache, WordPress, and Node.js are included on the site
- Expiry reminder emails so you don't forget to renew before the 90-day window

Would love to hear your feedback. What other features would be useful?

**Thumbnail Description:**
A clean, minimal web interface showing a domain input field with a green shield icon. The design conveys simplicity and security -- reflecting the tool's purpose of making SSL certificates accessible to everyone.

---

## 2. AlternativeTo

**Software Name:** freesslcert.net

**Category:** Security > SSL/TLS Certificate Tools

**Description:**
freesslcert.net is a free, browser-based SSL/TLS certificate generator powered by Let's Encrypt. It provides a guided visual interface for obtaining Domain Validation (DV) certificates without requiring command-line tools, SSH access, or account creation. The tool supports single-domain, wildcard, and multi-domain SAN certificates, and includes installation guides for popular web servers.

**Features List:**
- Free SSL/TLS certificates from Let's Encrypt
- Browser-based interface (no CLI or SSH required)
- Single-domain certificate generation
- Wildcard certificate support (*.example.com)
- Multi-domain SAN certificate support
- HTTP file validation and DNS TXT record validation
- Downloads certificate, private key, and CA bundle
- No account or signup required
- No server-side private key storage
- SSL checker tool to verify certificate installations
- Step-by-step installation guides for Nginx, Apache, WordPress, and Node.js
- Email notifications before certificate expiry
- Deployed across 6 regions for fast global access
- HSTS enabled with preload

**Alternatives to:**
- SSLForFree.com
- ZeroSSL
- Certbot (Let's Encrypt CLI client)
- SSL.com

**Tags:**
SSL, TLS, HTTPS, certificate, Let's Encrypt, free SSL, security, web development, ACME, wildcard certificate, domain validation

**License Type:** Free

**Platforms:** Web-based (any browser)

---

## 3. GitHub Awesome Lists

### 3a. awesome-selfhosted

**Target repo:** awesome-selfhosted/awesome-selfhosted

**Section:** Security > SSL/TLS

**PR Title:** Add freesslcert.net to Security section

**PR Description:**
Adding freesslcert.net -- a browser-based Let's Encrypt certificate generator. It provides a web UI for the ACME protocol, supporting single, wildcard, and SAN certificates without requiring CLI tools.

**Entry (matching list format):**
```
- [freesslcert.net](https://freesslcert.net) - Browser-based SSL/TLS certificate generator using Let's Encrypt ACME protocol. Supports single, wildcard, and multi-domain SAN certificates. `MIT` `Go/Docker`
```

### 3b. awesome-security

**Target repo:** sbilly/awesome-security

**Section:** Web > SSL/TLS

**PR Title:** Add freesslcert.net - browser-based Let's Encrypt certificate generator

**PR Description:**
Adding freesslcert.net, a web-based tool for generating free SSL/TLS certificates via the Let's Encrypt ACME protocol. Supports single-domain, wildcard, and SAN certificates through a browser interface without requiring Certbot or SSH access.

**Entry (matching list format):**
```
- [freesslcert.net](https://freesslcert.net) - Free browser-based SSL/TLS certificate generator powered by Let's Encrypt. Supports single, wildcard, and multi-domain SAN certificates with HTTP and DNS validation.
```

### 3c. awesome-sysadmin

**Target repo:** awesome-foss/awesome-sysadmin

**Section:** Security > SSL/TLS

**PR Title:** Add freesslcert.net to SSL/TLS section

**PR Description:**
Adding freesslcert.net, a web-based Let's Encrypt ACME client that generates SSL certificates through a browser UI. Useful for environments where Certbot isn't available or for users who prefer a GUI workflow.

**Entry (matching list format):**
```
- [freesslcert.net](https://freesslcert.net) - Web-based Let's Encrypt ACME client for generating SSL/TLS certificates. Supports single, wildcard, and SAN certificates via HTTP and DNS validation. ([Source Code](https://github.com/freesslcert)) `MIT` `Go/Docker`
```

### 3d. awesome-nodejs (for the Node.js guide)

**Target repo:** sindresorhus/awesome-nodejs

**Section:** Security

**PR Title:** Add freesslcert.net Node.js SSL guide

**Entry:**
```
- [freesslcert.net Node.js SSL Guide](https://freesslcert.net/guides/nodejs-ssl) - Step-by-step guide for setting up HTTPS with Node.js and Express.js, including certificate generation.
```

### 3e. awesome-web-security

**Target repo:** nicksalientmedia/awesome-web-security or AcademySoftwareFoundation/awesome-web-security

**Section:** Tools > SSL/TLS

**PR Title:** Add freesslcert.net SSL certificate generator

**Entry:**
```
- [freesslcert.net](https://freesslcert.net) - Free browser-based SSL certificate generator and SSL checker. Generates Let's Encrypt certificates without CLI tools.
```

---

## 4. Hacker News (Show HN)

**Title:**
Show HN: freesslcert.net -- Browser-based SSL certificate generator using Let's Encrypt

**Description Text:**
I built a browser-based tool for generating free SSL certificates from Let's Encrypt without needing Certbot or SSH access.

The workflow: enter your domain, verify ownership via HTTP file or DNS TXT record, download your certificate + private key + CA bundle. Takes about 60 seconds.

It supports single-domain, wildcard (*.example.com), and multi-domain SAN certificates.

Why I built it: Certbot works well if you have terminal access, but a surprising number of people -- shared hosting users, WordPress site owners, students -- don't. They either pay for SSL unnecessarily or skip HTTPS entirely. This tool bridges that gap with a visual interface.

Technical details:
- Go backend implementing the ACME protocol (using the lego library)
- React + TypeScript frontend
- No private keys are stored server-side
- No signup or account creation
- Deployed across 6 regions
- Includes an SSL checker tool and installation guides for Nginx, Apache, WordPress, and Node.js

https://freesslcert.net

Happy to answer questions about the ACME implementation or architecture.

---

## 5. Reddit

### r/webdev

**Title:** I built a browser-based SSL certificate generator so you don't need Certbot or SSH access

**Body:**
I've been working on [freesslcert.net](https://freesslcert.net), a free tool that generates SSL certificates from Let's Encrypt through a browser interface.

**The problem it solves:** A lot of developers -- especially those on shared hosting, working with WordPress, or just starting out -- don't have easy access to Certbot or the terminal. They end up either paying for SSL certificates or leaving their sites on HTTP.

**How it works:**
1. Enter your domain name (supports single, wildcard, and multi-domain SAN)
2. Verify ownership via HTTP file upload or DNS TXT record
3. Download your certificate, private key, and CA bundle

The whole process takes about 60 seconds.

**Technical stack:** Go backend implementing the ACME protocol with the lego library, React + TypeScript frontend, deployed across 6 regions.

**Privacy-focused:** No signup required, no private keys stored on our servers, no tracking cookies.

I also wrote step-by-step installation guides for [Nginx](https://freesslcert.net/guides/nginx-ssl), [Apache](https://freesslcert.net/guides/apache-ssl), [WordPress](https://freesslcert.net/guides/wordpress-ssl), and [Node.js](https://freesslcert.net/guides/nodejs-ssl) that walk through the full process from certificate generation to working HTTPS.

Would appreciate any feedback from the community. What would make this more useful for your workflow?

---

### r/sysadmin

**Title:** Free browser-based Let's Encrypt certificate generator -- useful for environments where Certbot isn't an option

**Body:**
Built a tool at [freesslcert.net](https://freesslcert.net) that generates Let's Encrypt certificates through a web interface instead of the command line.

**When this is useful:**
- Shared hosting environments without SSH access
- Quick one-off certificates for dev/staging servers
- Non-technical team members who need to manage certs
- Environments where installing Certbot isn't practical

**What it does:**
- Generates single-domain, wildcard, and multi-domain SAN certificates
- Supports both HTTP file validation and DNS TXT record validation
- Provides certificate + private key + CA bundle download
- Includes an SSL checker to verify installations

**What it doesn't do:**
- No auto-renewal (these are standard 90-day Let's Encrypt certs -- you'd still want Certbot or similar for automated renewal on production systems)
- No private key storage on our end
- No account/signup required

This isn't meant to replace Certbot for automated production workflows. It's for situations where you need a certificate quickly and don't have CLI access, or for people who aren't comfortable with terminal-based tools.

The site also has installation guides covering Nginx, Apache, WordPress, and Node.js configurations.

https://freesslcert.net

Curious if others have run into the same use cases. What situations do you find yourselves needing a quick cert without Certbot?

---

### r/selfhosted

**Title:** freesslcert.net -- browser-based SSL certificate generator for your self-hosted projects

**Body:**
I built [freesslcert.net](https://freesslcert.net), a web tool for generating free SSL certificates from Let's Encrypt without needing Certbot installed.

For self-hosters, this is handy when:
- You're setting up a new service and need a cert before configuring automated renewal
- You're running something on a device where installing Certbot is awkward (NAS, embedded systems, etc.)
- You want a quick wildcard cert for *.yourdomain.com to cover multiple services

**How it works:** Enter your domain, verify via HTTP file or DNS TXT record, download cert + key + CA bundle. About 60 seconds start to finish.

Supports single-domain, wildcard, and multi-domain SAN certificates. No signup, no data stored, no cost.

The backend is written in Go and implements the ACME protocol using the lego library. The frontend is React + TypeScript. The whole stack runs in Docker if you want to look at self-hosting the tool itself.

Installation guides included for [Nginx](https://freesslcert.net/guides/nginx-ssl), [Apache](https://freesslcert.net/guides/apache-ssl), and [Node.js](https://freesslcert.net/guides/nodejs-ssl).

https://freesslcert.net

---

### r/netsec

**Title:** Browser-based ACME client for Let's Encrypt -- no CLI required, no key storage

**Body:**
I built [freesslcert.net](https://freesslcert.net), a web-based ACME client that generates SSL/TLS certificates from Let's Encrypt through a browser interface.

**Security considerations I want to be upfront about:**

- Private keys are generated server-side during the ACME flow but are not persisted to disk or database after delivery. This is a deliberate tradeoff -- browser-based key generation would be ideal but isn't compatible with the ACME protocol's CSR signing requirements.
- No user accounts or authentication. The tool is stateless by design.
- All traffic is served over HTTPS with HSTS preload enabled.
- No tracking scripts or third-party analytics cookies.

**What it supports:**
- Single-domain, wildcard, and multi-domain SAN certificates
- HTTP-01 and DNS-01 validation challenges
- Certificate + private key + CA bundle download

**Tech stack:** Go backend using the lego ACME library, React frontend, Docker deployment across 6 regions.

This is aimed at people who need certificates but don't have CLI access (shared hosting, managed environments, etc.). For production systems with shell access, Certbot with automated renewal is still the better choice.

I'd appreciate feedback from the security community on the architecture. Open to suggestions on improving the key handling workflow.

https://freesslcert.net

---

### r/webhosting

**Title:** Free tool to generate SSL certificates without SSH access -- useful for shared hosting

**Body:**
If you're on shared hosting without SSH access, getting a free SSL certificate can be frustrating. Your host might charge extra for SSL, or you might not have access to Certbot.

I built [freesslcert.net](https://freesslcert.net) to solve this. It generates free SSL certificates from Let's Encrypt through your browser:

1. Go to https://freesslcert.net
2. Enter your domain name
3. Verify ownership by uploading a file to your server or adding a DNS TXT record
4. Download your certificate, private key, and CA bundle

It supports:
- Single-domain certificates (example.com)
- Wildcard certificates (*.example.com)
- Multi-domain SAN certificates (multiple domains on one cert)

No signup needed. No cost. No data stored on our servers.

Once you have your certificate files, you can install them through your hosting control panel (cPanel, Plesk, etc.) or follow the guides on the site for [Nginx](https://freesslcert.net/guides/nginx-ssl) or [Apache](https://freesslcert.net/guides/apache-ssl).

The certificates are valid for 90 days (standard Let's Encrypt duration), and the site can send you an email reminder before expiry so you don't forget to renew.

Hope this helps someone save money on SSL. Happy to answer questions.

---

## 6. Dev.to Article

**Title:** How to Get a Free SSL Certificate Without the Command Line

**Tags:** ssl, security, webdev, tutorial

**Article Body:**

Every website should use HTTPS. It protects your users' data, improves your search ranking, and prevents browsers from showing "Not Secure" warnings that drive visitors away. But for many website owners, the process of actually obtaining and installing an SSL certificate remains confusing.

In this article, I'll explain how SSL certificates work, what your options are for getting one for free, and walk through a browser-based approach that doesn't require any command-line tools.

### What Is an SSL Certificate?

An SSL/TLS certificate is a cryptographic file that enables encrypted communication between a web server and a browser. When you visit a site using HTTPS, the certificate proves that the server is who it claims to be and establishes an encrypted channel for data transfer.

Certificates are issued by Certificate Authorities (CAs) -- organizations that verify domain ownership before issuing a certificate. Historically, certificates cost $50-200 per year, but since 2015, Let's Encrypt has been issuing them for free.

### The Traditional Way: Certbot

The standard way to get a free Let's Encrypt certificate is through Certbot, a command-line tool that automates the entire process. If you have SSH access to your server, Certbot is excellent:

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

This single command requests a certificate, proves domain ownership, installs the certificate on Nginx, and sets up automatic renewal. It is the recommended approach for anyone with terminal access.

But not everyone has terminal access.

### When Certbot Isn't an Option

There are several common situations where Certbot doesn't work:

- **Shared hosting** without SSH access (common with budget hosting plans)
- **Managed WordPress hosting** where you can't install packages
- **cPanel environments** where you have a web interface but no shell
- **Development machines** where you want a quick cert for testing
- **Non-technical users** who are comfortable with web interfaces but not terminals

For these cases, a browser-based approach can fill the gap.

### Browser-Based Certificate Generation

I built [freesslcert.net](https://freesslcert.net) as a web interface for the Let's Encrypt ACME protocol. Here's how the process works:

**Step 1: Enter Your Domain**

Navigate to https://freesslcert.net and type your domain name. The tool supports three certificate types:

- **Single domain** -- covers one domain (e.g., `example.com`)
- **Wildcard** -- covers all subdomains (e.g., `*.example.com`)
- **Multi-domain SAN** -- covers multiple specific domains on one certificate

**Step 2: Verify Domain Ownership**

Let's Encrypt needs proof that you control the domain before issuing a certificate. There are two verification methods:

*HTTP validation:* You download a small text file and upload it to a specific path on your web server (`/.well-known/acme-challenge/`). Let's Encrypt's servers then fetch this file to confirm you control the domain.

*DNS validation:* You add a TXT record to your domain's DNS settings. This is required for wildcard certificates and works even if your web server isn't running yet.

**Step 3: Download Your Certificate**

Once verified, you receive three files:

- **Certificate file** (`certificate.crt`) -- your domain's public certificate
- **Private key** (`private.key`) -- the secret key that pairs with your certificate
- **CA bundle** (`ca_bundle.crt`) -- the intermediate certificate chain that links your cert to Let's Encrypt's root

### Installing Your Certificate

The installation process depends on your server software. Here's a brief overview for the two most common setups:

**Nginx:**

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/ssl/certificate.crt;
    ssl_certificate_key /etc/ssl/private.key;
    ssl_trusted_certificate /etc/ssl/ca_bundle.crt;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
}
```

**Apache:**

```apache
<VirtualHost *:443>
    ServerName example.com

    SSLEngine on
    SSLCertificateFile    /etc/ssl/certificate.crt
    SSLCertificateKeyFile /etc/ssl/private.key
    SSLCertificateChainFile /etc/ssl/ca_bundle.crt
</VirtualHost>
```

For detailed walkthroughs, freesslcert.net includes full installation guides for [Nginx](https://freesslcert.net/guides/nginx-ssl), [Apache](https://freesslcert.net/guides/apache-ssl), [WordPress](https://freesslcert.net/guides/wordpress-ssl), and [Node.js](https://freesslcert.net/guides/nodejs-ssl).

### Verifying Your Installation

After installing your certificate, verify that everything is working correctly. Check for:

- The padlock icon appears in the browser address bar
- No mixed content warnings (all resources loaded over HTTPS)
- The full certificate chain is served (not just the leaf certificate)
- HTTP requests redirect to HTTPS

You can use freesslcert.net's [SSL Checker](https://freesslcert.net/ssl-checker) tool to scan your domain and identify any issues with your certificate installation.

### Renewal Reminder

Let's Encrypt certificates are valid for 90 days. If you're using Certbot, renewal is automatic. If you generated your certificate through a browser-based tool, you'll need to repeat the process before expiry.

freesslcert.net offers optional email notifications that remind you before your certificate expires, so you don't wake up to a "Your connection is not private" error on your site.

### Summary

| Method | Best For | Requires CLI | Auto-Renewal |
|--------|----------|-------------|-------------|
| Certbot | Servers with SSH access | Yes | Yes |
| Browser-based (freesslcert.net) | Shared hosting, cPanel, quick certs | No | No (email reminders available) |
| Hosting provider SSL | Sites on hosts that include SSL | No | Yes |

Every website deserves HTTPS. If you have shell access, use Certbot. If you don't, or if you just need a quick certificate without installing anything, give [freesslcert.net](https://freesslcert.net) a try.

---

## 7. Web Directories

### Capterra

**Product Name:** freesslcert.net

**Category:** Network Security Software > SSL Certificate Tools

**Short Description (150 chars):**
Free browser-based SSL certificate generator powered by Let's Encrypt. Single, wildcard, and multi-domain certificates in 60 seconds. No signup required.

**Full Description:**
freesslcert.net is a free, web-based SSL/TLS certificate generation tool that makes HTTPS accessible to everyone. Powered by Let's Encrypt, it provides a guided browser interface for obtaining Domain Validation (DV) certificates without requiring command-line tools, SSH access, or technical expertise.

Users enter their domain name, verify ownership through HTTP file upload or DNS TXT record validation, and download their certificate files -- all within about 60 seconds. The tool supports single-domain certificates, wildcard certificates (*.example.com), and multi-domain Subject Alternative Name (SAN) certificates.

Security is built into the architecture: private keys are not stored on the server after delivery, no user accounts or signup are required, and all communication occurs over HTTPS with HSTS preload. The service includes an SSL checker tool for verifying certificate installations and provides detailed installation guides for Nginx, Apache, WordPress, and Node.js.

**Features:**
- Free SSL/TLS certificate generation via Let's Encrypt
- Browser-based interface (no CLI or SSH required)
- Single-domain, wildcard, and multi-domain SAN support
- HTTP file and DNS TXT record domain validation
- Certificate, private key, and CA bundle download
- No signup or account creation
- No server-side private key storage
- SSL certificate checker tool
- Installation guides for Nginx, Apache, WordPress, and Node.js
- Certificate expiry email notifications
- Multi-region deployment for global performance
- HSTS with preload support

**Pricing:** Free

**Deployment:** Cloud/Web-based

**Website:** https://freesslcert.net

---

### G2

**Product Name:** freesslcert.net

**Category:** SSL Certificate Management

**One-Liner:** Free SSL certificates from Let's Encrypt, generated in your browser

**Description:**
freesslcert.net eliminates the complexity of obtaining SSL/TLS certificates. Instead of installing command-line tools or purchasing certificates, users generate free Let's Encrypt certificates through a simple web interface in about 60 seconds.

The tool handles the full ACME protocol workflow: domain entry, ownership verification (via HTTP file or DNS record), and certificate download. It supports single-domain, wildcard, and multi-domain SAN certificates.

Designed with privacy in mind, freesslcert.net stores no private keys, requires no user accounts, and includes no tracking. Additional tools include an SSL checker for verifying installations and step-by-step guides for Nginx, Apache, WordPress, and Node.js.

**What Users Like:**
- No cost, no signup, no hidden fees
- Works without SSH access or CLI tools
- Supports wildcard and SAN certificates
- Clear installation guides for major web servers
- Fast -- certificates generated in about 60 seconds

**Best For:** Web developers, sysadmins, small business owners, freelancers, and anyone who needs a free SSL certificate without command-line complexity.

**Pricing:** Free

---

### SourceForge

**Product Name:** freesslcert.net

**Category:** Security & Utilities > SSL/TLS Tools

**Short Description:**
Free browser-based SSL certificate generator powered by Let's Encrypt. Generate single, wildcard, and multi-domain SAN certificates in 60 seconds without CLI tools or signup.

**Full Description:**
freesslcert.net is a web-based tool for generating free SSL/TLS certificates from Let's Encrypt. It implements the ACME protocol through a visual browser interface, making certificate generation accessible to users who don't have command-line access or prefer a GUI workflow.

Features:
- Generate single-domain, wildcard, and multi-domain SAN certificates
- Verify domain ownership via HTTP file upload or DNS TXT record
- Download certificate, private key, and CA bundle
- No account creation or signup required
- No server-side private key retention
- SSL certificate checker to verify installations
- Installation guides for Nginx, Apache, WordPress, and Node.js
- Email notifications before certificate expiry
- Deployed across 6 global regions

Built with a Go backend (ACME protocol via lego library) and React + TypeScript frontend. The entire stack runs in Docker.

**License:** Free to use

**Programming Language:** Go, TypeScript

**Website:** https://freesslcert.net

---

## 8. IndieHackers

### Product Listing Description

**Name:** freesslcert.net

**Tagline:** Free SSL certificates in your browser, powered by Let's Encrypt

**Description:**
freesslcert.net is a free tool that generates SSL/TLS certificates from Let's Encrypt through a browser interface. No CLI, no SSH, no signup. Enter your domain, verify ownership, download your cert. Supports single, wildcard, and multi-domain SAN certificates.

Built as a solo project with a Go backend and React frontend. The service is free and has no paid tier -- the goal is to make HTTPS accessible to everyone.

**Revenue Model:** Free (no monetization)

**Tech Stack:** Go, React, TypeScript, Docker, Turso

**Website:** https://freesslcert.net

---

### Launch Post

**Title:** freesslcert.net -- I built a browser-based SSL certificate generator

**Body:**
Hey IH,

I just launched [freesslcert.net](https://freesslcert.net), a free tool for generating SSL certificates from Let's Encrypt without needing Certbot or terminal access.

**Why I built it:**

I kept running into the same scenario: someone needs HTTPS on their website, but they're on shared hosting without SSH access, or they're just not comfortable with command-line tools. The existing browser-based options (like SSLForFree.com) either disappeared behind paywalls, got acquired and changed their model, or started requiring account creation for something that should be straightforward.

I wanted a tool that:
- Works entirely in the browser
- Requires no signup or account
- Stores no private keys
- Is completely free
- Just works

**What it does:**

1. You enter your domain (single, wildcard, or multi-domain)
2. You verify ownership via HTTP file or DNS TXT record
3. You download your certificate, private key, and CA bundle

The whole thing takes about 60 seconds.

**Tech stack:**

- Go backend implementing the ACME protocol (using the lego library)
- React + TypeScript + Tailwind CSS frontend
- Turso (libSQL) for minimal operational data
- Docker deployment across 6 regions via Traefik

**What's included on the site:**

- SSL certificate generator (the core tool)
- SSL checker to verify your installation
- Installation guides for Nginx, Apache, WordPress, and Node.js
- Expiry email reminders so you don't forget to renew
- Educational content: SSL vs TLS explainer, comprehensive FAQ

**Business model:**

There isn't one. This is a free tool. No paid tier, no premium features behind a wall. I built it because I think HTTPS should be easy for everyone, and the existing free options keep getting worse.

If it generates some traffic and backlinks to other projects down the road, great. But the tool itself will remain free.

**Numbers so far:**

- Launched about a week ago
- ~2,000 sessions in the first few days (mostly launch day spike)
- Starting to get indexed by Google (74 impressions, working on improving rankings)

Would love to hear from others who've launched free tools: how do you think about sustainability when there's no revenue model? And any feedback on the product itself is very welcome.

https://freesslcert.net

---

## Quick Reference: All Submission URLs

| Platform | Submission URL |
|----------|---------------|
| Product Hunt | https://www.producthunt.com/posts/new |
| AlternativeTo | https://alternativeto.net/software/submit/ |
| Hacker News | https://news.ycombinator.com/submitlink |
| Reddit (various) | Post to each subreddit individually |
| Dev.to | https://dev.to/new |
| Capterra | https://www.capterra.com/vendors/sign-up |
| G2 | https://seller.g2.com/ |
| SourceForge | https://sourceforge.net/software/vendors/ |
| IndieHackers | https://www.indiehackers.com/products/new |
| GitHub Awesome Lists | Submit PRs to each repository |

---

## Submission Checklist

- [ ] Product Hunt -- schedule launch for a Tuesday or Wednesday
- [ ] AlternativeTo -- submit listing
- [ ] GitHub awesome-selfhosted -- submit PR
- [ ] GitHub awesome-security -- submit PR
- [ ] GitHub awesome-sysadmin -- submit PR
- [ ] Hacker News Show HN -- post during US morning hours (9-11am ET)
- [ ] Reddit r/webdev -- post (check subreddit rules for self-promotion limits)
- [ ] Reddit r/sysadmin -- post (frame as useful tool, not promotion)
- [ ] Reddit r/selfhosted -- post
- [ ] Reddit r/netsec -- post (emphasize security architecture)
- [ ] Reddit r/webhosting -- post (focus on shared hosting use case)
- [ ] Dev.to article -- publish
- [ ] Capterra listing -- submit
- [ ] G2 listing -- submit
- [ ] SourceForge listing -- submit
- [ ] IndieHackers product listing -- create
- [ ] IndieHackers launch post -- publish
