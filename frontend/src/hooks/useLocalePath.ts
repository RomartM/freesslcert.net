import { useParams } from "react-router-dom";
import { isSupportedLanguage, DEFAULT_LANGUAGE } from "@/i18n";
import { ensureTrailingSlash } from "@/hooks/useLocaleUrl";

/**
 * Returns a function that prepends the current locale prefix to a path
 * and guarantees the returned path ends with a trailing slash (except for
 * the bare root "/").
 *
 * Trailing slashes are required because Cloudflare Pages serves pre-rendered
 * pages from directory-style paths (e.g., /about/ -> dist/about/index.html).
 * Without the trailing slash, CF Pages issues a 308 redirect.
 *
 * Usage:
 *   const localePath = useLocalePath();
 *   <Link to={localePath("/about")} />
 *   // On /es/faq -> returns "/es/about/"
 *   // On /faq    -> returns "/about/"
 */
export function useLocalePath(): (path: string) => string {
  const { lang } = useParams<{ lang?: string }>();

  const currentLang =
    lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;

  return (path: string): string => {
    const normalizedPath = ensureTrailingSlash(path);
    if (currentLang === DEFAULT_LANGUAGE) {
      return normalizedPath;
    }
    return normalizedPath === "/"
      ? `/${currentLang}/`
      : `/${currentLang}${normalizedPath}`;
  };
}
