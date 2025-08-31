"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import "./AboutSection.css"; // Brush-Effekt

const brushColors = ["red", "blue", "green", "purple", "orange", "teal", "magenta", "pink", "indigo", "lime"];

const aboutImages = [
  "/about-images/about1.jpg",
  "/about-images/about2.jpg",
  "/about-images/about3.jpg",
  "/about-images/about4.jpg",
];

export default function AboutSection() {
  const t = useTranslations("about");
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [speedFactor, setSpeedFactor] = useState(1.2);

  const sections = useMemo(
    () => ({
      background: { title: t("background.title"), text: t("background.text") },
      experience: { title: t("experience.title"), text: t("experience.text") },
      approach: { title: t("approach.title"), text: t("approach.text") },
      whyMe: { title: t("whyMe.title"), text: t("whyMe.text") },
    }),
    [t]
  );

  const paragraphs = useMemo(
    () => [sections.background.text, sections.experience.text, sections.approach.text, sections.whyMe.text],
    [sections]
  );

  const highlightWords = [
    "background", "hintergrund", "bilingual", "zweisprachig", "engineering", "technische Informatik",
    "corporateexperience", "freelance", "freiberuflich", "lawyers", "Kanzleien", "realestate", "Immobilien",
    "Siemens", "infrastructure", "websites", "networks", "cybersecurity", "reliable", "secure", "customized",
    "growth", "ITsolutions", "IT-Lösungen",
  ];

  const highlightWordsSet = useMemo(
    () => new Set(highlightWords.flatMap((w) => w.split(/\s+/)).map((w) => w.toLowerCase())),
    [highlightWords]
  );

  const allWords = useMemo(() => {
    let globalIndex = 0;
    return paragraphs.map((paragraph) => {
      const paragraphWords = paragraph.split(/\s+/).flatMap((word, wIdx, arr) => {
        const result: { word: string; index: number }[] = [];
        if (word) result.push({ word, index: globalIndex++ });
        if (wIdx < arr.length - 1) result.push({ word: " ", index: globalIndex++ });
        return result;
      });
      paragraphWords.push({ word: "\n", index: globalIndex++ });
      return paragraphWords;
    });
  }, [paragraphs]);

  const highlightColorMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    let ci = 0;
    allWords.flat().forEach(({ word, index }) => {
      const clean = word.replace(/[.,!?–]/g, "").toLowerCase();
      if (highlightWordsSet.has(clean)) {
        map[index] = brushColors[ci % brushColors.length];
        ci++;
      }
    });
    return map;
  }, [allWords, highlightWordsSet]);

  useEffect(() => {
    const handleResize = () => setSpeedFactor(window.innerWidth < 768 ? 1.13 : 1.22);
    handleResize();
    window.addEventListener("resize", handleResize);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const { top, height } = sectionRef.current.getBoundingClientRect();
          const wh = window.innerHeight;
          const scrollProgress = (wh - top) / (height + wh);
          const progress = Math.min(Math.max(0, scrollProgress * speedFactor), 1);
          const totalPhases = allWords.length * 2;

          itemRefs.current.forEach((item, paraIdx) => {
            if (!item) return;
            const imagePhaseIndex = paraIdx * 2;
            const textPhaseIndex = paraIdx * 2 + 1;
            const phaseLength = 1 / totalPhases;
            const imageStart = imagePhaseIndex * phaseLength;
            const textStart = textPhaseIndex * phaseLength;

            const imageProgress = Math.min(Math.max(0, progress - imageStart) / phaseLength, 1);
            const textProgress = Math.min(Math.max(0, progress - textStart) / phaseLength, 1);

            const imageOverlay = item.querySelector(".image-overlay") as HTMLElement;
            if (imageOverlay) imageOverlay.style.transform = `scaleY(${1 - imageProgress})`;

            const titleElement = item.querySelector(".animated-title") as HTMLElement;
            if (titleElement) titleElement.style.opacity = textProgress > 0 ? "1" : "0.15";

            const words = item.querySelectorAll(".animated-word");
            const totalWords = words.length;
            const wordsToReveal = Math.floor(totalWords * textProgress);
            words.forEach((wordElement, idx) => {
              (wordElement as HTMLElement).style.opacity = idx < wordsToReveal ? "1" : "0.15";
            });
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [speedFactor, allWords]);

  const titles = [sections.background.title, sections.experience.title, sections.approach.title, sections.whyMe.title];

  return (
    <div ref={sectionRef} className="relative z-10">
      {/* Kicker */}
      <div className="mb-6">
        <div className="inline-flex px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10">
          {t("kicker")}
        </div>
      </div>

      {/* Headline */}
      <h1 className="mb-16 text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-black font-headline">
        {t("title")}
      </h1>

      {/* Content-Items */}
      <div className="space-y-12">
        {allWords.map((paragraphWords, paraIdx) => (
          <div
            key={paraIdx}
            ref={(el) => (itemRefs.current[paraIdx] = el)}
            className="flex flex-col md:flex-row md:space-x-12 space-y-6 md:space-y-0 items-start"
          >
            {/* Bild */}
            <div className="relative w-full h-[250px] md:w-[350px] md:h-[250px] rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={aboutImages[paraIdx]}
                alt={`Image for about paragraph ${paraIdx + 1}`}
                width={350}
                height={250}
                className="object-cover w-full h-full"
              />
              <div
                className="image-overlay absolute inset-0 bg-white/70 backdrop-blur-sm"
                style={{ transform: `scaleY(1)`, transformOrigin: "bottom" }}
              />
            </div>

            {/* Text */}
            <div className="w-full md:w-[calc(100%-350px-3rem)] text-xl md:text-2xl text-gray-900 leading-loose">
              <h2 className="animated-title text-4xl md:text-5xl font-bold mb-4" style={{ opacity: 0.15 }}>
                {titles[paraIdx]}
              </h2>
              {paragraphWords.map(({ word, index }) => {
                if (word === "\n") return null;
                const clean = word.replace(/[.,!?–]/g, "").toLowerCase();
                const highlighted = highlightWordsSet.has(clean);
                const color = highlighted ? highlightColorMap[index] || "red" : "";
                return (
                  <span
                    key={index}
                    className={`animated-word inline-block ${highlighted ? `brush-effect brush-${color}` : ""}`}
                    style={{ opacity: 0.15 }}
                  >
                    {word === " " ? <span>&nbsp;</span> : word}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
