import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StructuredData } from "@/components/seo/StructuredData";
import type { JsonLdSchema } from "@/components/seo/StructuredData";

const howToSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Install a Free SSL Certificate on WordPress",
  description:
    "Step-by-step guide to installing a free Let's Encrypt SSL/TLS certificate on a WordPress website, including cPanel installation, URL updates, mixed content fixes, and HTTPS redirects.",
  totalTime: "PT20M",
  supply: [
    {
      "@type": "HowToSupply",
      name: "SSL certificate files from freesslcert.net (certificate.crt, private.key, ca_bundle.crt)",
    },
  ],
  tool: [
    { "@type": "HowToTool", name: "WordPress admin access" },
    {
      "@type": "HowToTool",
      name: "Hosting control panel (cPanel, Plesk, or similar)",
    },
    {
      "@type": "HowToTool",
      name: "FTP/SFTP client or file manager (optional)",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Generate your SSL certificate",
      text: "Visit freesslcert.net and generate a free SSL certificate for your WordPress domain using Let's Encrypt.",
      url: "https://freesslcert.net",
    },
    {
      "@type": "HowToStep",
      name: "Install SSL via your hosting control panel",
      text: "Log in to cPanel or your hosting control panel, navigate to the SSL/TLS section, and paste your certificate, private key, and CA bundle.",
    },
    {
      "@type": "HowToStep",
      name: "Update WordPress URL settings",
      text: "In the WordPress admin dashboard, go to Settings > General and change both the WordPress Address and Site Address from http:// to https://.",
    },
    {
      "@type": "HowToStep",
      name: "Update internal links and fix mixed content",
      text: "Use a search-and-replace plugin like Better Search Replace to update all internal URLs from http:// to https:// in your database.",
    },
    {
      "@type": "HowToStep",
      name: "Force HTTPS via .htaccess",
      text: "Add redirect rules to your .htaccess file to automatically redirect all HTTP traffic to HTTPS.",
    },
    {
      "@type": "HowToStep",
      name: "Verify SSL and fix remaining mixed content",
      text: "Test your site in a browser, check for the padlock icon, and use developer tools to identify and fix any remaining mixed content warnings.",
    },
  ],
};

const breadcrumbSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://freesslcert.net",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Guides",
      item: "https://freesslcert.net/guides/wordpress-ssl",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "WordPress SSL Installation",
      item: "https://freesslcert.net/guides/wordpress-ssl",
    },
  ],
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-sm leading-relaxed">
      <code className="text-neutral-100 font-mono text-xs">{children}</code>
    </pre>
  );
}

export function WordPressSSLGuidePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>
          How to Install a Free SSL Certificate on WordPress - Step-by-Step
          Guide
        </title>
        <meta
          name="description"
          content="Complete guide to installing a free SSL certificate on WordPress. Covers cPanel installation, updating WordPress URLs, fixing mixed content, and forcing HTTPS redirects."
        />
        <link
          rel="canonical"
          href="https://freesslcert.net/guides/wordpress-ssl"
        />
      </Helmet>
      <StructuredData data={[howToSchema, breadcrumbSchema]} />

      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-150 mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
        How to Install a Free SSL Certificate on WordPress
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        A complete step-by-step guide to securing your WordPress site with HTTPS
      </p>

      <div className="space-y-8 text-sm text-neutral-600 leading-relaxed">
        {/* Introduction */}
        <p>
          WordPress powers over 40% of all websites on the internet, making it
          the most popular content management system in the world. Securing your
          WordPress site with an SSL certificate is essential for protecting
          visitor data, improving search engine rankings, and building trust with
          your audience. This guide walks you through installing a free SSL/TLS
          certificate from{" "}
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            freesslcert.net
          </Link>{" "}
          on your WordPress website. The entire process typically takes about 20
          minutes, regardless of your hosting provider.
        </p>

        {/* Prerequisites */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Prerequisites
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              A WordPress website hosted on a web hosting provider (shared
              hosting, VPS, or dedicated server)
            </li>
            <li>
              Access to your hosting control panel (cPanel, Plesk, DirectAdmin,
              or similar)
            </li>
            <li>
              WordPress admin dashboard access (you will need to update site
              settings)
            </li>
            <li>
              A domain name pointing to your hosting server (A record configured
              in DNS)
            </li>
            <li>
              Your SSL certificate files from{" "}
              <Link
                to="/"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                freesslcert.net
              </Link>
              : the certificate file (
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                certificate.crt
              </code>
              ), private key (
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                private.key
              </code>
              ), and CA bundle (
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                ca_bundle.crt
              </code>
              )
            </li>
          </ul>
        </section>

        {/* Step 1 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 1: Generate Your SSL Certificate
          </h2>
          <p className="mb-3">
            If you have not already obtained your certificate, visit{" "}
            <Link
              to="/"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              freesslcert.net
            </Link>{" "}
            and follow the guided process:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 mb-3">
            <li>
              Enter your domain name (e.g., yourblog.com or
              www.yourblog.com)
            </li>
            <li>
              Choose your certificate type (single domain is most common for
              WordPress sites; choose wildcard if you use subdomains)
            </li>
            <li>
              Complete domain validation via HTTP file upload or DNS TXT record
            </li>
            <li>Download all three certificate files</li>
          </ol>
          <p>
            You will receive three files:{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              certificate.crt
            </code>{" "}
            (your SSL certificate),{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              private.key
            </code>{" "}
            (your private key), and{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              ca_bundle.crt
            </code>{" "}
            (the intermediate certificate chain). Keep these files safe. For
            more details on what these files are, see our{" "}
            <Link
              to="/faq"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              FAQ on certificate chains
            </Link>
            .
          </p>
        </section>

        {/* Step 2 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 2: Install SSL via Your Hosting Control Panel
          </h2>
          <p className="mb-3">
            Most WordPress sites run on shared hosting with cPanel. Here is how
            to install your certificate through cPanel. If your host uses a
            different control panel, the steps are similar; look for an
            &ldquo;SSL/TLS&rdquo; or &ldquo;Security&rdquo; section.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            cPanel Installation
          </h3>
          <ol className="list-decimal pl-5 space-y-1.5 mb-3">
            <li>
              Log in to your cPanel account (usually at{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                yourdomain.com/cpanel
              </code>{" "}
              or{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                yourdomain.com:2083
              </code>
              )
            </li>
            <li>
              Navigate to <strong className="text-neutral-900">Security</strong>{" "}
              &rarr;{" "}
              <strong className="text-neutral-900">SSL/TLS</strong>
            </li>
            <li>
              Click{" "}
              <strong className="text-neutral-900">
                Manage SSL sites
              </strong>{" "}
              (or &ldquo;Install and Manage SSL for your site&rdquo;)
            </li>
            <li>
              Select your domain from the dropdown menu
            </li>
            <li>
              Open{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                certificate.crt
              </code>{" "}
              in a text editor, copy the entire contents (including the{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                -----BEGIN CERTIFICATE-----
              </code>{" "}
              and{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                -----END CERTIFICATE-----
              </code>{" "}
              lines), and paste into the{" "}
              <strong className="text-neutral-900">Certificate (CRT)</strong>{" "}
              field
            </li>
            <li>
              Open{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                private.key
              </code>{" "}
              and paste the contents into the{" "}
              <strong className="text-neutral-900">Private Key (KEY)</strong>{" "}
              field
            </li>
            <li>
              Open{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                ca_bundle.crt
              </code>{" "}
              and paste the contents into the{" "}
              <strong className="text-neutral-900">
                Certificate Authority Bundle (CABUNDLE)
              </strong>{" "}
              field
            </li>
            <li>
              Click{" "}
              <strong className="text-neutral-900">Install Certificate</strong>
            </li>
          </ol>
          <p>
            You should see a success message confirming that the SSL certificate
            has been installed for your domain. If your host uses Plesk,
            DirectAdmin, or another panel, look for a similar SSL/TLS section
            where you can paste in the certificate, key, and CA bundle.
          </p>
        </section>

        {/* Step 3 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 3: Update WordPress URL Settings
          </h2>
          <p className="mb-3">
            After installing the certificate on your server, you need to tell
            WordPress to use HTTPS. Log in to your WordPress admin dashboard and
            update the site URLs:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 mb-3">
            <li>
              Go to{" "}
              <strong className="text-neutral-900">Settings</strong> &rarr;{" "}
              <strong className="text-neutral-900">General</strong>
            </li>
            <li>
              Change{" "}
              <strong className="text-neutral-900">WordPress Address (URL)</strong>{" "}
              from{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                http://yourdomain.com
              </code>{" "}
              to{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                https://yourdomain.com
              </code>
            </li>
            <li>
              Change{" "}
              <strong className="text-neutral-900">Site Address (URL)</strong>{" "}
              from{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                http://yourdomain.com
              </code>{" "}
              to{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                https://yourdomain.com
              </code>
            </li>
            <li>
              Click{" "}
              <strong className="text-neutral-900">Save Changes</strong>
            </li>
          </ol>
          <p className="mb-3">
            You will be logged out and redirected to the HTTPS version of the
            login page. Log back in to continue.
          </p>
          <p>
            Alternatively, if you cannot access the WordPress admin, you can
            force HTTPS by adding these lines to your{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              wp-config.php
            </code>{" "}
            file (above the line that says &ldquo;That&#39;s all, stop
            editing!&rdquo;):
          </p>
          <CodeBlock>
            {`define('WP_HOME', 'https://yourdomain.com');
define('WP_SITEURL', 'https://yourdomain.com');
define('FORCE_SSL_ADMIN', true);`}
          </CodeBlock>
        </section>

        {/* Step 4 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 4: Update Internal Links and Fix Mixed Content
          </h2>
          <p className="mb-3">
            After switching WordPress to HTTPS, your database still contains
            references to{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              http://
            </code>{" "}
            URLs in your posts, pages, menus, and widget content. These cause
            mixed content warnings where the browser loads some resources over
            insecure HTTP. You need to do a search-and-replace across your
            database.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Using Better Search Replace (Recommended)
          </h3>
          <ol className="list-decimal pl-5 space-y-1.5 mb-3">
            <li>
              Install and activate the{" "}
              <strong className="text-neutral-900">Better Search Replace</strong>{" "}
              plugin from the WordPress plugin directory
            </li>
            <li>
              Go to{" "}
              <strong className="text-neutral-900">Tools</strong> &rarr;{" "}
              <strong className="text-neutral-900">Better Search Replace</strong>
            </li>
            <li>
              In the &ldquo;Search for&rdquo; field, enter:{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                http://yourdomain.com
              </code>
            </li>
            <li>
              In the &ldquo;Replace with&rdquo; field, enter:{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                https://yourdomain.com
              </code>
            </li>
            <li>Select all database tables</li>
            <li>
              Run a dry run first to preview changes, then uncheck &ldquo;Run
              as dry run&rdquo; and run the replacement
            </li>
          </ol>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Using WP-CLI (For Advanced Users)
          </h3>
          <p className="mb-3">
            If you have SSH access and WP-CLI installed, you can run the
            replacement from the command line:
          </p>
          <CodeBlock>
            {`# Run a dry-run first to see what will change
wp search-replace 'http://yourdomain.com' 'https://yourdomain.com' --dry-run

# Perform the actual replacement
wp search-replace 'http://yourdomain.com' 'https://yourdomain.com'

# Clear the WordPress cache
wp cache flush`}
          </CodeBlock>
        </section>

        {/* Step 5 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 5: Force HTTPS via .htaccess
          </h2>
          <p className="mb-3">
            To ensure all visitors are redirected to the secure version of your
            site, add the following rules to your{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              .htaccess
            </code>{" "}
            file in your WordPress root directory. Place these rules{" "}
            <strong className="text-neutral-900">
              before
            </strong>{" "}
            the existing WordPress rewrite rules (before the line{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              # BEGIN WordPress
            </code>
            ):
          </p>
          <CodeBlock>
            {`# Force HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# BEGIN WordPress
# The directives between "BEGIN WordPress" and "END WordPress" are
# dynamically generated, and should only be modified via WordPress filters.
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress`}
          </CodeBlock>
          <p className="mt-3">
            If your WordPress site runs behind a load balancer or CDN like
            Cloudflare, you may need to use a different redirect approach to
            avoid redirect loops. In that case, use this alternative:
          </p>
          <CodeBlock>
            {`# Force HTTPS behind a load balancer or reverse proxy
RewriteEngine On
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`}
          </CodeBlock>
        </section>

        {/* Step 6 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 6: Verify SSL and Fix Mixed Content Warnings
          </h2>
          <p className="mb-3">
            After completing all the steps above, verify that everything is
            working correctly:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mb-3">
            <li>
              Visit{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                https://yourdomain.com
              </code>{" "}
              and confirm the padlock icon appears in the address bar
            </li>
            <li>
              Visit{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                http://yourdomain.com
              </code>{" "}
              and confirm it redirects to HTTPS
            </li>
            <li>
              Open your browser&#39;s developer tools (F12) and check the
              Console tab for mixed content warnings
            </li>
            <li>
              Browse several pages including posts, pages, and any custom post
              types to check for warnings
            </li>
            <li>
              Use an online SSL testing tool like{" "}
              <a
                href="https://www.ssllabs.com/ssltest/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150 inline-flex items-center gap-1"
              >
                SSL Labs
                <ExternalLink className="size-3" aria-hidden="true" />
              </a>{" "}
              to verify the full certificate chain
            </li>
          </ul>
          <p>
            If you find remaining mixed content warnings, they are usually
            caused by hardcoded HTTP URLs in your theme, plugins, or custom
            code. Check your theme&#39;s header and footer templates, any custom
            CSS, and third-party plugin settings for HTTP references.
          </p>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Troubleshooting
          </h2>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Mixed Content Warnings
          </h3>
          <p className="mb-3">
            Mixed content occurs when your HTTPS page loads resources (images,
            scripts, stylesheets) over HTTP. The browser&#39;s developer console
            will show messages like &ldquo;Mixed Content: The page at
            &#39;https://...&#39; was loaded over HTTPS, but requested an
            insecure resource.&rdquo; Common causes include:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mb-3">
            <li>
              Hardcoded HTTP URLs in theme template files
            </li>
            <li>
              Plugin settings that store absolute URLs with HTTP
            </li>
            <li>
              External resources (fonts, scripts, embeds) loaded over HTTP
            </li>
            <li>
              Images in posts and pages that were not caught by
              search-and-replace
            </li>
          </ul>
          <p>
            Fix theme references by editing the template files directly. For
            plugin URLs, check each plugin&#39;s settings page. For external
            resources, update them to use HTTPS or protocol-relative URLs. See
            our{" "}
            <Link
              to="/faq"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              FAQ on mixed content
            </Link>{" "}
            for more detailed solutions.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Redirect Loop (ERR_TOO_MANY_REDIRECTS)
          </h3>
          <p className="mb-3">
            A redirect loop occurs when your server keeps redirecting between
            HTTP and HTTPS endlessly. This is common with WordPress sites behind
            Cloudflare, a load balancer, or a reverse proxy. To fix this:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 mb-3">
            <li>
              Clear your browser cookies for the domain
            </li>
            <li>
              If using Cloudflare, set the SSL mode to &ldquo;Full&rdquo; or
              &ldquo;Full (Strict)&rdquo; instead of &ldquo;Flexible&rdquo;
            </li>
            <li>
              Add this line to your{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                wp-config.php
              </code>{" "}
              file:
            </li>
          </ol>
          <CodeBlock>
            {`// Fix redirect loop behind reverse proxy / load balancer
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}`}
          </CodeBlock>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            White Screen of Death After URL Change
          </h3>
          <p className="mb-3">
            If you see a blank white screen after changing the WordPress URL
            settings, it usually means the SSL certificate is not properly
            installed or the URLs were changed before the certificate was
            active. To recover:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>
              Access your site via FTP or your hosting file manager
            </li>
            <li>
              Open{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                wp-config.php
              </code>
            </li>
            <li>
              Add these lines to temporarily revert the URLs:
            </li>
          </ol>
          <CodeBlock>
            {`define('WP_HOME', 'http://yourdomain.com');
define('WP_SITEURL', 'http://yourdomain.com');`}
          </CodeBlock>
          <p className="mt-3">
            This overrides the database settings and allows you to log in again.
            Once you have confirmed the SSL certificate is properly installed,
            change these back to{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              https://
            </code>{" "}
            and remove the lines or update them.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Certificate Not Trusted Warning
          </h3>
          <p>
            If browsers show a &ldquo;Your connection is not private&rdquo; or
            &ldquo;Certificate not trusted&rdquo; warning, the most common cause
            is a missing CA bundle. Make sure you pasted the contents of{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              ca_bundle.crt
            </code>{" "}
            into the CABUNDLE field in cPanel. Without the intermediate
            certificate chain, browsers cannot verify the trust path to the
            Let&#39;s Encrypt root CA. If the issue persists, you may need to{" "}
            <Link
              to="/"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              generate a new certificate
            </Link>
            .
          </p>
        </section>

        {/* Related resources */}
        <section className="rounded-lg border border-neutral-200/60 bg-neutral-50/50 p-5">
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Related Resources
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/guides/nginx-ssl"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                How to Install SSL on Nginx
              </Link>{" "}
              &mdash; Guide for Nginx servers
            </li>
            <li>
              <Link
                to="/guides/apache-ssl"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                How to Install SSL on Apache
              </Link>{" "}
              &mdash; Guide for Apache/httpd servers
            </li>
            <li>
              <Link
                to="/guides/nodejs-ssl"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                How to Set Up SSL with Node.js
              </Link>{" "}
              &mdash; Guide for Node.js applications
            </li>
            <li>
              <Link
                to="/ssl-vs-tls"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                SSL vs TLS: What&#39;s the Difference?
              </Link>{" "}
              &mdash; Understanding SSL and TLS protocols
            </li>
            <li>
              <Link
                to="/faq"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                SSL Certificate FAQ
              </Link>{" "}
              &mdash; Common questions about SSL/TLS
            </li>
            <li>
              <Link
                to="/"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                Generate a Free SSL Certificate
              </Link>{" "}
              &mdash; Get started now
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
