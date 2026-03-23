---
name: i18n-l10n
description: >
  Internationalization and localization covering string externalization, locale
  formatting, and multi-language support. Trigger for any i18n or l10n work.
---

# Internationalization & Localization

## Official Documentation
- [react-i18next](https://react.i18next.com/)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
- [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

## Key Patterns
- **String externalization**: All user-facing strings in translation files; never hardcoded
- **Translation files**: JSON format in `src/locales/{lang}/`; namespaced by feature
- **Key naming**: Dot-separated hierarchy (`donations.form.amountLabel`)
- **Interpolation**: Use named variables (`Hello {{name}}`) not positional
- **Pluralization**: ICU plural rules (`{count, plural, one {# item} other {# items}}`)
- **Date/time**: Use `Intl.DateTimeFormat` or date-fns with locale; never manual formatting
- **Numbers/currency**: Use `Intl.NumberFormat`; respect locale decimal/grouping conventions
- **RTL support**: Use logical CSS properties (`margin-inline-start` not `margin-left`)
- **Fallback chain**: Specific locale → base language → default language (en)
- **Backend messages**: Error messages use codes; frontend resolves to localized strings

## Anti-Patterns
- Do NOT concatenate strings for translations (word order varies by language)
- Do NOT hardcode date formats; always use locale-aware formatters
- Do NOT assume text direction; support both LTR and RTL
- Do NOT embed HTML in translation strings; use component interpolation
- Do NOT translate technical identifiers (API keys, enum values, log messages)
