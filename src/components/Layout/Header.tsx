// src/components/Header.tsx

"use client";

import { useState, useRef, useLayoutEffect, useEffect, useMemo } from "react";
import gsap from "gsap";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Home, User, Cpu, Mail, Menu, X, BookOpen, type LucideIcon } from "lucide-react";
import clsx from "clsx";

// --- Typen und Konfiguration ---
// Anker-Links (#...) scrollen zu Sektionen der Startseite,
// Seiten-Links (/...) navigieren über den next-intl-Router.
type NavItem = {
  key: "home" | "services" | "about" | "contact" | "blog";
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "#home", icon: Home },
  { key: "services", href: "#services", icon: Cpu },
  { key: "about", href: "#about", icon: User },
  { key: "contact", href: "#contact", icon: Mail },
  { key: "blog", href: "#blog", icon: BookOpen },
];

const HEADER_CONFIG = {
  desktop: {
    iconWidth: 63,
    iconMargin: 27,
    jumperSize: 72,
    svgIconSize: 32,
    iconOffsetX: 120,
    headerPadding: 30,
    // Absoluter Viewport-Abstand (nav hat top-0): entspricht dem alten
    // Look auf der Startseite (128px kollabierter Hero-Margin - 80px)
    topPosition: 48,
    scrollOffset: 100,
  },
  mobile: {
    // Kompakter als Desktop: 5 Icons müssen auch auf 360px-Displays passen
    iconWidth: 44,
    iconMargin: 11,
    jumperSize: 56,
    svgIconSize: 24,
    iconOffsetX: 58,
    headerPadding: 10,
    topPosition: 42,
    scrollOffset: 80,
  },
  svgHeight: 90,
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const jumper1Ref = useRef<SVGRectElement>(null);
  const jumper2Ref = useRef<SVGRectElement>(null);

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
  const homeHref = locale === "de" ? "/" : `/${locale}`;

  // Effekt 1: Jumper Animation
  useEffect(() => {
    if (!jumper1Ref.current || !jumper2Ref.current) return;

    const reduce = prefersReducedMotion();
    const targetX = iconCentersX[activeIndex] - config.jumperSize / 2;
    const targetY = yCenter - config.jumperSize / 2;

    gsap.to(jumper1Ref.current, {
      x: targetX,
      y: targetY,
      duration: reduce ? 0 : 0.8,
      ease: "power4.out",
      overwrite: "auto",
    });

    gsap.to(jumper2Ref.current, {
      x: targetX,
      y: targetY,
      duration: reduce ? 0 : 0.4,
      ease: "expo.out",
      delay: reduce ? 0 : 0.05,
    });
  }, [activeIndex, config, iconCentersX, yCenter]);

  // Effekt 2: Scroll-Beobachtung
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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
      if (!item.href.startsWith("#")) return; // Seiten-Links haben keine Sektion
      const element = document.querySelector(item.href);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Auf Blog-Seiten das Blog-Icon als aktiv markieren
  useEffect(() => {
    if (pathname.startsWith("/blog")) {
      const blogIndex = NAV_ITEMS.findIndex((item) => item.key === "blog");
      if (blogIndex !== -1) setActiveIndex(blogIndex);
    }
  }, [pathname]);

  // Effekt 3: Positionierung des Headers
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const reduce = prefersReducedMotion();
    const targetY = isMobile && !isMobileMenuOpen ? -150 : config.topPosition;
    gsap.to(headerRef.current, {
      width: svgWidth,
      y: targetY,
      opacity: isMobile && !isMobileMenuOpen ? 0 : 1,
      duration: reduce ? 0 : 0.5,
      ease: "power3.out",
    });
    gsap.set(headerRef.current, {
      left: "50%",
      xPercent: -50,
      pointerEvents: isMobile && !isMobileMenuOpen ? "none" : "auto",
    });
  }, [isMobile, isMobileMenuOpen, svgWidth, config.topPosition]);

  // Effekt 4: Rotation des Hamburger-Icons
  useEffect(() => {
    if (!menuButtonRef.current) return;
    gsap.to(menuButtonRef.current.querySelector("svg"), {
      rotate: isMobileMenuOpen ? 180 : 0,
      duration: prefersReducedMotion() ? 0 : 0.4,
      ease: "back.inOut(1.7)",
    });
  }, [isMobileMenuOpen]);

  // Handler-Funktion für Klicks
  const handleIconClick = (index: number) => {
    const item = NAV_ITEMS[index];

    // Seiten-Links (z. B. /blog): locale-bewusst navigieren statt scrollen
    if (!item.href.startsWith("#")) {
      setActiveIndex(index);
      setIsMobileMenuOpen(false);
      router.push(item.href);
      return;
    }

    const targetElement = document.querySelector(item.href);

    // Auf Unterseiten (z. B. /blog) existieren die Sektionen nicht —
    // dann zurück zur Startseite mit Anker navigieren
    if (!targetElement) {
      const base = locale === "de" ? "/" : `/${locale}`;
      window.location.href = `${base}${item.href}`;
      return;
    }

    if (targetElement) {
      isClickScrollingRef.current = true;
      setActiveIndex(index);

      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - config.scrollOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 1000);
    }
  };

  return (
    <>
      <button
        ref={menuButtonRef}
        className="fixed top-4 right-4 z-[999] p-2 w-14 h-14 rounded-full bg-[rgba(10,17,40,0.6)] flex items-center justify-center shadow-lg backdrop-blur-sm md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
        aria-expanded={isMobileMenuOpen}
        aria-controls="main-nav"
      >
        {isMobileMenuOpen ? <X className="text-white h-8 w-8" /> : <Menu className="text-white h-8 w-8" />}
      </button>

      {/* top-0 ist Pflicht: ohne explizites top hängt die Position der
          fixed-Nav vom kollabierenden Margin der ersten Homepage-Card ab
          und verrutscht auf Unterseiten (Blog, Impressum …) */}
      <nav
        ref={headerRef}
        id="main-nav"
        aria-label={t("ariaLabel")}
        className="fixed top-0 z-[100] flex justify-center px-2.5 py-1.25 rounded-xl shadow-md border header-glass opacity-0"
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
            <rect ref={jumper1Ref} width={config.jumperSize} height={config.jumperSize} rx="26" ry="26" className="jumper" />
            <rect ref={jumper2Ref} width={config.jumperSize} height={config.jumperSize} rx="26" ry="26" className="jumper" />
          </g>

          {/* Logo als echter Link (fokussierbar, behält die Sprache bei).
              transform liegt auf der inneren <g>, da Reacts Anker-Typen
              kein transform-Attribut kennen. */}
          <a href={homeHref} aria-label="Lindner IT">
            <g transform={`translate(${logoX}, ${yCenter - config.iconWidth / 2})`}>
              <rect width={config.iconWidth} height={config.iconWidth} fill="transparent" />
              <image
                href="/logo-white.svg"
                width={config.svgIconSize}
                height={config.svgIconSize}
                x={(config.iconWidth - config.svgIconSize) / 2}
                y={(config.iconWidth - config.svgIconSize) / 2}
              />
            </g>
          </a>

          {/* Navigation: echte Anker-Links statt klickbarer <g>-Gruppen,
              damit Tastatur & Screenreader sie erreichen */}
          <g id="icons">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.key}
                href={
                  item.href.startsWith("#") || locale === "de"
                    ? item.href
                    : `/${locale}${item.href}`
                }
                aria-label={t(item.key)}
                aria-current={activeIndex === index ? "true" : undefined}
                className={clsx("cursor-pointer nav-icon-group", { active: activeIndex === index })}
                onClick={(e) => {
                  e.preventDefault();
                  handleIconClick(index);
                }}
              >
                <g transform={`translate(${iconCentersX[index] - config.iconWidth / 2}, ${yCenter - config.iconWidth / 2})`}>
                  <rect width={config.iconWidth} height={config.iconWidth} fill="transparent" />
                  <item.icon
                    className="nav-icon"
                    x={config.iconWidth / 2 - config.svgIconSize / 2}
                    y={config.iconWidth / 2 - config.svgIconSize / 2}
                    width={config.svgIconSize}
                    height={config.svgIconSize}
                    strokeWidth={1.5}
                  />
                </g>
              </a>
            ))}
          </g>
        </svg>
      </nav>
    </>
  );
}
