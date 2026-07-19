"use client";

import React from "react";

interface AnimatedButtonProps {
  children: React.ReactNode;
}

// Die rotierende Gradient-Border läuft komplett in CSS
// (@property --gradient-angle + Keyframes in globals.css).
export function AnimatedButton({ children }: AnimatedButtonProps) {
  const handleClick = () => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button onClick={handleClick} className="border-gradient" type="button">
      {children}
    </button>
  );
}
