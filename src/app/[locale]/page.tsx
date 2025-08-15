import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import StickySlides from "@/components/StickySlides";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <StickySlides />

      {/* Anything after the stacked slides will come *after* the takeover sequence 
      <section className="max-w-7xl mx-auto px-6 py-20 flex justify-center">
        <LanguageSwitcher currentLocale={locale} />
      </section>*/}
    </main>
  );
}
