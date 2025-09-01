// app/[locale]/not-found.tsx
"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

interface NotFoundPageProps {
  locale: string;
}

export default function NotFoundPage({ locale }: NotFoundPageProps) {
  const t = useTranslations("notFound");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-6 bg-primary-dark text-white">
      {/* Bouncing & zooming logo */}
      <motion.img
        src="/logo-white.svg"
        alt="Logo"
        className="w-32 h-32"
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <h1 className="text-4xl font-bold text-white">{t("title")}</h1>
      <p className="text-lg text-gray-300">{t("subtitle")}</p>

      <Link
        href={`/${locale}`}
        className="inline-flex items-center justify-center px-6 py-4 border border-white/30 rounded-full text-white hover:bg-white/10 hover:-translate-y-1 transition-transform duration-300"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
