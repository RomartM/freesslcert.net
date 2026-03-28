import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { StructuredData } from "@/components/seo/StructuredData";
import type { JsonLdSchema } from "@/components/seo/StructuredData";

interface FaqItem {
  question: string;
  answer: string;
  /** JSX content rendered in the accordion (can include links, formatting) */
  content: React.ReactNode;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is an SSL/TLS certificate and why do I need one?",
    answer:
      "An SSL/TLS certificate is a digital file that encrypts data transmitted between a web browser and a web server. When installed on your server, it enables the HTTPS protocol and causes browsers to display a padlock icon in the address bar. SSL certificates protect sensitive data like login credentials, payment information, and personal details from interception by malicious actors. Beyond security, SSL certificates are now essential for SEO rankings, as Google uses HTTPS as a ranking signal. Modern browsers also display 'Not Secure' warnings for HTTP-only sites, which can erode visitor trust and increase bounce rates.",
    content: (
      <p>
        An SSL/TLS certificate is a digital file that encrypts data transmitted
        between a web browser and a web server. When installed on your server, it
        enables the HTTPS protocol and causes browsers to display a padlock icon
        in the address bar. SSL certificates protect sensitive data like login
        credentials, payment information, and personal details from interception
        by malicious actors. Beyond security, SSL certificates are now essential
        for SEO rankings, as Google uses HTTPS as a ranking signal. Modern
        browsers also display &ldquo;Not Secure&rdquo; warnings for HTTP-only
        sites, which can erode visitor trust and increase bounce rates. Read our
        in-depth article on{" "}
        <Link
          to="/blog/why-https-matters-2026"
          className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
        >
          why HTTPS matters in 2026
        </Link>{" "}
        for a comprehensive overview.
      </p>
    ),
  },
  {
    question: "What is the difference between SSL and TLS?",
    answer:
      "SSL (Secure Sockets Layer) and TLS (Transport Layer Security) are both cryptographic protocols that secure internet communication. TLS is the modern successor to SSL. The last version of SSL (3.0) was deprecated in 2015 due to security vulnerabilities, and all modern 'SSL certificates' actually use TLS 1.2 or TLS 1.3. The term 'SSL certificate' persists as an industry convention, but when you obtain an SSL certificate from freesslcert.net, you are getting a certificate that works with TLS. Your server configuration determines which protocol version is actually used during the connection handshake.",
    content: (
      <p>
        SSL (Secure Sockets Layer) and TLS (Transport Layer Security) are both
        cryptographic protocols that secure internet communication. TLS is the
        modern successor to SSL. The last version of SSL (3.0) was deprecated in
        2015 due to security vulnerabilities, and all modern &ldquo;SSL
        certificates&rdquo; actually use TLS 1.2 or TLS 1.3. The term
        &ldquo;SSL certificate&rdquo; persists as an industry convention, but
        when you obtain an SSL certificate from freesslcert.net, you are getting
        a certificate that works with TLS. Your server configuration determines
        which protocol version is actually used during the connection handshake.
      </p>
    ),
  },
  {
    question:
      "What is the difference between DV, OV, and EV SSL certificates?",
    answer:
      "There are three validation levels for SSL certificates: Domain Validation (DV) verifies only that you control the domain. It is the fastest and most common type, issued in minutes. Organization Validation (OV) verifies your organization's identity in addition to domain ownership, and typically takes 1-3 business days. Extended Validation (EV) requires extensive vetting of the organization's legal existence, physical address, and operational status, taking 1-2 weeks. freesslcert.net issues DV certificates through Let's Encrypt. For the vast majority of websites, DV certificates provide the same level of encryption as OV and EV. The encryption strength is identical; only the level of identity verification differs.",
    content: (
      <>
        <p className="mb-2">
          There are three validation levels for SSL certificates:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mb-2">
          <li>
            <strong className="text-neutral-900">
              Domain Validation (DV)
            </strong>{" "}
            verifies only that you control the domain. It is the fastest and most
            common type, issued in minutes.
          </li>
          <li>
            <strong className="text-neutral-900">
              Organization Validation (OV)
            </strong>{" "}
            verifies your organization&#39;s identity in addition to domain
            ownership, and typically takes 1-3 business days.
          </li>
          <li>
            <strong className="text-neutral-900">
              Extended Validation (EV)
            </strong>{" "}
            requires extensive vetting of the organization&#39;s legal
            existence, physical address, and operational status, taking 1-2
            weeks.
          </li>
        </ul>
        <p>
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            freesslcert.net
          </Link>{" "}
          issues DV certificates through Let&#39;s Encrypt. For the vast
          majority of websites, DV certificates provide the same level of
          encryption as OV and EV. The encryption strength is identical; only the
          level of identity verification differs. For a detailed comparison with
          cost and feature tables, see our guide to{" "}
          <Link
            to="/blog/ssl-certificate-types-explained"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            SSL certificate types explained
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    question: "What is a wildcard SSL certificate?",
    answer:
      "A wildcard certificate secures a domain and all of its subdomains at one level. For example, a wildcard certificate for *.example.com covers www.example.com, mail.example.com, app.example.com, and any other subdomain. However, it does not cover sub-subdomains like staging.app.example.com. Wildcard certificates require DNS validation because you must prove control over the entire domain's DNS zone. freesslcert.net supports wildcard certificate generation. Simply select 'Wildcard' as the certificate type, and you will be guided through DNS validation by adding a TXT record to your domain's DNS settings.",
    content: (
      <p>
        A wildcard certificate secures a domain and all of its subdomains at one
        level. For example, a wildcard certificate for{" "}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
          *.example.com
        </code>{" "}
        covers www.example.com, mail.example.com, app.example.com, and any other
        subdomain. However, it does not cover sub-subdomains like
        staging.app.example.com. Wildcard certificates require DNS validation
        because you must prove control over the entire domain&#39;s DNS zone.{" "}
        <Link
          to="/"
          className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
        >
          freesslcert.net supports wildcard certificate generation
        </Link>
        . Simply select &ldquo;Wildcard&rdquo; as the certificate type, and you
        will be guided through DNS validation by adding a TXT record to your
        domain&#39;s DNS settings.
      </p>
    ),
  },
  {
    question: "What is a SAN (Subject Alternative Name) certificate?",
    answer:
      "A SAN certificate, also called a multi-domain certificate or UCC (Unified Communications Certificate), allows you to secure multiple different domain names with a single certificate. Unlike a wildcard certificate that covers subdomains of one domain, a SAN certificate can cover entirely different domains, for example example.com, example.org, and mysite.net in one certificate. Each additional domain is listed as a Subject Alternative Name in the certificate. freesslcert.net supports SAN certificates. You can add multiple domains during the generation process, and each domain will need to be validated independently.",
    content: (
      <p>
        A SAN certificate, also called a multi-domain certificate or UCC
        (Unified Communications Certificate), allows you to secure multiple
        different domain names with a single certificate. Unlike a wildcard
        certificate that covers subdomains of one domain, a SAN certificate can
        cover entirely different domains &mdash; for example, example.com,
        example.org, and mysite.net in one certificate. Each additional domain is
        listed as a Subject Alternative Name in the certificate.{" "}
        <Link
          to="/"
          className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
        >
          freesslcert.net supports SAN certificates
        </Link>
        . You can add multiple domains during the generation process, and each
        domain will need to be validated independently.
      </p>
    ),
  },
  {
    question: "How long do Let's Encrypt certificates last?",
    answer:
      "Let's Encrypt certificates are valid for 90 days. This shorter lifespan compared to traditional commercial certificates (which can last 1-2 years) is intentional. Shorter certificate lifetimes reduce the impact of key compromise, encourage automation, and ensure that domain ownership is regularly re-verified. We recommend setting a calendar reminder to renew your certificate at least 30 days before expiration. You can return to freesslcert.net at any time to generate a new certificate for your domain at no cost.",
    content: (
      <p>
        Let&#39;s Encrypt certificates are valid for 90 days. This shorter
        lifespan compared to traditional commercial certificates (which can last
        1-2 years) is intentional. Shorter certificate lifetimes reduce the
        impact of key compromise, encourage automation, and ensure that domain
        ownership is regularly re-verified. We recommend setting a calendar
        reminder to renew your certificate at least 30 days before expiration.
        You can{" "}
        <Link
          to="/"
          className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
        >
          return to freesslcert.net
        </Link>{" "}
        at any time to generate a new certificate for your domain at no cost.
        Learn more about the reasoning behind 90-day lifetimes in our{" "}
        <Link
          to="/blog/lets-encrypt-guide"
          className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
        >
          Let&#39;s Encrypt guide
        </Link>
        .
      </p>
    ),
  },
  {
    question: "What are Let's Encrypt rate limits?",
    answer:
      "Let's Encrypt enforces several rate limits to prevent abuse. The main limits are: 50 certificates per registered domain per week, 5 duplicate certificates per week (same set of domain names), 300 new orders per account per 3 hours, and 10 accounts per IP address per 3 hours. A 'registered domain' is the part you purchase from a registrar, so for blog.example.com, the registered domain is example.com. Subdomains do not count separately. These limits are generous for most use cases. If you encounter rate limits, wait for the limit window to reset (usually one week). freesslcert.net also applies its own fair-use limits to ensure availability for all users.",
    content: (
      <>
        <p className="mb-2">
          Let&#39;s Encrypt enforces several rate limits to prevent abuse. The
          main limits are:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mb-2">
          <li>50 certificates per registered domain per week</li>
          <li>
            5 duplicate certificates per week (same set of domain names)
          </li>
          <li>300 new orders per account per 3 hours</li>
          <li>10 accounts per IP address per 3 hours</li>
        </ul>
        <p>
          A &ldquo;registered domain&rdquo; is the part you purchase from a
          registrar, so for blog.example.com the registered domain is
          example.com. Subdomains do not count separately. These limits are
          generous for most use cases. If you encounter rate limits, wait for the
          limit window to reset (usually one week). For a complete breakdown, see
          our{" "}
          <Link
            to="/blog/lets-encrypt-guide"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            Let&#39;s Encrypt guide
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    question: "What is the difference between HTTP and DNS validation?",
    answer:
      "HTTP validation requires you to place a specific file with a specific content at a known URL on your web server (typically at /.well-known/acme-challenge/). Let's Encrypt then makes an HTTP request to that URL to verify you control the domain. DNS validation requires you to create a TXT record in your domain's DNS zone with a specific value. Let's Encrypt then performs a DNS lookup to verify the record exists. HTTP validation is simpler if you have direct access to your web server's file system. DNS validation is required for wildcard certificates and is useful when you do not have direct file access to the server, such as when using certain hosting providers or CDNs.",
    content: (
      <>
        <p className="mb-2">
          <strong className="text-neutral-900">HTTP validation</strong> requires
          you to place a specific file with a specific content at a known URL on
          your web server (typically at{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
            /.well-known/acme-challenge/
          </code>
          ). Let&#39;s Encrypt then makes an HTTP request to that URL to verify
          you control the domain.
        </p>
        <p className="mb-2">
          <strong className="text-neutral-900">DNS validation</strong> requires
          you to create a TXT record in your domain&#39;s DNS zone with a
          specific value. Let&#39;s Encrypt then performs a DNS lookup to verify
          the record exists.
        </p>
        <p>
          HTTP validation is simpler if you have direct access to your web
          server&#39;s file system. DNS validation is required for wildcard
          certificates and is useful when you do not have direct file access to
          the server, such as when using certain hosting providers or CDNs.
        </p>
      </>
    ),
  },
  {
    question: "Are free SSL certificates as secure as paid ones?",
    answer:
      "Yes. The encryption provided by a free DV certificate from Let's Encrypt is identical to that of a paid DV certificate from any commercial Certificate Authority. Both use the same cryptographic standards (RSA 2048-bit or ECDSA P-256 keys, TLS 1.2/1.3 protocols). The padlock icon in the browser is the same regardless of whether the certificate was free or cost hundreds of dollars. The difference between free and paid certificates lies in validation level (DV vs OV/EV), warranty coverage, and customer support. For most websites, blogs, and web applications, a free DV certificate provides all the security you need.",
    content: (
      <p>
        Yes. The encryption provided by a free DV certificate from Let&#39;s
        Encrypt is identical to that of a paid DV certificate from any
        commercial Certificate Authority. Both use the same cryptographic
        standards (RSA 2048-bit or ECDSA P-256 keys, TLS 1.2/1.3 protocols).
        The padlock icon in the browser is the same regardless of whether the
        certificate was free or cost hundreds of dollars. The difference between
        free and paid certificates lies in validation level (DV vs OV/EV),
        warranty coverage, and customer support. For most websites, blogs, and
        web applications, a free DV certificate provides all the security you
        need. See our{" "}
        <Link
          to="/blog/ssl-certificate-types-explained"
          className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
        >
          SSL certificate types comparison
        </Link>{" "}
        for more details.
      </p>
    ),
  },
  {
    question: "What browsers and devices support Let's Encrypt certificates?",
    answer:
      "Let's Encrypt certificates are trusted by virtually all modern browsers and operating systems. This includes Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, Opera, and their mobile counterparts. Android devices running version 7.1.1 or later trust Let's Encrypt directly. Older Android devices (2.3.6 through 7.1.0) also work thanks to a cross-sign arrangement with IdenTrust. The only environments where you might encounter issues are very old systems like Windows XP SP2 or Android 2.x, which represent a negligible fraction of internet traffic. In practice, Let's Encrypt certificates work everywhere your visitors will be browsing.",
    content: (
      <p>
        Let&#39;s Encrypt certificates are trusted by virtually all modern
        browsers and operating systems. This includes Google Chrome, Mozilla
        Firefox, Apple Safari, Microsoft Edge, Opera, and their mobile
        counterparts. Android devices running version 7.1.1 or later trust
        Let&#39;s Encrypt directly. Older Android devices (2.3.6 through 7.1.0)
        also work thanks to a cross-sign arrangement with IdenTrust. The only
        environments where you might encounter issues are very old systems like
        Windows XP SP2 or Android 2.x, which represent a negligible fraction of
        internet traffic. In practice, Let&#39;s Encrypt certificates work
        everywhere your visitors will be browsing.
      </p>
    ),
  },
  {
    question: "What is HSTS and should I enable it?",
    answer:
      "HSTS (HTTP Strict Transport Security) is a security header that tells browsers to only connect to your website over HTTPS, even if the user types http:// or clicks an HTTP link. Once a browser receives an HSTS header, it will automatically upgrade all future requests to HTTPS for the specified duration. You should enable HSTS after you have confirmed your SSL certificate is correctly installed and HTTPS is working properly. Add the header 'Strict-Transport-Security: max-age=31536000; includeSubDomains' to your server configuration. Start with a short max-age value (like 300 seconds) to test, then increase it once you are confident. Be cautious: once HSTS is active, you cannot easily switch back to HTTP without visitors experiencing errors.",
    content: (
      <>
        <p className="mb-2">
          HSTS (HTTP Strict Transport Security) is a security header that tells
          browsers to only connect to your website over HTTPS, even if the user
          types http:// or clicks an HTTP link. Once a browser receives an HSTS
          header, it will automatically upgrade all future requests to HTTPS for
          the specified duration.
        </p>
        <p className="mb-2">
          You should enable HSTS after you have confirmed your SSL certificate is
          correctly installed and HTTPS is working properly. Add the following
          header to your server configuration:
        </p>
        <code className="block rounded bg-neutral-100 px-3 py-2 text-xs font-mono text-neutral-800 mb-2">
          Strict-Transport-Security: max-age=31536000; includeSubDomains
        </code>
        <p>
          Start with a short max-age value (like 300 seconds) to test, then
          increase it once you are confident. Be cautious: once HSTS is active,
          you cannot easily switch back to HTTP without visitors experiencing
          errors. See our{" "}
          <Link
            to="/guides/nginx-ssl"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            Nginx
          </Link>{" "}
          and{" "}
          <Link
            to="/guides/apache-ssl"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            Apache
          </Link>{" "}
          guides for configuration examples.
        </p>
      </>
    ),
  },
  {
    question: "What is mixed content and how do I fix it?",
    answer:
      "Mixed content occurs when an HTTPS page loads sub-resources (images, scripts, stylesheets, iframes) over HTTP. Browsers block or warn about mixed content because it undermines the security of the HTTPS connection. To fix mixed content: update all resource URLs in your HTML, CSS, and JavaScript to use HTTPS or protocol-relative URLs (starting with //). Check for hardcoded http:// URLs in your database (common in WordPress). Use your browser's developer console (F12) to identify which resources are loaded over HTTP. A Content Security Policy header with 'upgrade-insecure-requests' can also help by instructing browsers to automatically upgrade HTTP requests to HTTPS.",
    content: (
      <>
        <p className="mb-2">
          Mixed content occurs when an HTTPS page loads sub-resources (images,
          scripts, stylesheets, iframes) over HTTP. Browsers block or warn about
          mixed content because it undermines the security of the HTTPS
          connection.
        </p>
        <p className="mb-2">To fix mixed content:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Update all resource URLs in your HTML, CSS, and JavaScript to use
            HTTPS or protocol-relative URLs (starting with{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              //
            </code>
            )
          </li>
          <li>
            Check for hardcoded http:// URLs in your database (common in
            WordPress)
          </li>
          <li>
            Use your browser&#39;s developer console (F12) to identify which
            resources are loaded over HTTP
          </li>
          <li>
            Add a Content Security Policy header with{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              upgrade-insecure-requests
            </code>{" "}
            to automatically upgrade HTTP requests to HTTPS
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "What is a certificate chain and why does it matter?",
    answer:
      "A certificate chain (or chain of trust) is the sequence of certificates from your server's certificate up to a trusted root Certificate Authority. It typically consists of three parts: your server certificate (leaf), an intermediate certificate from the CA, and the root certificate (pre-installed in browsers). When freesslcert.net issues your certificate, we provide the CA bundle (intermediate certificate) alongside your server certificate. You must install both on your server. If you only install the leaf certificate without the intermediate, some browsers and devices will show security warnings because they cannot verify the full chain of trust. Always test your installation with an SSL checker tool to verify the chain is complete.",
    content: (
      <>
        <p className="mb-2">
          A certificate chain (or chain of trust) is the sequence of
          certificates from your server&#39;s certificate up to a trusted root
          Certificate Authority. It typically consists of three parts:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 mb-2">
          <li>
            Your <strong className="text-neutral-900">server certificate</strong>{" "}
            (leaf certificate)
          </li>
          <li>
            An{" "}
            <strong className="text-neutral-900">
              intermediate certificate
            </strong>{" "}
            from the CA
          </li>
          <li>
            The{" "}
            <strong className="text-neutral-900">root certificate</strong>{" "}
            (pre-installed in browsers and operating systems)
          </li>
        </ol>
        <p>
          When{" "}
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            freesslcert.net
          </Link>{" "}
          issues your certificate, we provide the CA bundle (intermediate
          certificate) alongside your server certificate. You must install both
          on your server. If you only install the leaf certificate without the
          intermediate, some browsers and devices will show security warnings
          because they cannot verify the full chain of trust. Learn more about
          the ISRG Root X1 trust chain in our{" "}
          <Link
            to="/blog/lets-encrypt-guide"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            Let&#39;s Encrypt guide
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    question: "What is a CSR (Certificate Signing Request)?",
    answer:
      "A CSR (Certificate Signing Request) is a block of encoded text that contains information about the entity requesting the certificate (domain name, organization, country) and the public key that will be included in the certificate. The CSR is generated alongside a private key: the private key stays on your server, while the CSR is sent to the Certificate Authority. With freesslcert.net, the CSR generation is handled automatically as part of the ACME protocol workflow. You do not need to manually generate or submit a CSR. The key pair and certificate request are created during the issuance process, and you receive the final certificate and private key files ready to install.",
    content: (
      <p>
        A CSR (Certificate Signing Request) is a block of encoded text that
        contains information about the entity requesting the certificate (domain
        name, organization, country) and the public key that will be included in
        the certificate. The CSR is generated alongside a private key: the
        private key stays secret, while the CSR is sent to the Certificate
        Authority. With{" "}
        <Link
          to="/"
          className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
        >
          freesslcert.net
        </Link>
        , the CSR generation is handled automatically as part of the ACME
        protocol workflow. You do not need to manually generate or submit a CSR.
        The key pair and certificate request are created during the issuance
        process, and you receive the final certificate and private key files
        ready to install.
      </p>
    ),
  },
  {
    question:
      "What are the different certificate file formats (PEM, PFX/PKCS12, DER)?",
    answer:
      "PEM is the most common format on Linux/Unix servers. Files are Base64-encoded and typically have extensions like .pem, .crt, .cer, or .key. They start with lines like '-----BEGIN CERTIFICATE-----'. PFX (also called PKCS#12 or .p12) is a binary format that bundles the certificate, private key, and intermediate certificates into a single encrypted file. It is commonly used with Windows IIS and Tomcat servers. DER is a binary-encoded format, often used with Java applications. freesslcert.net provides certificates in PEM format, which is the standard for Nginx, Apache, and most web servers. You can convert PEM files to other formats using the OpenSSL command-line tool if needed.",
    content: (
      <>
        <ul className="list-disc pl-5 space-y-2 mb-2">
          <li>
            <strong className="text-neutral-900">PEM</strong> is the most common
            format on Linux/Unix servers. Files are Base64-encoded and typically
            have extensions like{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              .pem
            </code>
            ,{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              .crt
            </code>
            ,{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              .cer
            </code>
            , or{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              .key
            </code>
            . They start with lines like{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              -----BEGIN CERTIFICATE-----
            </code>
            .
          </li>
          <li>
            <strong className="text-neutral-900">PFX/PKCS#12</strong> (
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              .pfx
            </code>{" "}
            or{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              .p12
            </code>
            ) is a binary format that bundles the certificate, private key, and
            intermediate certificates into a single encrypted file. It is
            commonly used with Windows IIS and Tomcat servers.
          </li>
          <li>
            <strong className="text-neutral-900">DER</strong> is a
            binary-encoded format, often used with Java applications.
          </li>
        </ul>
        <p>
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            freesslcert.net
          </Link>{" "}
          provides certificates in PEM format, which is the standard for Nginx,
          Apache, and most web servers. You can convert PEM files to other
          formats using the OpenSSL command-line tool if needed.
        </p>
      </>
    ),
  },
  {
    question: "How do I install my SSL certificate on a web server?",
    answer:
      "The installation process varies by web server software. For the two most popular servers, we provide detailed step-by-step guides. For Nginx, you will need to configure the ssl_certificate and ssl_certificate_key directives in your server block. For Apache, you will configure SSLCertificateFile, SSLCertificateKeyFile, and SSLCertificateChainFile in your VirtualHost configuration. Both guides cover uploading your certificate files, configuring the server, testing the configuration, and enabling HTTPS. Other servers like IIS, Tomcat, or LiteSpeed have their own configuration methods, but the certificate files from freesslcert.net work with all of them.",
    content: (
      <>
        <p className="mb-2">
          The installation process varies by web server software. We provide
          detailed step-by-step guides for the two most popular servers:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mb-2">
          <li>
            <Link
              to="/guides/nginx-ssl"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              How to Install SSL on Nginx
            </Link>{" "}
            &mdash; configure{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              ssl_certificate
            </code>{" "}
            and{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              ssl_certificate_key
            </code>{" "}
            directives
          </li>
          <li>
            <Link
              to="/guides/apache-ssl"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              How to Install SSL on Apache
            </Link>{" "}
            &mdash; configure{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              SSLCertificateFile
            </code>{" "}
            and{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              SSLCertificateKeyFile
            </code>{" "}
            directives
          </li>
        </ul>
        <p>
          Both guides cover uploading your certificate files, configuring the
          server, testing the configuration, and enabling HTTPS. Other servers
          like IIS, Tomcat, or LiteSpeed have their own configuration methods,
          but the certificate files from freesslcert.net work with all of them.
        </p>
      </>
    ),
  },
  {
    question: "How do I renew my SSL certificate before it expires?",
    answer:
      "To renew a Let's Encrypt certificate from freesslcert.net, simply visit the homepage, enter the same domain name, complete domain validation again, and download your new certificate files. Then replace the old certificate files on your server and reload your web server configuration. We recommend starting the renewal process at least 30 days before expiration to give yourself time to handle any issues. Let's Encrypt sends expiration reminder emails to the address used during issuance, and freesslcert.net also offers optional email reminders that you can set up when generating your certificate. The renewal process is identical to the initial issuance process and is completely free.",
    content: (
      <p>
        To renew a Let&#39;s Encrypt certificate, simply{" "}
        <Link
          to="/"
          className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
        >
          visit the homepage
        </Link>
        , enter the same domain name, complete domain validation again, and
        download your new certificate files. Then replace the old certificate
        files on your server and reload your web server configuration. We
        recommend starting the renewal process at least 30 days before expiration
        to give yourself time to handle any issues. Let&#39;s Encrypt sends
        expiration reminder emails to the address used during issuance, and
        freesslcert.net also offers optional email reminders that you can set up
        when generating your certificate. The renewal process is identical to
        the initial issuance process and is completely free.
      </p>
    ),
  },
  {
    question: "Is my private key stored on freesslcert.net servers?",
    answer:
      "Private keys are generated as part of the certificate issuance process and served to you over an encrypted HTTPS connection. They are not permanently stored on our servers. We strongly recommend downloading your certificate files immediately after generation. For maximum security, always treat your private key as confidential: do not share it, do not send it via email, and restrict file permissions on your server so only the web server process can read it. See our Privacy Policy for complete details on how we handle data.",
    content: (
      <p>
        Private keys are generated as part of the certificate issuance process
        and served to you over an encrypted HTTPS connection. They are not
        permanently stored on our servers. We strongly recommend downloading your
        certificate files immediately after generation. For maximum security,
        always treat your private key as confidential: do not share it, do not
        send it via email, and restrict file permissions on your server so only
        the web server process can read it. See our{" "}
        <Link
          to="/privacy"
          className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
        >
          Privacy Policy
        </Link>{" "}
        for complete details on how we handle data.
      </p>
    ),
  },
  {
    question: "Can I use Let's Encrypt certificates for email servers?",
    answer:
      "Yes. Let's Encrypt certificates work with mail servers like Postfix, Dovecot, Exim, and Microsoft Exchange. You can use the same certificate files (PEM format) that you download from freesslcert.net to encrypt SMTP (port 587/465), IMAP (port 993), and POP3 (port 995) connections. The configuration is similar to web servers: point your mail server's SSL configuration to the certificate, private key, and CA bundle files. Keep in mind that the certificate's domain name must match the hostname your mail clients use to connect to the mail server. Wildcard certificates are especially useful for mail servers because they cover all subdomains, including mail.example.com.",
    content: (
      <p>
        Yes. Let&#39;s Encrypt certificates work with mail servers like Postfix,
        Dovecot, Exim, and Microsoft Exchange. You can use the same certificate
        files (PEM format) that you download from freesslcert.net to encrypt
        SMTP (port 587/465), IMAP (port 993), and POP3 (port 995) connections.
        The configuration is similar to web servers: point your mail server&#39;s
        SSL configuration to the certificate, private key, and CA bundle files.
        Keep in mind that the certificate&#39;s domain name must match the
        hostname your mail clients use to connect to the mail server. Wildcard
        certificates are especially useful for mail servers because they cover
        all subdomains, including mail.example.com.
      </p>
    ),
  },
  {
    question: "What should I do if my certificate is not trusted by browsers?",
    answer:
      "If browsers show a 'Not Secure' or 'Certificate Not Trusted' warning after installing your SSL certificate, check these common issues: First, ensure you have installed the intermediate certificate (CA bundle) alongside your server certificate. Missing intermediates are the most common cause of trust errors. Second, verify your certificate has not expired using an online SSL checker. Third, confirm the certificate's domain name matches the URL visitors are using. Fourth, check your server's date and time settings; an incorrect clock can cause validation failures. Fifth, ensure you are not serving mixed content, which can trigger warnings. If problems persist, try generating a new certificate from freesslcert.net and reinstalling it.",
    content: (
      <>
        <p className="mb-2">
          If browsers show a &ldquo;Not Secure&rdquo; or &ldquo;Certificate Not
          Trusted&rdquo; warning after installing your SSL certificate, check
          these common issues:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 mb-2">
          <li>
            Ensure you have installed the{" "}
            <strong className="text-neutral-900">
              intermediate certificate (CA bundle)
            </strong>{" "}
            alongside your server certificate. Missing intermediates are the most
            common cause of trust errors.
          </li>
          <li>
            Verify your certificate has not{" "}
            <strong className="text-neutral-900">expired</strong> using an
            online SSL checker.
          </li>
          <li>
            Confirm the certificate&#39;s{" "}
            <strong className="text-neutral-900">domain name matches</strong>{" "}
            the URL visitors are using.
          </li>
          <li>
            Check your server&#39;s{" "}
            <strong className="text-neutral-900">
              date and time settings
            </strong>
            ; an incorrect clock can cause validation failures.
          </li>
          <li>
            Ensure you are not serving{" "}
            <strong className="text-neutral-900">mixed content</strong>, which
            can trigger warnings.
          </li>
        </ol>
        <p>
          If problems persist, try{" "}
          <Link
            to="/"
            className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
          >
            generating a new certificate
          </Link>{" "}
          and reinstalling it.
        </p>
      </>
    ),
  },
];

const faqSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>
          SSL Certificate FAQ - Common Questions About Free SSL/TLS Certificates
        </title>
        <meta
          name="description"
          content="Answers to common questions about SSL/TLS certificates, Let's Encrypt, wildcard certs, SAN certificates, HSTS, certificate chains, renewal, and more."
        />
        <link rel="canonical" href="https://freesslcert.net/faq" />
      </Helmet>
      <StructuredData data={faqSchema} />

      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-150 mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
        Frequently Asked Questions
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        Everything you need to know about SSL/TLS certificates and freesslcert.net
      </p>

      <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
        <Accordion className="space-y-2">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={`faq-${index}`}
              value={`faq-${index}`}
              className="rounded-lg border border-neutral-200/60 px-4 data-open:bg-neutral-50/50"
            >
              <AccordionTrigger className="text-sm font-medium text-neutral-900 hover:no-underline py-3 text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-neutral-500 leading-relaxed pb-3">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <section className="rounded-lg border border-neutral-200/60 bg-neutral-50/50 p-5 mt-8">
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Still have questions?
          </h2>
          <p className="mb-3">
            If your question is not answered above, you can{" "}
            <Link
              to="/"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              generate your certificate now
            </Link>{" "}
            and follow the guided process, check our installation guides for{" "}
            <Link
              to="/guides/nginx-ssl"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              Nginx
            </Link>{" "}
            and{" "}
            <Link
              to="/guides/apache-ssl"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              Apache
            </Link>
            , or read our{" "}
            <Link
              to="/blog"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              blog
            </Link>{" "}
            for in-depth articles on SSL certificates and HTTPS security.
          </p>
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors duration-150"
          >
            Generate a Free SSL Certificate
          </Link>
        </section>
      </div>
    </div>
  );
}
