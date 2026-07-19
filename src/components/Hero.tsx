"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AnimatedButton } from "./AnimatedButton";

const GALLERY_IMAGES = [
  "/hero-images/hero-img.webp",
  "/hero-images/hero-img1.webp",
  "/hero-images/hero-img2.webp",
  "/hero-images/hero-img3.webp",
  "/hero-images/hero-img4.webp",
  "/hero-images/hero-img5.webp",
  "/hero-images/hero-img6.webp",
  "/hero-images/hero-img7.webp",
  "/hero-images/hero-img8.webp",
];

const GALLERY_COLUMNS = [
  GALLERY_IMAGES.slice(0, 3),
  GALLERY_IMAGES.slice(3, 6),
  GALLERY_IMAGES.slice(6, 9),
];

function GalleryColumn({
  images,
  reverse,
  duration,
}: {
  images: string[];
  reverse: boolean;
  duration: number;
}) {
  return (
    <motion.div
      animate={{ y: reverse ? ["-100%", "0%"] : ["0%", "-100%"] }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
      className="flex flex-col gap-2"
    >
      {[...images, ...images].map((src, i) => (
        <div key={i} className="flex-shrink-0" style={{ height: "calc(100% / 2)" }}>
          <Image
            src={src}
            alt=""
            width={300}
            height={200}
            sizes="(min-width: 768px) 16vw, 30vw"
            className="w-full h-full object-cover rounded-lg aspect-[3/2]"
            loading="lazy"
          />
        </div>
      ))}
    </motion.div>
  );
}

export default function Hero() {
  const t = useTranslations("hero");

  // Nur bei Breakpoint-Wechsel neu rendern, nicht bei jedem Resize-Pixel
  const [animationSpeed, setAnimationSpeed] = useState(20);
  useEffect(() => {
    const update = () =>
      setAnimationSpeed(
        window.innerWidth < 768 ? 30 : window.innerWidth < 1024 ? 25 : 20
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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

  const scrollToServices = () => {
    const section = document.querySelector("#services");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const ctaButtons = (
    <>
      <AnimatedButton>{t("ctaPrimary")}</AnimatedButton>
      <button
        onClick={scrollToServices}
        className="inline-flex items-center justify-center px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
      >
        {t("ctaSecondary")}
      </button>
    </>
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
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

        {/* Desktop Buttons */}
        <div className="hidden lg:flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
          {ctaButtons}
        </div>
      </motion.div>

      {/* Galerie — eine Instanz für alle Breakpoints, rein dekorativ */}
      <motion.div
        variants={fadeUp}
        aria-hidden="true"
        className="lg:col-span-5 xl:col-span-6 flex justify-center lg:justify-end"
      >
        <div className="relative w-full h-[60vh] md:h-auto md:aspect-[4/3] overflow-hidden rounded-2xl bg-black px-1">
          <div className="grid grid-cols-3 gap-2 h-full">
            {GALLERY_COLUMNS.map((images, colIndex) => (
              <GalleryColumn
                key={colIndex}
                images={images}
                reverse={colIndex === 1}
                duration={animationSpeed}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile Buttons nach der Galerie */}
      <motion.div
        variants={fadeUp}
        className="w-full lg:hidden flex flex-col sm:flex-row sm:items-center gap-4"
      >
        {ctaButtons}
      </motion.div>
    </motion.div>
  );
}
