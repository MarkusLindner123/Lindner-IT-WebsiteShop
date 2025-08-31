"use client";
import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import clsx from "clsx";
import gsap from "gsap";
import Link from "next/link";
import { Home, User, Cpu, Mail, Menu, X, type LucideIcon } from "lucide-react";

type NavItem = { name: string; href: string; icon: LucideIcon };
const navItems: NavItem[] = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Services", href: "#services", icon: Cpu },
  { name: "About", href: "#about", icon: User },
  { name: "Contact", href: "#contact", icon: Mail },
];

const ICON_WIDTH = 63;
const ICON_MARGIN = 27;
const ICON_TOTAL_WIDTH = ICON_WIDTH + ICON_MARGIN;
const SVG_HEIGHT = 90;
const JUMPER_SIZE = 72;
const iconCentersX = navItems.map((_, i) => 120 + i * ICON_TOTAL_WIDTH + JUMPER_SIZE / 2); // 120px Abstand für Logo
const yCenter = SVG_HEIGHT / 2;

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

export default function Header() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const animRef = useRef<gsap.core.Timeline | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  // ---- Jumper Animation ----
  const animateJumperTo = useCallback((targetIndex: number) => {
    if (animRef.current) animRef.current.kill();
    const toX = iconCentersX[targetIndex] - JUMPER_SIZE / 2;

    animRef.current = gsap.timeline({ defaults: { duration: 0.7, ease: "power2.inOut", willChange: "transform" } })
      .to(".jumper", {
        x: toX,
        y: yCenter - JUMPER_SIZE / 2,
        stagger: 0.05,
      });
  }, []);

  const positionJumpersAt = useCallback((x: number) => {
    gsap.set(".jumper", { x: x - JUMPER_SIZE / 2, y: yCenter - JUMPER_SIZE / 2, willChange: "transform" });
  }, []);

  const handleIconClick = (targetIndex: number) => {
    if (targetIndex === activeIndex) return;
    animateJumperTo(targetIndex);
    setActiveIndex(targetIndex);

    const el = document.querySelector(navItems[targetIndex].href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ---- Initial Setup ----
  useLayoutEffect(() => {
    positionJumpersAt(iconCentersX[0]);
  }, [positionJumpersAt]);

  // ---- Mobile Menu Rotation ----
  useEffect(() => {
    if (!menuButtonRef.current) return;
    const icon = menuButtonRef.current.querySelector("svg");
    if (!icon) return;
    gsap.to(icon, { rotate: isMobileMenuOpen ? 90 : 0, duration: 0.4, ease: "power2.inOut" });
  }, [isMobileMenuOpen]);

  // ---- Header Positioning ----
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const topPosition = isMobile ? 35 : 10;
    gsap.set(headerRef.current, {
      xPercent: isMobile ? 150 : -50,
      scale: isMobile ? 0.8 : 1,
      opacity: isMobile ? 0 : 1,
      pointerEvents: isMobile ? "none" : "auto",
      top: `${topPosition}px`,
      left: "50%",
    });
  }, [isMobile]);

  useEffect(() => {
    if (!headerRef.current || !isMobile) return;
    const topPosition = 35;
    gsap.to(headerRef.current, {
      xPercent: isMobileMenuOpen ? -50 : 150,
      scale: 0.8,
      opacity: isMobileMenuOpen ? 1 : 0,
      pointerEvents: isMobileMenuOpen ? "auto" : "none",
      duration: 0.4,
      ease: "power3.inOut",
      top: `${topPosition}px`,
    });
  }, [isMobileMenuOpen, isMobile]);

  // ---- Scroll Listener: Jumper automatisch animieren ----
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      let newIndex = activeIndex;

      navItems.forEach((item, index) => {
        const el = document.querySelector(item.href);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const top = scrollY + rect.top;
        const bottom = top + rect.height;

        if (scrollY + viewportHeight / 2 >= top && scrollY + viewportHeight / 2 < bottom) {
          newIndex = index;
        }
      });

      if (newIndex !== activeIndex) {
        animateJumperTo(newIndex);
        setActiveIndex(newIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeIndex, animateJumperTo]);

  const SVG_WIDTH = iconCentersX[iconCentersX.length - 1] + ICON_WIDTH / 2 + 10;

  return (
    <>
      {/* Hamburger Button */}
      <button
        ref={menuButtonRef}
        className="fixed top-[2.5%] right-[2.5%] z-[60] p-2 rounded-full backdrop-blur-sm md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="text-white h-8 w-8" /> : <Menu className="text-white h-8 w-8" />}
      </button>

      {/* Header */}
      <div
        ref={headerRef}
        className="fixed z-50 flex justify-center px-2.5 py-1.25 rounded-xl shadow-md border header-glass"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="overflow-visible"
        >
          <defs>
            <filter id="gooey-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -7" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
          <g filter="url(#gooey-filter)">
            <rect className="jumper" width={JUMPER_SIZE} height={JUMPER_SIZE} rx="26" ry="26" />
            <rect className="jumper" width={JUMPER_SIZE} height={JUMPER_SIZE} rx="26" ry="26" />
          </g>

          {/* Logo */}
          <Link href="/">
            <image href="/logo-white.svg" width="90" height="70" x="10" y={yCenter - 35} />
          </Link>

          {/* Icons */}
          <g id="icons">
            {navItems.map((item, index) => (
              <g
                key={item.name}
                className="cursor-pointer"
                onClick={() => handleIconClick(index)}
                transform={`translate(${iconCentersX[index] - ICON_WIDTH / 2}, ${yCenter - ICON_WIDTH / 2})`}
              >
                <rect width={ICON_WIDTH} height={ICON_WIDTH} fill="transparent" />
                <item.icon
                  className={clsx(
                    "transition-transform duration-300 will-change-transform nav-icon",
                    activeIndex === index ? "scale-110" : "scale-100"
                  )}
                  x={ICON_WIDTH / 2 - 16}
                  y={ICON_WIDTH / 2 - 16}
                  width={32}
                  height={32}
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
