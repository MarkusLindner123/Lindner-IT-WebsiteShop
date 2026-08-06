import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'pl'],
  defaultLocale: 'de',
  localePrefix: 'as-needed',
  // Kein Redirect anhand des Accept-Language-Headers: "/" liefert immer Deutsch.
  // Grund: Google crawlt/rendert mit "Accept-Language: en-US" — mit Detection
  // wurde "/" zu einem Redirect statt einer indexierbaren Seite.
  // Sprachwahl läuft ausschliesslich über den LanguageSwitcher + hreflang.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
