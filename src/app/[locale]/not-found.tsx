// app/[locale]/not-found.tsx
"use client"; // needed for animations and useTranslations

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

interface NotFoundPageProps {
  locale: string;
}

export default function NotFoundPage({ locale }: NotFoundPageProps) {
  const t = useTranslations("notFound");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-6">
      {/* Bouncing & zooming logo */}
      <motion.img
        src="/logo.png"
        alt="Logo"
        className="w-32 h-32"
        animate={{ scale: [0.8, 1.2, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />

      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-lg text-gray-600">{t("subtitle")}</p>

      <Link
        href={`/${locale}`} // ensures the "Back Home" link respects the current locale
        className="inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
