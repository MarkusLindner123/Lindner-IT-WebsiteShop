"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import AnimatedButton from "@/components/AnimatedButton";

export default function AboutSection() {
  const t = useTranslations("about");

  const sections = [t("intro"), t("approach"), t("audience"), t("cta")];
  const fullText = sections.join("\n"); // Abschnitte mit Zeilenumbruch verbinden

  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Split text and filter out unwanted leading/trailing whitespace
  const words = fullText.split(/(\s+|\n)/).filter((word, idx, arr) => {
    // Skip leading whitespace at the start of the text
    if (word.trim() === "" && idx === 0) return false;
    // Skip leading whitespace after a newline
    if (word.trim() === "" && idx > 0 && arr[idx - 1] === "\n") return false;
    return true;
  });

  // Wörter, die hervorgehoben werden sollen (case-insensitive)
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

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress: 0 when section enters, 1 when nearly fully scrolled
      let newProgress =
        (windowHeight - rect.top) / (rect.height + windowHeight / 2);
      newProgress = Math.min(Math.max(0, newProgress), 1);

      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial

    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array to prevent loops

  const visibleCount = Math.floor(words.length * progress);

  return (
    <section
      id="about"
      className="max-w-3xl mx-auto px-6 lg:px-8 py-20 md:py-28 lg:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] mb-12 ml-12 lg:ml-24 tracking-tight">
        {t("title")}
      </h2>

      <div className="text-xl md:text-2xl font-[var(--font-sans)] max-w-[600px] space-y-8 ml-12 lg:ml-24">
        <div ref={ref} class="leading-loose">
          {words.map((word, idx) => {
            if (word === "\n") {
              return <br key={idx} />;
            }
            if (word.trim() === "") {
              return (
                <span key={idx} className="inline-block mr-1">
                  &nbsp;
                </span>
              ); // Preserve spaces between words
            }
            const isVisible = idx < visibleCount;
            // Entferne Satzzeichen für den Vergleich, aber zeige das Original an
            const cleanWord = word.replace(/[.,!?–]/g, "").toLowerCase();
            const isHighlighted = highlightWords.includes(cleanWord);
            return (
              <span
                key={idx}
                className={`inline-block mr-1 transition-all duration-500 ease-out ${
                  isHighlighted ? "highlight" : ""
                }`}
                style={{
                  opacity: isVisible ? 1 : 0.2, // Start bei 20% Transparenz
                  ...(isHighlighted
                    ? {
                        backgroundImage:
                          "url(//s2.svgbox.net/pen-brushes.svg?ic=brush-3&color=ffff43)",
                        margin: "-2px -6px",
                        padding: "2px 6px",
                      }
                    : {}),
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-12 flex justify-start ml-12 lg:ml-24">
        <AnimatedButton href="#contact">
          {t("ctaPrimary") || "Contact Us"}
        </AnimatedButton>
      </div>
    </section>
  );
}
