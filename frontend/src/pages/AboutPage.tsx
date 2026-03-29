import { ArrowLeft, Shield, Code, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StructuredData } from "@/components/seo/StructuredData";
import type { JsonLdSchema } from "@/components/seo/StructuredData";
import { useCanonicalUrl, useHreflangUrls } from "@/hooks/useLocaleUrl";

const aboutSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About freesslcert.net",
  description:
    "Learn how freesslcert.net provides free SSL/TLS certificates through Let's Encrypt with a simple browser-based interface.",
  url: "https://freesslcert.net/about",
  mainEntity: {
    "@type": "WebApplication",
    name: "freesslcert.net",
    url: "https://freesslcert.net",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
};

export function AboutPage() {
  const canonicalUrl = useCanonicalUrl("/about");
  const hreflangUrls = useHreflangUrls("/about");

  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>About freesslcert.net - Free SSL Certificate Generator</title>
        <meta
          name="description"
          content="Learn how freesslcert.net provides free SSL/TLS certificates through Let's Encrypt. Browser-based ACME client, no server-side key storage, no signup required."
        />
        <link rel="canonical" href={canonicalUrl} />

        {hreflangUrls.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
        ))}
      </Helmet>
      <StructuredData data={aboutSchema} />

      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-150 mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
        About freesslcert.net
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        Free SSL certificates for everyone, powered by Let&#39;s Encrypt
      </p>

      <div className="space-y-8 text-sm text-neutral-600 leading-relaxed">
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Shield className="size-4" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold tracking-tight text-neutral-900">
              What We Do
            </h2>
          </div>
          <p>
            freesslcert.net is a free SSL/TLS certificate generation service
            that makes HTTPS accessible to everyone. We provide a simple,
            browser-based interface for obtaining Domain Validation (DV)
            certificates from{" "}
            <a
              href="https://letsencrypt.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              Let&#39;s Encrypt
            </a>
            , a free, automated, and open Certificate Authority. Whether you
            need a single-domain certificate, a multi-domain SAN certificate, or
            a wildcard certificate, our tool handles the entire ACME protocol
            workflow for you. There is no signup, no account creation, and no
            cost involved.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Heart className="size-4" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold tracking-tight text-neutral-900">
              Why We Built This
            </h2>
          </div>
          <p>
            HTTPS should be the default for every website, but obtaining and
            installing SSL certificates has traditionally been a complex process
            involving command-line tools, server configuration, and technical
            knowledge that many website owners simply do not have. While
            Let&#39;s Encrypt made free certificates available to the world, their
            standard tooling (Certbot) requires SSH access and command-line
            familiarity. We built freesslcert.net to bridge that gap: a visual,
            guided interface that walks you through every step of certificate
            generation, from domain validation to downloading your certificate
            files. Our goal is to remove every barrier between a website owner
            and a secure HTTPS connection.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Code className="size-4" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold tracking-tight text-neutral-900">
              How It Works
            </h2>
          </div>
          <p className="mb-3">
            Under the hood, freesslcert.net implements the ACME (Automatic
            Certificate Management Environment) protocol, which is the standard
            used by Let&#39;s Encrypt to verify domain ownership and issue
            certificates. Here is what happens when you use our service:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong className="text-neutral-900">
                You enter your domain name
              </strong>{" "}
              and choose a certificate type (single domain, wildcard, or
              multi-domain SAN).
            </li>
            <li>
              <strong className="text-neutral-900">
                We create an ACME order
              </strong>{" "}
              with Let&#39;s Encrypt and present you with a domain validation
              challenge. You can verify ownership via HTTP file validation (by
              placing a file on your server) or DNS validation (by adding a TXT
              record to your domain&#39;s DNS settings).
            </li>
            <li>
              <strong className="text-neutral-900">
                Once validated, Let&#39;s Encrypt issues your certificate
              </strong>
              , and we provide you with all necessary files: the certificate, the
              private key, and the CA bundle (intermediate certificate chain).
            </li>
            <li>
              <strong className="text-neutral-900">
                You download your files
              </strong>{" "}
              and install them on your web server. We provide detailed guides for{" "}
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
              ,{" "}
              <Link
                to="/guides/wordpress-ssl"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                WordPress
              </Link>
              , and{" "}
              <Link
                to="/guides/nodejs-ssl"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                Node.js
              </Link>{" "}
              to help you through the installation process.
            </li>
          </ol>
          <p className="mt-3">
            Want to learn more about the technology behind SSL certificates?
            Read our article on{" "}
            <Link
              to="/blog/lets-encrypt-guide"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              how Let&#39;s Encrypt works
            </Link>{" "}
            or explore{" "}
            <Link
              to="/blog/why-https-matters-2026"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              why HTTPS matters in 2026
            </Link>
            .
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Eye className="size-4" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold tracking-tight text-neutral-900">
              Trust &amp; Security
            </h2>
          </div>
          <p className="mb-3">
            Security and privacy are fundamental to everything we do. Here is
            how we protect you:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-neutral-900">No data stored</strong> -
              Certificate data, including private keys, is not permanently stored
              on our servers. We do not maintain a database of issued
              certificates or your domain information.
            </li>
            <li>
              <strong className="text-neutral-900">
                Encrypted transmission
              </strong>{" "}
              - All communication with our service occurs over HTTPS. Your
              private key is never transmitted in plain text.
            </li>
            <li>
              <strong className="text-neutral-900">No tracking</strong> - We do
              not use analytics trackers, advertising cookies, or any third-party
              scripts that monitor your behavior. See our{" "}
              <Link
                to="/privacy"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                Privacy Policy
              </Link>{" "}
              for full details.
            </li>
            <li>
              <strong className="text-neutral-900">Open infrastructure</strong>{" "}
              - We use Let&#39;s Encrypt, a transparent, publicly audited
              Certificate Authority operated by the nonprofit Internet Security
              Research Group (ISRG).
            </li>
          </ul>
        </section>

        <section className="rounded-lg border border-neutral-200/60 bg-neutral-50/50 p-5">
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Get Started
          </h2>
          <p className="mb-3">
            Ready to secure your website with a free SSL certificate? Head to
            our homepage to generate your certificate in minutes. Or visit our{" "}
            <Link
              to="/blog"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              blog
            </Link>{" "}
            to learn more about SSL certificates, HTTPS security, and best
            practices.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors duration-150"
            >
              Generate a Certificate
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
            >
              Read the Blog
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
            >
              Read the FAQ
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Legal
          </h2>
          <p>
            By using freesslcert.net, you agree to our{" "}
            <Link
              to="/terms"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              Terms of Use
            </Link>{" "}
            and acknowledge our{" "}
            <Link
              to="/privacy"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              Privacy Policy
            </Link>
            . Certificates are issued by Let&#39;s Encrypt and are subject to
            their own{" "}
            <a
              href="https://letsencrypt.org/repository/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              policies and terms
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
