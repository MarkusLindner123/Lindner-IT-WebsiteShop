// app/[locale]/page.tsx

import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

//import HeroVideo from "@/components/HeroVideo";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import TestimonialsSection from "@/components/TestimonialsSection"; // <-- neue Komponente

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative p-6 space-y-6 md:p-12 md:space-y-12">
      <div className="space-y-6 md:space-y-12">
        {/*
        <section className="bg-heroVideo-bg rounded-2xl overflow-hidden shadow-xl">
          <HeroVideo />
        </section>
        */}
        <section id="home" className="bg-hero-bg rounded-2xl overflow-hidden shadow-xl">
          <Hero />
        </section>
      </div>

  

      <section id="services" className="bg-services-section-bg rounded-2xl overflow-hidden shadow-xl">
        <ServicesSection />
      </section>

      <section id="about" className="bg-about-bg rounded-2xl overflow-hidden shadow-xl">
        <AboutSection />
      </section>

 
     <section id="contact" className="bg-contact-bg rounded-2xl overflow-hidden shadow-xl">
        <ContactSection />
      </section>

      {/* Testimonials Section ganz unten */}
      <section id="testimonials" className="bg-location-bg rounded-2xl overflow-hidden shadow-xl">
        <TestimonialsSection />
      </section>

    </main>
  );
}
