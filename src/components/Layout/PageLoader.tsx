"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import "@/app/globals.css";

export default function PageLoader({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Dauer der Simulation
  const updateInterval = 200; // ms

  useEffect(() => {
    const interval: number = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + Math.floor(Math.random() * 5);
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, []);

  // Logo-Fortschritt leicht schneller als Ladebalken
  const logoProgress = Math.min(progress * 1.2, 100); // 20% schneller
  const clipValue = 100 - logoProgress; // invertiert für clipPath

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-primary-dark z-[9999]">
          {/* Logo zeichnen leicht schneller */}
          <motion.div
            className="w-[40vw] h-auto mb-12 relative overflow-hidden"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: `inset(${clipValue}% 0% 0% 0%)` }}
            transition={{ duration: updateInterval / 1000, ease: "linear" }}
          >
            <Image
              src="/logo-white.svg"
              alt="Logo"
              width={500}
              height={200}
              priority
            />
          </motion.div>

          {/* Ladebalken komplett weiß */}
          <div className="w-2/3 h-8 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 text-white font-medium text-2xl">
            {Math.min(progress, 100)}%
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
