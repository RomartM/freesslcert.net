import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { StructuredData } from "@/components/seo/StructuredData";
import { useCanonicalUrl, useHreflangUrls } from "@/hooks/useLocaleUrl";

export function TermsPage() {
  const canonicalUrl = useCanonicalUrl("/terms");
  const hreflangUrls = useHreflangUrls("/terms");

  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>Terms of Service | freesslcert.net</title>
        <meta
          name="description"
          content="Terms of service for freesslcert.net free SSL certificate generator. Powered by Let's Encrypt ACME protocol."
        />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:title"
          content="Terms of Service | freesslcert.net"
        />
        <meta
          property="og:description"
          content="Terms of service for freesslcert.net free SSL certificate generator. Powered by Let's Encrypt ACME protocol."
        />
        <meta
          property="og:image"
          content="https://freesslcert.net/og-image.svg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta
          name="twitter:title"
          content="Terms of Service | freesslcert.net"
        />
        <meta
          name="twitter:description"
          content="Terms of service for freesslcert.net free SSL certificate generator. Powered by Let's Encrypt ACME protocol."
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
            { "@type": "ListItem", "position": 2, "name": "Terms of Service", "item": "https://freesslcert.net/terms" },
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
        Terms of Use
      </h1>
      <p className="text-sm text-neutral-500 mb-8">Last updated: March 2026</p>

      <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
        <p>By using freesslcert.net, you agree to the following terms.</p>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">Service Description</h2>
          <p>
            freesslcert.net provides free SSL/TLS certificate generation using the Let&#39;s Encrypt
            Certificate Authority via the ACME protocol. Certificates issued are subject to
            Let&#39;s Encrypt&#39;s own terms and policies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">Acceptable Use</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>You may only request certificates for domains you own or are authorized to manage</li>
            <li>You must not use this service for any illegal purpose or to facilitate fraud</li>
            <li>You must not attempt to circumvent rate limits or abuse the service</li>
            <li>Automated bulk certificate generation is prohibited without prior authorization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">No Warranty</h2>
          <p>
            This service is provided &ldquo;as is&rdquo; without warranty of any kind. We do not guarantee
            uptime, availability, or the validity of certificates issued. Certificates are issued
            by Let&#39;s Encrypt and are subject to their policies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">Limitation of Liability</h2>
          <p>
            freesslcert.net shall not be liable for any damages arising from the use or inability
            to use this service, including but not limited to certificate expiration, revocation,
            or domain validation failures.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">Rate Limits</h2>
          <p>
            This service is subject to Let&#39;s Encrypt rate limits: 50 certificates per registered
            domain per week, and 5 duplicate certificates per week. We may impose additional rate
            limits to ensure fair usage.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">Changes</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the service
            constitutes acceptance of updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
