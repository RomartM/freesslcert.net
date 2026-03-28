import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/hooks/useLocalePath";

export function Footer() {
  const { t } = useTranslation();
  const localePath = useLocalePath();

  return (
    <footer className="border-t border-neutral-100">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 py-6 sm:flex-row sm:justify-between">
        <p className="text-xs text-neutral-400">
          {t("footer.copyright", { year: new Date().getFullYear() })}{" "}
          <a
            href="https://letsencrypt.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-600 transition-colors duration-150"
          >
            {t("footer.letsEncrypt")}
          </a>
        </p>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center" aria-label="Footer">
          <Link to={localePath("/about")} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            {t("nav.about")}
          </Link>
          <Link to={localePath("/blog")} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            {t("nav.blog")}
          </Link>
          <Link to={localePath("/faq")} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            {t("nav.faq")}
          </Link>
          <Link to={localePath("/ssl-checker")} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            {t("nav.sslChecker")}
          </Link>
          <Link to={localePath("/ssl-vs-tls")} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            {t("nav.sslVsTls")}
          </Link>
          <Link to={localePath("/guides/nginx-ssl")} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            {t("nav.nginxGuide")}
          </Link>
          <Link to={localePath("/guides/apache-ssl")} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            {t("nav.apacheGuide")}
          </Link>
          <Link to={localePath("/guides/wordpress-ssl")} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            {t("nav.wordpressGuide")}
          </Link>
          <Link to={localePath("/guides/nodejs-ssl")} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            {t("nav.nodejsGuide")}
          </Link>
          <Link to={localePath("/privacy")} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            {t("nav.privacy")}
          </Link>
          <Link to={localePath("/terms")} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150">
            {t("nav.terms")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
