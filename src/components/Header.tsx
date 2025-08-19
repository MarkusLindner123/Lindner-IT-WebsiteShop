// components/Header.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import clsx from "clsx";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Register the GSAP plugin
gsap.registerPlugin(MotionPathPlugin);

// Define navigation items with icons and links
const navItems = [
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

// --- Static positions to match the original demo's aesthetic ---
const ICON_WIDTH = 70;
const ICON_MARGIN = 30;
const ICON_TOTAL_WIDTH = ICON_WIDTH + ICON_MARGIN;
const SVG_WIDTH = (navItems.length * ICON_TOTAL_WIDTH) - ICON_MARGIN + 20; // Dynamic width
const SVG_HEIGHT = 150;
const JUMPER_SIZE = 80;

const iconPositions = navItems.map((_, i) => 10 + (i * ICON_TOTAL_WIDTH) + (JUMPER_SIZE / 2));
const yCenter = SVG_HEIGHT / 2;
// -------------------------------------------------------------

export default function Header() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const servicesIconRef = useRef<SVGGElement>(null);
  const animRef = useRef<gsap.core.Timeline | null>(null);

  const handleIconClick = (targetIndex: number) => {
    // If clicking the services icon, just toggle the dropdown
    if (navItems[targetIndex].subItems) {
      setDropdownVisible(!isDropdownVisible);
    } else {
      setDropdownVisible(false);
    }
    
    if (targetIndex === activeIndex || (animRef.current && animRef.current.isActive())) {
       document.querySelector(navItems[targetIndex].href)?.scrollIntoView({ behavior: 'smooth' });
       return;
    }

    const oldX = iconPositions[activeIndex];
    const newX = iconPositions[targetIndex];

    const travel = Math.abs(oldX - newX);
    const mapper = gsap.utils.mapRange(ICON_TOTAL_WIDTH, SVG_WIDTH, 0.5, 1);
    const factor = mapper(travel);
    const dur = 1 * factor;
    const newArc = yCenter - 100 * factor;

    const newPath = `M${oldX},${yCenter} Q${travel / 2 + Math.min(oldX, newX)},${newArc} ${newX},${yCenter}`;
    gsap.set("#main-path", { attr: { d: newPath } });

    animRef.current = gsap.timeline()
      .to(".jumper", {
        motionPath: { path: "#main-path", align: "#main-path", alignOrigin: [0.5, 0.5] },
        duration: dur,
        ease: "sine.inOut",
      })
      .to(".jumper", { duration: dur / 2, attr: { rx: 40, ry: 40 }, yoyo: true, repeat: 1 }, 0);

    setActiveIndex(targetIndex);
    document.querySelector(navItems[targetIndex].href)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    gsap.set('.jumper', {
      x: iconPositions[0] - JUMPER_SIZE / 2,
      y: yCenter - JUMPER_SIZE / 2,
    });
  }, []);

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (!svgRef.current || !servicesIconRef.current) return { top: 0, left: 0 };
    const svgRect = svgRef.current.getBoundingClientRect();
    const iconRect = servicesIconRef.current.getBoundingClientRect();
    return {
      top: svgRect.top + yCenter + JUMPER_SIZE / 2,
      left: iconRect.left + iconRect.width / 2,
    };
  };

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex justify-center">
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
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>

          {/* Gooey Jumper Elements */}
          <g filter="url(#gooey-filter)">
            <rect className="jumper" width={JUMPER_SIZE} height={JUMPER_SIZE} rx="26" ry="26" />
            <rect className="jumper" width={JUMPER_SIZE} height={JUMPER_SIZE} rx="26" ry="26" />
          </g>

          {/* Clickable Icons */}
          <g id="icons">
            {navItems.map((item, index) => (
              <g
                key={item.name}
                ref={index === 3 ? servicesIconRef : null} // Ref only for the services icon
                className="cursor-pointer"
                onClick={() => handleIconClick(index)}
                transform={`translate(${iconPositions[index] - ICON_WIDTH/2}, ${yCenter - ICON_WIDTH/2})`}
              >
                {/* Invisible click area */}
                <rect width={ICON_WIDTH} height={ICON_WIDTH} fill="transparent" />
                {/* Centered Icon */}
                <item.icon
                  className={clsx("text-white transition-transform duration-300", activeIndex === index ? "scale-110" : "scale-100")}
                  x={ICON_WIDTH/2 - 16} // Center 32x32 icon
                  y={ICON_WIDTH/2 - 16}
                  width={32}
                  height={32}
                  strokeWidth={1.5}
                />
              </g>
            ))}
          </g>

          <path id="main-path" d="" fill="none" />
        </svg>
      </header>

      {/* Dropdown Menu (Positioned absolutely in the viewport) */}
      <AnimatePresence>
        {isDropdownVisible && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-50 w-56 bg-white rounded-xl shadow-xl p-2"
            style={{
              top: getDropdownPosition().top,
              left: getDropdownPosition().left,
              transform: 'translateX(-50%)', // Center align
            }}
          >
            {navItems[3].subItems?.map((subItem) => (
              <Link
                key={subItem.name}
                href={subItem.href}
                className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                onClick={() => setDropdownVisible(false)}
              >
                <subItem.icon size={16} />
                {subItem.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}