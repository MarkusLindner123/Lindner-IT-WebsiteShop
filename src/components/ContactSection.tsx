"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function ContactSection() {
  const t = useTranslations("contact");

  // Variants for staggering child animations
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      aria-label="Contact"
      className="relative overflow-hidden bg-services-section-bg rounded-2xl shadow-xl"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 lg:py-20 relative z-10">
        {/* Kicker */}
        <motion.div variants={item} className="flex justify-left mb-8">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10">
            {t("kicker")}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-black font-headline mb-8"
        >
          {t("title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={item} className="text-services-card-description mb-8">
          {t("subtitle")}
        </motion.p>

        {/* Form */}
        <motion.form
          variants={item}
          action="https://formspree.io/f/yourFormId"
          method="POST"
          className="bg-services-card p-6 rounded-xl shadow-lg space-y-6"
        >
          {/* Name */}
          <motion.div variants={item}>
            <label className="block text-services-card-title font-medium mb-1">
              {t("form.name")}
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={item}>
            <label className="block text-services-card-title font-medium mb-1">
              {t("form.email")}
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </motion.div>

          {/* Phone */}
          <motion.div variants={item}>
            <label className="block text-services-card-title font-medium mb-1">
              {t("form.phone")}
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="tel"
              name="phone"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </motion.div>

          {/* Reason */}
          <motion.div variants={item}>
            <label className="block text-services-card-title font-medium mb-1">
              {t("form.reason")}
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              name="reason"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">{t("form.reasonPlaceholder")}</option>
              <option value="quote">{t("form.options.quote")}</option>
              <option value="support">{t("form.options.support")}</option>
              <option value="general">{t("form.options.general")}</option>
            </motion.select>
          </motion.div>

          {/* Message */}
          <motion.div variants={item}>
            <label className="block text-services-card-title font-medium mb-1">
              {t("form.message")}
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              name="message"
              rows={5}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </motion.div>

          {/* Submit */}
          <motion.div variants={item}>
            <motion.button
              type="submit"
              className="btn-primary w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {t("form.submit")}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
}
