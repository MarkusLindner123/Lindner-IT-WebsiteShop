"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AnimatedButton } from "./AnimatedButton";

export default function Hero() {
  const t = useTranslations("hero");
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const getAnimationSpeed = () => {
    if (windowWidth < 768) return 30;
    if (windowWidth < 1024) return 25;
    return 20;
  };
  const animationSpeed = getAnimationSpeed();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const galleryImages = Array(9).fill("/hero-img.jpg"); // Hier später echte Service-Bilder einsetzen
  const column1Images = galleryImages.slice(0, 3);
  const column2Images = galleryImages.slice(3, 6);
  const column3Images = galleryImages.slice(6, 9);
  const allColumns = [column1Images, column2Images, column3Images];

  const scrollToServices = () => {
    const section = document.querySelector("#services");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section aria-label="Hero" className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10 p-8 rounded-2xl md:p-12">
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <motion.div variants={fadeUp} className="lg:col-span-7 xl:col-span-6 space-y-6">
            <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10">
              {t("kicker")}
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-black font-headline">
              <span className="block">{t("titleLine1")}</span>
              <span className="block underline decoration-4 decoration-accent">{t("titleLine2")}</span>
              <span className="block">{t("titleLine3")}</span>
            </h1>

            <p className="text-xl md:text-2xl text-black max-w-2xl">{t("subtitle")}</p>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
              <AnimatedButton>{t("ctaPrimary")}</AnimatedButton>
              <button
                onClick={scrollToServices}
                className="inline-flex items-center justify-center px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
              >
                {t("ctaSecondary")}
              </button>
            </div>
          </motion.div>

          {/* Gallery Desktop & Tablet */}
          <motion.div variants={fadeUp} className="hidden md:flex lg:col-span-5 xl:col-span-6 relative justify-center lg:justify-end">
            <div className="relative mx-auto w-full">
              <div className="relative w-full h-[60vh] sm:h-auto sm:aspect-[4/3] overflow-hidden rounded-2xl bg-black px-1">
                <div className="grid grid-cols-3 gap-2 h-full">
                  {allColumns.map((columnImages, colIndex) => {
                    const direction = colIndex === 1 ? ["-100%", "0%"] : ["0%", "-100%"];
                    return (
                      <motion.div
                        key={colIndex}
                        animate={{ y: direction }}
                        transition={{ repeat: Infinity, duration: animationSpeed, ease: "linear" }}
                        className="flex flex-col gap-2"
                      >
                        {[...columnImages, ...columnImages].map((src, i) => (
                          <div key={i} className="flex-shrink-0" style={{ height: "calc(100% / 2)" }}>
                            <Image
                              src={src}
                              alt={`Visual representing our service ${i + 1}`} // SEO-relevanter Alt-Text
                              width={300}
                              height={200}
                              className="w-full h-full object-cover rounded-lg aspect-[3/2]"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Gallery */}
          <motion.div variants={fadeUp} className="flex md:hidden mt-8">
            <div className="relative w-full h-[60vh] overflow-hidden rounded-2xl bg-black px-1">
              <div className="grid grid-cols-3 gap-2 h-full">
                {allColumns.map((columnImages, colIndex) => {
                  const direction = colIndex === 1 ? ["-100%", "0%"] : ["0%", "-100%"];
                  return (
                    <motion.div
                      key={colIndex}
                      animate={{ y: direction }}
                      transition={{ repeat: Infinity, duration: animationSpeed, ease: "linear" }}
                      className="flex flex-col gap-2"
                    >
                      {[...columnImages, ...columnImages].map((src, i) => (
                        <div key={i} className="flex-shrink-0" style={{ height: "calc(100% / 2)" }}>
                          <Image
                            src={src}
                            alt={`Visual representing our service ${i + 1}`}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover rounded-lg aspect-[3/2]"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Mobile Buttons AFTER Gallery */}
          <motion.div variants={fadeUp} className="w-full lg:hidden flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
            <AnimatedButton>{t("ctaPrimary")}</AnimatedButton>
            <button
              onClick={scrollToServices}
              className="inline-flex items-center justify-center px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
            >
              {t("ctaSecondary")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
