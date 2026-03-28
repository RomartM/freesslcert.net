import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  isSupportedLanguage,
  isRtlLanguage,
  DEFAULT_LANGUAGE,
} from "@/i18n";

export function LocaleLayout() {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();

  const resolvedLang =
    lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;

  useEffect(() => {
    // Sync i18next language with URL
    if (i18n.language !== resolvedLang) {
      i18n.changeLanguage(resolvedLang);
    }

    // Set document direction and lang attribute
    const htmlElement = document.documentElement;
    htmlElement.lang = resolvedLang;
    htmlElement.dir = isRtlLanguage(resolvedLang) ? "rtl" : "ltr";

    return () => {
      // Reset to LTR on unmount (safety measure)
      htmlElement.dir = "ltr";
      htmlElement.lang = DEFAULT_LANGUAGE;
    };
  }, [resolvedLang, i18n]);

  return <Outlet />;
}
