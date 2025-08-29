"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import {
  Home,
  User,
  Briefcase,
  Mail,
  ChevronDown,
  Code,
  PenTool,
  BarChart,
  Film,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(MotionPathPlugin);

type SubItem = { name: string; href: string; icon: LucideIcon };
type NavItem = { name: string; href: string; icon: LucideIcon; subItems?: SubItem[] };

const navItems: NavItem[] = [
  { name: "Hero Video", href: "#home", icon: Film },
  { name: "Home", href: "#home-main", icon: Home },
  { name: "About", href: "#about", icon: User },
  {
    name: "Services",
    href: "#services",
    icon: Briefcase,
    subItems: [
      { name: "Web Development", href: "#", icon: Code },
      { name: "UI/UX Design", href: "#", icon: PenTool },
      { name: "SEO", href: "#", icon: BarChart },
    ],
  },
  { name: "Contact", href: "#contact", icon: Mail },
];

const SERVICES_INDEX = navItems.findIndex((n) => n.subItems);
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
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const svgRef = useRef<SVGSVGElement>(null);
  const servicesIconRef = useRef<SVGGElement>(null);
  const animRef = useRef<gsap.core.Timeline | null>(null);
  const introPlayedRef = useRef(false);

  const buildPath = (fromX: number, toX: number) => {
    const travel = Math.abs(fromX - toX);
    const factor = gsap.utils.mapRange(ICON_TOTAL_WIDTH, SVG_WIDTH, 0.5, 1)(travel);
    const dur = 1 * factor;
    const arc = yCenter - 100 * factor;
    const d = `M${fromX},${yCenter} Q${travel / 2 + Math.min(fromX, toX)},${arc} ${toX},${yCenter}`;
    return { d, dur };
  };

  const positionJumpersAt = (x: number) => {
    gsap.set(".jumper", {
      x: x - JUMPER_SIZE / 2,
      y: yCenter - JUMPER_SIZE / 2,
      willChange: "transform",
    });
  };

  const computeDropdownPosition = () => {
    if (!svgRef.current || !servicesIconRef.current) return { top: 0, left: 0 };
    const svgRect = svgRef.current.getBoundingClientRect();
    const iconRect = servicesIconRef.current.getBoundingClientRect();
    const arrowOffset = ICON_WIDTH / 2 + 18;
    const arrowLeft = iconRect.left + arrowOffset;
    return {
      top: svgRect.top + yCenter + JUMPER_SIZE / 2 + 8,
      left: arrowLeft,
    };
  };

  useLayoutEffect(() => {
    positionJumpersAt(iconCentersX[0]);

    if (introPlayedRef.current) return;
    introPlayedRef.current = true;

    gsap.to(".jumper", {
      duration: 0.6,
      y: yCenter - JUMPER_SIZE / 2 - 18,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut",
    });
  }, []);

  const handleIconClick = (targetIndex: number) => {
    if (navItems[targetIndex].subItems) {
      setDropdownPos(computeDropdownPosition());
      setDropdownVisible((v) => !v);
    } else {
      setDropdownVisible(false);
    }

    if (targetIndex === activeIndex) {
      document.querySelector(navItems[targetIndex].href)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (animRef.current && animRef.current.isActive()) animRef.current.progress(1);

    const fromX = iconCentersX[activeIndex];
    const toX = iconCentersX[targetIndex];
    const { d, dur } = buildPath(fromX, toX);

    gsap.set("#main-path", { attr: { d } });

    animRef.current = gsap.timeline().to(".jumper", {
      motionPath: {
        path: d,
        align: "#main-path",
        alignOrigin: [0.5, 0.5],
      },
      duration: dur,
      stagger: 0.14,
      ease: "sine.inOut",
      willChange: "transform",
    });

    setActiveIndex(targetIndex);
    document.querySelector(navItems[targetIndex].href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex justify-center px-2.5 py-1.25 rounded-xl shadow-md border header-glass"
        style={{ backgroundColor: "var(--header-bg)" }}
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
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -7"
                result="goo"
              />
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
                ref={index === SERVICES_INDEX ? servicesIconRef : null}
                className="cursor-pointer"
                onClick={() => handleIconClick(index)}
                transform={`translate(${iconCentersX[index] - ICON_WIDTH / 2}, ${
                  yCenter - ICON_WIDTH / 2
                })`}
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
                {item.subItems && (
                  <ChevronDown
                    className={clsx(
                      "nav-icon subtle-rotate",
                      isDropdownVisible && index === SERVICES_INDEX ? "rotate-180" : "rotate-0"
                    )}
                    x={ICON_WIDTH / 2 + 18}
                    y={ICON_WIDTH / 2 - 6}
                    width={16}
                    height={16}
                    strokeWidth={2}
                  />
                )}
              </g>
            ))}
          </g>

          <path id="main-path" d="" fill="none" />
        </svg>
      </header>

      <AnimatePresence>
        {isDropdownVisible && SERVICES_INDEX >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-[60] w-56 dropdown-panel"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
              transform: "translateX(-50%)",
            }}
          >
            {navItems[SERVICES_INDEX].subItems!.map((sub) => (
              <Link
                key={sub.name}
                href={sub.href}
                className="dropdown-item"
                onClick={() => setDropdownVisible(false)}
              >
                <sub.icon className="dropdown-item-icon" size={16} />
                {sub.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
