"use client";

import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";
import { motion, Variants, useInView } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface Review {
  name: string;
  rating: number;
  text: string;
}

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");

  const reviews = t.raw("reviews") as Review[];
  const googleProfileUrl = t("googleProfile");
  const googleButtonText = t("googleButtonText") || "View on Google";
  const kicker = t("kicker") || "Trusted by our clients";

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const [scrollIndex, setScrollIndex] = useState(0);

  // Automatisches Scrollen nur, wenn im Viewport
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      if (!containerRef.current) return;

      const card = containerRef.current.querySelector("div.flex-none");
      if (!card) return;

      const nextIndex = (scrollIndex + 1) % reviews.length;
      containerRef.current.scrollTo({
        left: nextIndex * (card.clientWidth + 24),
        behavior: "smooth",
      });

      setScrollIndex(nextIndex);
    }, 8000);

    return () => clearInterval(interval);
  }, [isInView, scrollIndex, reviews.length]);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const card = containerRef.current.querySelector("div.flex-none");
    if (!card) return;

    let nextIndex = scrollIndex;
    if (direction === "right") {
      nextIndex = (scrollIndex + 1) % reviews.length;
    } else {
      nextIndex = (scrollIndex - 1 + reviews.length) % reviews.length;
    }

    containerRef.current.scrollTo({
      left: nextIndex * (card.clientWidth + 24),
      behavior: "smooth",
    });

    setScrollIndex(nextIndex);
  };

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section ref={sectionRef} aria-label="Testimonials Section" className="relative bg-services-section-bg py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 md:px-8"
      >
        {/* Kicker */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10">{kicker}</div>
        </motion.div>

        {/* Title */}
        <motion.div variants={fadeUp} className="mb-8">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-primary-dark font-headline">{t("title") || "What our clients say"}</h2>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative">
          <div ref={containerRef} className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6 no-scrollbar">
            {reviews.map((review, idx) => (
              <div key={idx} className="flex-none w-full md:w-[calc(50%-12px)] snap-center bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-neutral mb-4">&quot;{review.text}&quot;</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{review.name}</span>
                  <span>{'★'.repeat(review.rating)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left/Right Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => scroll("left")} className="bg-white rounded-full p-2 shadow-md">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button onClick={() => scroll("right")} className="bg-white rounded-full p-2 shadow-md">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Google Profile Button */}
        <div className="text-center mt-8">
          <a
            href={googleProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
          >
            { googleButtonText }
          </a>
        </div>
      </motion.div>
    </section>
  );
}
