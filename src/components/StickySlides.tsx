"use client";

import HeroVideo from "@/components/HeroVideo";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection/AboutSection";
import ServicesSection from "@/components/ServicesSection";

export default function StickySlides() {
  return (
    <div className="relative p-6 space-y-6 md:p-12 md:space-y-12">
      {/* Slide 1: Video Hero */}
      <section className="sticky top-6 min-h-screen z-0">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
          <HeroVideo />
        </div>
      </section>

      {/* Slide 2: Hero */}
      <section className="sticky top-6 min-h-screen z-10 bg-brand-bg rounded-2xl overflow-hidden shadow-xl">
        <Hero />
      </section>

      {/* Slide 3: About */}
      <section className="sticky top-6 min-h-screen z-20 bg-brand-bg rounded-2xl overflow-hidden shadow-xl">
        <div className="w-full h-full overflow-y-auto">
          <AboutSection />
        </div>
      </section>
      
      {/* Slide 4: Services */}
      <section className="sticky top-6 min-h-screen z-20 bg-brand-bg rounded-2xl overflow-hidden shadow-xl">
        <div className="w-full h-full overflow-y-auto">
          <ServicesSection />
        </div>
      </section>
    </div>
  );
}
