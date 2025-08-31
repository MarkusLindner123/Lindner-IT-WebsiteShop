"use client";

import { useState, useEffect } from "react";
import { motion, Variants, Transition } from "framer-motion";
import "@/app/globals.css";

export default function PageLoader({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval: number = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Variants für die Rakete (draw/un-draw)
  const drawAnimation: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 3, ease: "easeInOut" } as Transition,
    },
  };

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-primary-dark z-[9999]">
          {/* 🚀 Raketen-Icon */}
          <motion.svg
            className="w-32 h-32 mb-6"
            viewBox="0 0 64 64"
            fill="none"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Raketenform */}
            <motion.path
              d="M32 2 L42 22 L32 42 L22 22 Z M32 42 L32 62"
              variants={drawAnimation}
              initial="hidden"
              animate="visible"
            />
          </motion.svg>

          {/* Ladebalken */}
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-one transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-white font-medium">{Math.min(progress, 100)}%</div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
