"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import AnimatedButton from "@/components/AnimatedButton";

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

  const content = useMemo(
    () => ({
      about: {
        paragraphs: [t("analyze"), t("plan"), t("build"), t("support")],
        ctaPrimary: t("ctaPrimary"),
      },
    }),
    [t]
  );

  const highlightWords = [
    "solutions",
    "lösungen",
    "scalable",
    "skalierbar",
    "design",
    "results",
    "ergebnisse",
  ];

  const words = useMemo(() => {
    return content.about.paragraphs
      .flatMap((paragraph, paraIdx) =>
        paragraph.split("\n").flatMap((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return [];
          const parts = trimmed.split(/\s+/);
          const result: { word: string; index: number }[] = [];
          parts.forEach((w, wIdx) => {
            result.push({
              word: w,
              index: paraIdx * 10000 + lineIdx * 1000 + wIdx * 2,
            });
            if (wIdx < parts.length - 1)
              result.push({
                word: " ",
                index: paraIdx * 10000 + lineIdx * 1000 + wIdx * 2 + 1,
              });
          });
          if (lineIdx < paragraph.split("\n").length - 1) {
            result.push({
              word: "\n",
              index: paraIdx * 10000 + lineIdx * 1000 + parts.length * 2,
            });
          }
          return result;
        })
      )
      .filter(({ word }) => word !== "");
  }, [content.about.paragraphs]);

  useEffect(() => {
    const map: { [key: number]: string } = {};
    let ci = 0;
    words.forEach(({ word, index }) => {
      const clean = word.replace(/[.,!?–]/g, "").toLowerCase();
      if (highlightWords.includes(clean)) {
        map[index] = brushColors[ci % brushColors.length];
        ci++;
      }
    });
    setHighlightColorMap(map);
  }, [words]);

  useEffect(() => {
    let lastScroll = 0;
    const delay = 50;
    const handle = () => {
      const now = Date.now();
      if (now - lastScroll < delay) return;
      lastScroll = now;
      if (!ref.current) return;
      const { top, height } = ref.current.getBoundingClientRect();
      const wh = window.innerHeight;
      const np = Math.min(Math.max(0, (wh - top) / (height + wh * 0.3)), 1);
      setProgress(np);
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle(); // Initial call
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <section
      id="about"
      className="mx-auto max-w-full px-6 py-20 md:py-28 lg:px-8 lg:py-32 bg-brand-bg"
    >
      <div className="mx-auto max-w-3xl">
        <div className="max-w-[600px] space-y-8 text-xl md:text-2xl text-gray-900">
          <div ref={ref} className="leading-loose">
            {words.map(({ word, index }, idx) => {
              if (word === "\n") return <br key={index} />;
              if (word === " ") return <span key={index}>&nbsp;</span>;

              const visible = idx <= Math.floor(words.length * progress);
              const clean = word.replace(/[.,!?–]/g, "").toLowerCase();
              const highlighted = highlightWords.includes(clean);
              const color = highlighted
                ? highlightColorMap[index] || "red"
                : "";

              return (
                <span
                  key={index}
                  className={`inline-block transition-all duration-500 ease-out ${
                    highlighted ? `brush-effect brush-${color}` : ""
                  }`}
                  style={{ opacity: visible ? 1 : 0.15 }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
        <div className="mt-12">
          <AnimatedButton href="#contact">
            {content.about.ctaPrimary}
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}
