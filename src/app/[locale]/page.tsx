// src/app/[locale]/page.tsx
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-gray-70 bg-brand-bg text-brand-text font-sans">
      {/* Hero Section */}
      <Hero />
      <AboutSection />
      {/* Language Switcher Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex justify-center">
        <LanguageSwitcher currentLocale={locale} />
      </section>
    </main>
  );
}
