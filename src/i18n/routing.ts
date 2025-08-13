import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de'],
  defaultLocale: 'en'
  // Optional: localePrefix: 'as-needed' | 'always'
});

export type AppLocale = (typeof routing.locales)[number];