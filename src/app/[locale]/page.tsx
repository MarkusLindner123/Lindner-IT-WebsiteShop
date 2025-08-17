import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

//import LanguageSwitcher from "@/components/LanguageSwitcher";
//import StickySlides from "@/components/StickySlides";
import HeroVideo from "@/components/HeroVideo";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
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
    <section className=" top-6 min-h-screen z-20 bg-brand-bg rounded-2xl overflow-hidden shadow-xl">
       
          <HeroVideo />
      </section>
        <section className=" top-6 min-h-screen z-20 bg-brand-bg rounded-2xl overflow-hidden shadow-xl">
       
          <Hero/>
      
      </section>
       {/* Slide 4: Services */}
      <section className=" top-6 min-h-screen z-20 bg-brand-bg rounded-2xl overflow-hidden shadow-xl">
       
          <AboutSection />
      
      </section>
      
      {/* Slide 4: Services */}
      <section className=" top-6 min-h-screen z-20 bg-brand-bg rounded-2xl overflow-hidden shadow-xl">
       
          <ServicesSection />
      
      </section>
    </div>
  );
}
