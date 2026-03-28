import { useState } from "react";
import { ArrowLeft, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StructuredData } from "@/components/seo/StructuredData";
import type { JsonLdSchema } from "@/components/seo/StructuredData";

const webAppSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free SSL Certificate Checker",
  description:
    "Check any website's SSL/TLS certificate status, expiration date, issuer, and configuration. Identify common SSL problems like expired certificates, self-signed certificates, and incomplete certificate chains.",
  url: "https://freesslcert.net/ssl-checker",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
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
      name: "SSL Checker",
      item: "https://freesslcert.net/ssl-checker",
    },
  ],
};

export function SSLCheckerPage() {
  const [domain, setDomain] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Checker functionality will be implemented in a future update
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>
          Free SSL Certificate Checker - Check SSL Certificate Status |
          freesslcert.net
        </title>
        <meta
          name="description"
          content="Check any website's SSL certificate status for free. Verify expiration dates, certificate chain, issuer details, and identify common SSL problems like mixed content and hostname mismatches."
        />
        <link rel="canonical" href="https://freesslcert.net/ssl-checker" />
      </Helmet>
      <StructuredData data={[webAppSchema, breadcrumbSchema]} />

      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-150 mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
        Free SSL Certificate Checker
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        Check the SSL/TLS certificate status of any website
      </p>

      {/* Hero / Checker Form */}
      <section className="rounded-xl border border-neutral-200/60 bg-white p-6 mb-10 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-neutral-900">
              Check SSL Certificate
            </h2>
            <p className="text-xs text-neutral-500">
              Enter a domain name to check its SSL certificate
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="ssl-checker-domain" className="sr-only">
            Domain name
          </label>
          <input
            id="ssl-checker-domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors duration-150"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 transition-colors duration-150"
          >
            <Search className="size-4" aria-hidden="true" />
            Check SSL
          </button>
        </form>
        <p className="mt-3 text-xs text-neutral-400">
          Coming soon. This tool is under development. In the meantime, you can{" "}
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            generate a free SSL certificate
          </Link>{" "}
          for your domain.
        </p>
      </section>

      <div className="space-y-8 text-sm text-neutral-600 leading-relaxed">
        {/* What Does an SSL Checker Do? */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            What Does an SSL Checker Do?
          </h2>
          <p className="mb-3">
            An SSL checker connects to a website&#39;s server, retrieves its
            SSL/TLS certificate, and analyzes the certificate for potential
            problems. It performs the same verification steps that a web
            browser does when you visit an HTTPS website, but presents the
            results in a detailed, human-readable format.
          </p>
          <p>
            Unlike a browser that simply shows a padlock or a warning, an SSL
            checker gives you specific information about the certificate and
            its configuration. This is valuable for website administrators who
            need to diagnose SSL problems, verify that a certificate
            installation was successful, or monitor certificate expiration
            dates.
          </p>
        </section>

        {/* What Information Can You Learn */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            What Information Can You Learn from Checking SSL?
          </h2>
          <p className="mb-3">
            When you check a website&#39;s SSL certificate, you can learn:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-neutral-900">Certificate validity</strong>{" "}
              &mdash; Whether the certificate is currently valid, expired, or
              not yet active
            </li>
            <li>
              <strong className="text-neutral-900">Expiration date</strong>{" "}
              &mdash; When the certificate expires and how many days remain
            </li>
            <li>
              <strong className="text-neutral-900">Issuer</strong> &mdash; The
              Certificate Authority (CA) that issued the certificate (e.g.,
              Let&#39;s Encrypt, DigiCert, Comodo)
            </li>
            <li>
              <strong className="text-neutral-900">Domain coverage</strong>{" "}
              &mdash; Which domain names are covered by the certificate
              (including Subject Alternative Names)
            </li>
            <li>
              <strong className="text-neutral-900">Certificate chain</strong>{" "}
              &mdash; Whether the full chain of trust is properly configured
              from the server certificate through intermediate certificates to
              the root CA
            </li>
            <li>
              <strong className="text-neutral-900">Protocol support</strong>{" "}
              &mdash; Which{" "}
              <Link
                to="/ssl-vs-tls"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                TLS versions
              </Link>{" "}
              the server supports (TLS 1.2, TLS 1.3, or deprecated versions)
            </li>
            <li>
              <strong className="text-neutral-900">Cipher suites</strong>{" "}
              &mdash; The encryption algorithms the server offers and whether
              they are considered secure
            </li>
            <li>
              <strong className="text-neutral-900">Key size</strong> &mdash;
              The bit length of the certificate&#39;s public key (2048-bit RSA
              or 256-bit ECDSA are standard)
            </li>
          </ul>
        </section>

        {/* Common SSL Certificate Problems */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Common SSL Certificate Problems
          </h2>
          <p className="mb-3">
            An SSL checker can identify several common issues that cause
            browser warnings or security vulnerabilities:
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Expired Certificate
          </h3>
          <p className="mb-3">
            The most common SSL problem. When a certificate expires, browsers
            display a full-page warning that blocks visitors from accessing
            your site. Let&#39;s Encrypt certificates expire after 90 days,
            so timely renewal is critical. You can{" "}
            <Link
              to="/"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              generate a new free certificate on freesslcert.net
            </Link>{" "}
            at any time.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Self-Signed Certificate
          </h3>
          <p className="mb-3">
            A self-signed certificate is not issued by a trusted Certificate
            Authority. Browsers do not trust these certificates and will show
            a security warning. Self-signed certificates are only appropriate
            for local development or internal testing. For production websites,
            always use a certificate from a trusted CA like Let&#39;s Encrypt.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Hostname Mismatch
          </h3>
          <p className="mb-3">
            This error occurs when the domain name in the browser does not
            match any of the domain names listed in the certificate. For
            example, if your certificate covers{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              example.com
            </code>{" "}
            but a visitor accesses{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              www.example.com
            </code>
            , they will see a mismatch warning. The solution is to generate a
            certificate that covers all the domain names your site uses,
            including the{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              www
            </code>{" "}
            subdomain.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Incomplete Certificate Chain
          </h3>
          <p className="mb-3">
            An incomplete chain means the server is not sending the
            intermediate certificates needed for browsers to verify the trust
            path to the root CA. While most desktop browsers can work around
            this by fetching the missing intermediates, mobile browsers and
            other clients often cannot. Always include the CA bundle when
            installing your certificate. See our installation guides for{" "}
            <Link
              to="/guides/nginx-ssl"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              Nginx
            </Link>
            ,{" "}
            <Link
              to="/guides/apache-ssl"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              Apache
            </Link>
            , or{" "}
            <Link
              to="/guides/wordpress-ssl"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              WordPress
            </Link>{" "}
            for detailed instructions.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Weak Cipher Suite
          </h3>
          <p>
            Older cipher suites like RC4, DES, and 3DES have known
            vulnerabilities and should be disabled. Modern servers should only
            offer AEAD cipher suites (AES-GCM, ChaCha20-Poly1305) with TLS
            1.2 or TLS 1.3. Read our{" "}
            <Link
              to="/ssl-vs-tls"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              SSL vs TLS comparison
            </Link>{" "}
            for details on protocol versions and cipher suites.
          </p>
        </section>

        {/* How to Fix Common SSL Issues */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            How to Fix Common SSL Issues
          </h2>
          <p className="mb-3">
            If an SSL check reveals problems with your certificate, here are
            the most common fixes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-neutral-900">
                Expired certificate
              </strong>{" "}
              &mdash;{" "}
              <Link
                to="/"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                Generate a new free certificate
              </Link>{" "}
              and install it on your server. Consider setting up email
              reminders for future renewals.
            </li>
            <li>
              <strong className="text-neutral-900">
                Self-signed certificate
              </strong>{" "}
              &mdash; Replace it with a certificate from a trusted CA.
              Let&#39;s Encrypt certificates are free and trusted by all major
              browsers.
            </li>
            <li>
              <strong className="text-neutral-900">
                Hostname mismatch
              </strong>{" "}
              &mdash; Generate a new certificate that includes all the domain
              names your site uses. Include both{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                example.com
              </code>{" "}
              and{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                www.example.com
              </code>
              , or use a wildcard certificate.
            </li>
            <li>
              <strong className="text-neutral-900">
                Incomplete chain
              </strong>{" "}
              &mdash; Install the CA bundle (intermediate certificate)
              alongside your server certificate. The{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                ca_bundle.crt
              </code>{" "}
              file from freesslcert.net contains the necessary intermediates.
            </li>
            <li>
              <strong className="text-neutral-900">
                Weak cipher suites
              </strong>{" "}
              &mdash; Update your server configuration to disable legacy
              ciphers and enable only TLS 1.2+ with AEAD cipher suites. See
              our{" "}
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
              guides for recommended cipher configurations.
            </li>
            <li>
              <strong className="text-neutral-900">
                Mixed content
              </strong>{" "}
              &mdash; Update all internal links and resource URLs to use HTTPS.
              Check your HTML, CSS, and JavaScript for hardcoded HTTP URLs. See
              our{" "}
              <Link
                to="/faq"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                FAQ on mixed content
              </Link>{" "}
              for detailed guidance.
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="rounded-lg border border-neutral-200/60 bg-neutral-50/50 p-5">
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Need a New SSL Certificate?
          </h2>
          <p className="mb-3">
            If your SSL check reveals an expired, self-signed, or misconfigured
            certificate, you can get a free replacement in minutes from
            freesslcert.net. Our certificates are issued by Let&#39;s Encrypt
            and are trusted by all major browsers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors duration-150"
            >
              Generate a Free Certificate
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
            >
              Read the FAQ
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
