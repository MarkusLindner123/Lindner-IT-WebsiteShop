// src/app/[locale]/page.tsx
import { setRequestLocale, getTranslations } from "next-intl/server";

import StructuredData from "@/components/StructuredData";
import BlogTeaser from "@/components/BlogTeaser";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection/AboutSection";
import ReferencesSection from "@/components/ReferencesSection/ReferencesSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Card } from "@/components/Layout/Card";
import CardScrollLines from "@/components/Layout/CardScrollLines";
import CookieBanner from "@/components/Layout/CookieBanner"; // ✅ neu

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations("metadata");
  const tNav = await getTranslations("nav");
  const tServices = await getTranslations("services");
  const serviceKeys = ["webDesign", "itSupport", "networkSetup", "cyberSecurity"] as const;
  const services = serviceKeys.map((key) => ({
    name: tServices(`${key}.title`),
    description: tServices(`${key}.description`),
  }));

  return (
    <main className="relative px-6 md:px-12">
      {/* JSON-LD für Google Rich Results */}
      <StructuredData
        description={tMeta("description")}
        catalogName={tNav("services")}
        services={services}
      />

      {/* Scroll Lines Overlay */}
      <CardScrollLines cardIds={["home", "services", "references", "about", "contact", "testimonials", "blog"]} />

      {/* Hero Card */}
      <Card id="home" className="bg-card-hero pt-0 mt-3 md:mt-32 mb-20">
        <Hero />
      </Card>

      <div className="space-y-20 pb-20"> {/* vergrößertes spacing zwischen Cards */}
        <Card id="services">
          <ServicesSection />
        </Card>

        <Card id="references">
          <ReferencesSection />
        </Card>

        <Card id="about">
          <AboutSection />
        </Card>

        <Card id="contact">
          <ContactSection />
        </Card>

        <Card id="testimonials">
          <TestimonialsSection />
        </Card>

        <Card id="blog">
          <BlogTeaser locale={locale} />
        </Card>
      </div>

      {/* Cookie Banner */}
      <CookieBanner />
    </main>
  );
}
