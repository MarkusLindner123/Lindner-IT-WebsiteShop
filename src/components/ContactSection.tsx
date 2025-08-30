"use client";

import { useTranslations } from "next-intl";
import { motion, Variants } from "framer-motion";

export default function ContactSection() {
  const t = useTranslations("contact");

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <motion.section
      aria-label="Kontaktbereich"
      className="bg-services-section-bg py-16"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Kicker */}
        <motion.div variants={fadeUp} className="mb-4">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10">
            {t("kicker")}
          </div>
        </motion.div>

        {/* Titel */}
        <motion.h2
          variants={fadeUp}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-primary-dark font-headline mb-4"
        >
          {t("title")}
        </motion.h2>

        {/* Untertitel */}
        <motion.p
          variants={fadeUp}
          className="text-neutral text-lg sm:text-xl mb-8"
        >
          {t("subtitle")}
        </motion.p>

        {/* Formular-Karte */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-10 space-y-6"
        >
          <form
            action="https://formspree.io/f/yourFormId"
            method="POST"
            className="space-y-6"
          >
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-contact-label mb-1">
                {t("form.name")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl border border-contact-border focus:outline-none focus:ring-2 focus:ring-accent-one"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-contact-label mb-1">
                {t("form.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-contact-border focus:outline-none focus:ring-2 focus:ring-accent-one"
              />
            </div>

            {/* Telefon */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-contact-label mb-1">
                {t("form.phone")}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 rounded-xl border border-contact-border focus:outline-none focus:ring-2 focus:ring-accent-one"
              />
            </div>

            {/* Grund */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-contact-label mb-1">
                {t("form.reason")}
              </label>
              <select
                id="reason"
                name="reason"
                required
                className="w-full px-4 py-3 rounded-xl border border-contact-border focus:outline-none focus:ring-2 focus:ring-accent-one"
              >
                <option value="">{t("form.reasonPlaceholder")}</option>
                <option value="quote">{t("form.options.quote")}</option>
                <option value="support">{t("form.options.support")}</option>
                <option value="general">{t("form.options.general")}</option>
              </select>
            </div>

            {/* Nachricht */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-contact-label mb-1">
                {t("form.message")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-xl border border-contact-border focus:outline-none focus:ring-2 focus:ring-accent-one"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
              >
                {t("form.submit")}
              </button>
              <a
                href="tel:+491628036905"
                className="inline-flex items-center justify-center px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
              >
                Anrufen
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
}