"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Settings, X } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import "flag-icons/css/flag-icons.min.css";

type Language = {
  locale: AppLocale;
  flag: string; // ISO-Code für flag-icons ('gb' für Englisch)
  label: string;
};

const languages: Language[] = [
  { locale: "de", flag: "de", label: "Deutsch" },
  { locale: "en", flag: "gb", label: "English" },
  { locale: "pl", flag: "pl", label: "Polski" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  // Slide Animation
  useEffect(() => {
    if (!menuRef.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isOpen) {
      gsap.to(menuRef.current, {
        y: 0,
        opacity: 1,
        duration: reduce ? 0 : 0.4,
        ease: "power2.out",
        pointerEvents: "auto",
      });
    } else {
      gsap.to(menuRef.current, {
        y: 50,
        opacity: 0,
        duration: reduce ? 0 : 0.3,
        ease: "power2.in",
        pointerEvents: "none",
      });
    }
  }, [isOpen]);

  // next-intl-Router: ersetzt die Locale im aktuellen Pfad korrekt
  // (inkl. präfix-freiem Deutsch durch localePrefix "as-needed")
  const handleChangeLanguage = (lang: Language) => {
    router.replace(pathname, { locale: lang.locale });
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed bottom-6 right-[2.5%] z-50 w-14 h-14 rounded-full bg-[rgba(10,17,40,0.6)] flex items-center justify-center shadow-lg backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sprache wählen / Choose language"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="text-white w-7 h-7" /> : <Settings className="text-white w-7 h-7" />}
      </button>

      {/* Language Menu */}
      <div
        ref={menuRef}
        className="fixed bottom-20 right-[2.5%] flex flex-col gap-3 bg-[rgba(10,17,40,0.6)] backdrop-blur-md p-3 rounded-2xl shadow-lg z-[70] pointer-events-none opacity-0 translate-y-12"
      >
        {languages.map((lang) => {
          const isActive = currentLocale === lang.locale;
          return (
            <button
              key={lang.locale}
              lang={lang.locale}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-accent-two text-primary-dark"
                  : "hover:bg-white/10 text-white"
              }`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => handleChangeLanguage(lang)}
            >
              <span className={`fi fi-${lang.flag} w-6 h-4 rounded-sm`} aria-hidden="true" />
              <span className="font-medium">{lang.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
