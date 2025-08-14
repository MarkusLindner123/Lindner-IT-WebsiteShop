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
  const [highlightColorMap, setHighlightColorMap] = useState<{
    [key: number]: string;
  }>({});

  // Combine sections with newline separator
  const sections = [t("intro"), t("approach"), t("audience"), t("cta")];
  const fullText = sections.join("\n");

  // Split text into words, preserving newlines and filtering unnecessary whitespace
  const words = fullText
    .split(/(\s+|\n)/)
    .reduce<{ word: string; index: number }[]>((acc, word, idx, arr) => {
      // Skip leading whitespace at the start of the text
      if (word.trim() === "" && idx === 0) return acc;
      // Skip leading whitespace after a newline
      if (word.trim() === "" && idx > 0 && arr[idx - 1] === "\n") return acc;
      // Normalize multiple spaces to a single space
      if (word.trim() === "" && acc.length > 0 && acc[acc.length - 1].word !== "\n") {
        if (acc[acc.length - 1].word.trim() === "") return acc; // Skip if last was a space
        return [...acc, { word: " ", index: idx }]; // Single space
      }
      return [...acc, { word, index: idx }];
    }, []);

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

  // Assign colors to highlighted words in sequence
  useEffect(() => {
    const colorMap: { [key: number]: string } = {};
    let colorIndex = 0;
    words.forEach(({ word, index }) => {
      const cleanWord = word.replace(/[.,!?–]/g, "").toLowerCase();
      if (highlightWords.includes(cleanWord)) {
        colorMap[index] = brushColors[colorIndex % brushColors.length];
        colorIndex++; // Move to next color
      }
    });
    setHighlightColorMap(colorMap);
  }, [fullText]); // Re-run if fullText changes (e.g., language switch)

  // Handle scroll for word reveal effect
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
          {words.map(({ word, index }, idx) => {
            if (word === "\n") return <br key={index} />;
            if (word === " ")
              return (
                <span key={index} className="inline-block mr-1">
                  &nbsp;
                </span>
              );

            const isVisible = idx < Math.floor(words.length * progress);
            const cleanWord = word.replace(/[.,!?–]/g, "").toLowerCase();
            const isHighlighted = highlightWords.includes(cleanWord);
            const brushColor = isHighlighted ? highlightColorMap[index] || "red" : "";

            return (
              <span
                key={index}
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