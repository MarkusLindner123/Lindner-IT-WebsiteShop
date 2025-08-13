"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link
              href="#contact"
              className="inline-block px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:scale-105 transform transition"
            >
              {t("cta")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
