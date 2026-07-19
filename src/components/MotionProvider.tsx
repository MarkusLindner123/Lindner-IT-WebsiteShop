"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

// reducedMotion="user": framer-motion deaktiviert Transform-Animationen
// automatisch, wenn das Betriebssystem "Bewegung reduzieren" meldet.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
