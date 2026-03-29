import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { StructuredData } from "@/components/seo/StructuredData";
import { useCanonicalUrl, useHreflangUrls } from "@/hooks/useLocaleUrl";

export function PrivacyPage() {
  const canonicalUrl = useCanonicalUrl("/privacy");
  const hreflangUrls = useHreflangUrls("/privacy");

  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>Privacy Policy | freesslcert.net</title>
        <meta
          name="description"
          content="Privacy policy for freesslcert.net. Learn how we handle your data when generating free SSL certificates. No data stored, no signup required."
        />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:title"
          content="Privacy Policy | freesslcert.net"
        />
        <meta
          property="og:description"
          content="Privacy policy for freesslcert.net. Learn how we handle your data when generating free SSL certificates. No data stored, no signup required."
        />
        <meta
          property="og:image"
          content="https://freesslcert.net/og-image.svg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta
          name="twitter:title"
          content="Privacy Policy | freesslcert.net"
        />
        <meta
          name="twitter:description"
          content="Privacy policy for freesslcert.net. Learn how we handle your data when generating free SSL certificates. No data stored, no signup required."
        />
        <meta
          name="twitter:image"
          content="https://freesslcert.net/og-image.svg"
        />

        {hreflangUrls.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
        ))}
      </Helmet>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://freesslcert.net/" },
            { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://freesslcert.net/privacy" },
          ],
        }}
      />

      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-150 mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-neutral-500 mb-8">Last updated: March 2026</p>

      <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
        <p>
          freesslcert.net is a free SSL/TLS certificate generation service powered by Let&#39;s Encrypt.
          We are committed to transparency about how we handle your data.
        </p>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Domain names you submit for certificate generation</li>
            <li>Temporary certificate data (private keys, certificates) during the issuance process</li>
            <li>Basic request metadata (IP address, timestamp) for rate limiting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">Data Retention</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>All certificate data (including private keys) is automatically purged within <strong className="text-neutral-900">24 hours</strong> of generation</li>
            <li>We do not store your certificates or keys permanently</li>
            <li>Rate limiting data is held in memory only and cleared on service restart</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">Data Sharing</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Domain names are shared with Let&#39;s Encrypt as part of the ACME certificate issuance protocol</li>
            <li>Issued certificates are logged to public Certificate Transparency logs (required by Let&#39;s Encrypt)</li>
            <li>We do not sell, share, or transfer your data to any other third party</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">Cookies & Tracking</h2>
          <p>
            We do not use cookies, analytics trackers, or any third-party tracking scripts.
            This site does not use Google Analytics, Facebook Pixel, or similar services.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">Security</h2>
          <p>
            All communication with our service is encrypted via HTTPS. Private keys generated
            during the certificate issuance process are transmitted over encrypted connections
            and automatically purged from our servers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">Contact</h2>
          <p>
            For privacy-related inquiries, please email{" "}
            <a href="mailto:privacy@freesslcert.net" className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150">
              privacy@freesslcert.net
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
