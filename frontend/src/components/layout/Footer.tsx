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
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center" aria-label="Footer">
          <Link to="/about" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            About
          </Link>
          <Link to="/faq" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            FAQ
          </Link>
          <Link to="/ssl-checker" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            SSL Checker
          </Link>
          <Link to="/ssl-vs-tls" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            SSL vs TLS
          </Link>
          <Link to="/guides/nginx-ssl" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            Nginx Guide
          </Link>
          <Link to="/guides/apache-ssl" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            Apache Guide
          </Link>
          <Link to="/guides/wordpress-ssl" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            WordPress Guide
          </Link>
          <Link to="/guides/nodejs-ssl" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            Node.js Guide
          </Link>
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
