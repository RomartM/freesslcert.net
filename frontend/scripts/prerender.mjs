/**
 * Post-build prerender script for freesslcert.net
 *
 * Generates route-specific HTML files so crawlers receive fully rendered pages
 * with correct <title>, <meta>, <link rel="canonical">, Open Graph tags,
 * structured data, and meaningful body content -- instead of the generic
 * homepage fallback that index.html provides.
 *
 * The React app hydrates over this static content on the client side.
 *
 * Usage: node scripts/prerender.mjs
 * Called automatically by "npm run build".
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, "..", "dist");
const BASE_URL = "https://freesslcert.net";

// ---------------------------------------------------------------------------
// Route definitions: meta tags + body content for each pre-rendered page
// ---------------------------------------------------------------------------

/** @typedef {{ route: string; title: string; description: string; canonical: string; ogType?: string; ogImage?: string; bodyContent: string; structuredData?: object[] }} RouteDefinition */

/** @type {RouteDefinition[]} */
const ROUTES = [
  // --- /about ---
  {
    route: "/about",
    title: "About freesslcert.net - Free SSL Certificate Generator",
    description:
      "Learn how freesslcert.net provides free SSL/TLS certificates through Let's Encrypt. Browser-based ACME client, no server-side key storage, no signup required.",
    canonical: `${BASE_URL}/about`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About freesslcert.net",
        description:
          "Learn how freesslcert.net provides free SSL/TLS certificates through Let's Encrypt with a simple browser-based interface.",
        url: `${BASE_URL}/about`,
        mainEntity: {
          "@type": "WebApplication",
          name: "freesslcert.net",
          url: BASE_URL,
          applicationCategory: "SecurityApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "About",
            item: `${BASE_URL}/about`,
          },
        ],
      },
    ],
    bodyContent: `
      <a href="/">Back to Home</a>
      <h1>About freesslcert.net</h1>
      <p>Free SSL certificates for everyone, powered by Let's Encrypt</p>

      <section>
        <h2>What We Do</h2>
        <p>freesslcert.net is a free SSL/TLS certificate generation service that makes HTTPS accessible to everyone. We provide a simple, browser-based interface for obtaining Domain Validation (DV) certificates from <a href="https://letsencrypt.org">Let's Encrypt</a>, a free, automated, and open Certificate Authority. Whether you need a single-domain certificate, a multi-domain SAN certificate, or a wildcard certificate, our tool handles the entire ACME protocol workflow for you. There is no signup, no account creation, and no cost involved.</p>
      </section>

      <section>
        <h2>Why We Built This</h2>
        <p>HTTPS should be the default for every website, but obtaining and installing SSL certificates has traditionally been a complex process involving command-line tools, server configuration, and technical knowledge that many website owners simply do not have. While Let's Encrypt made free certificates available to the world, their standard tooling (Certbot) requires SSH access and command-line familiarity. We built freesslcert.net to bridge that gap: a visual, guided interface that walks you through every step of certificate generation, from domain validation to downloading your certificate files.</p>
      </section>

      <section>
        <h2>How It Works</h2>
        <p>Under the hood, freesslcert.net implements the ACME (Automatic Certificate Management Environment) protocol, which is the standard used by Let's Encrypt to verify domain ownership and issue certificates.</p>
        <ol>
          <li><strong>You enter your domain name</strong> and choose a certificate type (single domain, wildcard, or multi-domain SAN).</li>
          <li><strong>We create an ACME order</strong> with Let's Encrypt and present you with a domain validation challenge.</li>
          <li><strong>Once validated, Let's Encrypt issues your certificate</strong>, and we provide you with all necessary files.</li>
          <li><strong>You download your files</strong> and install them on your web server.</li>
        </ol>
      </section>

      <section>
        <h2>Trust &amp; Security</h2>
        <ul>
          <li><strong>No data stored</strong> - Certificate data, including private keys, is not permanently stored on our servers.</li>
          <li><strong>Encrypted transmission</strong> - All communication occurs over HTTPS.</li>
          <li><strong>No tracking</strong> - We do not use analytics trackers or advertising cookies.</li>
          <li><strong>Open infrastructure</strong> - We use Let's Encrypt, a transparent, publicly audited Certificate Authority.</li>
        </ul>
      </section>

      <section>
        <h2>Get Started</h2>
        <p>Ready to secure your website with a free SSL certificate? Head to our homepage to generate your certificate in minutes.</p>
        <a href="/">Generate a Certificate</a>
        <a href="/faq">Read the FAQ</a>
      </section>
    `,
  },

  // --- /faq ---
  {
    route: "/faq",
    title: "SSL Certificate FAQ - Frequently Asked Questions | freesslcert.net",
    description:
      "Answers to common questions about free SSL certificates, Let's Encrypt, wildcard certificates, certificate installation, renewal, and troubleshooting.",
    canonical: `${BASE_URL}/faq`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is an SSL/TLS certificate and why do I need one?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "An SSL/TLS certificate is a digital file that encrypts data transmitted between a web browser and a web server. When installed on your server, it enables the HTTPS protocol and causes browsers to display a padlock icon. SSL certificates protect sensitive data and are essential for SEO rankings, as Google uses HTTPS as a ranking signal.",
            },
          },
          {
            "@type": "Question",
            name: "Is this really free? What's the catch?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, completely free. We use Let's Encrypt, a nonprofit Certificate Authority backed by major tech companies. There are no hidden costs, no premium tiers, and no credit card required.",
            },
          },
          {
            "@type": "Question",
            name: "How long do SSL certificates last?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Let's Encrypt certificates are valid for 90 days. You can generate a new certificate anytime for free.",
            },
          },
          {
            "@type": "Question",
            name: "Are wildcard SSL certificates supported?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! Select Wildcard as the certificate type and use DNS validation. A wildcard certificate covers your domain and all its subdomains.",
            },
          },
          {
            "@type": "Question",
            name: "What validation methods are available?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "HTTP file upload and DNS TXT record validation. DNS validation is required for wildcard certificates.",
            },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "FAQ",
            item: `${BASE_URL}/faq`,
          },
        ],
      },
    ],
    bodyContent: `
      <a href="/">Back to Home</a>
      <h1>SSL Certificate FAQ</h1>
      <p>Everything you need to know about free SSL/TLS certificates</p>

      <section>
        <h2>What is an SSL/TLS certificate and why do I need one?</h2>
        <p>An SSL/TLS certificate is a digital file that encrypts data transmitted between a web browser and a web server. When installed on your server, it enables the HTTPS protocol and causes browsers to display a padlock icon in the address bar. SSL certificates protect sensitive data like login credentials, payment information, and personal details from interception. Beyond security, SSL certificates are essential for SEO rankings, as Google uses HTTPS as a ranking signal. Modern browsers also display "Not Secure" warnings for HTTP-only sites.</p>
      </section>

      <section>
        <h2>Is this really free? What's the catch?</h2>
        <p>Yes, completely free. We use Let's Encrypt, a nonprofit Certificate Authority backed by organizations including Mozilla, EFF, Cisco, and Google. There are no hidden costs, no premium tiers, and no credit card required. Let's Encrypt has issued certificates for over 400 million websites.</p>
      </section>

      <section>
        <h2>How long do SSL certificates last?</h2>
        <p>Let's Encrypt certificates are valid for 90 days. You can generate a new certificate anytime for free. We recommend setting a reminder to renew before expiration. freesslcert.net offers optional email reminders when your certificate is about to expire.</p>
      </section>

      <section>
        <h2>Are wildcard SSL certificates supported?</h2>
        <p>Yes! Select "Wildcard" as the certificate type and use DNS validation. A wildcard certificate covers your domain and all its subdomains (e.g., *.example.com covers blog.example.com, app.example.com, etc.).</p>
      </section>

      <section>
        <h2>What validation methods are available?</h2>
        <p>We support two validation methods: HTTP file upload (place a verification file on your web server) and DNS TXT record validation (add a TXT record to your domain's DNS). DNS validation is required for wildcard certificates.</p>
      </section>

      <section>
        <h2>What web servers are supported?</h2>
        <p>Our certificates work with all major web servers including Nginx, Apache, Node.js, Caddy, IIS, Tomcat, and any server that supports PEM, DER, or PKCS12 certificate formats.</p>
      </section>

      <section>
        <h2>Is my private key secure?</h2>
        <p>Private keys are generated on our server for the certificate issuance process, then served to you over HTTPS. All certificate data including private keys is automatically purged from our servers within 24 hours.</p>
      </section>

      <section>
        <h2>How do I generate a Let's Encrypt certificate without certbot?</h2>
        <p>freesslcert.net is a web-based certbot alternative. Enter your domain, verify ownership via DNS or HTTP, and download your certificate - all from your browser. No command line required.</p>
      </section>

      <section>
        <h2>Is this an alternative to SSLForFree.com?</h2>
        <p>Yes. SSLForFree.com was acquired by ZeroSSL in 2020 and now has limitations. freesslcert.net provides unlimited free SSL certificates with no signup, just like the original SSLForFree.</p>
      </section>

      <section>
        <a href="/">Generate a Free SSL Certificate</a>
      </section>
    `,
  },

  // --- /guides/nginx-ssl ---
  {
    route: "/guides/nginx-ssl",
    title:
      "How to Install a Free SSL Certificate on Nginx - Step-by-Step Guide",
    description:
      "Complete guide to installing a free Let's Encrypt SSL certificate on Nginx. Includes server block configuration, HTTPS redirect, security headers, and testing.",
    canonical: `${BASE_URL}/guides/nginx-ssl`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Install a Free SSL Certificate on Nginx",
        description:
          "Step-by-step guide to installing a free Let's Encrypt SSL/TLS certificate on an Nginx web server.",
        totalTime: "PT15M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Generate your SSL certificate",
            text: "Visit freesslcert.net and generate a free SSL certificate for your domain.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Upload certificate files to your server",
            text: "Transfer certificate.crt, private.key, and ca_bundle.crt to /etc/ssl/ on your server.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Create the full chain certificate file",
            text: "Concatenate your certificate and CA bundle into fullchain.pem.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Configure Nginx server block for SSL",
            text: "Add ssl_certificate and ssl_certificate_key directives to your Nginx server block.",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Test and reload Nginx",
            text: "Run nginx -t then systemctl reload nginx.",
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Nginx SSL Guide",
            item: `${BASE_URL}/guides/nginx-ssl`,
          },
        ],
      },
    ],
    bodyContent: `
      <a href="/">Back to Home</a>
      <h1>How to Install a Free SSL Certificate on Nginx</h1>
      <p>A complete step-by-step guide to configuring HTTPS on your Nginx web server</p>

      <p>This guide walks you through installing a free SSL/TLS certificate from <a href="/">freesslcert.net</a> on an Nginx web server. By the end, your website will serve traffic over HTTPS with a valid, browser-trusted certificate from Let's Encrypt.</p>

      <section>
        <h2>Prerequisites</h2>
        <ul>
          <li>A server running Nginx (1.18+)</li>
          <li>SSH (root or sudo) access to your server</li>
          <li>A domain name pointing to your server's IP address</li>
          <li>SSL certificate files from <a href="/">freesslcert.net</a></li>
        </ul>
      </section>

      <section>
        <h2>Step 1: Generate Your SSL Certificate</h2>
        <p>Visit <a href="/">freesslcert.net</a>, enter your domain, choose your certificate type, complete domain validation, and download your certificate files.</p>
      </section>

      <section>
        <h2>Step 2: Upload Certificate Files to Your Server</h2>
        <p>Transfer certificate.crt, private.key, and ca_bundle.crt to your server's /etc/ssl/ directory using SCP or SFTP.</p>
      </section>

      <section>
        <h2>Step 3: Create the Full Chain Certificate</h2>
        <p>Nginx requires a single file containing both your certificate and the intermediate CA certificate. Concatenate them into a fullchain.pem file.</p>
      </section>

      <section>
        <h2>Step 4: Configure Nginx Server Block</h2>
        <p>Edit your Nginx server block to listen on port 443 with SSL. Add ssl_certificate, ssl_certificate_key, and security headers.</p>
      </section>

      <section>
        <h2>Step 5: Test and Reload Nginx</h2>
        <p>Test the configuration with nginx -t, then reload with systemctl reload nginx.</p>
      </section>

      <section>
        <h2>Step 6: Set Up Auto-Renewal Reminder</h2>
        <p>Let's Encrypt certificates expire after 90 days. Set a reminder to renew before expiration.</p>
      </section>

      <section>
        <h2>Related Resources</h2>
        <ul>
          <li><a href="/guides/apache-ssl">How to Install SSL on Apache</a></li>
          <li><a href="/guides/wordpress-ssl">How to Install SSL on WordPress</a></li>
          <li><a href="/guides/nodejs-ssl">How to Set Up SSL with Node.js</a></li>
          <li><a href="/ssl-vs-tls">SSL vs TLS: What's the Difference?</a></li>
          <li><a href="/faq">SSL Certificate FAQ</a></li>
        </ul>
      </section>
    `,
  },

  // --- /guides/apache-ssl ---
  {
    route: "/guides/apache-ssl",
    title:
      "How to Install a Free SSL Certificate on Apache - Step-by-Step Guide",
    description:
      "Complete guide to installing a free Let's Encrypt SSL certificate on Apache. Includes VirtualHost configuration, HTTPS redirect, mod_ssl setup, and testing.",
    canonical: `${BASE_URL}/guides/apache-ssl`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Install a Free SSL Certificate on Apache",
        description:
          "Step-by-step guide to installing a free Let's Encrypt SSL/TLS certificate on an Apache web server.",
        totalTime: "PT15M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Generate your SSL certificate",
            text: "Visit freesslcert.net and generate a free SSL certificate for your domain.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enable mod_ssl on Apache",
            text: "Install and enable the mod_ssl module for Apache.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Upload certificate files",
            text: "Transfer certificate files to your server.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Configure Apache VirtualHost",
            text: "Add SSLCertificateFile and SSLCertificateKeyFile directives to your VirtualHost.",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Test and restart Apache",
            text: "Run apachectl configtest then systemctl restart apache2.",
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Apache SSL Guide",
            item: `${BASE_URL}/guides/apache-ssl`,
          },
        ],
      },
    ],
    bodyContent: `
      <a href="/">Back to Home</a>
      <h1>How to Install a Free SSL Certificate on Apache</h1>
      <p>A complete step-by-step guide to configuring HTTPS on your Apache web server</p>

      <p>This guide walks you through installing a free SSL/TLS certificate from <a href="/">freesslcert.net</a> on an Apache (httpd) web server.</p>

      <section>
        <h2>Prerequisites</h2>
        <ul>
          <li>A server running Apache 2.4+</li>
          <li>SSH (root or sudo) access</li>
          <li>A domain name pointing to your server</li>
          <li>SSL certificate files from <a href="/">freesslcert.net</a></li>
        </ul>
      </section>

      <section>
        <h2>Step 1: Generate Your SSL Certificate</h2>
        <p>Visit <a href="/">freesslcert.net</a> to generate a free certificate for your domain.</p>
      </section>

      <section>
        <h2>Step 2: Enable mod_ssl</h2>
        <p>Install and enable the Apache SSL module with: sudo a2enmod ssl</p>
      </section>

      <section>
        <h2>Step 3: Upload Certificate Files</h2>
        <p>Transfer certificate.crt, private.key, and ca_bundle.crt to your server.</p>
      </section>

      <section>
        <h2>Step 4: Configure Apache VirtualHost</h2>
        <p>Create or update your VirtualHost configuration with SSLEngine on, SSLCertificateFile, SSLCertificateKeyFile, and SSLCertificateChainFile directives.</p>
      </section>

      <section>
        <h2>Step 5: Set Up HTTP to HTTPS Redirect</h2>
        <p>Add a redirect rule to automatically send HTTP visitors to HTTPS.</p>
      </section>

      <section>
        <h2>Step 6: Test and Restart Apache</h2>
        <p>Test configuration with apachectl configtest, then restart with systemctl restart apache2.</p>
      </section>

      <section>
        <h2>Related Resources</h2>
        <ul>
          <li><a href="/guides/nginx-ssl">How to Install SSL on Nginx</a></li>
          <li><a href="/guides/wordpress-ssl">How to Install SSL on WordPress</a></li>
          <li><a href="/guides/nodejs-ssl">How to Set Up SSL with Node.js</a></li>
          <li><a href="/ssl-vs-tls">SSL vs TLS: What's the Difference?</a></li>
          <li><a href="/faq">SSL Certificate FAQ</a></li>
        </ul>
      </section>
    `,
  },

  // --- /guides/wordpress-ssl ---
  {
    route: "/guides/wordpress-ssl",
    title:
      "How to Install a Free SSL Certificate on WordPress - Step-by-Step Guide",
    description:
      "Complete guide to installing a free Let's Encrypt SSL certificate on WordPress. Includes cPanel installation, URL updates, mixed content fixes, and HTTPS redirects.",
    canonical: `${BASE_URL}/guides/wordpress-ssl`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Install a Free SSL Certificate on WordPress",
        description:
          "Step-by-step guide to installing a free Let's Encrypt SSL/TLS certificate on a WordPress website.",
        totalTime: "PT20M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Generate your SSL certificate",
            text: "Visit freesslcert.net and generate a free SSL certificate for your domain.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Install the certificate via your hosting control panel",
            text: "Use cPanel, Plesk, or your host's SSL manager to install the certificate.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Update WordPress URLs to HTTPS",
            text: "Change the WordPress Address and Site Address to use https:// in Settings > General.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Fix mixed content",
            text: "Update internal links and media URLs to use HTTPS.",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Set up HTTP to HTTPS redirect",
            text: "Add a redirect rule in .htaccess or your hosting panel.",
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "WordPress SSL Guide",
            item: `${BASE_URL}/guides/wordpress-ssl`,
          },
        ],
      },
    ],
    bodyContent: `
      <a href="/">Back to Home</a>
      <h1>How to Install a Free SSL Certificate on WordPress</h1>
      <p>A complete step-by-step guide to securing your WordPress website with HTTPS</p>

      <p>This guide covers installing a free Let's Encrypt SSL certificate on your WordPress site, whether you use shared hosting with cPanel, a VPS, or managed WordPress hosting.</p>

      <section>
        <h2>Prerequisites</h2>
        <ul>
          <li>A WordPress website with admin access</li>
          <li>Access to your hosting control panel (cPanel, Plesk, or similar)</li>
          <li>A domain name pointing to your hosting server</li>
          <li>SSL certificate files from <a href="/">freesslcert.net</a></li>
        </ul>
      </section>

      <section>
        <h2>Step 1: Generate Your SSL Certificate</h2>
        <p>Visit <a href="/">freesslcert.net</a> to generate a free certificate for your domain.</p>
      </section>

      <section>
        <h2>Step 2: Install the Certificate via cPanel</h2>
        <p>Log in to cPanel, navigate to SSL/TLS, and paste your certificate, private key, and CA bundle.</p>
      </section>

      <section>
        <h2>Step 3: Update WordPress URLs</h2>
        <p>In WordPress Settings &gt; General, change both WordPress Address and Site Address to use https://.</p>
      </section>

      <section>
        <h2>Step 4: Fix Mixed Content</h2>
        <p>Update internal links, images, and resource URLs to use HTTPS. Use a plugin like Really Simple SSL or Better Search Replace.</p>
      </section>

      <section>
        <h2>Step 5: Set Up HTTPS Redirect</h2>
        <p>Add a redirect in .htaccess to automatically redirect HTTP to HTTPS.</p>
      </section>

      <section>
        <h2>Related Resources</h2>
        <ul>
          <li><a href="/guides/nginx-ssl">How to Install SSL on Nginx</a></li>
          <li><a href="/guides/apache-ssl">How to Install SSL on Apache</a></li>
          <li><a href="/guides/nodejs-ssl">How to Set Up SSL with Node.js</a></li>
          <li><a href="/faq">SSL Certificate FAQ</a></li>
        </ul>
      </section>
    `,
  },

  // --- /guides/nodejs-ssl ---
  {
    route: "/guides/nodejs-ssl",
    title:
      "How to Set Up a Free SSL Certificate with Node.js - Step-by-Step Guide",
    description:
      "Complete guide to setting up a free Let's Encrypt SSL certificate with Node.js. Includes HTTPS server configuration, Express.js setup, and HTTP-to-HTTPS redirect.",
    canonical: `${BASE_URL}/guides/nodejs-ssl`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Set Up a Free SSL Certificate with Node.js",
        description:
          "Step-by-step guide to setting up a free Let's Encrypt SSL/TLS certificate with a Node.js server.",
        totalTime: "PT15M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Generate your SSL certificate",
            text: "Visit freesslcert.net and generate a free SSL certificate for your domain.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Upload certificate files to your server",
            text: "Transfer certificate files to your Node.js project directory.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Configure the HTTPS server",
            text: "Use https.createServer() with your certificate files to create an HTTPS server.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Set up HTTP to HTTPS redirect",
            text: "Create an HTTP server that redirects all requests to HTTPS.",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Test your setup",
            text: "Start your server and verify HTTPS works correctly.",
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Node.js SSL Guide",
            item: `${BASE_URL}/guides/nodejs-ssl`,
          },
        ],
      },
    ],
    bodyContent: `
      <a href="/">Back to Home</a>
      <h1>How to Set Up a Free SSL Certificate with Node.js</h1>
      <p>A complete step-by-step guide to configuring HTTPS on your Node.js server</p>

      <p>This guide walks you through setting up a free Let's Encrypt SSL certificate with Node.js using the built-in https module and Express.js.</p>

      <section>
        <h2>Prerequisites</h2>
        <ul>
          <li>Node.js v14 or later installed on your server</li>
          <li>SSH access to your server</li>
          <li>A domain name pointing to your server</li>
          <li>SSL certificate files from <a href="/">freesslcert.net</a></li>
        </ul>
      </section>

      <section>
        <h2>Step 1: Generate Your SSL Certificate</h2>
        <p>Visit <a href="/">freesslcert.net</a> to generate a free certificate for your domain.</p>
      </section>

      <section>
        <h2>Step 2: Upload Certificate Files</h2>
        <p>Transfer certificate.crt, private.key, and ca_bundle.crt to your project's certs/ directory.</p>
      </section>

      <section>
        <h2>Step 3: Configure the HTTPS Server</h2>
        <p>Use Node.js https.createServer() with fs.readFileSync() to load your certificate files and create an HTTPS server.</p>
      </section>

      <section>
        <h2>Step 4: Set Up HTTP to HTTPS Redirect</h2>
        <p>Create a separate HTTP server on port 80 that redirects all requests to HTTPS on port 443.</p>
      </section>

      <section>
        <h2>Step 5: Express.js Configuration</h2>
        <p>If using Express, pass your Express app to https.createServer() for automatic HTTPS support.</p>
      </section>

      <section>
        <h2>Related Resources</h2>
        <ul>
          <li><a href="/guides/nginx-ssl">How to Install SSL on Nginx</a></li>
          <li><a href="/guides/apache-ssl">How to Install SSL on Apache</a></li>
          <li><a href="/guides/wordpress-ssl">How to Install SSL on WordPress</a></li>
          <li><a href="/ssl-vs-tls">SSL vs TLS: What's the Difference?</a></li>
          <li><a href="/faq">SSL Certificate FAQ</a></li>
        </ul>
      </section>
    `,
  },

  // --- /ssl-vs-tls ---
  {
    route: "/ssl-vs-tls",
    title:
      "SSL vs TLS: What's the Difference? A Complete Guide | freesslcert.net",
    description:
      "Understand the differences between SSL and TLS protocols. Learn about SSL 3.0, TLS 1.0 through 1.3, why TLS replaced SSL, and why we still say 'SSL certificate'.",
    canonical: `${BASE_URL}/ssl-vs-tls`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "SSL vs TLS: What's the Difference?",
        description:
          "A comprehensive explanation of the differences between SSL and TLS, their history, versions, and why we still say 'SSL' when we mean TLS.",
        author: {
          "@type": "Organization",
          name: "freesslcert.net",
          url: BASE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "freesslcert.net",
          url: BASE_URL,
        },
        mainEntityOfPage: `${BASE_URL}/ssl-vs-tls`,
        datePublished: "2025-01-15",
        dateModified: "2025-01-15",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "SSL vs TLS",
            item: `${BASE_URL}/ssl-vs-tls`,
          },
        ],
      },
    ],
    bodyContent: `
      <a href="/">Back to Home</a>
      <h1>SSL vs TLS: What's the Difference?</h1>
      <p>A comprehensive guide to understanding SSL and TLS protocols</p>

      <section>
        <h2>The Short Answer</h2>
        <p>TLS (Transport Layer Security) is the modern successor to SSL (Secure Sockets Layer). They serve the same purpose: encrypting data between a client and server. SSL is deprecated and should not be used. When people say "SSL certificate," they almost always mean a certificate used with the TLS protocol.</p>
      </section>

      <section>
        <h2>A Brief History</h2>
        <p>SSL was developed by Netscape in the 1990s. SSL 2.0 was the first publicly released version (1995), followed by SSL 3.0 (1996). TLS 1.0 was introduced in 1999 as a standards-based upgrade. TLS 1.1 arrived in 2006, TLS 1.2 in 2008, and TLS 1.3 in 2018. All SSL versions and TLS 1.0/1.1 are now deprecated due to known vulnerabilities.</p>
      </section>

      <section>
        <h2>Key Differences</h2>
        <ul>
          <li><strong>Security</strong> - TLS uses stronger cryptographic algorithms and eliminates vulnerabilities present in SSL.</li>
          <li><strong>Performance</strong> - TLS 1.3 reduces handshake roundtrips, making connections faster.</li>
          <li><strong>Cipher Suites</strong> - TLS 1.3 removes support for legacy algorithms like RC4, DES, and 3DES.</li>
          <li><strong>Compatibility</strong> - Modern browsers require TLS 1.2 or higher. SSL connections will be rejected.</li>
        </ul>
      </section>

      <section>
        <h2>Why Do People Still Say "SSL"?</h2>
        <p>The term "SSL" became the generic name for web encryption. Even though TLS replaced SSL over 20 years ago, "SSL certificate" remains the common term. The certificates themselves work with any protocol version - they are not specific to SSL or TLS.</p>
      </section>

      <section>
        <h2>What Should You Use?</h2>
        <p>Always use TLS 1.2 or TLS 1.3. Disable all SSL versions and TLS 1.0/1.1 on your server. Modern web servers default to secure settings, but older configurations may still have legacy protocols enabled.</p>
      </section>

      <section>
        <a href="/">Generate a Free SSL/TLS Certificate</a>
        <a href="/faq">Read the FAQ</a>
      </section>
    `,
  },

  // --- /ssl-checker ---
  {
    route: "/ssl-checker",
    title:
      "Free SSL Certificate Checker - Check SSL Certificate Status | freesslcert.net",
    description:
      "Check any website's SSL certificate status for free. Verify expiration dates, certificate chain, issuer details, and identify common SSL problems like mixed content and hostname mismatches.",
    canonical: `${BASE_URL}/ssl-checker`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Free SSL Certificate Checker",
        description:
          "Check any website's SSL/TLS certificate status, expiration date, issuer, and configuration.",
        url: `${BASE_URL}/ssl-checker`,
        applicationCategory: "SecurityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "SSL Checker",
            item: `${BASE_URL}/ssl-checker`,
          },
        ],
      },
    ],
    bodyContent: `
      <a href="/">Back to Home</a>
      <h1>Free SSL Certificate Checker</h1>
      <p>Check the SSL/TLS certificate status of any website</p>

      <section>
        <h2>Check SSL Certificate</h2>
        <p>Enter a domain name to check its SSL certificate status, expiration date, issuer, and configuration.</p>
      </section>

      <section>
        <h2>What Does an SSL Checker Do?</h2>
        <p>An SSL checker connects to a website's server, retrieves its SSL/TLS certificate, and analyzes it for potential problems. It performs the same verification steps that a browser does, but presents the results in a detailed, human-readable format.</p>
      </section>

      <section>
        <h2>What Information Can You Learn from Checking SSL?</h2>
        <ul>
          <li><strong>Certificate validity</strong> - Whether the certificate is currently valid, expired, or not yet active</li>
          <li><strong>Expiration date</strong> - When the certificate expires and how many days remain</li>
          <li><strong>Issuer</strong> - The Certificate Authority that issued the certificate</li>
          <li><strong>Domain coverage</strong> - Which domain names are covered by the certificate</li>
          <li><strong>Certificate chain</strong> - Whether the full chain of trust is properly configured</li>
          <li><strong>Protocol support</strong> - Which <a href="/ssl-vs-tls">TLS versions</a> the server supports</li>
          <li><strong>Key size</strong> - The bit length of the certificate's public key</li>
        </ul>
      </section>

      <section>
        <h2>Common SSL Certificate Problems</h2>
        <ul>
          <li><strong>Expired Certificate</strong> - The most common problem. <a href="/">Generate a new free certificate</a> at any time.</li>
          <li><strong>Self-Signed Certificate</strong> - Not issued by a trusted CA. Replace with a Let's Encrypt certificate.</li>
          <li><strong>Hostname Mismatch</strong> - Domain in browser doesn't match the certificate. Generate a new certificate covering all domains.</li>
          <li><strong>Incomplete Certificate Chain</strong> - Server not sending intermediate certificates. Include the CA bundle.</li>
        </ul>
      </section>

      <section>
        <h2>Need a New SSL Certificate?</h2>
        <p>If your SSL check reveals an expired or misconfigured certificate, get a free replacement in minutes.</p>
        <a href="/">Generate a Free Certificate</a>
        <a href="/faq">Read the FAQ</a>
      </section>
    `,
  },

  // --- /privacy ---
  {
    route: "/privacy",
    title: "Privacy Policy | freesslcert.net",
    description:
      "Privacy policy for freesslcert.net. Learn how we handle your data when generating free SSL certificates. No data stored, no signup required.",
    canonical: `${BASE_URL}/privacy`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${BASE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Privacy Policy",
            item: `${BASE_URL}/privacy`,
          },
        ],
      },
    ],
    bodyContent: `
      <a href="/">Back to Home</a>
      <h1>Privacy Policy</h1>
      <p>Last updated: March 2026</p>

      <p>freesslcert.net is a free SSL/TLS certificate generation service powered by Let's Encrypt. We are committed to transparency about how we handle your data.</p>

      <section>
        <h2>Data We Collect</h2>
        <ul>
          <li>Domain names you submit for certificate generation</li>
          <li>Temporary certificate data (private keys, certificates) during the issuance process</li>
          <li>Basic request metadata (IP address, timestamp) for rate limiting</li>
        </ul>
      </section>

      <section>
        <h2>Data Retention</h2>
        <ul>
          <li>All certificate data (including private keys) is automatically purged within 24 hours of generation</li>
          <li>We do not store your certificates or keys permanently</li>
          <li>Rate limiting data is held in memory only and cleared on service restart</li>
        </ul>
      </section>

      <section>
        <h2>Data Sharing</h2>
        <ul>
          <li>Domain names are shared with Let's Encrypt as part of the ACME protocol</li>
          <li>Issued certificates are logged to public Certificate Transparency logs</li>
          <li>We do not sell, share, or transfer your data to any other third party</li>
        </ul>
      </section>

      <section>
        <h2>Cookies &amp; Tracking</h2>
        <p>We do not use cookies, analytics trackers, or any third-party tracking scripts.</p>
      </section>

      <section>
        <h2>Security</h2>
        <p>All communication with our service is encrypted via HTTPS. Private keys are transmitted over encrypted connections and automatically purged from our servers.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>For privacy-related inquiries, please email <a href="mailto:privacy@freesslcert.net">privacy@freesslcert.net</a>.</p>
      </section>
    `,
  },

  // --- /terms ---
  {
    route: "/terms",
    title: "Terms of Service | freesslcert.net",
    description:
      "Terms of service for freesslcert.net free SSL certificate generator. Powered by Let's Encrypt ACME protocol.",
    canonical: `${BASE_URL}/terms`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${BASE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Terms of Service",
            item: `${BASE_URL}/terms`,
          },
        ],
      },
    ],
    bodyContent: `
      <a href="/">Back to Home</a>
      <h1>Terms of Service</h1>
      <p>Last updated: March 2026</p>

      <p>These terms govern your use of freesslcert.net, a free SSL/TLS certificate generation service.</p>

      <section>
        <h2>Service Description</h2>
        <p>freesslcert.net provides a web-based interface for generating free SSL/TLS certificates through the Let's Encrypt Certificate Authority using the ACME protocol.</p>
      </section>

      <section>
        <h2>Acceptable Use</h2>
        <p>You may use this service to generate SSL certificates for domains you own or are authorized to manage. You may not use automated tools to generate excessive numbers of certificates or abuse the Let's Encrypt rate limits.</p>
      </section>

      <section>
        <h2>Certificate Authority</h2>
        <p>Certificates are issued by Let's Encrypt, a nonprofit Certificate Authority operated by the Internet Security Research Group (ISRG). Certificate issuance is subject to Let's Encrypt's policies and rate limits.</p>
      </section>

      <section>
        <h2>No Warranty</h2>
        <p>This service is provided "as is" without warranty of any kind. We do not guarantee uninterrupted service availability or certificate issuance.</p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>freesslcert.net shall not be liable for any damages arising from the use of this service, including but not limited to certificate expiration, misconfiguration, or security vulnerabilities.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>For questions about these terms, please email <a href="mailto:legal@freesslcert.net">legal@freesslcert.net</a>.</p>
      </section>
    `,
  },

  // --- /blog ---
  {
    route: "/blog",
    title: "SSL Certificate Blog | freesslcert.net",
    description:
      "Learn about SSL certificates, HTTPS security, Let's Encrypt, and website encryption. Guides, tutorials, and best practices from freesslcert.net.",
    canonical: `${BASE_URL}/blog`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "SSL Certificate Blog",
        description:
          "Learn about SSL certificates, HTTPS security, Let's Encrypt, and website encryption. Guides, tutorials, and best practices from freesslcert.net.",
        url: `${BASE_URL}/blog`,
        publisher: {
          "@type": "Organization",
          name: "freesslcert.net",
          url: BASE_URL,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${BASE_URL}/blog`,
          },
        ],
      },
    ],
    bodyContent: `
      <a href="/">Back to Home</a>
      <h1>SSL Certificate Blog</h1>
      <p>Guides, tutorials, and insights about SSL/TLS certificates and web security</p>

      <section>
        <h2>Latest Articles</h2>
        <article>
          <h3><a href="/blog/why-https-matters-2026">Why HTTPS Matters in 2026: Security, SEO, and Trust</a></h3>
          <p>HTTPS is no longer optional. Learn how SSL certificates impact your search rankings, protect user data, and why every website needs encryption in 2026.</p>
          <p>March 15, 2026 - 8 min read</p>
        </article>
        <article>
          <h3><a href="/blog/lets-encrypt-guide">Let's Encrypt Explained: How Free SSL Certificates Work</a></h3>
          <p>A comprehensive guide to Let's Encrypt, the nonprofit Certificate Authority that has issued billions of free SSL certificates. Learn how ACME works and how to get started.</p>
          <p>March 1, 2026 - 9 min read</p>
        </article>
        <article>
          <h3><a href="/blog/ssl-certificate-types-explained">SSL Certificate Types Explained: DV, OV, EV - Which Do You Need?</a></h3>
          <p>Not all SSL certificates are the same. Understand the differences between DV, OV, and EV certificates, plus wildcard and multi-domain options.</p>
          <p>February 15, 2026 - 10 min read</p>
        </article>
      </section>

      <section>
        <a href="/">Generate a Free SSL Certificate</a>
      </section>
    `,
  },

  // --- /blog/why-https-matters-2026 ---
  {
    route: "/blog/why-https-matters-2026",
    title: "Why HTTPS Matters in 2026: Security, SEO, and Trust | freesslcert.net",
    description:
      "Discover why HTTPS is essential in 2026 for SEO rankings, browser trust, data protection, and modern web API access. Learn how to get a free SSL certificate.",
    canonical: `${BASE_URL}/blog/why-https-matters-2026`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Why HTTPS Matters in 2026: Security, SEO, and Trust",
        description:
          "Discover why HTTPS is essential in 2026 for SEO rankings, browser trust, data protection, and modern web API access.",
        datePublished: "2026-03-15",
        dateModified: "2026-03-15",
        url: `${BASE_URL}/blog/why-https-matters-2026`,
        author: {
          "@type": "Organization",
          name: "freesslcert.net",
          url: BASE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "freesslcert.net",
          url: BASE_URL,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}/blog/why-https-matters-2026`,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${BASE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Why HTTPS Matters in 2026",
            item: `${BASE_URL}/blog/why-https-matters-2026`,
          },
        ],
      },
    ],
    bodyContent: `
      <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; Why HTTPS Matters in 2026</nav>

      <h1>Why HTTPS Matters in 2026: Security, SEO, and Trust</h1>
      <p>March 15, 2026 - 8 min read</p>

      <p>The internet has changed dramatically over the past decade, and HTTPS has gone from a nice-to-have feature to an absolute requirement. In 2026, running a website without an SSL certificate is not just a security risk; it actively harms your search rankings, drives away visitors, and prevents you from using modern web technologies.</p>

      <section>
        <h2>HTTPS Is a Google Ranking Signal</h2>
        <p>Google first announced HTTPS as a ranking signal in 2014, and its importance has only grown since. In 2026, Google's ranking algorithms give a measurable boost to websites that serve content over HTTPS. While HTTPS alone will not catapult you to the top of search results, it is a tiebreaker between otherwise equally relevant pages.</p>
        <p>Google's Core Web Vitals, which are now a confirmed ranking factor, also benefit from HTTPS. Modern performance optimizations like HTTP/2 and HTTP/3 require a secure connection.</p>
      </section>

      <section>
        <h2>Browser Warnings Scare Visitors Away</h2>
        <p>Every major browser now displays prominent warnings for websites that do not use HTTPS. Chrome marks all HTTP pages as "Not Secure" in the address bar. Firefox, Safari, and Edge display similar warnings.</p>
      </section>

      <section>
        <h2>Data Protection and Legal Compliance</h2>
        <p>HTTPS protects data in transit between your visitors' browsers and your server. Without encryption, anyone on the same network can intercept login credentials, personal information, and browsing activity.</p>
      </section>

      <section>
        <h2>Modern Web APIs Require HTTPS</h2>
        <p>Many modern browser APIs are restricted to secure contexts (HTTPS only). This includes Service Workers, Geolocation, Camera/Microphone access, Web Bluetooth, and more.</p>
      </section>

      <section>
        <h2>Get a Free SSL Certificate</h2>
        <p>There is no reason to run a website without HTTPS. <a href="/">freesslcert.net</a> provides free SSL certificates powered by Let's Encrypt in under 60 seconds, with no signup required.</p>
        <a href="/">Generate a Free SSL Certificate</a>
      </section>

      <section>
        <h2>Related Articles</h2>
        <ul>
          <li><a href="/blog/lets-encrypt-guide">Let's Encrypt Explained: How Free SSL Certificates Work</a></li>
          <li><a href="/blog/ssl-certificate-types-explained">SSL Certificate Types Explained: DV, OV, EV</a></li>
        </ul>
      </section>

      <a href="/blog">Back to Blog</a>
    `,
  },

  // --- /blog/lets-encrypt-guide ---
  {
    route: "/blog/lets-encrypt-guide",
    title: "Let's Encrypt Explained: How Free SSL Certificates Work | freesslcert.net",
    description:
      "Learn how Let's Encrypt provides free SSL certificates using the ACME protocol. Covers domain validation, 90-day lifetimes, rate limits, and alternatives to certbot.",
    canonical: `${BASE_URL}/blog/lets-encrypt-guide`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Let's Encrypt Explained: How Free SSL Certificates Work",
        description:
          "Learn how Let's Encrypt provides free SSL certificates using the ACME protocol.",
        datePublished: "2026-03-01",
        dateModified: "2026-03-01",
        url: `${BASE_URL}/blog/lets-encrypt-guide`,
        author: {
          "@type": "Organization",
          name: "freesslcert.net",
          url: BASE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "freesslcert.net",
          url: BASE_URL,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}/blog/lets-encrypt-guide`,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${BASE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Let's Encrypt Guide",
            item: `${BASE_URL}/blog/lets-encrypt-guide`,
          },
        ],
      },
    ],
    bodyContent: `
      <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; Let's Encrypt Guide</nav>

      <h1>Let's Encrypt Explained: How Free SSL Certificates Work</h1>
      <p>March 1, 2026 - 9 min read</p>

      <p>Let's Encrypt has fundamentally changed the SSL certificate landscape. Since its public launch in 2015, this free, automated, and open Certificate Authority has issued billions of certificates and helped push HTTPS adoption past the 95% mark.</p>

      <section>
        <h2>What Is Let's Encrypt?</h2>
        <p>Let's Encrypt is a free, automated, and open Certificate Authority (CA) operated by the Internet Security Research Group (ISRG), a California-based nonprofit organization. ISRG's mission is to reduce financial, technological, and educational barriers to secure communication on the internet.</p>
        <p>Let's Encrypt is sponsored by major technology companies including Mozilla, Google, Cisco, and the Electronic Frontier Foundation.</p>
      </section>

      <section>
        <h2>How the ACME Protocol Works</h2>
        <p>Let's Encrypt uses the ACME (Automatic Certificate Management Environment) protocol, standardized as RFC 8555. The ACME protocol automates three steps: account registration, domain validation, and certificate issuance.</p>
      </section>

      <section>
        <h2>Domain Validation Methods</h2>
        <p>Let's Encrypt supports HTTP-01 (place a file on your web server) and DNS-01 (add a TXT record to your DNS). DNS validation is required for wildcard certificates.</p>
      </section>

      <section>
        <h2>Certificate Lifetime and Renewal</h2>
        <p>Let's Encrypt certificates are valid for 90 days. This short lifetime is intentional - it encourages automation and limits the damage from key compromise.</p>
      </section>

      <section>
        <h2>Rate Limits</h2>
        <p>Let's Encrypt enforces rate limits to prevent abuse: 50 certificates per registered domain per week, 5 duplicate certificates per week, and other safeguards.</p>
      </section>

      <section>
        <h2>Get Started with Let's Encrypt</h2>
        <p><a href="/">freesslcert.net</a> provides a web-based interface for generating Let's Encrypt certificates without installing certbot or using the command line.</p>
        <a href="/">Generate a Free SSL Certificate</a>
      </section>

      <section>
        <h2>Related Articles</h2>
        <ul>
          <li><a href="/blog/why-https-matters-2026">Why HTTPS Matters in 2026</a></li>
          <li><a href="/blog/ssl-certificate-types-explained">SSL Certificate Types Explained</a></li>
        </ul>
      </section>

      <a href="/blog">Back to Blog</a>
    `,
  },

  // --- /blog/ssl-certificate-types-explained ---
  {
    route: "/blog/ssl-certificate-types-explained",
    title: "SSL Certificate Types Explained: DV, OV, EV - Which Do You Need? | freesslcert.net",
    description:
      "Compare SSL certificate types: Domain Validated (DV), Organization Validated (OV), and Extended Validation (EV). Includes wildcard and SAN certificates explained.",
    canonical: `${BASE_URL}/blog/ssl-certificate-types-explained`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "SSL Certificate Types Explained: DV, OV, EV - Which Do You Need?",
        description:
          "Compare SSL certificate types: Domain Validated (DV), Organization Validated (OV), and Extended Validation (EV).",
        datePublished: "2026-02-15",
        dateModified: "2026-02-15",
        url: `${BASE_URL}/blog/ssl-certificate-types-explained`,
        author: {
          "@type": "Organization",
          name: "freesslcert.net",
          url: BASE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "freesslcert.net",
          url: BASE_URL,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}/blog/ssl-certificate-types-explained`,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${BASE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "SSL Certificate Types",
            item: `${BASE_URL}/blog/ssl-certificate-types-explained`,
          },
        ],
      },
    ],
    bodyContent: `
      <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; SSL Certificate Types</nav>

      <h1>SSL Certificate Types Explained: DV, OV, EV - Which Do You Need?</h1>
      <p>February 15, 2026 - 10 min read</p>

      <p>When you start researching SSL certificates, you quickly discover that not all certificates are the same. There are different validation levels, different coverage scopes, and wildly different price points. This guide breaks down every major type of SSL certificate.</p>

      <section>
        <h2>Domain Validated (DV) Certificates</h2>
        <p>Domain Validated certificates are the most common type. The CA verifies only that you control the domain name. DV certificates are typically issued within minutes and cost nothing from providers like <a href="/blog/lets-encrypt-guide">Let's Encrypt</a>. The encryption strength is identical to more expensive certificate types.</p>
        <p>Best for: personal websites, blogs, small business sites, web applications, APIs, and the vast majority of websites.</p>
      </section>

      <section>
        <h2>Organization Validated (OV) Certificates</h2>
        <p>OV certificates require the CA to verify your organization's identity in addition to domain control. This includes checking business registration, address, and phone number. OV certificates cost $50 to $200 per year.</p>
        <p>Best for: medium to large businesses that want verified organizational identity in their certificate details.</p>
      </section>

      <section>
        <h2>Extended Validation (EV) Certificates</h2>
        <p>EV certificates require the most rigorous validation process. The CA verifies legal, physical, and operational existence of the organization. EV certificates cost $100 to $1,000+ per year.</p>
        <p>Best for: financial institutions, large e-commerce sites, and organizations that need the highest level of visible trust.</p>
      </section>

      <section>
        <h2>Wildcard Certificates</h2>
        <p>A wildcard certificate covers a domain and all its subdomains. For example, *.example.com covers blog.example.com, app.example.com, and any other subdomain. You can get free wildcard DV certificates from <a href="/">freesslcert.net</a>.</p>
      </section>

      <section>
        <h2>Multi-Domain (SAN) Certificates</h2>
        <p>SAN certificates cover multiple distinct domain names in a single certificate. For example, one certificate can cover example.com, example.org, and example.net.</p>
      </section>

      <section>
        <h2>Which Certificate Do You Need?</h2>
        <p>For the vast majority of websites, a free DV certificate from Let's Encrypt is the right choice. The encryption is identical across all certificate types. <a href="/">Generate your free SSL certificate now</a>.</p>
        <a href="/">Generate a Free SSL Certificate</a>
      </section>

      <section>
        <h2>Related Articles</h2>
        <ul>
          <li><a href="/blog/why-https-matters-2026">Why HTTPS Matters in 2026</a></li>
          <li><a href="/blog/lets-encrypt-guide">Let's Encrypt Explained</a></li>
        </ul>
      </section>

      <a href="/blog">Back to Blog</a>
    `,
  },

];

// ---------------------------------------------------------------------------
// HTML generation
// ---------------------------------------------------------------------------

/**
 * Build a complete HTML page for a given route by modifying the template
 * index.html: replace meta tags in <head> and static content in <body>.
 */
function buildPageHtml(template, route) {
  let html = template;

  // --- <title> ---
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(route.title)}</title>`
  );

  // --- <meta name="title"> ---
  html = html.replace(
    /<meta name="title" content="[^"]*"\s*\/?>/,
    `<meta name="title" content="${escapeAttr(route.title)}" />`
  );

  // --- <meta name="description"> ---
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeAttr(route.description)}" />`
  );

  // --- <link rel="canonical"> ---
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(route.canonical)}" />`
  );

  // --- Open Graph tags ---
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapeAttr(route.canonical)}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`
  );

  // --- Twitter tags ---
  html = html.replace(
    /<meta property="twitter:url" content="[^"]*"\s*\/?>/,
    `<meta property="twitter:url" content="${escapeAttr(route.canonical)}" />`
  );
  html = html.replace(
    /<meta property="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta property="twitter:title" content="${escapeAttr(route.title)}" />`
  );
  html = html.replace(
    /<meta property="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta property="twitter:description" content="${escapeAttr(route.description)}" />`
  );

  // --- Page-specific structured data ---
  // Insert route-specific JSON-LD right before </head>, in addition to the
  // global schemas that are already in index.html.
  if (route.structuredData && route.structuredData.length > 0) {
    const jsonLdTags = route.structuredData
      .map(
        (schema) =>
          `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>`
      )
      .join("\n    ");
    html = html.replace("</head>", `    ${jsonLdTags}\n  </head>`);
  }

  // --- Body content ---
  // Replace the static SEO content inside <div id="root">...</div> with
  // route-specific content. The existing template has a large block of static
  // HTML between <div id="root"> and its closing </div> (followed by
  // <noscript>). We replace that entire inner content.
  const rootOpenTag = '<div id="root">';
  const rootStartIdx = html.indexOf(rootOpenTag);
  if (rootStartIdx !== -1) {
    const contentStart = rootStartIdx + rootOpenTag.length;
    // Find the closing </div> that corresponds to id="root".
    // The template structure has the root div's content ending right before
    // <noscript>, so we look for </div> followed by whitespace and <noscript>.
    const noscriptIdx = html.indexOf("<noscript>", contentStart);
    if (noscriptIdx !== -1) {
      // Walk backwards from <noscript> to find the </div> that closes #root
      const closingDivPattern = "</div>";
      let searchFrom = noscriptIdx - 1;
      while (searchFrom > contentStart) {
        const candidate = html.lastIndexOf(closingDivPattern, searchFrom);
        if (candidate <= contentStart) break;
        // Check if this </div> is the one closing #root
        // by verifying there's only whitespace between it and <noscript>
        const between = html
          .substring(candidate + closingDivPattern.length, noscriptIdx)
          .trim();
        if (between === "") {
          // Found it - replace everything between <div id="root"> and this </div>
          const staticContent = buildStaticBody(route);
          html =
            html.substring(0, contentStart) +
            "\n" +
            staticContent +
            "\n    " +
            html.substring(candidate);
          break;
        }
        searchFrom = candidate - 1;
      }
    }
  }

  return html;
}

/**
 * Build the static body HTML for a route.
 * This produces semantic HTML that crawlers can index, with the same
 * structural elements (header, main, footer) as the React app.
 */
function buildStaticBody(route) {
  return `      <!-- Pre-rendered content for ${route.route} — React replaces this on mount -->
      <header style="padding:16px 24px;border-bottom:1px solid #e5e5e5">
        <a href="/" style="font-weight:600;font-size:15px;color:#171717;text-decoration:none">freesslcert.net</a>
      </header>
      <main style="max-width:768px;margin:0 auto;padding:80px 24px 64px">
${route.bodyContent}
      </main>
      <footer style="border-top:1px solid #e5e5e5;padding:24px;text-align:center;font-size:12px;color:#a3a3a3">
        <p>&copy; 2026 freesslcert.net &middot; Powered by <a href="https://letsencrypt.org" style="color:#a3a3a3">Let's Encrypt</a></p>
        <nav>
          <a href="/about" style="color:#a3a3a3;margin:0 8px">About</a>
          <a href="/faq" style="color:#a3a3a3;margin:0 8px">FAQ</a>
          <a href="/ssl-checker" style="color:#a3a3a3;margin:0 8px">SSL Checker</a>
          <a href="/guides/nginx-ssl" style="color:#a3a3a3;margin:0 8px">Nginx Guide</a>
          <a href="/guides/apache-ssl" style="color:#a3a3a3;margin:0 8px">Apache Guide</a>
          <a href="/privacy" style="color:#a3a3a3;margin:0 8px">Privacy</a>
          <a href="/terms" style="color:#a3a3a3;margin:0 8px">Terms</a>
        </nav>
      </footer>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const templatePath = join(DIST_DIR, "index.html");

  if (!existsSync(templatePath)) {
    console.error(
      "[prerender] dist/index.html not found. Run vite build first."
    );
    process.exit(1);
  }

  const template = readFileSync(templatePath, "utf-8");
  let successCount = 0;
  let errorCount = 0;

  for (const route of ROUTES) {
    try {
      const html = buildPageHtml(template, route);

      // Determine output path: /about -> dist/about/index.html
      const segments = route.route.replace(/^\//, "").split("/");
      const outDir = join(DIST_DIR, ...segments);
      const outFile = join(outDir, "index.html");

      mkdirSync(outDir, { recursive: true });
      writeFileSync(outFile, html, "utf-8");

      successCount++;
      console.log(`[prerender] ${route.route} -> ${outFile}`);
    } catch (err) {
      errorCount++;
      console.error(`[prerender] Failed to prerender ${route.route}:`, err);
      // Non-blocking: continue with remaining routes
    }
  }

  console.log(
    `[prerender] Done. ${successCount} pages rendered, ${errorCount} errors.`
  );

  // Don't exit with error code even if some pages failed - the main build
  // should not be blocked by prerender failures.
}

main();
