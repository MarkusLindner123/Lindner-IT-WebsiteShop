// app/[locale]/page.tsx

import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import TestimonialsSection from "@/components/TestimonialsSection"; // neue Komponente
import { Card } from "@/components/Layout/Card";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative p-6 space-y-6 md:p-12 md:space-y-12">
      {/* Hero Section */}
      <Card id="home" className="bg-card-hero">
        <Hero />
      </Card>

      {/* Services Section */}
      <Card id="services" className="bg-card-services">
        <ServicesSection />
      </Card>

      {/* About Section */}
      <Card id="about" className="bg-card-about">
        <AboutSection />
      </Card>

      {/* Contact Section */}
      <Card id="contact" className="bg-card-contact">
        <ContactSection />
      </Card>

      {/* Testimonials Section */}
      <Card id="testimonials" className="bg-card-testimonials">
        <TestimonialsSection />
      </Card>
    </main>
  );
}
