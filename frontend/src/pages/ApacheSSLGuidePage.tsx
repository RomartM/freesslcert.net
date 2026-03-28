import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StructuredData } from "@/components/seo/StructuredData";
import type { JsonLdSchema } from "@/components/seo/StructuredData";

const howToSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Install a Free SSL Certificate on Apache",
  description:
    "Step-by-step guide to installing a free Let's Encrypt SSL/TLS certificate on an Apache web server, including VirtualHost configuration, testing, and renewal.",
  totalTime: "PT15M",
  supply: [
    {
      "@type": "HowToSupply",
      name: "SSL certificate files from freesslcert.net (certificate.crt, private.key, ca_bundle.crt)",
    },
  ],
  tool: [
    { "@type": "HowToTool", name: "Apache web server (httpd)" },
    { "@type": "HowToTool", name: "SSH access to your server" },
    { "@type": "HowToTool", name: "Text editor (nano, vim, etc.)" },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Generate your SSL certificate",
      text: "Visit freesslcert.net and generate a free SSL certificate for your domain using Let's Encrypt.",
      url: "https://freesslcert.net",
    },
    {
      "@type": "HowToStep",
      name: "Upload certificate files to your server",
      text: "Transfer the certificate.crt, private.key, and ca_bundle.crt files to your server's /etc/ssl/ directory using SCP or SFTP.",
    },
    {
      "@type": "HowToStep",
      name: "Enable Apache SSL module",
      text: "Enable the mod_ssl module and the default SSL site configuration on Apache.",
    },
    {
      "@type": "HowToStep",
      name: "Configure Apache VirtualHost for SSL",
      text: "Edit your Apache VirtualHost configuration to add SSL directives including SSLCertificateFile, SSLCertificateKeyFile, and SSLCertificateChainFile.",
    },
    {
      "@type": "HowToStep",
      name: "Test and restart Apache",
      text: "Test the Apache configuration for syntax errors and restart the service to apply changes.",
    },
    {
      "@type": "HowToStep",
      name: "Set up a renewal reminder",
      text: "Set a reminder to renew your certificate before it expires in 90 days.",
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
      item: "https://freesslcert.net/guides/apache-ssl",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Apache SSL Installation",
      item: "https://freesslcert.net/guides/apache-ssl",
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

export function ApacheSSLGuidePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>
          How to Install a Free SSL Certificate on Apache - Step-by-Step Guide
        </title>
        <meta
          name="description"
          content="Complete guide to installing a free Let's Encrypt SSL certificate on Apache (httpd). Includes VirtualHost configuration, HTTPS redirect, security headers, and testing."
        />
        <link
          rel="canonical"
          href="https://freesslcert.net/guides/apache-ssl"
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
        How to Install a Free SSL Certificate on Apache
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        A complete step-by-step guide to configuring HTTPS on your Apache web
        server
      </p>

      <div className="space-y-8 text-sm text-neutral-600 leading-relaxed">
        {/* Introduction */}
        <p>
          This guide walks you through installing a free SSL/TLS certificate
          from{" "}
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            freesslcert.net
          </Link>{" "}
          on an Apache web server (also known as httpd). Apache is one of the
          most widely used web servers in the world, and adding HTTPS support is
          straightforward once you have your certificate files. The entire
          process typically takes about 15 minutes.
        </p>

        {/* Prerequisites */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Prerequisites
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              A server running Apache 2.4+ (this guide covers Ubuntu/Debian and
              CentOS/RHEL configurations)
            </li>
            <li>
              SSH (root or sudo) access to your server
            </li>
            <li>
              A domain name pointing to your server&#39;s IP address (A record
              or AAAA record configured in DNS)
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
            <li>Enter your domain name (e.g., example.com)</li>
            <li>
              Choose your certificate type (single domain, wildcard, or
              multi-domain)
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
            (the intermediate certificate chain). To understand what these files
            are and why each matters, check our{" "}
            <Link
              to="/faq"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              FAQ on certificate chains and formats
            </Link>
            .
          </p>
        </section>

        {/* Step 2 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 2: Upload Certificate Files to Your Server
          </h2>
          <p className="mb-3">
            Transfer the certificate files to your server using SCP, SFTP, or
            your preferred file transfer method. The standard location for SSL
            files on Apache depends on your distribution:
          </p>
          <CodeBlock>
            {`# Create a directory for your SSL files
sudo mkdir -p /etc/ssl/example.com

# Upload files using SCP (run from your local machine)
scp certificate.crt user@your-server:/etc/ssl/example.com/
scp private.key user@your-server:/etc/ssl/example.com/
scp ca_bundle.crt user@your-server:/etc/ssl/example.com/`}
          </CodeBlock>
          <p className="mt-3 mb-3">
            Set proper file permissions to protect your private key:
          </p>
          <CodeBlock>
            {`# Restrict private key permissions (owner read-only)
sudo chmod 600 /etc/ssl/example.com/private.key
sudo chmod 644 /etc/ssl/example.com/certificate.crt
sudo chmod 644 /etc/ssl/example.com/ca_bundle.crt

# Ensure root owns the files
sudo chown root:root /etc/ssl/example.com/*`}
          </CodeBlock>
        </section>

        {/* Step 3 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 3: Enable Apache SSL Module
          </h2>
          <p className="mb-3">
            Apache requires the{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              mod_ssl
            </code>{" "}
            module to handle HTTPS connections. Enable it along with the{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              mod_headers
            </code>{" "}
            module (for security headers) and{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              mod_rewrite
            </code>{" "}
            (for HTTP-to-HTTPS redirects):
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Ubuntu / Debian
          </h3>
          <CodeBlock>
            {`# Enable required modules
sudo a2enmod ssl
sudo a2enmod headers
sudo a2enmod rewrite

# Enable the default SSL site (optional)
sudo a2ensite default-ssl`}
          </CodeBlock>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            CentOS / RHEL / Amazon Linux
          </h3>
          <CodeBlock>
            {`# Install mod_ssl if not already installed
sudo yum install mod_ssl

# Or on newer systems with dnf
sudo dnf install mod_ssl`}
          </CodeBlock>
          <p className="mt-3">
            On CentOS/RHEL, mod_ssl is usually enabled automatically upon
            installation. You can verify it is loaded by checking for the SSL
            configuration file:
          </p>
          <CodeBlock>
            {`ls /etc/httpd/conf.d/ssl.conf`}
          </CodeBlock>
        </section>

        {/* Step 4 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 4: Configure Apache VirtualHost for SSL
          </h2>
          <p className="mb-3">
            Edit your Apache VirtualHost configuration to add SSL support. On
            Ubuntu/Debian, configuration files are typically in{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              /etc/apache2/sites-available/
            </code>
            . On CentOS/RHEL, they are in{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              /etc/httpd/conf.d/
            </code>
            .
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            HTTPS VirtualHost Configuration
          </h3>
          <p className="mb-3">
            Create or update your SSL VirtualHost to listen on port 443:
          </p>
          <CodeBlock>
            {`<VirtualHost *:443>
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/example.com/html

    # Enable SSL
    SSLEngine on

    # Certificate files
    SSLCertificateFile      /etc/ssl/example.com/certificate.crt
    SSLCertificateKeyFile   /etc/ssl/example.com/private.key
    SSLCertificateChainFile /etc/ssl/example.com/ca_bundle.crt

    # SSL protocol configuration (modern settings)
    SSLProtocol             all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite          ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder     off

    # OCSP stapling (improves SSL handshake speed)
    SSLUseStapling on
    SSLStaplingResponderTimeout 5
    SSLStaplingReturnResponderErrors off

    # Security headers
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    # Logging
    ErrorLog \${APACHE_LOG_DIR}/example.com-ssl-error.log
    CustomLog \${APACHE_LOG_DIR}/example.com-ssl-access.log combined
</VirtualHost>

# OCSP stapling cache (place outside VirtualHost block)
SSLStaplingCache shmcb:/var/run/ocsp(128000)`}
          </CodeBlock>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            HTTP to HTTPS Redirect
          </h3>
          <p className="mb-3">
            Add a VirtualHost for port 80 that redirects all HTTP traffic to
            HTTPS:
          </p>
          <CodeBlock>
            {`<VirtualHost *:80>
    ServerName example.com
    ServerAlias www.example.com

    # Redirect all HTTP requests to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>`}
          </CodeBlock>
          <p className="mt-3">
            Replace{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              example.com
            </code>{" "}
            with your actual domain name throughout the configuration. Note that
            unlike{" "}
            <Link
              to="/guides/nginx-ssl"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              Nginx
            </Link>
            , Apache uses three separate directives for certificate, key, and
            chain file rather than a single combined fullchain file.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            CentOS/RHEL Log Path Note
          </h3>
          <p>
            On CentOS/RHEL systems, the log variable is different. Replace{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              {"${APACHE_LOG_DIR}"}
            </code>{" "}
            with{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              /var/log/httpd
            </code>{" "}
            in the logging directives, or use the{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              logs/
            </code>{" "}
            relative path.
          </p>
        </section>

        {/* Step 5 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 5: Test and Restart Apache
          </h2>
          <p className="mb-3">
            Before restarting Apache, test the configuration for syntax errors:
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Ubuntu / Debian
          </h3>
          <CodeBlock>
            {`# Test Apache configuration
sudo apachectl configtest`}
          </CodeBlock>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            CentOS / RHEL
          </h3>
          <CodeBlock>
            {`# Test Apache configuration
sudo httpd -t`}
          </CodeBlock>

          <p className="mt-3 mb-3">
            You should see:
          </p>
          <CodeBlock>{`Syntax OK`}</CodeBlock>
          <p className="mt-3 mb-3">
            If the test passes, restart Apache to apply the changes. Note that
            unlike Nginx, Apache requires a full restart (not just a reload) to
            pick up new SSL certificates:
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Ubuntu / Debian
          </h3>
          <CodeBlock>
            {`# Restart Apache
sudo systemctl restart apache2`}
          </CodeBlock>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            CentOS / RHEL
          </h3>
          <CodeBlock>
            {`# Restart Apache
sudo systemctl restart httpd`}
          </CodeBlock>

          <p className="mt-3 mb-3">
            Now verify your SSL installation:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Visit{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                https://example.com
              </code>{" "}
              and confirm the padlock icon appears
            </li>
            <li>
              Visit{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                http://example.com
              </code>{" "}
              and confirm it redirects to HTTPS
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
              to verify the full certificate chain and grade your configuration
            </li>
          </ul>
        </section>

        {/* Step 6 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 6: Set Up Auto-Renewal Reminder
          </h2>
          <p className="mb-3">
            Let&#39;s Encrypt certificates expire after 90 days. To avoid
            downtime, plan your renewal well in advance:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mb-3">
            <li>
              <strong className="text-neutral-900">Email reminder</strong> -
              freesslcert.net offers optional expiration email reminders when you
              generate your certificate
            </li>
            <li>
              <strong className="text-neutral-900">Calendar reminder</strong> -
              Set a recurring calendar event for 60 days after certificate
              generation
            </li>
            <li>
              <strong className="text-neutral-900">Monitoring service</strong> -
              Use an SSL monitoring tool to alert you when your certificate is
              nearing expiration
            </li>
          </ul>
          <p>
            When it is time to renew, simply{" "}
            <Link
              to="/"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              visit freesslcert.net
            </Link>
            , generate a new certificate for the same domain, upload the new
            files to your server (replacing the old ones), and restart Apache.
          </p>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Troubleshooting
          </h2>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            &ldquo;AH02572: Failed to configure at least one certificate and
            key&rdquo;
          </h3>
          <p className="mb-3">
            This error means Apache cannot find or read your certificate files.
            Verify the file paths in your VirtualHost configuration match the
            actual file locations, and check that the files are readable by the
            Apache process:
          </p>
          <CodeBlock>
            {`# Check that certificate files exist and are not empty
sudo ls -la /etc/ssl/example.com/
sudo head -1 /etc/ssl/example.com/certificate.crt
# Should output: -----BEGIN CERTIFICATE-----`}
          </CodeBlock>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            &ldquo;AH02565: Certificate and private key do not match&rdquo;
          </h3>
          <p>
            This indicates the certificate and private key were not generated
            together. Both files must come from the same certificate request. If
            they do not match, you will need to{" "}
            <Link
              to="/"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              generate a new certificate
            </Link>{" "}
            and download fresh copies of all files.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Port 443 already in use
          </h3>
          <p className="mb-3">
            If another process is already listening on port 443, Apache cannot
            start with SSL. Check what is using the port:
          </p>
          <CodeBlock>
            {`# Find what process is using port 443
sudo lsof -i :443
# or
sudo ss -tlnp | grep 443`}
          </CodeBlock>
          <p className="mt-3">
            Common culprits include another Apache instance, Nginx, or a
            firewall/proxy. Stop the conflicting service before starting Apache
            with SSL.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Browser shows incomplete certificate chain
          </h3>
          <p>
            If SSL testing tools report a missing intermediate certificate,
            verify that your{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              SSLCertificateChainFile
            </code>{" "}
            directive points to the correct CA bundle file and that the file is
            not empty. See our{" "}
            <Link
              to="/faq"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              FAQ on certificate chains
            </Link>{" "}
            for more details.
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
                to="/guides/wordpress-ssl"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                How to Install SSL on WordPress
              </Link>{" "}
              &mdash; Guide for WordPress websites
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
