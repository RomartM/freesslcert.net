import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

export const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "zh",
  "pt",
  "fr",
  "de",
  "hi",
  "ar",
  "bn",
  "ru",
  "ur",
  "ja",
  "th",
  "vi",
  "ko",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES: ReadonlySet<string> = new Set(["ar", "ur"]);

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export const NAMESPACES = [
  "common",
  "home",
  "faq",
  "guides",
  "blog",
  "ssl-checker",
] as const;

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
}

export function isRtlLanguage(lang: string): boolean {
  return RTL_LANGUAGES.has(lang);
}

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: "pathLanguageDetector",
  lookup(): string | undefined {
    if (typeof window === "undefined") return undefined;
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];
    if (firstSegment && isSupportedLanguage(firstSegment)) {
      return firstSegment;
    }
    return "en";
  },
  cacheUserLanguage(): void {
    // No caching — language is always derived from URL
  },
});

i18n
  .use(HttpBackend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: [...SUPPORTED_LANGUAGES],
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: "common",
    ns: [...NAMESPACES],
    detection: {
      order: ["pathLanguageDetector"],
      caches: [],
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
