"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FileText,
  Award,
  GraduationCap,
  Trophy,
  ShieldCheck,
  Database,
  Cloud,
  type LucideIcon,
} from "lucide-react";
import "./AboutSection.css"; // Brush-Effekt

const brushColors = [
  "yellow", "blue", "green", "red", "orange", "purple", "teal", "indigo", "lime"
];

const aboutImages = [
  "/about-images/about1.webp",
  "/about-images/about2.webp",
  "/about-images/about3.webp",
  "/about-images/about4.webp",
];

// Highlight-Wörter pro Sprache — müssen wörtlich in den about-Texten
// (messages/*.json) vorkommen, sonst wird nichts markiert
const highlightWordsEn = [
  "specialist", "bilingual", "administration", "development",
  "websites", "Siemens", "infrastructure", "ELK-stack",
  "automation", "freelance", "firms", "cloud",
  "analysis", "scalable", "secure", "cybersecurity",
  "reliability", "reliable", "growth-driven", "SMEs"
];

const highlightWordsDe = [
  "Fachinformatiker", "IHK-Abschluss", "Systemadministration", "Softwareentwicklung",
  "zweisprachig", "Websites", "Siemens", "IT-Infrastruktur",
  "ELK-Stack", "Automatisierung", "Freelancer", "Kanzleien",
  "Cloud-Systeme", "Netzwerkinstallationen", "Analyse", "skalierbare",
  "Cybersicherheit", "Datenschutz", "zuverlässige", "wachstumsorientierte"
];

const highlightWordsPl = [
  "specjalistą", "dwujęzycznie", "administrację", "programowaniem",
  "Siemens", "infrastrukturze", "ELK-Stack", "automatyzacji",
  "freelancer", "kancelarii", "chmurowe", "analizy",
  "skalowalne", "bezpieczne", "cyberbezpieczeństwa", "niezawodne",
  "MŚP", "strony"
];

// Satzzeichen, die vor dem Wortvergleich entfernt werden
const PUNCTUATION_RE = /[.,!?:;()„“”–—]/g;

const CERT_BADGES: { key: "ihk" | "python" | "cpp" | "siemens" | "elastic" | "azure"; icon: LucideIcon }[] = [
  { key: "ihk", icon: GraduationCap },
  { key: "python", icon: Trophy },
  { key: "cpp", icon: Trophy },
  { key: "siemens", icon: ShieldCheck },
  { key: "elastic", icon: Database },
  { key: "azure", icon: Cloud },
];

export default function AboutSection() {
  const t = useTranslations("about");
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [speedFactor, setSpeedFactor] = useState(1.2);
  const pathname = usePathname();

  const sections = useMemo(
    () => ({
      background: { title: t("background.title"), text: t("background.text") },
      experience: { title: t("experience.title"), text: t("experience.text") },
      approach: { title: t("approach.title"), text: t("approach.text") },
      whyMe: { title: t("whyMe.title"), text: t("whyMe.text") },
    }),
    [t]
  );

  const paragraphs = useMemo(
    () => [sections.background.text, sections.experience.text, sections.approach.text, sections.whyMe.text],
    [sections]
  );

  // Sprache wählen
  const highlightWords = useMemo(() => {
    if (pathname.startsWith("/en")) return highlightWordsEn;
    if (pathname.startsWith("/pl")) return highlightWordsPl;
    return highlightWordsDe;
  }, [pathname]);

  const highlightWordsSet = useMemo(
    () => new Set(highlightWords.map(w => w.toLowerCase())),
    [highlightWords]
  );

  // Wörter für Animation vorbereiten
  const allWords = useMemo(() => {
    let globalIndex = 0;
    return paragraphs.map((paragraph) => {
      const paragraphWords = paragraph.split(/\s+/).flatMap((word, wIdx, arr) => {
        const result: { word: string; index: number }[] = [];
        if (word) result.push({ word, index: globalIndex++ });
        if (wIdx < arr.length - 1) result.push({ word: " ", index: globalIndex++ });
        return result;
      });
      paragraphWords.push({ word: "\n", index: globalIndex++ });
      return paragraphWords;
    });
  }, [paragraphs]);

  // Highlight-Farben zuordnen
  const highlightColorMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    let ci = 0;
    allWords.flat().forEach(({ word, index }) => {
      const clean = word.replace(PUNCTUATION_RE, "").toLowerCase();
      if (highlightWordsSet.has(clean)) {
        map[index] = brushColors[ci % brushColors.length];
        ci++;
      }
    });
    return map;
  }, [allWords, highlightWordsSet]);

  // Scroll-Animation
  useEffect(() => {
    const handleResize = () => setSpeedFactor(window.innerWidth < 768 ? 1.12 : 1.21);
    handleResize();
    window.addEventListener("resize", handleResize);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const { top, height } = sectionRef.current.getBoundingClientRect();
          const wh = window.innerHeight;
          const scrollProgress = (wh - top) / (height + wh);
          const progress = Math.min(Math.max(0, scrollProgress * speedFactor), 1);
          const totalPhases = allWords.length * 2;

          itemRefs.current.forEach((item, paraIdx) => {
            if (!item) return;
            const imagePhaseIndex = paraIdx * 2;
            const textPhaseIndex = paraIdx * 2 + 1;
            const phaseLength = 1 / totalPhases;
            const imageStart = imagePhaseIndex * phaseLength;
            const textStart = textPhaseIndex * phaseLength;

            const imageProgress = Math.min(Math.max(0, progress - imageStart) / phaseLength, 1);
            const textProgress = Math.min(Math.max(0, progress - textStart) / phaseLength, 1);

            const imageOverlay = item.querySelector(".image-overlay") as HTMLElement;
            if (imageOverlay) imageOverlay.style.transform = `scaleY(${1 - imageProgress})`;

            const titleElement = item.querySelector(".animated-title") as HTMLElement;
            if (titleElement) titleElement.style.opacity = textProgress > 0 ? "1" : "0.15";

            const words = item.querySelectorAll(".animated-word");
            const totalWords = words.length;
            const wordsToReveal = Math.floor(totalWords * textProgress);
            words.forEach((wordElement, idx) => {
              (wordElement as HTMLElement).style.opacity = idx < wordsToReveal ? "1" : "0.15";
            });
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [speedFactor, allWords]);

  const titles = [sections.background.title, sections.experience.title, sections.approach.title, sections.whyMe.title];

  return (
    <div ref={sectionRef} className="relative z-10">
      {/* Kicker */}
      <div className="mb-6">
        <div className="inline-flex px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10">
          {t("kicker")}
        </div>
      </div>

      {/* Headline (h2: die Seite hat genau eine h1 im Hero) */}
      <h2 className="mb-16 text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-black font-headline">
        {t("title")}
      </h2>

      {/* Content-Items */}
      <div className="space-y-12">
        {allWords.map((paragraphWords, paraIdx) => (
          <div
            key={paraIdx}
            ref={el => { itemRefs.current[paraIdx] = el; }}
            className="flex flex-col md:flex-row md:space-x-12 space-y-6 md:space-y-0 items-start"
          >
            {/* Bild */}
            <div className="relative w-full h-[250px] md:w-[350px] md:h-[250px] rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={aboutImages[paraIdx]}
                alt={titles[paraIdx]}
                width={350}
                height={250}
                sizes="(min-width: 768px) 350px, 100vw"
                className="object-cover w-full h-full rounded-xl"
              />
              <div
                className="image-overlay absolute inset-0 bg-white/70 backdrop-blur-sm rounded-xl"
                style={{ transform: `scaleY(1)`, transformOrigin: "bottom" }}
              />
            </div>

            {/* Text */}
            <div className="w-full md:w-[calc(100%-350px-3rem)] text-xl md:text-2xl text-gray-900 leading-loose">
              <h3 className="animated-title text-4xl md:text-5xl font-bold mb-4" style={{ opacity: 0.15 }}>
                {titles[paraIdx]}
              </h3>
              {paragraphWords.map(({ word, index }) => {
                if (word === "\n") return null;
                const clean = word.replace(PUNCTUATION_RE, "").toLowerCase();
                const highlighted = highlightWordsSet.has(clean);
                const color = highlighted ? highlightColorMap[index] || "red" : "";
                return (
                  <span
                    key={index}
                    className={`animated-word inline-block ${highlighted ? `brush-effect brush-${color}` : ""}`}
                    style={{ opacity: 0.15 }}
                  >
                    {word === " " ? <span>&nbsp;</span> : word}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Abschlüsse & Zertifikate als Badges */}
      <div className="mt-20">
        <h3 className="text-3xl md:text-4xl font-bold mb-8">{t("certs.title")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CERT_BADGES.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-200"
            >
              <span className="flex-shrink-0 w-11 h-11 rounded-full bg-accent-two/15 text-primary-dark flex items-center justify-center">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-primary-dark">
                  {t(`certs.${key}.title`)}
                </span>
                <span className="block text-sm text-neutral mt-1">
                  {t(`certs.${key}.sub`)}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Downloads: Lebenslauf & Zeugnisse (PDFs in /public/docs) */}
      <div className="mt-16 flex flex-col sm:flex-row gap-4">
        <a
          href="/docs/Lebenslauf_Markus_Lindner.pdf"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
        >
          <FileText size={20} aria-hidden="true" />
          {t("downloads.cv")}
        </a>
        <a
          href="/docs/Zeugnisse_Markus_Lindner.pdf"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
        >
          <Award size={20} aria-hidden="true" />
          {t("downloads.certificates")}
        </a>
      </div>
    </div>
  );
}
