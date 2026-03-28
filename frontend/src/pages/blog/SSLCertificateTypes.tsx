import { Link } from "react-router-dom";
import { BlogPost } from "@/components/blog/BlogPost";
import { getBlogPostBySlug } from "@/data/blogPosts";

const meta = getBlogPostBySlug("ssl-certificate-types-explained")!;

export function SSLCertificateTypes() {
  return (
    <BlogPost
      title={meta.title}
      slug={meta.slug}
      date={meta.date}
      readTime={meta.readTime}
      description={meta.description}
      keywords={meta.keywords}
    >
      <p>
        When you start researching SSL certificates, you quickly discover
        that not all certificates are the same. There are different
        validation levels, different coverage scopes, and wildly different
        price points. This guide breaks down every major type of SSL
        certificate so you can make an informed decision about which one
        your website actually needs.
      </p>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Domain Validated (DV) Certificates
        </h2>
        <p className="mb-3">
          Domain Validated certificates are the most common and most
          straightforward type of SSL certificate. The Certificate Authority
          verifies only one thing: that you control the domain name listed
          on the certificate. Verification is done automatically through
          either an HTTP challenge (placing a file on your server) or a DNS
          challenge (adding a TXT record to your DNS zone).
        </p>
        <p className="mb-3">
          DV certificates are typically issued within minutes, cost nothing
          from providers like{" "}
          <Link
            to="/blog/lets-encrypt-guide"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            Let&#39;s Encrypt
          </Link>
          , and provide the same encryption strength as more expensive
          certificate types. The padlock icon in the browser address bar
          looks identical whether the certificate is a free DV or a $1,000
          EV certificate.
        </p>
        <p>
          <strong className="text-neutral-900">Best for:</strong> personal
          websites, blogs, small business sites, web applications, APIs,
          development environments, and the vast majority of websites on
          the internet.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Organization Validated (OV) Certificates
        </h2>
        <p className="mb-3">
          Organization Validated certificates include everything in a DV
          certificate plus verification of the organization behind the
          website. The CA checks that the organization legally exists,
          verifies its physical address, and confirms the applicant&#39;s
          authority to request a certificate on the organization&#39;s
          behalf.
        </p>
        <p className="mb-3">
          The validation process typically takes one to three business days
          and requires submitting documentation such as articles of
          incorporation, a business license, or a DUNS number. OV
          certificates usually cost between $50 and $200 per year.
        </p>
        <p className="mb-3">
          From a visitor&#39;s perspective, OV certificates look identical
          to DV certificates in the browser. The organizational details are
          embedded in the certificate&#39;s subject field and can be viewed
          by inspecting the certificate details, but browsers do not
          display them prominently.
        </p>
        <p>
          <strong className="text-neutral-900">Best for:</strong> medium to
          large businesses that want organizational identity in their
          certificate for compliance or internal policy reasons.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Extended Validation (EV) Certificates
        </h2>
        <p className="mb-3">
          Extended Validation certificates require the most rigorous
          verification process. The CA must verify the legal, physical, and
          operational existence of the organization, confirm the
          applicant&#39;s identity and authority, and ensure the
          organization has acknowledged the request. This process typically
          takes one to two weeks and costs between $100 and $1,000 per year.
        </p>
        <p className="mb-3">
          Historically, EV certificates were associated with the
          &ldquo;green address bar&rdquo; that displayed the organization
          name directly in the browser&#39;s URL bar. However, since 2019,
          Chrome, Firefox, and Safari have removed this visual distinction.
          Today, EV certificates display the same padlock icon as DV and OV
          certificates. The organizational details are only visible by
          clicking the padlock and inspecting the certificate.
        </p>
        <p>
          <strong className="text-neutral-900">Best for:</strong> financial
          institutions, large e-commerce platforms, and organizations with
          regulatory requirements that specifically mandate EV certificates.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Wildcard Certificates
        </h2>
        <p className="mb-3">
          A wildcard certificate secures a domain and all of its
          single-level subdomains. A certificate issued for{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
            *.example.com
          </code>{" "}
          covers www.example.com, mail.example.com, api.example.com, and
          any other subdomain you create, without needing to modify or
          reissue the certificate.
        </p>
        <p className="mb-3">
          Wildcard certificates do not cover sub-subdomains. A certificate
          for{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
            *.example.com
          </code>{" "}
          will not work for staging.app.example.com. For that, you would
          need a separate wildcard certificate for{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
            *.app.example.com
          </code>
          .
        </p>
        <p className="mb-3">
          Important: wildcard certificates always require DNS-01 validation
          because the CA needs to verify control over the entire DNS zone,
          not just a specific web server. You can{" "}
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            generate free wildcard certificates
          </Link>{" "}
          through freesslcert.net using DNS validation.
        </p>
        <p>
          <strong className="text-neutral-900">Best for:</strong> websites
          with multiple subdomains, SaaS platforms with tenant subdomains,
          development teams with staging and preview environments.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Multi-Domain (SAN) Certificates
        </h2>
        <p className="mb-3">
          Subject Alternative Name (SAN) certificates, also called
          multi-domain certificates or Unified Communications Certificates
          (UCC), allow you to secure multiple completely different domain
          names with a single certificate. For example, one SAN certificate
          could cover example.com, example.org, and myothersite.net.
        </p>
        <p className="mb-3">
          Each domain listed in a SAN certificate must be validated
          independently, but all domains share the same certificate file
          and private key. This simplifies server configuration when a
          single server handles multiple domains.
        </p>
        <p>
          <strong className="text-neutral-900">Best for:</strong>{" "}
          organizations managing multiple domains on the same server,
          Microsoft Exchange and Office 365 deployments, and consolidated
          hosting environments.{" "}
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            freesslcert.net supports SAN certificates
          </Link>{" "}
          with multiple domains validated through HTTP or DNS challenges.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Code Signing Certificates
        </h2>
        <p>
          While not directly related to website SSL, code signing
          certificates are worth a brief mention. These certificates are
          used to digitally sign software executables, scripts, and drivers
          to verify the publisher&#39;s identity and ensure the code has
          not been tampered with. Code signing certificates require OV or
          EV-level validation and are not available from Let&#39;s Encrypt.
          They are purchased from commercial CAs and typically cost between
          $200 and $500 per year.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Comparison: DV vs OV vs EV
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-2 pr-4 font-semibold text-neutral-900">
                  Feature
                </th>
                <th className="py-2 px-4 font-semibold text-neutral-900">
                  DV
                </th>
                <th className="py-2 px-4 font-semibold text-neutral-900">
                  OV
                </th>
                <th className="py-2 pl-4 font-semibold text-neutral-900">
                  EV
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-600">
              <tr className="border-b border-neutral-100">
                <td className="py-2 pr-4 font-medium text-neutral-900">
                  Validation
                </td>
                <td className="py-2 px-4">Domain only</td>
                <td className="py-2 px-4">Domain + Organization</td>
                <td className="py-2 pl-4">Full legal vetting</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-2 pr-4 font-medium text-neutral-900">
                  Issuance Time
                </td>
                <td className="py-2 px-4">Minutes</td>
                <td className="py-2 px-4">1-3 business days</td>
                <td className="py-2 pl-4">1-2 weeks</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-2 pr-4 font-medium text-neutral-900">
                  Cost
                </td>
                <td className="py-2 px-4">Free (Let&#39;s Encrypt)</td>
                <td className="py-2 px-4">$50 - $200/year</td>
                <td className="py-2 pl-4">$100 - $1,000/year</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-2 pr-4 font-medium text-neutral-900">
                  Encryption Strength
                </td>
                <td className="py-2 px-4">256-bit</td>
                <td className="py-2 px-4">256-bit</td>
                <td className="py-2 pl-4">256-bit</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-2 pr-4 font-medium text-neutral-900">
                  Browser Padlock
                </td>
                <td className="py-2 px-4">Yes</td>
                <td className="py-2 px-4">Yes</td>
                <td className="py-2 pl-4">Yes</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-2 pr-4 font-medium text-neutral-900">
                  Green Bar
                </td>
                <td className="py-2 px-4">No</td>
                <td className="py-2 px-4">No</td>
                <td className="py-2 pl-4">Removed in 2019</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-neutral-900">
                  Org Name Visible
                </td>
                <td className="py-2 px-4">No</td>
                <td className="py-2 px-4">In cert details</td>
                <td className="py-2 pl-4">In cert details</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Why DV Is Sufficient for Most Websites
        </h2>
        <p className="mb-3">
          The encryption provided by a DV certificate is identical to OV and
          EV. The padlock icon is the same. The browser trust indicators are
          the same. The only difference is the level of identity verification
          performed by the CA, and since browsers no longer visually
          distinguish between certificate types, most visitors will never
          know or care what type of certificate you have.
        </p>
        <p className="mb-3">
          For personal websites, blogs, portfolios, small business sites,
          web applications, and most e-commerce stores, a free DV certificate
          from Let&#39;s Encrypt provides everything you need. The money
          saved by not purchasing an OV or EV certificate is better spent
          on other security measures like a web application firewall, regular
          security audits, or a content security policy.
        </p>
        <p>
          The one scenario where OV or EV certificates are worth considering
          is when you have specific compliance requirements (such as PCI DSS
          for payment processing) or internal organizational policies that
          mandate them.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Get a Free DV Certificate Now
        </h2>
        <p className="mb-3">
          Ready to secure your website? With{" "}
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            freesslcert.net
          </Link>
          , you can generate a free DV certificate from Let&#39;s Encrypt in
          just a few minutes. We support single-domain, wildcard, and
          multi-domain (SAN) certificates, all through a simple browser-based
          interface with no command-line tools or server access required.
        </p>
        <p>
          Once you have your certificate, check out our installation guides
          for{" "}
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
          to get your site running on HTTPS. And if you want to understand{" "}
          <Link
            to="/blog/why-https-matters-2026"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            why HTTPS matters
          </Link>
          , we have a detailed article on that too.
        </p>
      </section>
    </BlogPost>
  );
}
