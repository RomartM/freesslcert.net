import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-neutral-100">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 py-6 sm:flex-row sm:justify-between">
        <p className="text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} freesslcert.net &middot; Powered by{" "}
          <a
            href="https://letsencrypt.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-600 transition-colors duration-150"
          >
            Let&apos;s Encrypt
          </a>
        </p>
        <nav className="flex items-center gap-4" aria-label="Footer">
          <Link to="/privacy" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            Privacy
          </Link>
          <Link to="/terms" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
