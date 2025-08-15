"use client";
import HeroVideo from "@/components/HeroVideo";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";

export default function StickySlides() {
  return (
    <div className="relative p-6 space-y-6 md:p-12 md:space-y-12">
      {/* Slide 1: Video Hero */}
      <section className="sticky top-6 h-screen z-0 overflow-hidden rounded-2xl shadow-xl"> {/* Changed to h-screen */}
        <div className="w-full h-full overflow-hidden"> {/* Already h-full; video should fill */}
          <HeroVideo />
        </div>
      </section>
      {/* Slide 2: Hero */}
      <section className="sticky top-6 h-screen z-10 bg-brand-bg rounded-2xl overflow-hidden shadow-xl"> {/* Changed to h-screen */}
        <Hero />
      </section>
      {/* Slide 3: About */}
      <section className="sticky top-6 h-screen z-20 bg-brand-bg rounded-2xl overflow-hidden shadow-xl"> {/* Changed to h-screen */}
        <div className="w-full h-full overflow-y-auto"> {/* Already set up for scrolling */}
          <AboutSection />
        </div>
      </section>
    </div>
  );
}
