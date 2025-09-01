import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'pl'],
  defaultLocale: 'de',
  localePrefix: 'as-needed', 
});

export type AppLocale = (typeof routing.locales)[number];
