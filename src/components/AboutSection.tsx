"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [highlightColorMap, setHighlightColorMap] = useState<{
    [key: number]: string;
  }>({});

  // Hardcoded example text with highlighted words and newlines
  const fullText = [
    "We build scalable solutions for your business.",
    "Our approach combines thoughtful design with robust architecture.",
    "From startups to enterprises, we deliver results that grow with you.",
    "Let’s create something amazing together."
  ].join("\n");

  // Split text into words, preserving newlines and removing unwanted spaces
  const words = fullText
    .split(/(\s+|\n)/)
    .reduce<{ word: string; index: number }[]>((acc, word, idx, arr) => {
      // Skip empty strings or leading whitespace at the start
      if (word.trim() === "" && acc.length === 0) return acc;
      // Skip whitespace immediately after a newline
      if (
        word.trim() === "" &&
        acc.length > 0 &&
        acc[acc.length - 1].word === "\n"
      )
        return acc;
      // Normalize multiple spaces to a single space, but only between words
      if (
        word.trim() === "" &&
        acc.length > 0 &&
        acc[acc.length - 1].word !== "\n" &&
        acc[acc.length - 1].word.trim() === ""
      )
        return acc;
      // Convert single spaces to " " explicitly, preserve newlines and words
      const normalizedWord = word === "\n" ? "\n" : word.trim() === "" ? " " : word;
      return [...acc, { word: normalizedWord, index: idx }];
    }, []);

  // Debug: Log the words array to inspect the output
  console.log("Processed words:", words);

  // Words to highlight (case-insensitive)
  const highlightWords = [
    "solutions",
    "scalable",
    "design",
    "results",
  ];

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
  }, []); // Run once on mount, since fullText is now hardcoded

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
        About Us
      </h2>

      <div className="ml-12 max-w-[600px] space-y-8 text-xl font-[var(--font-sans)] md:text-2xl lg:ml-24">
        <div ref={ref} className="leading-loose">
          {words.map(({ word, index }, idx) => {
            if (word === "\n") return <br key={index} />;
            if (word === " ")
              return (
                <span key={index} className="inline-block">
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
          Request a Quote
        </AnimatedButton>
      </div>
    </section>
  );
}