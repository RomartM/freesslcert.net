export function PrivacySection() {
  return (
    <section id="privacy" className="mt-16 mb-8 scroll-mt-20">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Privacy Policy</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
        <p>
          <strong className="text-foreground">Last updated:</strong> March 2026
        </p>
        <p>
          freesslcert.net is a free SSL/TLS certificate generation service powered by Let&apos;s Encrypt. We are committed to transparency about how we handle your data.
        </p>
        <h3 className="text-lg font-semibold text-foreground mt-6">Data We Collect</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Domain names you submit for certificate generation</li>
          <li>Temporary certificate data (private keys, certificates) during the issuance process</li>
          <li>Basic request metadata (IP address, timestamp) for rate limiting</li>
        </ul>
        <h3 className="text-lg font-semibold text-foreground mt-6">Data Retention</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>All certificate data (including private keys) is automatically purged within <strong className="text-foreground">24 hours</strong> of generation</li>
          <li>We do not store your certificates or keys permanently</li>
          <li>Rate limiting data is held in memory only and cleared on service restart</li>
        </ul>
        <h3 className="text-lg font-semibold text-foreground mt-6">Data Sharing</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Domain names are shared with Let&apos;s Encrypt as part of the ACME certificate issuance protocol</li>
          <li>Issued certificates are logged to public Certificate Transparency logs (required by Let&apos;s Encrypt)</li>
          <li>We do not sell, share, or transfer your data to any other third party</li>
        </ul>
        <h3 className="text-lg font-semibold text-foreground mt-6">Cookies &amp; Tracking</h3>
        <p>
          We do not use cookies, analytics trackers, or any third-party tracking scripts. This site does not use Google Analytics, Facebook Pixel, or similar services.
        </p>
        <h3 className="text-lg font-semibold text-foreground mt-6">Security</h3>
        <p>
          All communication with our service is encrypted via HTTPS. Private keys generated during the certificate issuance process are transmitted over encrypted connections and automatically purged from our servers.
        </p>
        <h3 className="text-lg font-semibold text-foreground mt-6">Contact</h3>
        <p>
          For privacy-related inquiries, please email{" "}
          <a href="mailto:privacy@freesslcert.net" className="text-foreground underline underline-offset-2">privacy@freesslcert.net</a>.
        </p>
      </div>
    </section>
  );
}
