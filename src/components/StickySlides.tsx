// StickySlides.tsx

"use client";
import HeroVideo from "@/components/HeroVideo";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";

export default function StickySlides() {
  return (
    <div className="relative">
      <div className="sticky-section-wrapper">
        <HeroVideo />
      </div>
      <div className="sticky-section-wrapper">
        <Hero />
      </div>
      <div className="sticky-section-wrapper">
        <AboutSection />
      </div>
    </div>
  );
}
