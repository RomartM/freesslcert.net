import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-6 sm:flex-row sm:justify-between">
        <p className="text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} freesslcert.net &middot; Powered by{" "}
          <a
            href="https://letsencrypt.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-neutral-900"
          >
            Let&apos;s Encrypt
          </a>
        </p>
        <nav className="flex items-center gap-4" aria-label="Footer navigation">
          <Link
            to="/privacy"
            className="text-xs text-neutral-500 underline-offset-2 transition-colors hover:text-neutral-900 hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-xs text-neutral-500 underline-offset-2 transition-colors hover:text-neutral-900 hover:underline"
          >
            Terms of Use
          </Link>
        </nav>
      </div>
    </footer>
  );
}
