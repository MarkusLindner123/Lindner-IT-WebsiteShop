"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Briefcase, Clock, Mail, Phone, Send, X } from "lucide-react";

type FormStatus = "idle" | "sending" | "success" | "error";

// Animiertes Häkchen für den Success-Toast (Kreis + Haken zeichnen sich)
function AnimatedCheck() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="flex-shrink-0 mt-0.5" aria-hidden="true">
      <motion.circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke="#FACC15"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.path
        d="M11 18.5l4.5 4.5L25 14"
        fill="none"
        stroke="#34D399"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function ContactSection() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<FormStatus>("idle");

  // Toast nach 7s automatisch ausblenden
  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const timer = window.setTimeout(() => setStatus("idle"), 7000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-contact-border bg-white focus:outline-none focus:ring-2 focus:ring-accent-two focus:border-transparent transition-shadow";

  return (
    <motion.div
      aria-label="Kontaktbereich"
      className="py-16"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="w-full">
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
        <motion.p variants={fadeUp} className="text-neutral text-lg sm:text-xl mb-6">
          {t("subtitle")}
        </motion.p>

        {/* B2B-Hinweis (laienverständlich): nur Firmenkunden */}
        <motion.div
          variants={fadeUp}
          className="flex items-start gap-3 p-4 rounded-xl bg-accent-one/10 border border-accent-one/50 mb-10 max-w-3xl"
        >
          <Briefcase size={20} className="flex-shrink-0 mt-0.5 text-primary-dark" aria-hidden="true" />
          <p className="text-sm text-primary-dark m-0">{t("b2bNote")}</p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-[1fr_320px] items-start">
          {/* Formular → POST /api/contact (nodemailer, Strato-SMTP) */}
          <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot gegen Spam-Bots: unsichtbar, Server verwirft Einsendungen mit Inhalt */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-contact-label mb-1">
                  {t("form.name")} *
                </label>
                <input type="text" id="name" name="name" required maxLength={200} className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-contact-label mb-1">
                  {t("form.email")} *
                </label>
                <input type="email" id="email" name="email" required maxLength={200} className={inputClass} />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-contact-label mb-1">
                  {t("form.phone")}
                </label>
                <input type="tel" id="phone" name="phone" maxLength={100} className={inputClass} />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-contact-label mb-1">
                  {t("form.company")}
                </label>
                <input type="text" id="company" name="company" maxLength={200} className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-contact-label mb-1">
                {t("form.reason")}
              </label>
              <select id="reason" name="reason" required className={inputClass}>
                <option value="">{t("form.reasonPlaceholder")}</option>
                <option value="quote">{t("form.options.quote")}</option>
                <option value="support">{t("form.options.support")}</option>
                <option value="general">{t("form.options.general")}</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-contact-label mb-1">
                {t("form.message")} *
              </label>
              <textarea id="message" name="message" rows={5} required maxLength={5000} className={inputClass} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary-dark text-white font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "sending" ? (
                  <>
                    <span
                      className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                      aria-hidden="true"
                    />
                    {t("form.sending")}
                  </>
                ) : (
                  <>
                    <Send size={18} aria-hidden="true" />
                    {t("form.submit")}
                  </>
                )}
              </button>
              <a
                href="tel:+491628036905"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
              >
                <Phone size={18} aria-hidden="true" />
                {t("form.call")}
              </a>
            </div>
          </motion.form>

          {/* Info-Panel: direkter Kontakt + B2B-Badge */}
          <motion.aside
            variants={fadeUp}
            className="rounded-2xl bg-primary-dark text-white p-7 h-fit"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent-one/15 border border-accent-one/40 text-accent-one mb-5">
              <Briefcase size={13} aria-hidden="true" />
              {t("b2bBadge")}
            </span>
            <h3 className="text-xl font-bold text-white mb-3">{t("infoTitle")}</h3>
            <a
              href="tel:+491628036905"
              className="flex items-center gap-3 text-gray-200 hover:text-white py-2"
            >
              <Phone size={18} className="text-accent-two flex-shrink-0" aria-hidden="true" />
              +49 162 8036905
            </a>
            <a
              href="mailto:markuslindner1998@gmail.com"
              className="flex items-center gap-3 text-gray-200 hover:text-white py-2 break-all"
            >
              <Mail size={18} className="text-accent-two flex-shrink-0" aria-hidden="true" />
              markuslindner1998@gmail.com
            </a>
            <p className="flex items-center gap-3 text-gray-300 py-2 m-0">
              <Clock size={18} className="text-accent-one flex-shrink-0" aria-hidden="true" />
              {t("infoResponse")}
            </p>
          </motion.aside>
        </div>
      </div>

      {/* Toast: Anfrage versendet / Fehler */}
      <AnimatePresence>
        {(status === "success" || status === "error") && (
          <motion.div
            key="contact-toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 46, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="fixed bottom-6 right-6 z-[200] w-[min(92vw,380px)] rounded-2xl bg-primary-dark text-white shadow-2xl overflow-hidden"
          >
            <div
              className={`h-1 w-full ${
                status === "success"
                  ? "bg-gradient-to-r from-accent-one to-accent-two"
                  : "bg-red-500"
              }`}
            />
            <div className="flex items-start gap-4 p-5">
              {status === "success" ? (
                <AnimatedCheck />
              ) : (
                <span
                  className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-full border-2 border-red-400 text-red-400 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <X size={20} />
                </span>
              )}
              <div className="min-w-0">
                <p className="font-bold m-0">
                  {status === "success" ? t("form.successTitle") : t("form.errorTitle")}
                </p>
                <p className="text-sm text-gray-300 mt-1 mb-0">
                  {status === "success" ? t("form.successText") : t("form.errorText")}
                </p>
              </div>
              <button
                onClick={() => setStatus("idle")}
                aria-label="OK"
                className="ml-auto flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
