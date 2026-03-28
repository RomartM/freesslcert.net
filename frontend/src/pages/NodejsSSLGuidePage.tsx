import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StructuredData } from "@/components/seo/StructuredData";
import type { JsonLdSchema } from "@/components/seo/StructuredData";

const howToSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Set Up a Free SSL Certificate with Node.js",
  description:
    "Step-by-step guide to setting up a free Let's Encrypt SSL/TLS certificate with a Node.js server, including HTTPS configuration, Express.js setup, HTTP-to-HTTPS redirect, and renewal.",
  totalTime: "PT15M",
  supply: [
    {
      "@type": "HowToSupply",
      name: "SSL certificate files from freesslcert.net (certificate.crt, private.key, ca_bundle.crt)",
    },
  ],
  tool: [
    { "@type": "HowToTool", name: "Node.js runtime (v14 or later)" },
    { "@type": "HowToTool", name: "SSH access to your server" },
    { "@type": "HowToTool", name: "Text editor or IDE" },
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
      text: "Transfer the certificate.crt, private.key, and ca_bundle.crt files to a secure directory on your server.",
    },
    {
      "@type": "HowToStep",
      name: "Create an HTTPS server with Node.js",
      text: "Use the built-in Node.js https module to create an HTTPS server that reads your certificate files and serves your application.",
    },
    {
      "@type": "HowToStep",
      name: "Set up Express.js with HTTPS",
      text: "Configure Express.js to work with the HTTPS server for handling routes and middleware.",
    },
    {
      "@type": "HowToStep",
      name: "Redirect HTTP to HTTPS",
      text: "Create an HTTP server on port 80 that redirects all traffic to your HTTPS server on port 443.",
    },
    {
      "@type": "HowToStep",
      name: "Set up a renewal reminder",
      text: "Set a reminder to renew your certificate before it expires in 90 days, and configure your application for zero-downtime certificate reloading.",
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
      item: "https://freesslcert.net/guides/nodejs-ssl",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Node.js SSL Setup",
      item: "https://freesslcert.net/guides/nodejs-ssl",
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

export function NodejsSSLGuidePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>
          How to Set Up a Free SSL Certificate with Node.js - Step-by-Step Guide
        </title>
        <meta
          name="description"
          content="Complete guide to setting up a free SSL certificate with Node.js. Includes HTTPS server configuration, Express.js SSL setup, HTTP-to-HTTPS redirect, and certificate renewal."
        />
        <link
          rel="canonical"
          href="https://freesslcert.net/guides/nodejs-ssl"
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
        How to Set Up a Free SSL Certificate with Node.js
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        A complete step-by-step guide to enabling HTTPS on your Node.js
        application
      </p>

      <div className="space-y-8 text-sm text-neutral-600 leading-relaxed">
        {/* Introduction */}
        <p>
          Node.js makes it straightforward to serve your application over
          HTTPS using its built-in{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
            https
          </code>{" "}
          module. This guide walks you through setting up a free SSL/TLS
          certificate from{" "}
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            freesslcert.net
          </Link>{" "}
          with a Node.js server, whether you are using the core HTTP module or
          Express.js. By the end, your application will serve traffic over
          HTTPS with a valid, browser-trusted certificate from Let&#39;s
          Encrypt.
        </p>

        <p>
          <strong className="text-neutral-900">Note:</strong> In production,
          many Node.js applications sit behind a reverse proxy like{" "}
          <Link
            to="/guides/nginx-ssl"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            Nginx
          </Link>{" "}
          or{" "}
          <Link
            to="/guides/apache-ssl"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            Apache
          </Link>{" "}
          that handles SSL termination. This guide covers direct HTTPS with
          Node.js, which is useful for standalone applications, development
          servers, APIs, and microservices where a reverse proxy is not used.
        </p>

        {/* Prerequisites */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Prerequisites
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Node.js installed on your server (v14 or later recommended; this
              guide uses ES module syntax compatible with Node.js 16+)
            </li>
            <li>
              A domain name with an A record pointing to your server&#39;s IP
              address
            </li>
            <li>
              SSH access to your server (or the ability to deploy files to it)
            </li>
            <li>
              Ports 80 and 443 open on your firewall (you may need{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                sudo
              </code>{" "}
              to bind to ports below 1024)
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
            <li>Enter your domain name (e.g., api.example.com)</li>
            <li>
              Choose your certificate type (single domain for most Node.js
              applications, or wildcard if you serve multiple subdomains)
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
            </code>
            ,{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              private.key
            </code>
            , and{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              ca_bundle.crt
            </code>
            . For more details on what these files are, see our{" "}
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
            Transfer the certificate files to your server and store them in a
            secure directory. We recommend keeping them separate from your
            application code:
          </p>
          <CodeBlock>
            {`# Create a directory for SSL certificates
mkdir -p /etc/ssl/example.com

# Upload files using SCP (run from your local machine)
scp certificate.crt user@your-server:/etc/ssl/example.com/
scp private.key user@your-server:/etc/ssl/example.com/
scp ca_bundle.crt user@your-server:/etc/ssl/example.com/

# Set proper file permissions
sudo chmod 600 /etc/ssl/example.com/private.key
sudo chmod 644 /etc/ssl/example.com/certificate.crt
sudo chmod 644 /etc/ssl/example.com/ca_bundle.crt`}
          </CodeBlock>
          <p className="mt-3">
            <strong className="text-neutral-900">Important:</strong> Never
            commit your private key to version control. Add the certificate
            directory to your{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              .gitignore
            </code>{" "}
            file, or better yet, store the certificates outside your project
            directory entirely. Use environment variables to configure the
            certificate paths.
          </p>
        </section>

        {/* Step 3 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 3: Create an HTTPS Server with Node.js
          </h2>
          <p className="mb-3">
            Node.js includes a built-in{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              https
            </code>{" "}
            module that can create an HTTPS server. Here is a basic example:
          </p>
          <CodeBlock>
            {`const https = require('https');
const fs = require('fs');

// Read SSL certificate files
const options = {
  key: fs.readFileSync('/etc/ssl/example.com/private.key'),
  cert: fs.readFileSync('/etc/ssl/example.com/certificate.crt'),
  ca: fs.readFileSync('/etc/ssl/example.com/ca_bundle.crt'),
};

// Create HTTPS server
const server = https.createServer(options, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, HTTPS world!');
});

server.listen(443, () => {
  console.log('HTTPS server running on port 443');
});`}
          </CodeBlock>
          <p className="mt-3">
            The{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              ca
            </code>{" "}
            option provides the intermediate certificate chain (CA bundle),
            which is necessary for browsers to verify the complete chain of
            trust from your certificate to the Let&#39;s Encrypt root CA.
            Without it, some browsers and clients may show certificate
            warnings.
          </p>
        </section>

        {/* Step 4 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 4: Set Up Express.js with HTTPS
          </h2>
          <p className="mb-3">
            If you are using Express.js (the most popular Node.js web
            framework), wrap your Express app with the HTTPS server:
          </p>
          <CodeBlock>
            {`const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');

const app = express();

// Read SSL certificate files
const sslOptions = {
  key: fs.readFileSync('/etc/ssl/example.com/private.key'),
  cert: fs.readFileSync('/etc/ssl/example.com/certificate.crt'),
  ca: fs.readFileSync('/etc/ssl/example.com/ca_bundle.crt'),
};

// Your Express routes
app.get('/', (req, res) => {
  res.send('Hello, secure Express!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', secure: req.secure });
});

// Create HTTPS server with Express
const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(443, () => {
  console.log('HTTPS server running on port 443');
});`}
          </CodeBlock>
          <p className="mt-3">
            For a production setup, you should also configure security headers.
            Use the{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              helmet
            </code>{" "}
            middleware to set headers like Strict-Transport-Security,
            X-Content-Type-Options, and X-Frame-Options:
          </p>
          <CodeBlock>
            {`const helmet = require('helmet');

// Add security headers
app.use(helmet());

// Enable HSTS (HTTP Strict Transport Security)
app.use(helmet.hsts({
  maxAge: 31536000,        // 1 year in seconds
  includeSubDomains: true,
  preload: true,
}));`}
          </CodeBlock>
        </section>

        {/* Step 5 */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Step 5: Redirect HTTP to HTTPS
          </h2>
          <p className="mb-3">
            You should redirect all HTTP traffic on port 80 to your HTTPS
            server on port 443. Create a simple HTTP server that performs the
            redirect:
          </p>
          <CodeBlock>
            {`// HTTP redirect server
const httpApp = express();

httpApp.use((req, res) => {
  res.redirect(301, 'https://' + req.headers.host + req.url);
});

const httpServer = http.createServer(httpApp);

httpServer.listen(80, () => {
  console.log('HTTP redirect server running on port 80');
});`}
          </CodeBlock>
          <p className="mt-3 mb-3">
            Here is the complete file combining the HTTPS server and HTTP
            redirect:
          </p>
          <CodeBlock>
            {`const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');

const app = express();

// Security middleware
app.use(helmet());

// SSL certificate files
const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || '/etc/ssl/example.com/private.key'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/etc/ssl/example.com/certificate.crt'),
  ca: fs.readFileSync(process.env.SSL_CA_PATH || '/etc/ssl/example.com/ca_bundle.crt'),
};

// Your application routes
app.get('/', (req, res) => {
  res.send('Hello, secure Express!');
});

// HTTPS server (port 443)
const httpsServer = https.createServer(sslOptions, app);
httpsServer.listen(443, () => {
  console.log('HTTPS server running on port 443');
});

// HTTP redirect server (port 80)
const httpApp = express();
httpApp.use((req, res) => {
  res.redirect(301, 'https://' + req.headers.host + req.url);
});
http.createServer(httpApp).listen(80, () => {
  console.log('HTTP redirect server running on port 80');
});`}
          </CodeBlock>
          <p className="mt-3">
            <strong className="text-neutral-900">Tip:</strong> On Linux,
            binding to ports 80 and 443 requires root privileges. You can
            either run your application with{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              sudo
            </code>
            , use{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              authbind
            </code>
            , or set the capability with{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              sudo setcap &apos;cap_net_bind_service=+ep&apos;
              $(which node)
            </code>
            . Alternatively, run on higher ports (e.g., 3000 and 3443) and use{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              iptables
            </code>{" "}
            to redirect traffic.
          </p>
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
              freesslcert.net offers optional expiration email reminders when
              you generate your certificate
            </li>
            <li>
              <strong className="text-neutral-900">Calendar reminder</strong>{" "}
              - Set a recurring calendar event for 60 days after certificate
              generation
            </li>
            <li>
              <strong className="text-neutral-900">Monitoring service</strong>{" "}
              - Use an SSL monitoring tool to alert you when your certificate
              is nearing expiration
            </li>
          </ul>
          <p className="mb-3">
            When it is time to renew, simply{" "}
            <Link
              to="/"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              visit freesslcert.net
            </Link>
            , generate a new certificate for the same domain, upload the new
            files to your server, and restart your Node.js application.
          </p>
          <p>
            For zero-downtime certificate reloading, you can use the{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              tls.SecureContext
            </code>{" "}
            API or watch for file changes and update the SSL context without
            restarting the process:
          </p>
          <CodeBlock>
            {`const tls = require('tls');

function loadCertificates() {
  return {
    key: fs.readFileSync('/etc/ssl/example.com/private.key'),
    cert: fs.readFileSync('/etc/ssl/example.com/certificate.crt'),
    ca: fs.readFileSync('/etc/ssl/example.com/ca_bundle.crt'),
  };
}

const server = https.createServer({
  SNICallback: (servername, cb) => {
    const ctx = tls.createSecureContext(loadCertificates());
    cb(null, ctx);
  },
}, app);

// Certificates are re-read on each new connection,
// so you can replace the files without restarting the server.`}
          </CodeBlock>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Troubleshooting
          </h2>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            ERR_SSL_PROTOCOL_ERROR
          </h3>
          <p className="mb-3">
            This error usually means your server is not properly configured for
            SSL, or the client is trying to connect via HTTPS to a port that is
            serving plain HTTP. Check that:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Your HTTPS server is actually running on the port the client is
              connecting to
            </li>
            <li>
              You are using{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                https.createServer()
              </code>{" "}
              and not{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                http.createServer()
              </code>{" "}
              for the SSL port
            </li>
            <li>
              The certificate files are readable by the Node.js process (check
              file permissions)
            </li>
          </ul>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Error: DEPTH_ZERO_SELF_SIGNED_CERT
          </h3>
          <p>
            This error occurs when connecting to a server with a self-signed
            certificate. If you are seeing this with a Let&#39;s Encrypt
            certificate, it usually means the CA bundle is missing. Make sure
            you are passing the{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              ca
            </code>{" "}
            option with your{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              ca_bundle.crt
            </code>{" "}
            file in the server options. Never use{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              NODE_TLS_REJECT_UNAUTHORIZED=0
            </code>{" "}
            in production as it disables all certificate verification.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            EACCES: Permission Denied (Port 443)
          </h3>
          <p className="mb-3">
            On Linux, only root can bind to ports below 1024. You have several
            options:
          </p>
          <CodeBlock>
            {`# Option 1: Use authbind
sudo apt install authbind
sudo touch /etc/authbind/byport/443
sudo chmod 500 /etc/authbind/byport/443
sudo chown $(whoami) /etc/authbind/byport/443
authbind --deep node server.js

# Option 2: Grant Node.js the capability
sudo setcap 'cap_net_bind_service=+ep' $(which node)
node server.js

# Option 3: Use iptables to redirect ports
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 3443
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
# Then listen on ports 3443 and 3000 in your app`}
          </CodeBlock>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Certificate and Private Key Mismatch
          </h3>
          <p>
            If you see an error like &ldquo;error:0B080074:x509 certificate
            routines:X509_check_private_key:key values mismatch&rdquo;, the
            certificate and private key were not generated together. Make sure
            both files came from the same certificate request. If they do not
            match, you will need to{" "}
            <Link
              to="/"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              generate a new certificate
            </Link>{" "}
            from freesslcert.net.
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
              &mdash; Use Nginx as a reverse proxy for Node.js with SSL
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
                to="/guides/wordpress-ssl"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                How to Install SSL on WordPress
              </Link>{" "}
              &mdash; Guide for WordPress websites
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
