import { useParams } from "react-router-dom";
import {
  isSupportedLanguage,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "@/i18n";

const BASE_URL = "https://freesslcert.net";

/**
 * Ensures the given path ends with a trailing slash.
 * Root ("/") is returned unchanged. Paths that already end with "/" are
 * returned unchanged. All other paths get a trailing slash appended.
 *
 * This is used to canonicalize every URL in the app to the trailing-slash
 * form, matching Cloudflare Pages' default behavior for pre-rendered
 * directory structures (e.g., dist/about/index.html is served at /about/).
 */
export function ensureTrailingSlash(path: string): string {
  if (path === "/" || path.endsWith("/")) {
    return path;
  }
  return `${path}/`;
}

/**
 * Returns the current language resolved from the URL.
 */
export function useCurrentLanguage(): string {
  const { lang } = useParams<{ lang?: string }>();
  return lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
}

/**
 * Returns the full canonical URL for the current page, locale-aware.
 * Always includes a trailing slash (except the bare root is still "/").
 * English pages: https://freesslcert.net/about/
 * Other locales: https://freesslcert.net/es/about/
 */
export function useCanonicalUrl(pagePath: string): string {
  const currentLang = useCurrentLanguage();
  const normalizedPath = ensureTrailingSlash(pagePath);

  if (currentLang === DEFAULT_LANGUAGE) {
    return `${BASE_URL}${normalizedPath}`;
  }
  return normalizedPath === "/"
    ? `${BASE_URL}/${currentLang}/`
    : `${BASE_URL}/${currentLang}${normalizedPath}`;
}

/**
 * Returns hreflang alternate URLs for all supported languages.
 * Used in Helmet to declare language variants. All URLs are returned with
 * trailing slashes to match the canonicalization strategy.
 */
export function useHreflangUrls(pagePath: string): Array<{
  hreflang: string;
  href: string;
}> {
  const normalizedPath = ensureTrailingSlash(pagePath);
  const alternates: Array<{ hreflang: string; href: string }> = [];

  for (const lang of SUPPORTED_LANGUAGES) {
    if (lang === DEFAULT_LANGUAGE) {
      alternates.push({
        hreflang: lang,
        href: `${BASE_URL}${normalizedPath}`,
      });
    } else {
      alternates.push({
        hreflang: lang,
        href:
          normalizedPath === "/"
            ? `${BASE_URL}/${lang}/`
            : `${BASE_URL}/${lang}${normalizedPath}`,
      });
    }
  }

  // x-default points to English
  alternates.push({
    hreflang: "x-default",
    href: `${BASE_URL}${normalizedPath}`,
  });

  return alternates;
}
