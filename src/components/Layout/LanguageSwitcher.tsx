"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Settings, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import 'flag-icons/css/flag-icons.min.css';

type Language = {
  code: string; // ISO-Code für flag-icons ('de', 'gb', 'fr')
  label: string;
};

const languages: Language[] = [
  { code: "de", label: "Deutsch" },
  { code: "gb", label: "English" }, // flag-icons verwendet 'gb' für UK/English
  { code: "fr", label: "Français" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Slide Animation
  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      gsap.to(menuRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        pointerEvents: "auto",
      });
    } else {
      gsap.to(menuRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        pointerEvents: "none",
      });
    }
  }, [isOpen]);

  const handleChangeLanguage = (lang: Language) => {
    const segments = pathname.split("/");
    segments[1] = lang.code === "gb" ? "en" : lang.code; // Locale setzen
    router.push(segments.join("/"));
    setIsOpen(false);
  };

  // aktuelle Sprache ermitteln
  let currentLang = pathname.split("/")[1];
  if (pathname === "/") {
    currentLang = "en"; // Root zeigt Englisch
  }
  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed bottom-6 right-[2.5%] z-50 w-14 h-14 rounded-full bg-[rgba(10,17,40,0.6)] flex items-center justify-center shadow-lg backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle language menu"
      >
        {isOpen ? <X className="text-white w-7 h-7" /> : <Settings className="text-white w-7 h-7" />}
      </button>

      {/* Language Menu */}
      <div
        ref={menuRef}
        className="fixed bottom-20 right-[2.5%] flex flex-col gap-3 bg-[rgba(10,17,40,0.6)] backdrop-blur-md p-3 rounded-2xl shadow-lg z-[70] pointer-events-none opacity-0 translate-y-12"
      >
        {languages.map((lang) => {
          const isActive = currentLang === (lang.code === "gb" ? "en" : lang.code);
          return (
            <button
              key={lang.code}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-accent-one text-white" // Highlight aus globals.css
                  : "hover:bg-primary-light/20 text-white"
              }`}
              onClick={() => handleChangeLanguage(lang)}
            >
              <span className={`fi fi-${lang.code} w-6 h-4 rounded-sm`} />
              <span className="font-medium">{lang.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
