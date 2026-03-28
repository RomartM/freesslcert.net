import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <Helmet>
        <title>Page Not Found | freesslcert.net</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist. Generate free SSL certificates at freesslcert.net."
        />
        <meta name="robots" content="noindex, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://freesslcert.net/" />
        <meta
          property="og:title"
          content="Page Not Found | freesslcert.net"
        />
        <meta
          property="og:description"
          content="The page you're looking for doesn't exist. Generate free SSL certificates at freesslcert.net."
        />
        <meta
          property="og:image"
          content="https://freesslcert.net/og-image.svg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://freesslcert.net/" />
        <meta
          name="twitter:title"
          content="Page Not Found | freesslcert.net"
        />
        <meta
          name="twitter:description"
          content="The page you're looking for doesn't exist. Generate free SSL certificates at freesslcert.net."
        />
        <meta
          name="twitter:image"
          content="https://freesslcert.net/og-image.svg"
        />
      </Helmet>

      <h1 className="text-6xl font-bold text-neutral-200">404</h1>
      <p className="mt-4 text-neutral-500">Page not found</p>
      <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700">
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>
    </div>
  );
}
