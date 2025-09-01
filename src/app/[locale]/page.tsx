// src/app/[locale]/page.tsx
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Card } from "@/components/Layout/Card";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative px-6 md:px-12">
      <Card id="home" className="bg-card-hero pt-0 sm:mt-0 mb-12 mt-6">
        <Hero />
      </Card>

      <div className="space-y-12 pb-20">
        <Card id="services" className="bg-card-services">
          <ServicesSection />
        </Card>

        <Card id="about" className="bg-card-about">
          <AboutSection />
        </Card>

        <Card id="contact" className="bg-card-contact">
          <ContactSection />
        </Card>

        <Card id="testimonials" className="bg-card-testimonials ">
          <TestimonialsSection />
        </Card>
      </div>
    </main>

  );
}
