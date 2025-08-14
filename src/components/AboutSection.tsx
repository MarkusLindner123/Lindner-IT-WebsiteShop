"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import AnimatedButton from "@/components/AnimatedButton";

// List of colors for the brush effect
const brushColors = [
  "red",
  "blue",
  "green",
  "purple",
  "orange",
  "teal",
  "magenta",
  "pink",
  "indigo",
  "lime",
];

export default function AboutSection() {
  const t = useTranslations("about");
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Combine sections with newline separator
  const sections = [t("intro"), t("approach"), t("audience"), t("cta")];
  const fullText = sections.join("\n");

  // Split text into words, preserving newlines and filtering unnecessary whitespace
  const words = fullText
    .split(/(\s+|\n)/)
    .filter(
      (word, idx, arr) =>
        !(word.trim() === "" && (idx === 0 || arr[idx - 1] === "\n"))
    );

  // Words to highlight (case-insensitive)
  const highlightWords = [
    "solutions",
    "lösungen",
    "scalable",
    "skalierbar",
    "design",
    "results",
    "ergebnisse",
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const { top, height } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const newProgress = Math.min(
        Math.max(0, (windowHeight - top) / (height + windowHeight / 2)),
        1
      );
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Select a random color for each render (or per highlight word)
  const getRandomColor = () =>
    brushColors[Math.floor(Math.random() * brushColors.length)];

  return (
    <section
      id="about"
      className="mx-auto max-w-3xl px-6 py-20 md:py-28 lg:px-8 lg:py-32"
    >
      <h2 className="mb-12 ml-12 text-3xl font-extrabold tracking-tight text-[var(--color-primary)] md:text-4xl lg:ml-24">
        {t("title")}
      </h2>

      <div className="ml-12 max-w-[600px] space-y-8 text-xl font-[var(--font-sans)] md:text-2xl lg:ml-24">
        <div ref={ref} className="leading-loose">
          {words.map((word, idx) => {
            if (word === "\n") return <br key={idx} />;
            if (word.trim() === "")
              return (
                <span key={idx} className="inline-block mr-1">
                  &nbsp;
                </span>
              );

            const isVisible = idx < Math.floor(words.length * progress);
            const cleanWord = word.replace(/[.,!?–]/g, "").toLowerCase();
            const isHighlighted = highlightWords.includes(cleanWord);
            const brushColor = isHighlighted ? getRandomColor() : "";

            return (
              <span
                key={idx}
                className={`inline-block mr-1 transition-all duration-500 ease-out ${
                  isHighlighted ? `brush-effect brush-${brushColor}` : ""
                }`}
                style={{ opacity: isVisible ? 1 : 0.2 }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-12 ml-12 flex justify-start lg:ml-24">
        <AnimatedButton href="#contact">
          {t("ctaPrimary") || "Contact Us"}
        </AnimatedButton>
      </div>
    </section>
  );
}