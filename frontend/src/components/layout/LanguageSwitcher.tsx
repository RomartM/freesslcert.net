import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Globe } from "lucide-react";
import {
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  DEFAULT_LANGUAGE,
} from "@/i18n";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ lang?: string }>();

  const currentLang = i18n.language;

  function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLang = e.target.value;
    if (!isSupportedLanguage(newLang)) return;

    // Determine the current path without language prefix
    let pathWithoutLang = location.pathname;
    if (params.lang && isSupportedLanguage(params.lang)) {
      // Remove the current language prefix: /es/about -> /about
      pathWithoutLang = pathWithoutLang.replace(`/${params.lang}`, "") || "/";
    }

    // Build the new path
    let newPath: string;
    if (newLang === DEFAULT_LANGUAGE) {
      // English: no prefix
      newPath = pathWithoutLang;
    } else {
      // Other languages: add prefix
      newPath =
        pathWithoutLang === "/" ? `/${newLang}` : `/${newLang}${pathWithoutLang}`;
    }

    // Preserve search params and hash
    const newUrl = `${newPath}${location.search}${location.hash}`;

    i18n.changeLanguage(newLang);
    navigate(newUrl);
  }

  return (
    <div className="flex items-center gap-1.5">
      <Globe className="size-4 text-neutral-400" aria-hidden="true" />
      <select
        value={currentLang}
        onChange={handleLanguageChange}
        aria-label={t("languageSwitcher.selectLanguage")}
        className="appearance-none bg-transparent text-xs font-medium text-neutral-600 cursor-pointer
          border border-neutral-200 rounded-md px-2 py-1.5
          hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          transition-colors duration-150"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {t(`language.${lang}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
