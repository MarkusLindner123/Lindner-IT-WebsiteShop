"use client";

import HeroVideo from "@/components/HeroVideo";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";

export default function StickySlides() {
  return (
    <div className="relative">
      {/* Slide 1: Video Hero */}
      <section className="sticky top-0 min-h-screen w-full z-0">
        <HeroVideo />
      </section>

      {/* Slide 2: Hero */}
      <section className="sticky top-0 min-h-screen w-full z-10 bg-brand-bg">
        <Hero />
      </section>

      {/* Slide 3: About */}
      <section className="sticky top-0 min-h-screen w-full z-20 bg-white">
        <div className="min-h-screen w-full overflow-y-auto">
          <AboutSection />
        </div>
      </section>
    </div>
  );
}
