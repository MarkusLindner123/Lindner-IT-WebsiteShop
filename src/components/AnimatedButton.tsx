// src/components/AnimatedBorderButton.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

interface AnimatedButtonProps {
  href: string;
  children: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ href, children }) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = buttonRef.current;
    if (!element) return;

    let angle = 0;
    const rotateGradient = () => {
      angle = (angle + 2) % 360; // schneller drehen
      element.style.setProperty("--gradient-angle", `${angle}deg`);
      requestAnimationFrame(rotateGradient);
    };

    rotateGradient();
  }, []);

  return (
    <Link href={href} ref={buttonRef} className="border-gradient">
      {children}
    </Link>
  );
};

export default AnimatedButton;
