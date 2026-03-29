import { useParams } from "react-router-dom";
import {
  isSupportedLanguage,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "@/i18n";

const BASE_URL = "https://freesslcert.net";

/**
 * Returns the current language resolved from the URL.
 */
export function useCurrentLanguage(): string {
  const { lang } = useParams<{ lang?: string }>();
  return lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
}

/**
 * Returns the full canonical URL for the current page, locale-aware.
 * English pages: https://freesslcert.net/about
 * Other locales: https://freesslcert.net/es/about
 */
export function useCanonicalUrl(pagePath: string): string {
  const currentLang = useCurrentLanguage();

  if (currentLang === DEFAULT_LANGUAGE) {
    return `${BASE_URL}${pagePath}`;
  }
  return pagePath === "/"
    ? `${BASE_URL}/${currentLang}/`
    : `${BASE_URL}/${currentLang}${pagePath}`;
}

/**
 * Returns hreflang alternate URLs for all supported languages.
 * Used in Helmet to declare language variants.
 */
export function useHreflangUrls(pagePath: string): Array<{
  hreflang: string;
  href: string;
}> {
  const alternates: Array<{ hreflang: string; href: string }> = [];

  for (const lang of SUPPORTED_LANGUAGES) {
    if (lang === DEFAULT_LANGUAGE) {
      alternates.push({
        hreflang: lang,
        href: `${BASE_URL}${pagePath}`,
      });
    } else {
      alternates.push({
        hreflang: lang,
        href:
          pagePath === "/"
            ? `${BASE_URL}/${lang}/`
            : `${BASE_URL}/${lang}${pagePath}`,
      });
    }
  }

  // x-default points to English
  alternates.push({
    hreflang: "x-default",
    href: `${BASE_URL}${pagePath}`,
  });

  return alternates;
}
