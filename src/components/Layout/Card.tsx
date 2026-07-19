import { ReactNode } from "react";

interface CardProps {
  id?: string;
  children: ReactNode;
  className?: string; // für zusätzliche custom styles
}

export function Card({ id, children, className = "" }: CardProps) {
  return (
    <section id={id} className={`card ${className}`}>
      {children}
    </section>
  );
}
