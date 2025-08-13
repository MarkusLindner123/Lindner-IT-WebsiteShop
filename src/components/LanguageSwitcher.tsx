"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function LanguageSwitcher() {
  const pathname = usePathname(); // interner Pfad ohne Locale‑Prefix
  const router = useRouter();
  const t = useTranslations("Switcher");

  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border px-2 py-1">
      <span className="text-sm opacity-70">{t("label")}</span>
      <button
        className="rounded-xl px-2 py-1 text-sm hover:bg-black/5"
        onClick={() => router.replace(pathname, { locale: "en" })}
        aria-label="Switch to English"
      >
        {t("en")}
      </button>
      <button
        className="rounded-xl px-2 py-1 text-sm hover:bg-black/5"
        onClick={() => router.replace(pathname, { locale: "de" })}
        aria-label="Auf Deutsch umschalten"
      >
        {t("de")}
      </button>
    </div>
  );
}
