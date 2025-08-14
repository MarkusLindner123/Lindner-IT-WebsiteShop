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

  // Hardcoded, longer example text with highlighted words and newlines
  const fullText = [
    "We build scalable solutions for your business needs.",
    "Our approach combines thoughtful design with robust architecture to deliver exceptional results.",
    "Whether you’re a solo entrepreneur or a global enterprise, our team creates user-friendly platforms.",
    "We specialize in crafting websites and apps that are both beautiful and scalable.",
    "Our process ensures clear communication, measurable outcomes, and innovative solutions.",
    "From concept to launch, we focus on performance-driven design that grows with your goals.",
    "Our expertise spans modern technologies, delivering reliable and efficient results.",
    "Let’s partner to transform your ideas into digital success."
  ].join("\n");

  // Split text into words, preserving newlines and removing unwanted spaces
  const words = fullText
    .split(/(\n)/) // Split on newlines first
    .flatMap((segment, segmentIdx) =>
      segment === "\n"
        ? [{ word: "\n", index: segmentIdx }]
        : segment
            .trim() // Remove leading/trailing spaces in each segment
            .split(/\s+/) // Split on one or more spaces
            .map((word, wordIdx) => ({
              word,
              index: segmentIdx + wordIdx,
            }))
            .reduce<{ word: string; index: number }[]>((acc, { word, index }, idx, arr) => {
              // Add word
              acc.push({ word, index });
              // Add space between words, but not after the last word
              if (idx < arr.length - 1) {
                acc.push({ word: " ", index: index + 0.5 }); // Unique index for spaces
              }
              return acc;
            }, [])
    )
    .filter(({ word }) => word !== ""); // Remove any empty segments

  // Debug: Log the words array and rendered elements
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
  }, []); // Run once on mount, since fullText is hardcoded

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
      <h2 className="mb-12 text-3xl font-extrabold tracking-tight text-[var(--color-primary)] md:text-4xl">
        About Us
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
        <AnimatedButton href="#contact">
          Request a Quote
        </AnimatedButton>
      </div>
    </section>
  );
}