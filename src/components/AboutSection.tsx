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

  // Load content from translations
  const content = {
    about: {
      title: t("title"),
      text: t("text"),
      ctaPrimary: t("ctaPrimary"),
    },
  };

  // Words to highlight (case-insensitive)
  const highlightWords = ["solutions", "lösungen", "scalable", "skalierbar", "design", "results", "ergebnisse"];

  // Split text into words, preserving newlines and removing unwanted spaces
  const words = content.about.text
    .split("\n")
    .flatMap((line, lineIdx) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return []; // Skip empty lines
      const lineWords = trimmedLine.split(/\s+/); // Split on one or more spaces
      const result: { word: string; index: number }[] = [];
      lineWords.forEach((word, wordIdx) => {
        if (word) {
          result.push({ word, index: lineIdx * 1000 + wordIdx * 2 }); // Unique index for words
          if (wordIdx < lineWords.length - 1) {
            result.push({ word: " ", index: lineIdx * 1000 + wordIdx * 2 + 1 }); // Space between words
          }
        }
      });
      if (lineIdx < content.about.text.split("\n").length - 1) {
        result.push({ word: "\n", index: lineIdx * 1000 + lineWords.length * 2 }); // Newline at end, except for last line
      }
      return result;
    })
    .filter(({ word }) => word !== ""); // Remove any empty entries

  // Debug: Log the words array
  console.log("Processed words:", words);

  // Assign colors to highlighted words in sequence
  useEffect(() => {
    const colorMap: { [key: number]: string } = {};
    let colorIndex = 0;
    words.forEach(({ word, index }) => {
      const cleanWord = word.replace(/[.,!?–]/g, "").toLowerCase();
      if (highlightWords.includes(cleanWord)) {
        colorMap[index] = brushColors[colorIndex % brushColors.length];
        colorIndex++;
      }
    });
    setHighlightColorMap(colorMap);
  }, [content.about.text]); // Re-run if text changes (e.g., language switch)

  // Throttled scroll handler to reduce CPU usage
  useEffect(() => {
    let lastScroll = 0;
    const throttleDelay = 50; // Reduced to 50ms for smoother feel

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScroll < throttleDelay) return;
      lastScroll = now;

      if (!ref.current) return;

      const { top, height } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Slower progress: Stretch reveal over longer scroll distance
      const newProgress = Math.min(
        Math.max(0, (windowHeight - top) / (height + windowHeight * 0.3)),
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
      <h2 className="mb-12 text-3xl font-extrabold tracking-tight text-[var(--color-primary)] md:text-4xl">
        {content.about.title}
      </h2>

      <div className="max-w-[600px] space-y-8 text-xl font-[var(--font-sans)] md:text-2xl">
        <div ref={ref} className="leading-loose">
          {words.map(({ word, index }, idx) => {
            if (word === "\n") return <br key={index} />;
            if (word === " ")
              return (
                <span key={index} className="inline-block">
                  &nbsp;
                </span>
              );

            const isVisible = idx <= Math.floor(words.length * progress); // Use <= for last word
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

      <div className="mt-12 flex justify-start">
        <AnimatedButton href="#contact">{content.about.ctaPrimary}</AnimatedButton>
      </div>
    </section>
  );
}