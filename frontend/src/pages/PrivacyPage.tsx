import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="space-y-6 text-neutral-600 leading-relaxed">
        <p>
          freesslcert.net is a free SSL/TLS certificate generation service powered by Let's Encrypt.
          We are committed to transparency about how we handle your data.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Domain names you submit for certificate generation</li>
            <li>Temporary certificate data (private keys, certificates) during the issuance process</li>
            <li>Basic request metadata (IP address, timestamp) for rate limiting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Data Retention</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>All certificate data (including private keys) is automatically purged within <strong className="text-neutral-900">24 hours</strong> of generation</li>
            <li>We do not store your certificates or keys permanently</li>
            <li>Rate limiting data is held in memory only and cleared on service restart</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Data Sharing</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Domain names are shared with Let's Encrypt as part of the ACME certificate issuance protocol</li>
            <li>Issued certificates are logged to public Certificate Transparency logs (required by Let's Encrypt)</li>
            <li>We do not sell, share, or transfer your data to any other third party</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Cookies & Tracking</h2>
          <p>
            We do not use cookies, analytics trackers, or any third-party tracking scripts.
            This site does not use Google Analytics, Facebook Pixel, or similar services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Security</h2>
          <p>
            All communication with our service is encrypted via HTTPS. Private keys generated
            during the certificate issuance process are transmitted over encrypted connections
            and automatically purged from our servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Contact</h2>
          <p>
            For privacy-related inquiries, please email{" "}
            <a href="mailto:privacy@freesslcert.net" className="text-primary-600 underline underline-offset-2 hover:text-primary-700">
              privacy@freesslcert.net
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
