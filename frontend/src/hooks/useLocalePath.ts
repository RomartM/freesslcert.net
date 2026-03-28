import { useParams } from "react-router-dom";
import { isSupportedLanguage, DEFAULT_LANGUAGE } from "@/i18n";

/**
 * Returns a function that prepends the current locale prefix to a path.
 * For English (default), no prefix is added.
 *
 * Usage:
 *   const localePath = useLocalePath();
 *   <Link to={localePath("/about")} />
 *   // On /es/faq -> returns "/es/about"
 *   // On /faq    -> returns "/about"
 */
export function useLocalePath(): (path: string) => string {
  const { lang } = useParams<{ lang?: string }>();

  const currentLang =
    lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;

  return (path: string): string => {
    if (currentLang === DEFAULT_LANGUAGE) {
      return path;
    }
    return path === "/" ? `/${currentLang}` : `/${currentLang}${path}`;
  };
}
