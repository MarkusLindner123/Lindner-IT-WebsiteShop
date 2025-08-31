"use client";
import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import gsap from "gsap";
import { Home, User, Cpu, Mail, Menu, X, type LucideIcon } from "lucide-react";

type NavItem = { name: string; href: string; icon: LucideIcon };
const navItems: NavItem[] = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Services", href: "#services", icon: Cpu },
  { name: "About", href: "#about", icon: User },
  { name: "Contact", href: "#contact", icon: Mail },
];

// Feste Werte für Desktop
const DESKTOP_ICON_WIDTH = 63;
const DESKTOP_ICON_MARGIN = 27;
const DESKTOP_JUMPER_SIZE = 72;
const SVG_HEIGHT = 90;
const yCenter = SVG_HEIGHT / 2;
const DESKTOP_HEADER_PADDING = 30;

// Feste Werte für Mobile
const MOBILE_ICON_WIDTH = 54;
const MOBILE_ICON_MARGIN = 18;
const MOBILE_JUMPER_SIZE = 64;
const MOBILE_SVG_ICON_SIZE = 28;
const MOBILE_ICON_OFFSET_X = 90;
const MOBILE_HEADER_PADDING = 15;

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

// Debounce-Funktion zur Verzögerung von Aktionen
const debounce = (func: (...args: unknown[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export default function Header() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Dynamische Werte basierend auf isMobile
  const iconWidth = isMobile ? MOBILE_ICON_WIDTH : DESKTOP_ICON_WIDTH;
  const iconMargin = isMobile ? MOBILE_ICON_MARGIN : DESKTOP_ICON_MARGIN;
  const jumperSize = isMobile ? MOBILE_JUMPER_SIZE : DESKTOP_JUMPER_SIZE;
  const iconOffsetX = isMobile ? MOBILE_ICON_OFFSET_X : 120;
  const headerPadding = isMobile ? MOBILE_HEADER_PADDING : DESKTOP_HEADER_PADDING;
  const iconCentersX = navItems.map((_, i) => iconOffsetX + i * (iconWidth + iconMargin) + jumperSize / 2);
  const logoX = iconOffsetX - iconWidth - iconMargin;

  const getSvgWidth = useCallback(() => {
    const lastIconPosition = iconCentersX[iconCentersX.length - 1];
    return lastIconPosition + iconWidth / 2 + headerPadding;
  }, [iconWidth, iconCentersX, headerPadding]);

  // ---- Jumper Animation ----
  const animateJumperTo = useCallback((targetIndex: number, duration = 0.7) => {
    const toX = iconCentersX[targetIndex] - jumperSize / 2;
    // Der erste Jumper (im Vordergrund) zieht sanft nach
    gsap.to(".jumper:nth-child(1)", {
      x: toX,
      y: yCenter - jumperSize / 2,
      duration: duration,
      ease: "power3.out",
      overwrite: "auto",
    });
    // Der zweite Jumper (im Hintergrund) springt sofort
    gsap.set(".jumper:nth-child(2)", { x: toX, y: yCenter - jumperSize / 2 });
  }, [iconCentersX, jumperSize]);

  const positionJumpersAt = useCallback((x: number) => {
    gsap.set(".jumper:nth-child(1)", { x: x - jumperSize / 2, y: yCenter - jumperSize / 2 });
    gsap.set(".jumper:nth-child(2)", { x: x - jumperSize / 2, y: yCenter - jumperSize / 2 });
  }, [jumperSize]);

  const handleIconClick = (targetIndex: number) => {
    const el = document.querySelector(navItems[targetIndex].href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      // Direkt den Jumper zur geklickten Position animieren
      animateJumperTo(targetIndex);
    }
  };

  // ---- Initial Setup ----
  useLayoutEffect(() => {
    positionJumpersAt(iconCentersX[activeIndex]);
  }, [positionJumpersAt, iconCentersX, activeIndex]);

  // ---- Mobile Menu Rotation ----
  useEffect(() => {
    if (!menuButtonRef.current) return;
    const icon = menuButtonRef.current.querySelector("svg");
    if (!icon) return;
    gsap.to(icon, { rotate: isMobileMenuOpen ? 90 : 0, duration: 0.4, ease: "power2.inOut" });
  }, [isMobileMenuOpen]);

  // ---- Header Positioning & Animation ----
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const topPosition = isMobile ? 42 : 10;
    gsap.set(headerRef.current, {
      top: `${topPosition}px`,
      left: "50%",
      xPercent: -50,
      width: getSvgWidth(),
      opacity: 1,
      pointerEvents: "auto",
    });
  }, [isMobile, getSvgWidth]);

  // Überarbeitete Mobile-Animation: Sanftes Ein- und Ausblenden
  useEffect(() => {
    if (!headerRef.current || !isMobile) return;
    gsap.to(headerRef.current, {
      y: isMobileMenuOpen ? 0 : -100, // Sanft von oben nach unten einblenden
      opacity: isMobileMenuOpen ? 1 : 0,
      pointerEvents: isMobileMenuOpen ? "auto" : "none",
      duration: 0.4,
      ease: "power2.inOut",
    });
  }, [isMobileMenuOpen, isMobile]);

  // ---- Scroll Listener: Jumper automatisch animieren ----
  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      let newIndex = activeIndex;

      let found = false;
      navItems.forEach((item, index) => {
        const el = document.querySelector(item.href);
        if (!el || found) return;
        const rect = el.getBoundingClientRect();
        const top = scrollY + rect.top;
        const bottom = top + rect.height;

        // Bessere Logik: Jumper zur Mitte des Viewports
        if (scrollY + viewportHeight * 0.5 >= top && scrollY + viewportHeight * 0.5 < bottom) {
          newIndex = index;
          found = true;
        }
      });

      if (newIndex !== activeIndex) {
        animateJumperTo(newIndex, 0.7); // Angepasste Dauer
        setActiveIndex(newIndex);
      }
    }, 200); // Debounce-Zeit von 200ms

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeIndex, animateJumperTo]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        ref={menuButtonRef}
        className="fixed top-[2.5%] right-[2.5%] z-[60] p-2 w-14 h-14 rounded-full bg-[rgba(10,17,40,0.6)] flex items-center justify-center shadow-lg backdrop-blur-sm md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="text-white h-8 w-8" /> : <Menu className="text-white h-8 w-8" />}
      </button>
      {/* Header */}
      <div ref={headerRef} className="fixed z-50 flex justify-center px-2.5 py-1.25 rounded-xl shadow-md border header-glass">
        <svg xmlns="http://www.w3.org/2000/svg" width={getSvgWidth()} height={SVG_HEIGHT} viewBox={`0 0 ${getSvgWidth()} ${SVG_HEIGHT}`} className="overflow-visible">
          <defs>
            <filter id="gooey-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -7" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
          <g filter="url(#gooey-filter)">
            <rect className="jumper" width={jumperSize} height={jumperSize} rx="26" ry="26" />
            <rect className="jumper" width={jumperSize} height={jumperSize} rx="26" ry="26" />
          </g>
          {/* Logo */}
          <g className="cursor-pointer" onClick={() => (window.location.href = "/")} transform={`translate(${logoX}, ${yCenter - iconWidth / 2})`}>
            <rect width={iconWidth} height={iconWidth} fill="transparent" />
            <image
              href="/logo-white.svg"
              width={isMobile ? MOBILE_SVG_ICON_SIZE : 32}
              height={isMobile ? MOBILE_SVG_ICON_SIZE : 32}
              x={(iconWidth - (isMobile ? MOBILE_SVG_ICON_SIZE : 32)) / 2}
              y={(iconWidth - (isMobile ? MOBILE_SVG_ICON_SIZE : 32)) / 2}
            />
          </g>
          {/* Icons */}
          <g id="icons">
            {navItems.map((item, index) => (
              <g key={item.name} className="cursor-pointer" onClick={() => handleIconClick(index)} transform={`translate(${iconCentersX[index] - iconWidth / 2}, ${yCenter - iconWidth / 2})`}>
                <rect width={iconWidth} height={iconWidth} fill="transparent" />
                <item.icon
                  className="transition-transform duration-300 will-change-transform nav-icon"
                  x={iconWidth / 2 - (isMobile ? MOBILE_SVG_ICON_SIZE / 2 : 16)}
                  y={iconWidth / 2 - (isMobile ? MOBILE_SVG_ICON_SIZE / 2 : 16)}
                  width={isMobile ? MOBILE_SVG_ICON_SIZE : 32}
                  height={isMobile ? MOBILE_SVG_ICON_SIZE : 32}
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