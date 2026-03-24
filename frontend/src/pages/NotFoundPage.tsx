import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-neutral-200">404</h1>
      <p className="mt-4 text-neutral-500">Page not found</p>
      <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700">
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>
    </div>
  );
}
