import { Helmet } from "react-helmet-async";
import { WizardContainer } from "@/components/wizard/WizardContainer";
import { TrustSection } from "@/components/marketing/TrustSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { RelatedTools } from "@/components/marketing/RelatedTools";
import { FaqSection } from "@/components/marketing/FaqSection";
import { useCanonicalUrl, useHreflangUrls } from "@/hooks/useLocaleUrl";

export function HomePage() {
  const canonicalUrl = useCanonicalUrl("/");
  const hreflangUrls = useHreflangUrls("/");

  return (
    <>
      <Helmet>
        <title>Free SSL Certificate Generator | freesslcert.net</title>
        <meta
          name="description"
          content="Generate free SSL certificates powered by Let's Encrypt in 60 seconds. No signup required. Single, wildcard & multi-domain support."
        />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:title"
          content="Free SSL Certificate Generator | freesslcert.net"
        />
        <meta
          property="og:description"
          content="Generate free SSL certificates powered by Let's Encrypt in 60 seconds. No signup required. Single, wildcard & multi-domain support."
        />
        <meta
          property="og:image"
          content="https://freesslcert.net/og-image.svg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta
          name="twitter:title"
          content="Free SSL Certificate Generator | freesslcert.net"
        />
        <meta
          name="twitter:description"
          content="Generate free SSL certificates powered by Let's Encrypt in 60 seconds. No signup required. Single, wildcard & multi-domain support."
        />
        <meta
          name="twitter:image"
          content="https://freesslcert.net/og-image.svg"
        />

        {hreflangUrls.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
        ))}
      </Helmet>

      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-green-600">
          Free SSL Certificates
        </h1>
        <p className="mt-3 text-[17px] text-neutral-400 font-light">
          Powered by Let&#39;s Encrypt. No signup. No cost.
        </p>
      </div>

      <WizardContainer />

      <TrustSection />
      <HowItWorks />
      <RelatedTools />
      <FaqSection />
    </>
  );
}
