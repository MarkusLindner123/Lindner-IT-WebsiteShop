"use client";

import { ReactNode } from "react";

interface CardProps {
  id?: string;
  children: ReactNode;
  className?: string; // für zusätzlichen bg oder custom styles
}

export function Card({ id, children, className = "" }: CardProps) {
  return (
    <section
      id={id}
      className={`card ${className}`}
    >
      {children}
    </section>
  );
}
