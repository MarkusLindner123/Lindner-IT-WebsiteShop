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

  const getColumnImages = (col: number) => [
    ...galleryImages.slice(col * 3, col * 3 + 3),
    ...galleryImages.slice(col * 3, col * 3 + 3),
  ];

  return (
    <section aria-label="Hero" className="relative overflow-hidden">
      {/* Hero gradient background */}
      <div className="absolute inset-0 hero-gradient" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16 lg:py-20 overflow-x-hidden overflow-y-auto relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Text Content */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-7 xl:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10">
              {t("kicker")}
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-black font-headline">
              <span className="block">{t("titleLine1")}</span>
              <span className="block underline decoration-4 decoration-accent">
                {t("titleLine2")}
              </span>
              <span className="block">{t("titleLine3")}</span>
            </h1>

            <p className="text-xl md:text-2xl text-black max-w-2xl">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <AnimatedButton href="#contact">{t("ctaPrimary")}</AnimatedButton>
              <Link
                href="#services"
                className="inline-flex items-center justify-center px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
                aria-label={String(t("ctaSecondary"))}
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </motion.div>

          {/* Gallery */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-5 xl:col-span-6 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[114%] lg:max-w-[95%]">
              <div className="relative w-full h-[540px] sm:h-[450px] lg:h-[427.5px] overflow-hidden rounded-2xl bg-black px-1">
                <div className="grid grid-cols-3 gap-2 pt-4 pb-4">
                  {[0, 1, 2].map((colIndex) => (
                    <motion.div
                      key={colIndex}
                      animate={{
                        y: colIndex === 1 ? ["-50%", "0%"] : ["0%", "-50%"],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 30,
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
