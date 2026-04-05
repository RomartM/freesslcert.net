import { Link } from "react-router-dom";
import { BlogPost } from "@/components/blog/BlogPost";
import { getBlogPostBySlug } from "@/data/blogPosts";

const meta = getBlogPostBySlug("lets-encrypt-guide")!;

export function LetsEncryptGuide() {
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
        Let&#39;s Encrypt has fundamentally changed the SSL certificate
        landscape. Since its public launch in 2015, this free, automated, and
        open Certificate Authority has issued billions of certificates and
        helped push HTTPS adoption past the 95% mark. But how does it
        actually work? This guide explains everything you need to know about
        Let&#39;s Encrypt, from the organization behind it to the technical
        protocol that makes it possible.
      </p>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          What Is Let&#39;s Encrypt?
        </h2>
        <p className="mb-3">
          Let&#39;s Encrypt is a free, automated, and open Certificate
          Authority (CA) operated by the{" "}
          <a
            href="https://www.abetterinternet.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            Internet Security Research Group (ISRG)
          </a>
          , a California-based nonprofit organization. ISRG&#39;s mission is
          to reduce financial, technological, and educational barriers to
          secure communication on the internet.
        </p>
        <p className="mb-3">
          Let&#39;s Encrypt is sponsored by major technology companies
          including Mozilla, Google, Cisco, the Electronic Frontier
          Foundation, and many others. This broad sponsorship ensures the
          project&#39;s long-term sustainability and independence.
        </p>
        <p>
          Unlike traditional Certificate Authorities that charge annual fees
          ranging from $10 to $1,000 or more, Let&#39;s Encrypt provides
          Domain Validated (DV) certificates at no cost. The certificates are
          technically identical to paid DV certificates from commercial CAs
          and provide the same level of encryption.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          How the ACME Protocol Works
        </h2>
        <p className="mb-3">
          The magic behind Let&#39;s Encrypt is the ACME (Automatic
          Certificate Management Environment) protocol, standardized as{" "}
          <a
            href="https://datatracker.ietf.org/doc/html/rfc8555"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            RFC 8555
          </a>
          . ACME automates the entire certificate lifecycle: issuance,
          renewal, and revocation. Here is how the process works step by
          step:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mb-3">
          <li>
            <strong className="text-neutral-900">Account registration</strong> -
            The ACME client creates a key pair and registers with the CA.
            This key pair identifies the account for future interactions.
          </li>
          <li>
            <strong className="text-neutral-900">Order creation</strong> -
            The client submits an order for a certificate covering one or
            more domain names.
          </li>
          <li>
            <strong className="text-neutral-900">
              Authorization challenges
            </strong>{" "}
            - The CA responds with challenges that the client must complete
            to prove domain ownership. The two most common challenge types
            are HTTP-01 and DNS-01.
          </li>
          <li>
            <strong className="text-neutral-900">
              Challenge completion
            </strong>{" "}
            - The client fulfills the challenge (placing a file on the web
            server or creating a DNS TXT record) and notifies the CA.
          </li>
          <li>
            <strong className="text-neutral-900">Validation</strong> -
            The CA verifies the challenge response and marks the
            authorization as valid.
          </li>
          <li>
            <strong className="text-neutral-900">
              Certificate issuance
            </strong>{" "}
            - The client submits a Certificate Signing Request (CSR), and
            the CA issues the signed certificate.
          </li>
        </ol>
        <p>
          This entire process can be completed in seconds for HTTP validation
          or a few minutes for DNS validation (depending on DNS propagation
          time).
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Domain Validation: HTTP-01 vs DNS-01
        </h2>
        <p className="mb-3">
          Let&#39;s Encrypt offers two primary methods for proving domain
          ownership:
        </p>
        <div className="space-y-3 mb-3">
          <div className="rounded-lg border border-neutral-200/60 p-4">
            <h3 className="text-sm font-medium text-neutral-900 mb-1">
              HTTP-01 Validation
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              The CA provides a token, and you place a file containing that
              token at{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                http://yourdomain.com/.well-known/acme-challenge/TOKEN
              </code>
              . The CA makes an HTTP request to that URL to verify the file
              exists. This is the simplest method if you have direct access
              to your web server&#39;s file system. It works for single
              domains and multi-domain (SAN) certificates but cannot be used
              for wildcard certificates.
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200/60 p-4">
            <h3 className="text-sm font-medium text-neutral-900 mb-1">
              DNS-01 Validation
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              The CA provides a token, and you create a TXT record at{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                _acme-challenge.yourdomain.com
              </code>{" "}
              with the token value. The CA performs a DNS lookup to verify
              the record. This method is required for wildcard certificates
              and is useful when you cannot place files on the web server
              directly (such as with CDN-fronted origins or hosting
              providers with limited file access).
            </p>
          </div>
        </div>
        <p>
          Both validation methods prove that you control the domain. The
          choice between them depends on your hosting setup and the type of
          certificate you need.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Why 90-Day Certificate Lifetimes?
        </h2>
        <p className="mb-3">
          Let&#39;s Encrypt certificates are valid for 90 days, which is
          significantly shorter than the one-year maximum allowed by the
          CA/Browser Forum (and the historical two-year or three-year
          lifetimes that were previously common). This short lifetime is a
          deliberate design decision with several security benefits:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mb-3">
          <li>
            <strong className="text-neutral-900">
              Reduced impact of compromise
            </strong>{" "}
            - If a private key is stolen, the window of vulnerability is
            limited to at most 90 days rather than a year or more.
          </li>
          <li>
            <strong className="text-neutral-900">
              Encourages automation
            </strong>{" "}
            - Short lifetimes make manual renewal impractical, pushing
            website operators toward automated renewal, which is more
            reliable and secure.
          </li>
          <li>
            <strong className="text-neutral-900">
              Regular domain validation
            </strong>{" "}
            - Every renewal re-verifies domain ownership, ensuring that
            certificates are not left active for domains that have changed
            hands.
          </li>
          <li>
            <strong className="text-neutral-900">
              Faster adoption of improvements
            </strong>{" "}
            - If Let&#39;s Encrypt needs to change its signing infrastructure
            or algorithms, the changes propagate within 90 days without
            requiring mass revocation.
          </li>
        </ul>
        <p>
          Let&#39;s Encrypt recommends renewing certificates when they have
          30 days of validity remaining, giving you a 60-day effective
          certificate lifetime with a 30-day renewal window.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Rate Limits
        </h2>
        <p className="mb-3">
          Let&#39;s Encrypt enforces rate limits to ensure fair usage and
          prevent abuse. The primary limits you should be aware of are:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mb-3">
          <li>
            <strong className="text-neutral-900">
              50 certificates per registered domain per week
            </strong>{" "}
            - A &ldquo;registered domain&rdquo; is the domain you buy from
            a registrar (e.g., example.com). Subdomains like
            blog.example.com and shop.example.com count under the same
            registered domain.
          </li>
          <li>
            <strong className="text-neutral-900">
              5 duplicate certificates per week
            </strong>{" "}
            - A duplicate is a certificate covering the exact same set of
            domain names.
          </li>
          <li>
            <strong className="text-neutral-900">
              300 new orders per account per 3 hours
            </strong>{" "}
            - This limits the rate of new certificate requests from a single
            account.
          </li>
          <li>
            <strong className="text-neutral-900">
              5 failed validations per hostname per hour
            </strong>{" "}
            - To prevent brute-force validation attempts.
          </li>
        </ul>
        <p>
          These limits are generous enough for virtually all legitimate use
          cases. If you are setting up certificates for the first time, you
          are unlikely to hit any of them. For testing, Let&#39;s Encrypt
          provides a{" "}
          <a
            href="https://letsencrypt.org/docs/staging-environment/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            staging environment
          </a>{" "}
          with much higher limits.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Beyond Certbot: Alternative ACME Clients
        </h2>
        <p className="mb-3">
          Certbot, developed by the EFF, is the most well-known ACME client,
          but it is far from the only option. Certbot requires command-line
          access and is designed for server administrators comfortable with
          SSH. For users who need a simpler solution, several alternatives
          exist:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mb-3">
          <li>
            <strong className="text-neutral-900">
              <Link
                to="/"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                freesslcert.net
              </Link>
            </strong>{" "}
            - A browser-based ACME client that requires no software
            installation or command-line knowledge. Generate certificates
            through a visual, guided interface.
          </li>
          <li>
            <strong className="text-neutral-900">acme.sh</strong> - A
            lightweight shell script that runs on Unix-like systems. Popular
            for its simplicity and lack of dependencies.
          </li>
          <li>
            <strong className="text-neutral-900">Caddy</strong> - A web
            server with automatic HTTPS built in. Caddy obtains and renews
            certificates automatically with zero configuration.
          </li>
          <li>
            <strong className="text-neutral-900">lego</strong> - A
            Go-based ACME client with support for over 100 DNS providers,
            making it excellent for automated DNS validation.
          </li>
          <li>
            <strong className="text-neutral-900">win-acme</strong> - A
            Windows-specific ACME client designed for IIS servers.
          </li>
        </ul>
        <p>
          The right client depends on your environment and technical
          comfort level. If you want the easiest possible experience with no
          software to install,{" "}
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            freesslcert.net
          </Link>{" "}
          handles the entire process in your browser.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          The Trust Chain: ISRG Root X1 and Intermediates
        </h2>
        <p className="mb-3">
          For a browser to trust a certificate, it must be able to trace a
          chain of trust from the certificate back to a root CA that is
          pre-installed in the browser or operating system. Let&#39;s
          Encrypt&#39;s trust chain works as follows:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 mb-3">
          <li>
            <strong className="text-neutral-900">ISRG Root X1</strong> -
            The self-signed root certificate, trusted by all major browsers
            and operating systems. This root has been directly trusted since
            2018 and provides the foundation of the chain.
          </li>
          <li>
            <strong className="text-neutral-900">
              Intermediate certificates (R10, R11, E5, E6)
            </strong>{" "}
            - These intermediate CAs are signed by the root and are used to
            sign end-entity (leaf) certificates. Using intermediates
            protects the root key, which is kept offline in secure
            facilities. Let&#39;s Encrypt rotates intermediates regularly
            for security.
          </li>
          <li>
            <strong className="text-neutral-900">Your certificate</strong>{" "}
            - The leaf certificate for your domain, signed by one of the
            intermediate CAs.
          </li>
        </ol>
        <p>
          When you download your certificate from{" "}
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            freesslcert.net
          </Link>
          , you receive both your leaf certificate and the intermediate
          certificate (CA bundle). You must install both on your server so
          that browsers can verify the complete chain. See our server
          installation guides for{" "}
          <Link
            to="/guides/nginx-ssl/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            Nginx
          </Link>{" "}
          and{" "}
          <Link
            to="/guides/apache-ssl/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            Apache
          </Link>{" "}
          for details.
        </p>
      </section>
    </BlogPost>
  );
}
