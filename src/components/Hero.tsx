"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useEffect, useState } from "react";

export default function Hero() {
  const t = useTranslations("hero");
  const [windowWidth, setWindowWidth] = useState(0);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width on component mount
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

  // Determine animation speed based on window width
  const getAnimationSpeed = () => {
    if (windowWidth < 768) {
      // Mobile speed
      return 30;
    } else if (windowWidth >= 768 && windowWidth < 1024) {
      // Tablet speed
      return 25;
    } else {
      // Desktop speed
      return 20;
    }
  };

  const animationSpeed = getAnimationSpeed();

  // New variables for mobile gallery dimensions
  const mobileGalleryWidth = "95%";
  const mobileGalleryHeight = "60vh";

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

  const column1Images = galleryImages.slice(0, 3);
  const column2Images = galleryImages.slice(3, 6);
  const column3Images = galleryImages.slice(6, 9);
  const allColumns = [column1Images, column2Images, column3Images];

  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10 p-8 rounded-2xl md:p-12">
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

            {/* Desktop Buttons - Visible only on large screens */}
            <div className="hidden lg:flex flex-col sm:flex-row sm:items-center gap-4">
              <AnimatedButton>{t("ctaPrimary")}</AnimatedButton>
              <Link
                href="#services"
                className="inline-flex items-center justify-center px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
                aria-label={String(t("ctaSecondary"))}
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </motion.div>

          {/* Desktop/Tablet Gallery */}
          <motion.div
            variants={fadeUp}
            className="hidden md:flex lg:col-span-5 xl:col-span-6 relative justify-center lg:justify-end"
          >
            <div
              className="relative mx-auto lg:w-full"
              style={{ width: windowWidth < 724 ? mobileGalleryWidth : "100%" }}
            >
              <div className="relative w-full h-[60vh] sm:h-auto sm:aspect-[4/3] overflow-hidden rounded-2xl bg-black px-1">
                <div className="grid grid-cols-3 gap-2 h-full">
                  {allColumns.map((columnImages, colIndex) => {
                    const direction = colIndex === 1 ? ["-100%", "0%"] : ["0%", "-100%"];
                    
                    return (
                      <motion.div
                        key={colIndex}
                        animate={{ y: direction }}
                        transition={{
                          repeat: Infinity,
                          duration: animationSpeed,
                          ease: "linear",
                        }}
                        className="flex flex-col gap-2"
                      >
                        {[...columnImages, ...columnImages].map((src, i) => (
                          <div key={i} className="flex-shrink-0" style={{ height: "calc(100% / 2)" }}>
                            <Image
                              src={src}
                              alt={`Gallery image ${i + 1}`}
                              width={300}
                              height={200}
                              className="w-full h-full object-cover rounded-lg aspect-[3/2]"
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
          <motion.div
            variants={fadeUp}
            className="flex md:hidden lg:col-span-5 xl:col-span-6 relative justify-center lg:justify-end"
          >
            <div
              className="relative mx-auto"
              style={{
                width: mobileGalleryWidth,
                height: mobileGalleryHeight,
              }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-2xl bg-black px-1">
                <div className="grid grid-cols-3 gap-2 h-full">
                  {allColumns.map((columnImages, colIndex) => {
                    const direction = colIndex === 1 ? ["-100%", "0%"] : ["0%", "-100%"];
                    
                    return (
                      <motion.div
                        key={colIndex}
                        animate={{ y: direction }}
                        transition={{
                          repeat: Infinity,
                          duration: animationSpeed,
                          ease: "linear",
                        }}
                        className="flex flex-col gap-2"
                      >
                        {[...columnImages, ...columnImages].map((src, i) => (
                          <div key={i} className="flex-shrink-0" style={{ height: "calc(100% / 2)" }}>
                            <Image
                              src={src}
                              alt={`Gallery image ${i + 1}`}
                              width={300}
                              height={200}
                              className="w-full h-full object-cover rounded-lg aspect-[3/2]"
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

          {/* Mobile Buttons */}
          <motion.div
            variants={fadeUp}
            className="w-full lg:hidden flex flex-col sm:flex-row sm:items-center gap-4 mt-8"
          >
            <AnimatedButton >{t("ctaPrimary")}</AnimatedButton>
            <Link
              href="#services"
              className="inline-flex items-center justify-center px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
              aria-label={String(t("ctaSecondary"))}
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}