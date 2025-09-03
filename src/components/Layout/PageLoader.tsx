"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import "@/app/globals.css";

interface PageLoaderProps {
  children: React.ReactNode;
  imagePaths?: string[];
}

export default function PageLoader({ children, imagePaths = [] }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackedImages = ["/logo-white.svg", ...imagePaths];
    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      const newProgress = Math.min(Math.round((loadedCount / trackedImages.length) * 100), 100);
      setProgress(newProgress);
      if (newProgress === 100) {
        setTimeout(() => setLoading(false), 200);
      }
    };

    trackedImages.forEach((src) => {
      const img: HTMLImageElement = new window.Image();
      img.src = src;
      if (img.complete) {
        updateProgress();
      } else {
        img.onload = updateProgress;
        img.onerror = updateProgress;
      }
    });
  }, [imagePaths]); // useEffect jetzt sauber

  const logoProgress = Math.min(progress * 1.2, 100);
  const clipValue = 100 - logoProgress;

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-primary-dark z-[9999]">
          <motion.div
            className="w-1/2 md:w-[40vw] h-auto mb-12 relative overflow-hidden"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: `inset(${clipValue}% 0% 0% 0%)` }}
            transition={{ duration: 0.15, ease: "linear" }}
          >
            <Image
              src="/logo-white.svg"
              alt="Logo"
              width={500}
              height={200}
              priority
            />
          </motion.div>

          <div className="w-1/2 md:w-[40vw] h-8 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 text-white font-medium text-2xl">
            {progress}%
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
