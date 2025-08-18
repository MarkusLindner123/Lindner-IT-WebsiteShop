// page.tsx
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

import HeroVideo from "@/components/HeroVideo";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection/AboutSection";
import ServicesSection from "@/components/ServicesSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative p-6 space-y-6 md:p-12 md:space-y-12">
      <section className="bg-heroVideo-bg  rounded-2xl overflow-hidden shadow-xl">
        <HeroVideo />
      </section>
      <section className="bg-hero-bg rounded-2xl overflow-hidden shadow-xl">
        <Hero />
      </section>
      <section className="bg-about-bg  rounded-2xl overflow-hidden shadow-xl">
        <AboutSection />
      </section>
      <section className="bg-services-section-bg  rounded-2xl overflow-hidden shadow-xl">
        <ServicesSection />
      </section>
    </div>
  );
}