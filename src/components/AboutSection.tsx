"use client";

import React, { useEffect, useRef, useState } from "react";
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

  const content = {
    about: { title: t("title"), text: t("text"), ctaPrimary: t("ctaPrimary") },
  };

  const highlightWords = [
    "solutions",
    "lösungen",
    "scalable",
    "skalierbar",
    "design",
    "results",
    "ergebnisse",
  ];

  const words = content.about.text
    .split("\n")
    .flatMap((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return [];
      const parts = trimmed.split(/\s+/);
      const result: { word: string; index: number }[] = [];
      parts.forEach((w, wIdx) => {
        result.push({ word: w, index: lineIdx * 1000 + wIdx * 2 });
        if (wIdx < parts.length - 1)
          result.push({ word: " ", index: lineIdx * 1000 + wIdx * 2 + 1 });
      });
      if (lineIdx < content.about.text.split("\n").length - 1) {
        result.push({ word: "\n", index: lineIdx * 1000 + parts.length * 2 });
      }
      return result;
    })
    .filter(({ word }) => word !== "");

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
  }, [content.about.text]);

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
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <section
      id="about"
      className="mx-auto max-w-3xl px-6 py-20 md:py-28 lg:px-8 lg:py-32"
    >
      <h2 className="mb-12 text-3xl font-extrabold tracking-tight text-[var(--color-primary)] md:text-4xl">
        {content.about.title}
      </h2>
      <div className="max-w-[600px] space-y-8 text-xl md:text-2xl text-gray-900">
        <div ref={ref} className="leading-loose">
          {words.map(({ word, index }, idx) => {
            if (word === "\n") return <br key={index} />;
            if (word === " ") return <span key={index}>&nbsp;</span>;

            const visible = idx <= Math.floor(words.length * progress);
            const clean = word.replace(/[.,!?–]/g, "").toLowerCase();
            const highlighted = highlightWords.includes(clean);
            const color = highlighted ? highlightColorMap[index] || "red" : "";

            return (
              <span
                key={index}
                className={`inline-block mr-1 transition-all duration-500 ease-out ${
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
    </section>
  );
}
