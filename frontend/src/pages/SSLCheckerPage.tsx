import { useState, useCallback } from "react";
import {
  ArrowLeft,
  Search,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  Clock,
  Globe,
  Lock,
  Layers,
  CalendarCheck,
  CalendarX,
  Fingerprint,
  Server,
  Loader2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StructuredData } from "@/components/seo/StructuredData";
import type { JsonLdSchema } from "@/components/seo/StructuredData";
import { sslCheckApi } from "@/api/ssl-check";
import type {
  SSLCheckResponse,
  SSLCheckStatus,
  SSLChainEntry,
} from "@/types/ssl-check";

const webAppSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free SSL Certificate Checker",
  description:
    "Check any website's SSL/TLS certificate status, expiration date, issuer, and configuration. Identify common SSL problems like expired certificates, self-signed certificates, and incomplete certificate chains.",
  url: "https://freesslcert.net/ssl-checker",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const breadcrumbSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://freesslcert.net",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "SSL Checker",
      item: "https://freesslcert.net/ssl-checker",
    },
  ],
};

/**
 * Strips protocol, path, port, and whitespace from user input,
 * leaving only the bare domain name.
 */
function sanitizeDomain(input: string): string {
  let domain = input.trim();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/\/.*$/, "");
  domain = domain.replace(/[?#].*$/, "");
  // Strip port
  const portMatch = domain.match(/^(.+):\d+$/);
  if (portMatch) {
    domain = portMatch[1];
  }
  return domain.toLowerCase().trim();
}

/**
 * Basic client-side validation that the string looks like a domain name.
 */
function isValidDomain(domain: string): boolean {
  return /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(
    domain
  );
}

/**
 * Returns a human-readable label for an SSL check status.
 */
function getStatusLabel(status: SSLCheckStatus): string {
  const labels: Record<SSLCheckStatus, string> = {
    valid: "Valid",
    expired: "Expired",
    not_yet_valid: "Not Yet Valid",
    invalid: "Invalid",
    self_signed: "Self-Signed",
    error: "Error",
  };
  return labels[status];
}

/**
 * Returns Tailwind classes for the status badge background and text color.
 */
function getStatusClasses(status: SSLCheckStatus): string {
  switch (status) {
    case "valid":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "expired":
    case "invalid":
    case "self_signed":
      return "bg-red-50 text-red-700 ring-red-600/20";
    case "not_yet_valid":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "error":
      return "bg-neutral-100 text-neutral-700 ring-neutral-600/20";
  }
}

/**
 * Returns Tailwind classes for the days-remaining indicator.
 */
function getDaysRemainingClasses(days: number): string {
  if (days <= 0) return "text-red-600";
  if (days <= 7) return "text-red-600";
  if (days <= 30) return "text-amber-600";
  return "text-green-600";
}

/**
 * Returns a human-readable label for how many days until expiry.
 */
function getDaysRemainingLabel(days: number): string {
  if (days <= 0) return "Expired";
  if (days === 1) return "1 day";
  return `${days} days`;
}

/**
 * Formats an ISO date string to a localized readable date.
 */
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats an ISO date string to a shorter form for the chain table.
 */
function formatDateShort(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StatusBadgeProps {
  status: SSLCheckStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(status)}`}
    >
      {status === "valid" ? (
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
      ) : status === "error" ? (
        <AlertTriangle className="size-3.5" aria-hidden="true" />
      ) : (
        <XCircle className="size-3.5" aria-hidden="true" />
      )}
      {getStatusLabel(status)}
    </span>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
  subValue?: string;
}

function StatCard({ icon, label, value, valueClassName, subValue }: StatCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200/60 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-neutral-400">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          {label}
        </span>
      </div>
      <p className={`text-sm font-semibold text-neutral-900 ${valueClassName ?? ""}`}>
        {value}
      </p>
      {subValue && (
        <p className="mt-0.5 text-xs text-neutral-500">{subValue}</p>
      )}
    </div>
  );
}

interface CertificateChainProps {
  chain: SSLChainEntry[];
}

function CertificateChain({ chain }: CertificateChainProps) {
  if (chain.length === 0) return null;

  return (
    <div className="rounded-lg border border-neutral-200/60 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
        <Layers className="size-4 text-neutral-400" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-neutral-900">
          Certificate Chain
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-500">
              <th className="px-4 py-2.5 font-medium">#</th>
              <th className="px-4 py-2.5 font-medium">Subject</th>
              <th className="px-4 py-2.5 font-medium">Issuer</th>
              <th className="px-4 py-2.5 font-medium">Valid From</th>
              <th className="px-4 py-2.5 font-medium">Valid Until</th>
            </tr>
          </thead>
          <tbody>
            {chain.map((entry, index) => (
              <tr
                key={`chain-${entry.subject}-${index}`}
                className="border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/50 transition-colors"
              >
                <td className="px-4 py-2.5 text-neutral-400 font-mono">
                  {index + 1}
                </td>
                <td className="px-4 py-2.5 text-neutral-900 font-medium">
                  {entry.subject || "N/A"}
                </td>
                <td className="px-4 py-2.5 text-neutral-600">
                  {entry.issuer || "N/A"}
                </td>
                <td className="px-4 py-2.5 text-neutral-600 whitespace-nowrap">
                  {formatDateShort(entry.validFrom)}
                </td>
                <td className="px-4 py-2.5 text-neutral-600 whitespace-nowrap">
                  {formatDateShort(entry.validUntil)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SANsListProps {
  sans: string[];
}

function SANsList({ sans }: SANsListProps) {
  if (sans.length === 0) return null;

  return (
    <div className="rounded-lg border border-neutral-200/60 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
        <Globe className="size-4 text-neutral-400" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-neutral-900">
          Subject Alternative Names ({sans.length})
        </h3>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {sans.map((san) => (
            <span
              key={san}
              className="inline-flex items-center rounded-md bg-neutral-50 px-2.5 py-1 text-xs font-mono text-neutral-700 ring-1 ring-inset ring-neutral-200/80"
            >
              {san}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ResultsDisplayProps {
  result: SSLCheckResponse;
}

function ResultsDisplay({ result }: ResultsDisplayProps) {
  const cert = result.certificate;
  const isError = result.status === "error";
  const isExpiredOrInvalid =
    result.status === "expired" ||
    result.status === "invalid" ||
    result.status === "self_signed";

  // Error state: no certificate data available
  if (isError || !cert) {
    return (
      <div className="rounded-xl border border-red-200/60 bg-red-50/30 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <ShieldX className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-neutral-900">
              Could not check SSL certificate
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              {result.error ?? "An unknown error occurred while checking the SSL certificate."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors duration-150"
              >
                Generate a Free Certificate
              </Link>
              <a
                href={`https://${result.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
              >
                Visit {result.domain}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full result display
  const headerBorderColor = result.valid
    ? "border-green-200/60"
    : "border-red-200/60";
  const headerBg = result.valid ? "bg-green-50/30" : "bg-red-50/30";
  const headerIconBg = result.valid ? "bg-green-100" : "bg-red-100";
  const headerIconColor = result.valid ? "text-green-600" : "text-red-600";
  const HeaderIcon = result.valid ? ShieldCheck : ShieldAlert;

  const issuerDisplay =
    cert.issuer.organization || cert.issuer.commonName || "Unknown";

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div
        className={`rounded-xl border ${headerBorderColor} ${headerBg} p-5 shadow-sm`}
      >
        <div className="flex items-start gap-3 sm:items-center">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${headerIconBg} ${headerIconColor}`}
          >
            <HeaderIcon className="size-5" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-neutral-900 truncate">
                {result.domain}
              </h3>
              <StatusBadge status={result.status} />
            </div>
            <p className="text-sm text-neutral-500">
              {result.valid
                ? `Certificate is valid and trusted. Issued by ${issuerDisplay}.`
                : result.status === "expired"
                  ? `Certificate expired on ${formatDate(cert.validUntil)}.`
                  : result.status === "self_signed"
                    ? "Certificate is self-signed and not trusted by browsers."
                    : `Certificate is ${getStatusLabel(result.status).toLowerCase()}. Issued by ${issuerDisplay}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<Clock className="size-4" aria-hidden="true" />}
          label="Expires In"
          value={getDaysRemainingLabel(cert.daysUntilExpiry)}
          valueClassName={getDaysRemainingClasses(cert.daysUntilExpiry)}
          subValue={formatDate(cert.validUntil)}
        />
        <StatCard
          icon={<Lock className="size-4" aria-hidden="true" />}
          label="Protocol"
          value={cert.protocol}
        />
        <StatCard
          icon={<Fingerprint className="size-4" aria-hidden="true" />}
          label="Signature"
          value={cert.signatureAlgorithm}
        />
        <StatCard
          icon={<CalendarCheck className="size-4" aria-hidden="true" />}
          label="Valid From"
          value={formatDate(cert.validFrom)}
        />
        <StatCard
          icon={<CalendarX className="size-4" aria-hidden="true" />}
          label="Valid Until"
          value={formatDate(cert.validUntil)}
        />
        <StatCard
          icon={<Server className="size-4" aria-hidden="true" />}
          label="Issuer"
          value={issuerDisplay}
        />
      </div>

      {/* Certificate Details */}
      <div className="rounded-lg border border-neutral-200/60 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
          <ShieldCheck className="size-4 text-neutral-400" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-neutral-900">
            Certificate Details
          </h3>
        </div>
        <dl className="divide-y divide-neutral-100 text-sm">
          <DetailRow label="Common Name (CN)" value={cert.commonName || "N/A"} />
          <DetailRow label="Serial Number" value={cert.serialNumber} mono />
          <DetailRow
            label="Issuer Organization"
            value={cert.issuer.organization || "N/A"}
          />
          <DetailRow
            label="Issuer Common Name"
            value={cert.issuer.commonName || "N/A"}
          />
          <DetailRow
            label="Signature Algorithm"
            value={cert.signatureAlgorithm}
          />
          <DetailRow label="TLS Version" value={cert.protocol} />
        </dl>
      </div>

      {/* SANs */}
      {cert.sans && cert.sans.length > 0 && <SANsList sans={cert.sans} />}

      {/* Certificate Chain */}
      {result.chain && result.chain.length > 0 && (
        <CertificateChain chain={result.chain} />
      )}

      {/* CTA for invalid/expired certificates */}
      {isExpiredOrInvalid && (
        <div className="rounded-lg border border-amber-200/60 bg-amber-50/30 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="size-5 shrink-0 text-amber-500 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">
                {result.status === "expired"
                  ? "This certificate has expired"
                  : result.status === "self_signed"
                    ? "This certificate is self-signed"
                    : "This certificate has issues"}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                {result.status === "expired"
                  ? "Visitors will see a security warning in their browser. Generate a new free SSL certificate to fix this."
                  : result.status === "self_signed"
                    ? "Self-signed certificates are not trusted by browsers. Replace it with a free certificate from a trusted CA."
                    : "The certificate could not be validated. Consider generating a new free SSL certificate."}
              </p>
              <Link
                to="/"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors duration-150"
              >
                Generate a Free Certificate
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  mono?: boolean;
}

function DetailRow({ label, value, mono }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      <dt className="text-neutral-500 sm:w-44 shrink-0 font-medium">{label}</dt>
      <dd
        className={`text-neutral-900 break-all ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function ResultsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-hidden="true">
      {/* Header skeleton */}
      <div className="rounded-xl border border-neutral-200/60 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-neutral-200" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 rounded bg-neutral-200" />
            <div className="h-4 w-72 rounded bg-neutral-100" />
          </div>
        </div>
      </div>
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`skel-stat-${i}`}
            className="rounded-lg border border-neutral-200/60 bg-white p-4 shadow-sm"
          >
            <div className="h-3 w-20 rounded bg-neutral-100 mb-3" />
            <div className="h-5 w-24 rounded bg-neutral-200" />
          </div>
        ))}
      </div>
      {/* Details skeleton */}
      <div className="rounded-lg border border-neutral-200/60 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
          <div className="h-4 w-40 rounded bg-neutral-200" />
        </div>
        <div className="divide-y divide-neutral-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`skel-row-${i}`} className="flex gap-4 px-4 py-3">
              <div className="h-4 w-32 rounded bg-neutral-100" />
              <div className="h-4 w-48 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function SSLCheckerPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SSLCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const sanitized = sanitizeDomain(domain);
      if (!sanitized) {
        setError("Please enter a domain name.");
        setResult(null);
        return;
      }

      if (!isValidDomain(sanitized)) {
        setError(
          `"${sanitized}" does not look like a valid domain name. Enter a domain like example.com.`
        );
        setResult(null);
        return;
      }

      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const data = await sslCheckApi.check(sanitized);
        setResult(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [domain]
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>
          Free SSL Certificate Checker - Check SSL Certificate Status |
          freesslcert.net
        </title>
        <meta
          name="description"
          content="Check any website's SSL certificate status for free. Verify expiration dates, certificate chain, issuer details, and identify common SSL problems like mixed content and hostname mismatches."
        />
        <link rel="canonical" href="https://freesslcert.net/ssl-checker" />
      </Helmet>
      <StructuredData data={[webAppSchema, breadcrumbSchema]} />

      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-150 mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
        Free SSL Certificate Checker
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        Check the SSL/TLS certificate status of any website
      </p>

      {/* Checker Form */}
      <section className="rounded-xl border border-neutral-200/60 bg-white p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-neutral-900">
              Check SSL Certificate
            </h2>
            <p className="text-xs text-neutral-500">
              Enter a domain name to inspect its SSL certificate
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="ssl-checker-domain" className="sr-only">
            Domain name
          </label>
          <input
            id="ssl-checker-domain"
            type="text"
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              if (error) setError(null);
            }}
            placeholder="example.com"
            className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors duration-150"
            autoComplete="off"
            spellCheck={false}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Search className="size-4" aria-hidden="true" />
            )}
            {loading ? "Checking..." : "Check SSL"}
          </button>
        </form>

        {/* Inline error */}
        {error && !result && (
          <div
            className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
            role="alert"
          >
            <XCircle
              className="size-4 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
        )}

        {!error && !result && !loading && (
          <p className="mt-3 text-xs text-neutral-400">
            Enter a domain like{" "}
            <button
              type="button"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              onClick={() => setDomain("google.com")}
            >
              google.com
            </button>{" "}
            or{" "}
            <button
              type="button"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              onClick={() => setDomain("freesslcert.net")}
            >
              freesslcert.net
            </button>{" "}
            to inspect its SSL certificate.
          </p>
        )}
      </section>

      {/* Loading State */}
      {loading && (
        <section className="mb-10" aria-live="polite" aria-busy="true">
          <div className="flex items-center gap-2 mb-4 text-sm text-neutral-500">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            <span>
              Connecting to <strong className="text-neutral-700">{sanitizeDomain(domain)}</strong> and inspecting its SSL certificate...
            </span>
          </div>
          <ResultsSkeleton />
        </section>
      )}

      {/* Results */}
      {result && !loading && (
        <section className="mb-10" aria-live="polite">
          <ResultsDisplay result={result} />
        </section>
      )}

      <div className="space-y-8 text-sm text-neutral-600 leading-relaxed">
        {/* What Does an SSL Checker Do? */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            What Does an SSL Checker Do?
          </h2>
          <p className="mb-3">
            An SSL checker connects to a website&#39;s server, retrieves its
            SSL/TLS certificate, and analyzes the certificate for potential
            problems. It performs the same verification steps that a web
            browser does when you visit an HTTPS website, but presents the
            results in a detailed, human-readable format.
          </p>
          <p>
            Unlike a browser that simply shows a padlock or a warning, an SSL
            checker gives you specific information about the certificate and
            its configuration. This is valuable for website administrators who
            need to diagnose SSL problems, verify that a certificate
            installation was successful, or monitor certificate expiration
            dates.
          </p>
        </section>

        {/* What Information Can You Learn */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            What Information Can You Learn from Checking SSL?
          </h2>
          <p className="mb-3">
            When you check a website&#39;s SSL certificate, you can learn:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-neutral-900">Certificate validity</strong>{" "}
              &mdash; Whether the certificate is currently valid, expired, or
              not yet active
            </li>
            <li>
              <strong className="text-neutral-900">Expiration date</strong>{" "}
              &mdash; When the certificate expires and how many days remain
            </li>
            <li>
              <strong className="text-neutral-900">Issuer</strong> &mdash; The
              Certificate Authority (CA) that issued the certificate (e.g.,
              Let&#39;s Encrypt, DigiCert, Comodo)
            </li>
            <li>
              <strong className="text-neutral-900">Domain coverage</strong>{" "}
              &mdash; Which domain names are covered by the certificate
              (including Subject Alternative Names)
            </li>
            <li>
              <strong className="text-neutral-900">Certificate chain</strong>{" "}
              &mdash; Whether the full chain of trust is properly configured
              from the server certificate through intermediate certificates to
              the root CA
            </li>
            <li>
              <strong className="text-neutral-900">Protocol support</strong>{" "}
              &mdash; Which{" "}
              <Link
                to="/ssl-vs-tls"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                TLS versions
              </Link>{" "}
              the server supports (TLS 1.2, TLS 1.3, or deprecated versions)
            </li>
            <li>
              <strong className="text-neutral-900">Cipher suites</strong>{" "}
              &mdash; The encryption algorithms the server offers and whether
              they are considered secure
            </li>
            <li>
              <strong className="text-neutral-900">Key size</strong> &mdash;
              The bit length of the certificate&#39;s public key (2048-bit RSA
              or 256-bit ECDSA are standard)
            </li>
          </ul>
        </section>

        {/* Common SSL Certificate Problems */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Common SSL Certificate Problems
          </h2>
          <p className="mb-3">
            An SSL checker can identify several common issues that cause
            browser warnings or security vulnerabilities:
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Expired Certificate
          </h3>
          <p className="mb-3">
            The most common SSL problem. When a certificate expires, browsers
            display a full-page warning that blocks visitors from accessing
            your site. Let&#39;s Encrypt certificates expire after 90 days,
            so timely renewal is critical. You can{" "}
            <Link
              to="/"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              generate a new free certificate on freesslcert.net
            </Link>{" "}
            at any time.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Self-Signed Certificate
          </h3>
          <p className="mb-3">
            A self-signed certificate is not issued by a trusted Certificate
            Authority. Browsers do not trust these certificates and will show
            a security warning. Self-signed certificates are only appropriate
            for local development or internal testing. For production websites,
            always use a certificate from a trusted CA like Let&#39;s Encrypt.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Hostname Mismatch
          </h3>
          <p className="mb-3">
            This error occurs when the domain name in the browser does not
            match any of the domain names listed in the certificate. For
            example, if your certificate covers{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              example.com
            </code>{" "}
            but a visitor accesses{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              www.example.com
            </code>
            , they will see a mismatch warning. The solution is to generate a
            certificate that covers all the domain names your site uses,
            including the{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
              www
            </code>{" "}
            subdomain.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Incomplete Certificate Chain
          </h3>
          <p className="mb-3">
            An incomplete chain means the server is not sending the
            intermediate certificates needed for browsers to verify the trust
            path to the root CA. While most desktop browsers can work around
            this by fetching the missing intermediates, mobile browsers and
            other clients often cannot. Always include the CA bundle when
            installing your certificate. See our installation guides for{" "}
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
            , or{" "}
            <Link
              to="/guides/wordpress-ssl"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              WordPress
            </Link>{" "}
            for detailed instructions.
          </p>

          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 mb-2 mt-4">
            Weak Cipher Suite
          </h3>
          <p>
            Older cipher suites like RC4, DES, and 3DES have known
            vulnerabilities and should be disabled. Modern servers should only
            offer AEAD cipher suites (AES-GCM, ChaCha20-Poly1305) with TLS
            1.2 or TLS 1.3. Read our{" "}
            <Link
              to="/ssl-vs-tls"
              className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
            >
              SSL vs TLS comparison
            </Link>{" "}
            for details on protocol versions and cipher suites.
          </p>
        </section>

        {/* How to Fix Common SSL Issues */}
        <section>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            How to Fix Common SSL Issues
          </h2>
          <p className="mb-3">
            If an SSL check reveals problems with your certificate, here are
            the most common fixes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-neutral-900">
                Expired certificate
              </strong>{" "}
              &mdash;{" "}
              <Link
                to="/"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                Generate a new free certificate
              </Link>{" "}
              and install it on your server. Consider setting up email
              reminders for future renewals.
            </li>
            <li>
              <strong className="text-neutral-900">
                Self-signed certificate
              </strong>{" "}
              &mdash; Replace it with a certificate from a trusted CA.
              Let&#39;s Encrypt certificates are free and trusted by all major
              browsers.
            </li>
            <li>
              <strong className="text-neutral-900">
                Hostname mismatch
              </strong>{" "}
              &mdash; Generate a new certificate that includes all the domain
              names your site uses. Include both{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                example.com
              </code>{" "}
              and{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                www.example.com
              </code>
              , or use a wildcard certificate.
            </li>
            <li>
              <strong className="text-neutral-900">
                Incomplete chain
              </strong>{" "}
              &mdash; Install the CA bundle (intermediate certificate)
              alongside your server certificate. The{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">
                ca_bundle.crt
              </code>{" "}
              file from freesslcert.net contains the necessary intermediates.
            </li>
            <li>
              <strong className="text-neutral-900">
                Weak cipher suites
              </strong>{" "}
              &mdash; Update your server configuration to disable legacy
              ciphers and enable only TLS 1.2+ with AEAD cipher suites. See
              our{" "}
              <Link
                to="/guides/nginx-ssl"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                Nginx
              </Link>{" "}
              or{" "}
              <Link
                to="/guides/apache-ssl"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                Apache
              </Link>{" "}
              guides for recommended cipher configurations.
            </li>
            <li>
              <strong className="text-neutral-900">
                Mixed content
              </strong>{" "}
              &mdash; Update all internal links and resource URLs to use HTTPS.
              Check your HTML, CSS, and JavaScript for hardcoded HTTP URLs. See
              our{" "}
              <Link
                to="/faq"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors duration-150"
              >
                FAQ on mixed content
              </Link>{" "}
              for detailed guidance.
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="rounded-lg border border-neutral-200/60 bg-neutral-50/50 p-5">
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Need a New SSL Certificate?
          </h2>
          <p className="mb-3">
            If your SSL check reveals an expired, self-signed, or misconfigured
            certificate, you can get a free replacement in minutes from
            freesslcert.net. Our certificates are issued by Let&#39;s Encrypt
            and are trusted by all major browsers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors duration-150"
            >
              Generate a Free Certificate
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
            >
              Read the FAQ
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
