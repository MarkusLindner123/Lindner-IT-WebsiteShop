"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";

export default function Hero() {
  const t = useTranslations("hero");
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonSize({ width: rect.width, height: rect.height });
    }
  }, []);

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
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const orbit: Variants = {
    animate: {
      rotate: 360,
      transition: { repeat: Infinity, duration: 2.5, ease: "linear" },
    },
  };

  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-blue-600 to-[var(--color-secondary)]"
    >
      {/* Dynamischer Blob */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute -left-32 top-[-8rem] w-[42rem] opacity-40 blur-3xl"
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
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full text-sm font-medium text-white/90 bg-white/10 backdrop-blur-sm">
              <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs text-white">
                {t("kicker")}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-white">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--color-secondary)]">
                {t("titleLine1")}
              </span>
              <span className="block text-white/95">{t("titleLine2")}</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* CTA mit perfektem Orbit */}
              <div className="relative">
                <Link
                  href="#contact"
                  ref={buttonRef}
                  className="relative inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-white rounded-full font-bold shadow-lg hover:bg-[var(--color-primary)]/90 hover:-translate-y-1 transition-transform duration-300 z-10"
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

                {buttonSize.width > 0 && (
                  <motion.div
                    variants={orbit}
                    animate="animate"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: buttonSize.width + 16,
                      height: buttonSize.height + 16,
                      transformOrigin: "center",
                    }}
                  >
                    <svg
                      className="w-full h-full"
                      viewBox={`0 0 ${buttonSize.width + 16} ${
                        buttonSize.height + 16
                      }`}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0"
                        y="0"
                        width={buttonSize.width + 16}
                        height={buttonSize.height + 16}
                        rx={(buttonSize.height + 16) / 2}
                        stroke="#facc15"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                        fill="none"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>

              <Link
                href="#services"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/30 rounded-full text-white/95 hover:bg-white/10 hover:-translate-y-1 transition-transform duration-300"
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
                className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src="/window.svg"
                  alt={String(t("portraitAlt") ?? "Tech Illustration")}
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain bg-white/10 p-4 rounded-2xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
