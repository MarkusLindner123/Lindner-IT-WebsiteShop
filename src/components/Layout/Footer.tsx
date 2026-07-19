"use client";

import { Link } from "@/i18n/navigation";
import { Phone, Mail, Copyright } from "lucide-react";
import { useTranslations } from "next-intl";

const linkClass =
  "flex items-center gap-2 text-neutral hover:text-link transition-colors";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 pt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-center gap-8 text-left md:text-center">

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <a href="tel:+491628036905" className={linkClass}>
            <Phone className="w-5 h-5" />
            <span>+49 162 8036 905</span>
          </a>
          <a href="mailto:markuslindner1998@gmail.com" className={linkClass}>
            <Mail className="w-5 h-5" />
            <span>markuslindner1998@gmail.com</span>
          </a>
        </div>

        {/* Footer Navigation — Link aus i18n/navigation behält die Sprache bei */}
        <nav className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-sm">
          <Link href="/#blog" className="text-neutral hover:text-link transition-colors">
            {t("blog")}
          </Link>
          <Link href="/privacy" className="text-neutral hover:text-link transition-colors">
            {t("privacy")}
          </Link>
          <Link href="/imprint" className="text-neutral hover:text-link transition-colors">
            {t("imprint")}
          </Link>
        </nav>

        {/* Copyright */}
        <div className="flex items-start sm:items-center gap-2 text-sm text-gray-400">
          <Copyright className="w-4 h-4" />
          <span>
            {currentYear} Markus Lindner – {t("company")}
          </span>
        </div>

      </div>
    </footer>
  );
}
