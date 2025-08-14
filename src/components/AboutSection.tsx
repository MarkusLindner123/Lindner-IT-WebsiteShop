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

// Hardcoded JSON text for testing (mimics de.json)
const content = {
  about: {
    title: "About Us",
    text: "We build scalable solutions for your business needs.\n" +
          "Our approach combines thoughtful design with robust architecture.\n" +
          "Whether you’re a solo entrepreneur or a global enterprise, our team creates user-friendly platforms.\n" +
          "We specialize in crafting websites and apps that are both beautiful and scalable.\n" +
          "Our process ensures clear communication, measurable outcomes, and innovative solutions.\n" +
          "From concept to launch, we focus on performance-driven design that grows with your goals.\n" +
          "Our expertise spans modern technologies, delivering reliable and efficient results.\n" +
          "Let’s partner to transform your ideas into digital success.",
    ctaPrimary: "Request a Quote",
  },
};

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [highlightColorMap, setHighlightColorMap] = useState<{
    [key: number]: string;
  }>({});

  // Words to highlight (case-insensitive)
  const highlightWords = ["solutions", "scalable", "design", "results"];

  // Split text into words, preserving newlines and removing unwanted spaces
  const words = content.about.text
    .split("\n")
    .flatMap((line, lineIdx) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return [{ word: "\n", index: lineIdx * 1000 }]; // Handle empty lines
      const lineWords = trimmedLine.split(/\s+/); // Split on one or more spaces
      const result: { word: string; index: number }[] = [];
      lineWords.forEach((word, wordIdx) => {
        result.push({ word, index: lineIdx * 1000 + wordIdx * 2 }); // Unique index for words
        if (wordIdx < lineWords.length - 1) {
          result.push({ word: " ", index: lineIdx * 1000 + wordIdx * 2 + 1 }); // Space between words
        }
      });
      result.push({ word: "\n", index: lineIdx * 1000 + lineWords.length * 2 }); // Newline at end
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
  }, []); // Run once on mount

  // Throttled scroll handler to reduce CPU usage
  useEffect(() => {
    let lastScroll = 0;
    const throttleDelay = 100; // Throttle to 100ms

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScroll < throttleDelay) return;
      lastScroll = now;

      if (!ref.current) return;

      const { top, bottom, height } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress: 0 when top of section enters viewport, 1 when bottom is near viewport bottom
      const newProgress = Math.min(
        Math.max(0, (windowHeight - top) / (height + windowHeight * 0.1)),
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

      <div className="mt-12 flex justify-start">
        <AnimatedButton href="#contact">{content.about.ctaPrimary}</AnimatedButton>
      </div>
    </section>
  );
}