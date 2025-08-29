"use client";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Home, User, Briefcase, Mail, Film, Menu, X, type LucideIcon } from "lucide-react";

gsap.registerPlugin(MotionPathPlugin);

type NavItem = { name: string; href: string; icon: LucideIcon };
const navItems: NavItem[] = [
  { name: "Hero Video", href: "#home", icon: Film },
  { name: "Home", href: "#home-main", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Services", href: "#services", icon: Briefcase },
  { name: "Contact", href: "#contact", icon: Mail },
];

const ICON_WIDTH = 63;
const ICON_MARGIN = 27;
const ICON_TOTAL_WIDTH = ICON_WIDTH + ICON_MARGIN;
const SVG_WIDTH = navItems.length * ICON_TOTAL_WIDTH - ICON_MARGIN + 20;
const SVG_HEIGHT = 90;
const JUMPER_SIZE = 72;
const iconCentersX = navItems.map((_, i) => 10 + i * ICON_TOTAL_WIDTH + JUMPER_SIZE / 2);
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
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<gsap.core.Timeline | null>(null);
  const introPlayedRef = useRef(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const buildPath = (fromX: number, toX: number) => {
    const travel = Math.abs(fromX - toX);
    const factor = gsap.utils.mapRange(ICON_TOTAL_WIDTH, SVG_WIDTH, 0.5, 1)(travel);
    const dur = 0.7 * factor;
    const arc = yCenter - 100 * factor;
    const d = `M${fromX},${yCenter} Q${travel / 2 + Math.min(fromX, toX)},${arc} ${toX},${yCenter}`;
    return { d, dur };
  };

  const positionJumpersAt = (x: number) => {
    gsap.set(".jumper", { x: x - JUMPER_SIZE / 2, y: yCenter - JUMPER_SIZE / 2, willChange: "transform" });
  };

  // Initial jumper animation
  useLayoutEffect(() => {
    positionJumpersAt(iconCentersX[0]);
    if (introPlayedRef.current) return;
    introPlayedRef.current = true;
    gsap.to(".jumper", {
      duration: 0.5,
      y: yCenter - JUMPER_SIZE / 2 - 18,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut",
      stagger: 0.05,
      willChange: "transform",
    });
  }, []);

  const handleIconClick = (targetIndex: number) => {
    if (animRef.current && animRef.current.isActive()) animRef.current.progress(1);
    const fromX = iconCentersX[activeIndex];
    const toX = iconCentersX[targetIndex];
    const { d, dur } = buildPath(fromX, toX);
    gsap.set("#main-path", { attr: { d } });
    animRef.current = gsap
      .timeline()
      .to(".jumper", {
        motionPath: { path: d, align: "#main-path", alignOrigin: [0.5, 0.5] },
        duration: dur,
        stagger: 0.1,
        ease: "sine.inOut",
        willChange: "transform",
      });
    setActiveIndex(targetIndex);
    document.querySelector(navItems[targetIndex].href)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isMobile) setIsMobileMenuOpen(false);
  }, [isMobile]);

  // Hamburger icon rotation
  useEffect(() => {
    if (!menuButtonRef.current) return;
    const icon = menuButtonRef.current.querySelector("svg");
    if (!icon) return;
    gsap.to(icon, { rotate: isMobileMenuOpen ? 90 : 0, duration: 0.4, ease: "power2.inOut" });
  }, [isMobileMenuOpen]);

  // Initial header setup
  useLayoutEffect(() => {
    if (!headerRef.current) return;

    const topPosition = isMobile ? "7%" : "5%";

    if (isMobile) {
      gsap.set(headerRef.current, {
        xPercent: 150,
        scale: 0.8,
        opacity: 0,
        pointerEvents: "none",
        top: topPosition,
        left: "50%",
      });
    } else {
      gsap.set(headerRef.current, {
        xPercent: -50,
        scale: 1,
        opacity: 1,
        pointerEvents: "auto",
        top: topPosition,
        left: "50%",
      });
    }
  }, [isMobile]);

  // Animate header when menu opens/closes
  useEffect(() => {
    if (!headerRef.current || !isMobile) return;

    const topPosition = "7%";

    if (isMobileMenuOpen) {
      gsap.to(headerRef.current, {
        xPercent: -50,
        scale: 0.8,
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.55,
        ease: "power3.out", // smoother bouncy feel
        top: topPosition,
      });
    } else {
      gsap.to(headerRef.current, {
        xPercent: 150,
        scale: 0.8,
        opacity: 0,
        pointerEvents: "none",
        duration: 0.55,
        ease: "power3.in",
        top: topPosition,
      });
    }
  }, [isMobileMenuOpen, isMobile]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        ref={menuButtonRef}
        className="fixed top-[2.5%] right-[2.5%] z-[60] md:hidden p-2 rounded-full backdrop-blur-sm"
        style={{ backgroundColor: "rgba(10, 17, 40, 0.6)" }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="text-white h-8 w-8" /> : <Menu className="text-white h-8 w-8" />}
      </button>

      {/* Header */}
      <div
        ref={headerRef}
        className="fixed z-50 flex justify-center px-2.5 py-1.25 rounded-xl shadow-md border header-glass"
        style={{ backgroundColor: "rgba(10,17,40,0.75)" }}
      >
        <svg
          ref={svgRef}
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
                    "transition-transform duration-300 will-change-transform",
                    "nav-icon",
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
          <path id="main-path" d="" fill="none" />
        </svg>
      </div>
    </>
  );
}
