"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function HeroVideo() {
  const t = useTranslations("heroVideo");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const videoEl = videoRef.current;

    // Endlos-Loop: Video beim Ende neu starten
    const handleEnded = () => {
      videoEl.currentTime = 0;
      videoEl.play().catch(() => {
        // Autoplay-Restrictions umgehen
      });
    };

    // IntersectionObserver: Video nur abspielen, wenn sichtbar
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.currentTime = 0;
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.5 }
    );

    videoEl.addEventListener("ended", handleEnded);
    observer.observe(videoEl);

    // Cleanup
    return () => {
      videoEl.removeEventListener("ended", handleEnded);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop={false} // Wir benutzen eigene Loop-Logik
        preload="auto"
        poster="/hero-video-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay für besseren Kontrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Animierter Text */}
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
