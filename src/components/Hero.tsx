// src/components/Hero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section aria-label="Hero" className="relative overflow-hidden">
      {/* decorative blob, uses CSS variables for colors via style attr or CSS var in SVG */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute -left-32 top-[-8rem] w-[42rem] opacity-30 blur-3xl"
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0" stopColor="var(--color-primary)" />
              <stop offset="1" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
          <g transform="translate(300,300)">
            <path
              d="M120,-154C154,-128,173,-83,183,-36C194,11,196,62,173,101C150,140,102,167,55,183C8,199,-37,204,-79,188C-121,172,-160,134,-183,86C-205,38,-211,-20,-193,-70C-174,-120,-131,-162,-83,-183C-36,-204,15,-204,64,-194C113,-184,86,-180,120,-154Z"
              fill="url(#g)"
            />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <motion.div
            variants={fadeUp}
            className="lg:col-span-7 xl:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-3 pill-glass px-3 py-1 rounded-full text-sm font-medium text-white/90 w-max">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {t("kicker")}
              </span>
              {/* optional kickerTag if present */}
              {/* {t("kickerTag") ? <span className="opacity-90">{t("kickerTag")}</span> : null} */}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-white font-headline">
              <span className="block text-hero-gradient">
                {t("titleLine1")}
              </span>
              <span className="block text-emerald-100/95">
                {t("titleLine2")}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 max-w-2xl">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-700 rounded-lg font-semibold shadow transform-gpu hover:-translate-y-1 transition"
                aria-label={String(t("ctaPrimary"))}
              >
                <span>{t("ctaPrimary")}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M5 12h14M13 5l6 7-6 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="#services"
                className="inline-flex items-center justify-center px-4 py-3 border border-white/20 rounded-lg text-white/95 hover:bg-white/5 transition"
                aria-label={String(t("ctaSecondary"))}
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-white/80">
              <div className="flex items-baseline gap-3">
                <div className="text-2xl font-semibold">
                  {t("projectsCount")}
                </div>
                <div className="opacity-80">{t("projectsText")}</div>
              </div>

              <div className="h-1 w-px bg-white/10 mx-2 hidden sm:block" />

              <div className="flex items-baseline gap-3">
                <div className="text-2xl font-semibold">{t("years")}</div>
                <div className="opacity-80">{t("yearsText")}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="lg:col-span-5 xl:col-span-6 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-sm">
              <motion.div
                initial={{ rotate: -3, scale: 0.98 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 70, damping: 14 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10"
              >
                <Image
                  src="/hero-portrait.jpg"
                  alt={String(t("portraitAlt") ?? "Portrait")}
                  width={880}
                  height={880}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 80 }}
                className="absolute -bottom-6 left-4 bg-white/95 rounded-xl p-3 shadow-lg w-52 border border-white/30"
                role="note"
              >
                <div className="text-xs text-gray-500 mb-1">
                  {t("projectLabel")}
                </div>
                <div className="font-medium text-sm text-gray-900">
                  {t("projectTitle")}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {t("projectSubtitle")}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
