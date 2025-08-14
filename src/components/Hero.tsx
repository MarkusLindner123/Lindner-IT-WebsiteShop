"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import AnimatedButton from "@/components/AnimatedButton";

export default function Hero() {
  const t = useTranslations("hero");

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const galleryImages = [
    "/hero-img.jpg",
    "/hero-img.jpg",
    "/hero-img.jpg",
    "/hero-img.jpg",
    "/hero-img.jpg",
    "/hero-img.jpg",
    "/hero-img.jpg",
    "/hero-img.jpg",
    "/hero-img.jpg",
  ];

  const getColumnImages = (col: number) =>
    // doppeln, damit keine Lücken entstehen
    [
      ...galleryImages.slice(col * 3, col * 3 + 3),
      ...galleryImages.slice(col * 3, col * 3 + 3),
    ];

  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 md:py-28 lg:py-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <motion.div
            variants={fadeUp}
            className="lg:col-span-7 xl:col-span-6 space-y-6"
          >
            {/* Textbereich */}
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full text-sm font-medium text-white/90 pill-glass">
              <span className="rounded-full bg-[var(--color-accent)]/30 px-2 py-0.5 text-xs text-white">
                {t("kicker")}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-hero-gradient font-[var(--font-headline)]">
              <span className="block">{t("titleLine1")}</span>
              <span className="block">{t("titleLine2")}</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-[var(--font-sans)]">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <AnimatedButton href="#contact">{t("ctaPrimary")}</AnimatedButton>
              <Link
                href="#services"
                className="inline-flex items-center justify-center px-6 py-4 border border-white/30 rounded-full text-white/95 hover:bg-white/10 hover:-translate-y-1 transition-transform duration-300 font-[var(--font-sans)]"
                aria-label={String(t("ctaSecondary"))}
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </motion.div>

          {/* Galerie */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-5 xl:col-span-6 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[120%]">
              <div className="relative w-full h-[540px] sm:h-[450px] overflow-hidden rounded-2xl bg-black px-1">
                <div className="grid grid-cols-3 gap-2 h-full">
                  {[0, 1, 2].map((colIndex) => (
                    <motion.div
                      key={colIndex}
                      animate={{
                        y: colIndex === 1 ? ["-50%", "0%"] : ["0%", "-50%"],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 20, // Geschwindigkeit anpassen
                        ease: "linear",
                      }}
                      className="flex flex-col gap-2"
                    >
                      {getColumnImages(colIndex).map((src, i) => (
                        <Image
                          key={i}
                          src={src}
                          alt={`Gallery ${colIndex * 3 + i + 1}`}
                          width={300}
                          height={200}
                          className="w-full object-cover rounded-lg"
                        />
                      ))}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
