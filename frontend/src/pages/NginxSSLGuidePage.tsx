import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StructuredData } from "@/components/seo/StructuredData";
import type { JsonLdSchema } from "@/components/seo/StructuredData";

const howToSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Install a Free SSL Certificate on Nginx",
  description:
    "Step-by-step guide to installing a free Let's Encrypt SSL/TLS certificate on an Nginx web server, including configuration, testing, and renewal.",
  totalTime: "PT15M",
  supply: [
    {
      "@type": "HowToSupply",
      name: "SSL certificate files from freesslcert.net (certificate.crt, private.key, ca_bundle.crt)",
    },
  ],
  tool: [
    { "@type": "HowToTool", name: "Nginx web server" },
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
      name: "Create the full chain certificate file",
      text: "Concatenate your certificate and the CA bundle into a single fullchain.pem file for Nginx.",
    },
    {
      "@type": "HowToStep",
      name: "Configure Nginx server block for SSL",
      text: "Edit your Nginx server block configuration to add SSL directives including ssl_certificate, ssl_certificate_key, and security headers.",
    },
    {
      "@type": "HowToStep",
      name: "Test and reload Nginx",
      text: "Test the Nginx configuration for syntax errors and reload the service to apply changes.",
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
      item: "https://freesslcert.net/guides/nginx-ssl",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Nginx SSL Installation",
      item: "https://freesslcert.net/guides/nginx-ssl",
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

export function NginxSSLGuidePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>
          How to Install a Free SSL Certificate on Nginx - Step-by-Step Guide
        </title>
        <meta
          name="description"
          content="Complete guide to installing a free Let's Encrypt SSL certificate on Nginx. Includes server block configuration, HTTPS redirect, security headers, and testing."
        />
        <link
          rel="canonical"
          href="https://freesslcert.net/guides/nginx-ssl"
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
        How to Install a Free SSL Certificate on Nginx
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        A complete step-by-step guide to configuring HTTPS on your Nginx web
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
          on an Nginx web server. By the end, your website will serve traffic
          over HTTPS with a valid, browser-trusted certificate from Let&#39;s
          Encrypt. The entire process typically takes about 15 minutes.
        </p>

        {/* Prerequisites */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Prerequisites
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              A server running Nginx (this guide covers Nginx 1.18+ on
              Ubuntu/Debian, but the configuration applies to all Linux
              distributions)
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
            (the intermediate certificate chain). For more details on what these
            files are, see our{" "}
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
            Step 2: Upload Certificate Files to Your Server
          </h2>
          <p className="mb-3">
            Transfer the certificate files to your server using SCP, SFTP, or
            your preferred file transfer method. We recommend storing SSL files
            in{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              /etc/ssl/
            </code>{" "}
            or a dedicated directory:
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
            Step 3: Create the Full Chain Certificate
          </h2>
          <p className="mb-3">
            Nginx requires a single file containing both your certificate and
            the intermediate CA certificate (the certificate chain). Concatenate
            them into a &ldquo;fullchain&rdquo; file:
          </p>
          <CodeBlock>
            {`# Combine certificate and CA bundle into a full chain file
sudo cat /etc/ssl/example.com/certificate.crt \\
         /etc/ssl/example.com/ca_bundle.crt \\
         > /etc/ssl/example.com/fullchain.pem`}
          </CodeBlock>
          <p className="mt-3">
            This ensures browsers can verify the complete chain of trust from
            your certificate up to the Let&#39;s Encrypt root CA. Without the
            intermediate certificate, some browsers and devices may show security
            warnings. Learn more about this in our{" "}
            <Link
              to="/faq"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              FAQ on certificate chains
            </Link>
            .
          </p>
        </section>

        {/* Step 4 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 4: Configure Nginx Server Block
          </h2>
          <p className="mb-3">
            Edit your Nginx server block configuration. On Ubuntu/Debian, this
            is typically located in{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              /etc/nginx/sites-available/
            </code>
            . On CentOS/RHEL, check{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              /etc/nginx/conf.d/
            </code>
            .
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            HTTPS Server Block
          </h3>
          <p className="mb-3">
            Create or update your server block to listen on port 443 with SSL:
          </p>
          <CodeBlock>
            {`server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;

    # SSL certificate files
    ssl_certificate     /etc/ssl/example.com/fullchain.pem;
    ssl_certificate_key /etc/ssl/example.com/private.key;

    # SSL configuration (modern settings)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # SSL session caching for performance
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;

    # OCSP stapling (improves SSL handshake speed)
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Your website root and configuration
    root /var/www/example.com/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}`}
          </CodeBlock>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            HTTP to HTTPS Redirect
          </h3>
          <p className="mb-3">
            Add a separate server block to redirect all HTTP traffic to HTTPS:
          </p>
          <CodeBlock>
            {`server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$server_name$request_uri;
}`}
          </CodeBlock>
          <p className="mt-3">
            Replace{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              example.com
            </code>{" "}
            with your actual domain name throughout the configuration. If you
            are using Nginx as a reverse proxy (e.g., for Node.js or Python
            applications), replace the{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              root
            </code>{" "}
            and{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              location
            </code>{" "}
            directives with your{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              proxy_pass
            </code>{" "}
            configuration.
          </p>
        </section>

        {/* Step 5 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 5: Test and Reload Nginx
          </h2>
          <p className="mb-3">
            Before reloading Nginx, test the configuration for syntax errors:
          </p>
          <CodeBlock>
            {`# Test Nginx configuration
sudo nginx -t`}
          </CodeBlock>
          <p className="mt-3 mb-3">
            You should see output like:
          </p>
          <CodeBlock>
            {`nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful`}
          </CodeBlock>
          <p className="mt-3 mb-3">
            If the test passes, reload Nginx to apply the changes:
          </p>
          <CodeBlock>
            {`# Reload Nginx (graceful - no downtime)
sudo systemctl reload nginx`}
          </CodeBlock>
          <p className="mt-3 mb-3">
            Now verify your SSL installation by visiting your website in a
            browser:
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
              to verify the full certificate chain and configuration
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
            downtime, plan your renewal well in advance. Here are your options:
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
            files to your server, recreate the fullchain file, and reload Nginx.
          </p>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Troubleshooting
          </h2>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            &ldquo;nginx: [emerg] cannot load certificate&rdquo;
          </h3>
          <p className="mb-3">
            This usually means the certificate file path is incorrect or the
            file is empty. Double-check the file paths in your server block and
            verify the files contain valid certificate data:
          </p>
          <CodeBlock>
            {`# Check that certificate files are not empty
sudo head -1 /etc/ssl/example.com/fullchain.pem
# Should output: -----BEGIN CERTIFICATE-----

sudo head -1 /etc/ssl/example.com/private.key
# Should output: -----BEGIN PRIVATE KEY-----`}
          </CodeBlock>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            &ldquo;SSL: error:0B080074:x509 certificate routines&rdquo;
          </h3>
          <p>
            This indicates a mismatch between the certificate and private key.
            Ensure both files were generated together from the same certificate
            request. If they do not match, you will need to{" "}
            <Link
              to="/"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              generate a new certificate
            </Link>
            .
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Browser shows &ldquo;Not Secure&rdquo; despite HTTPS
          </h3>
          <p>
            This is typically a mixed content issue. Your page is loading some
            resources (images, scripts, CSS) over HTTP instead of HTTPS. Check
            your browser&#39;s developer console for mixed content warnings. See
            our{" "}
            <Link
              to="/faq"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              FAQ on mixed content
            </Link>{" "}
            for detailed solutions.
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
                to="/guides/apache-ssl"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                How to Install SSL on Apache
              </Link>{" "}
              &mdash; Guide for Apache/httpd servers
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
                to="/about"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                About freesslcert.net
              </Link>{" "}
              &mdash; How our service works
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
