// src/components/Header.tsx

"use client";

import { useState, useRef, useLayoutEffect, useEffect, useMemo } from "react";
import gsap from "gsap";
import { Home, User, Cpu, Mail, Menu, X, type LucideIcon } from "lucide-react";
import clsx from "clsx"; // Hilfsbibliothek für Klassen, `npm install clsx`

// --- Typen und Konfiguration ---
type NavItem = { name: string; href: string; icon: LucideIcon };

const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Services", href: "#services", icon: Cpu },
  { name: "About", href: "#about", icon: User },
  { name: "Contact", href: "#contact", icon: Mail },
];

const HEADER_CONFIG = {
  desktop: {
    iconWidth: 63,
    iconMargin: 27,
    jumperSize: 72,
    svgIconSize: 32,
    iconOffsetX: 120,
    headerPadding: 30,
    topPosition: 10,
  },
  mobile: {
    iconWidth: 54,
    iconMargin: 18,
    jumperSize: 64,
    svgIconSize: 28,
    iconOffsetX: 90,
    headerPadding: 15,
    topPosition: 20, // <<< KORREKTUR: Position auf Mobile höher gesetzt
  },
  svgHeight: 90,
};

// --- Custom Hook für Media Queries ---
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

// --- Die Header Komponente ---
export default function Header() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const headerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const jumper1Ref = useRef<SVGRectElement>(null);
  const jumper2Ref = useRef<SVGRectElement>(null);
  
  // <<< NEU: Ref und Timeout zur Steuerung der Klick-vs-Scroll-Logik
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const config = useMemo(() => (isMobile ? HEADER_CONFIG.mobile : HEADER_CONFIG.desktop), [isMobile]);
  const yCenter = HEADER_CONFIG.svgHeight / 2;

  const iconCentersX = useMemo(() =>
    NAV_ITEMS.map((_, i) => config.iconOffsetX + i * (config.iconWidth + config.iconMargin) + config.jumperSize / 2),
  [config]);
  
  const svgWidth = useMemo(() =>
    iconCentersX[iconCentersX.length - 1] + config.iconWidth / 2 + config.headerPadding,
  [iconCentersX, config]);

  const logoX = config.iconOffsetX - config.iconWidth - config.iconMargin;

  // --- Effekt 1: Jumper Animation (Reagiert auf activeIndex) ---
  useEffect(() => {
    if (!jumper1Ref.current || !jumper2Ref.current) return;

    const targetX = iconCentersX[activeIndex] - config.jumperSize / 2;
    const targetY = yCenter - config.jumperSize / 2;

    gsap.to(jumper1Ref.current, {
      x: targetX,
      y: targetY,
      duration: 0.8,
      ease: "power4.out",
      overwrite: "auto",
    });

    gsap.to(jumper2Ref.current, {
      x: targetX,
      y: targetY,
      duration: 0.4,
      ease: "expo.out",
      delay: 0.05,
    });
  }, [activeIndex, config, iconCentersX, yCenter]);


  // --- Effekt 2: Scroll-Beobachtung mit IntersectionObserver ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // <<< KORREKTUR: Ignoriere Observer-Events während des Klick-Scrolls
        if (isClickScrollingRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            const newIndex = NAV_ITEMS.findIndex((item) => item.href === `#${id}`);
            if (newIndex !== -1) {
              setActiveIndex(newIndex);
            }
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    NAV_ITEMS.forEach((item) => {
      const element = document.querySelector(item.href);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);


  // --- Effekt 3: Positionierung und Sichtbarkeit des Headers ---
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const targetY = isMobile && !isMobileMenuOpen ? -150 : config.topPosition;
    gsap.to(headerRef.current, {
      width: svgWidth,
      y: targetY,
      opacity: isMobile && !isMobileMenuOpen ? 0 : 1,
      duration: 0.5,
      ease: "power3.out",
    });
    gsap.set(headerRef.current, {
      left: "50%",
      xPercent: -50,
      pointerEvents: isMobile && !isMobileMenuOpen ? "none" : "auto",
    });
  }, [isMobile, isMobileMenuOpen, svgWidth, config.topPosition]);


  // --- Effekt 4: Rotation des Hamburger-Icons ---
  useEffect(() => {
    if (!menuButtonRef.current) return;
    gsap.to(menuButtonRef.current.querySelector("svg"), {
      rotate: isMobileMenuOpen ? 180 : 0,
      duration: 0.4,
      ease: "back.inOut(1.7)",
    });
  }, [isMobileMenuOpen]);


  // --- Handler-Funktion für Klicks ---
  const handleIconClick = (index: number) => {
    const targetElement = document.querySelector(NAV_ITEMS[index].href);
    if (targetElement) {
      // <<< KORREKTUR: Scroll-Sperre aktivieren
      isClickScrollingRef.current = true;
      setActiveIndex(index);

      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

      // <<< KORREKTUR: Menü bleibt auf Mobile offen
      // if (isMobile) {
      //   setIsMobileMenuOpen(false); // DIESE ZEILE WURDE ENTFERNT
      // }

      // Hebe die Sperre nach 1 Sekunde wieder auf
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 1000); // 1000ms ist eine sichere Dauer für die meisten "smooth" Scrolls
    }
  };

  return (
    <>
      <button
        ref={menuButtonRef}
        className="fixed top-4 right-4 z-[60] p-2 w-14 h-14 rounded-full bg-[rgba(10,17,40,0.6)] flex items-center justify-center shadow-lg backdrop-blur-sm md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="text-white h-8 w-8" /> : <Menu className="text-white h-8 w-8" />}
      </button>

      <div
        ref={headerRef}
        className="fixed z-50 flex justify-center px-2.5 py-1.25 rounded-xl shadow-md border header-glass opacity-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={svgWidth}
          height={HEADER_CONFIG.svgHeight}
          viewBox={`0 0 ${svgWidth} ${HEADER_CONFIG.svgHeight}`}
          className="overflow-visible"
        >
          <defs>
            <filter id="gooey-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>

          <g filter="url(#gooey-filter)">
            {/* <<< KORREKTUR: `fill` entfernt, Styling via CSS-Klasse .jumper */}
            <rect ref={jumper1Ref} width={config.jumperSize} height={config.jumperSize} rx="26" ry="26" className="jumper" />
            <rect ref={jumper2Ref} width={config.jumperSize} height={config.jumperSize} rx="26" ry="26" className="jumper" />
          </g>

          <g className="cursor-pointer" onClick={() => (window.location.href = "/")} transform={`translate(${logoX}, ${yCenter - config.iconWidth / 2})`}>
            <rect width={config.iconWidth} height={config.iconWidth} fill="transparent" />
            <image
              href="/logo-white.svg"
              width={config.svgIconSize}
              height={config.svgIconSize}
              x={(config.iconWidth - config.svgIconSize) / 2}
              y={(config.iconWidth - config.svgIconSize) / 2}
            />
          </g>

          <g id="icons">
            {NAV_ITEMS.map((item, index) => (
              <g
                key={item.name}
                // <<< KORREKTUR: Dynamische Klassen für CSS-Styling
                className={clsx("cursor-pointer nav-icon-group", { "active": activeIndex === index })}
                onClick={() => handleIconClick(index)}
                transform={`translate(${iconCentersX[index] - config.iconWidth / 2}, ${yCenter - config.iconWidth / 2})`}
              >
                <rect width={config.iconWidth} height={config.iconWidth} fill="transparent" />
                <item.icon
                  // <<< KORREKTUR: `color` prop entfernt, Styling via CSS
                  className="nav-icon"
                  x={config.iconWidth / 2 - config.svgIconSize / 2}
                  y={config.iconWidth / 2 - config.svgIconSize / 2}
                  width={config.svgIconSize}
                  height={config.svgIconSize}
                  strokeWidth={1.5}
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </>
  );
}