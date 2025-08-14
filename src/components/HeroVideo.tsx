"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function HeroVideo() {
  const t = useTranslations("heroVideo"); // add keys in messages/*

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/hero-video-poster.jpg" // optional placeholder
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text overlay */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex h-full w-full items-center justify-center px-6 text-center text-white"
      >
        <div>
          <h1 className="text-4xl md:text-6xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">{t("subtitle")}</p>
        </div>
      </motion.div>
    </section>
  );
}
