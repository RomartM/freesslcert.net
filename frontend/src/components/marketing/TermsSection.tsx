export function TermsSection() {
  return (
    <section id="terms" className="mt-12 mb-8 scroll-mt-20">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Terms of Use</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
        <p>
          <strong className="text-foreground">Last updated:</strong> March 2026
        </p>
        <p>
          By using freesslcert.net, you agree to the following terms.
        </p>
        <h3 className="text-lg font-semibold text-foreground mt-6">Service Description</h3>
        <p>
          freesslcert.net provides free SSL/TLS certificate generation using the Let&apos;s Encrypt Certificate Authority via the ACME protocol. Certificates issued are subject to Let&apos;s Encrypt&apos;s own terms and policies.
        </p>
        <h3 className="text-lg font-semibold text-foreground mt-6">Acceptable Use</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>You may only request certificates for domains you own or are authorized to manage</li>
          <li>You must not use this service for any illegal purpose or to facilitate fraud</li>
          <li>You must not attempt to circumvent rate limits or abuse the service</li>
          <li>Automated bulk certificate generation is prohibited without prior authorization</li>
        </ul>
        <h3 className="text-lg font-semibold text-foreground mt-6">No Warranty</h3>
        <p>
          This service is provided &quot;as is&quot; without warranty of any kind. We do not guarantee uptime, availability, or the validity of certificates issued. Certificates are issued by Let&apos;s Encrypt and are subject to their policies.
        </p>
        <h3 className="text-lg font-semibold text-foreground mt-6">Limitation of Liability</h3>
        <p>
          freesslcert.net shall not be liable for any damages arising from the use or inability to use this service, including but not limited to certificate expiration, revocation, or domain validation failures.
        </p>
        <h3 className="text-lg font-semibold text-foreground mt-6">Rate Limits</h3>
        <p>
          This service is subject to Let&apos;s Encrypt rate limits: 50 certificates per registered domain per week, and 5 duplicate certificates per week. We may impose additional rate limits to ensure fair usage.
        </p>
        <h3 className="text-lg font-semibold text-foreground mt-6">Changes</h3>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.
        </p>
      </div>
    </section>
  );
}
