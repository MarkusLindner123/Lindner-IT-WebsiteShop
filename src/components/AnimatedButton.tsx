"use client";

import React, { useEffect, useRef } from "react";

interface AnimatedButtonProps {
  children: React.ReactNode;
}

export function AnimatedButton({ children }: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = buttonRef.current;
    if (!element) return;

    let angle = 0;
    const rotateGradient = () => {
      angle = (angle + 2) % 360;
      element.style.setProperty("--gradient-angle", `${angle}deg`);
      requestAnimationFrame(rotateGradient);
    };

    rotateGradient();
  }, []);

  const handleClick = () => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="border-gradient"
      type="button"
    >
      {children}
    </button>
  );
}
