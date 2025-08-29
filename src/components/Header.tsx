"use client";

import { useState, useRef, useLayoutEffect } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Home, User, Briefcase, Mail, Film, type LucideIcon } from "lucide-react";

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

export default function Header() {
  const [activeIndex, setActiveIndex] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<gsap.core.Timeline | null>(null);
  const introPlayedRef = useRef(false);

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

  useLayoutEffect(() => {
    positionJumpersAt(iconCentersX[0]);
    if (introPlayedRef.current) return;
    introPlayedRef.current = true;
    gsap.to(".jumper", { duration: 0.5, y: yCenter - JUMPER_SIZE / 2 - 18, yoyo: true, repeat: 1, ease: "sine.inOut", stagger: 0.05, willChange: "transform" });
  }, []);

  const handleIconClick = (targetIndex: number) => {
    if (animRef.current && animRef.current.isActive()) animRef.current.progress(1);

    const fromX = iconCentersX[activeIndex];
    const toX = iconCentersX[targetIndex];
    const { d, dur } = buildPath(fromX, toX);

    gsap.set("#main-path", { attr: { d } });
    animRef.current = gsap.timeline().to(".jumper", { motionPath: { path: d, align: "#main-path", alignOrigin: [0.5, 0.5] }, duration: dur, stagger: 0.1, ease: "sine.inOut", willChange: "transform" });

    setActiveIndex(targetIndex);
    document.querySelector(navItems[targetIndex].href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex justify-center px-2.5 py-1.25 rounded-xl shadow-md border header-glass" style={{ backgroundColor: "var(--header-bg)" }}>
      <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="overflow-visible">
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
            <g key={item.name} className="cursor-pointer" onClick={() => handleIconClick(index)} transform={`translate(${iconCentersX[index] - ICON_WIDTH / 2}, ${yCenter - ICON_WIDTH / 2})`}>
              <rect width={ICON_WIDTH} height={ICON_WIDTH} fill="transparent" />
              <item.icon className={clsx("transition-transform duration-300 will-change-transform", "nav-icon", activeIndex === index ? "scale-110" : "scale-100")} x={ICON_WIDTH / 2 - 16} y={ICON_WIDTH / 2 - 16} width={32} height={32} strokeWidth={1.5} />
            </g>
          ))}
        </g>
        <path id="main-path" d="" fill="none" />
      </svg>
    </header>
  );
}
