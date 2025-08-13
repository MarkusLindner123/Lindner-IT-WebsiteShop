import {setRequestLocale, getTranslations} from 'next-intl/server';
import {use} from 'react';
import {routing} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: (typeof routing.locales)[number]}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <section className="max-w-3xl text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight" data-testid="hero-title">
          {t('title')}
        </h1>
        <p className="text-base md:text-lg opacity-80">{t('subtitle')}</p>
        <div className="pt-4 flex items-center justify-center">
          <LanguageSwitcher />
        </div>
      </section>
    </main>
  );
}

// Optional: Lokalisierte Meta‑Daten pro Seite
export async function generateMetadata({
  params
}: {
  params: Promise<{locale: (typeof routing.locales)[number]}>;
}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  return {
    title: t('title')
    // Alternates kannst du global oder hier pro Route setzen.
  } as const;
}