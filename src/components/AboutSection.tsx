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
      className="mx-auto max-w-3xl px-6 py-20 md:py