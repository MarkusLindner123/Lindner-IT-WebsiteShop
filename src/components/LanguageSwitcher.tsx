"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Switcher");

  const switchLocale = (locale: "en" | "de") => {
    router.replace(pathname, { locale });
  };

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-gray-300 bg-white p-1 shadow-sm">
      <span className="text-sm font-medium text-gray-600">{t("label")}</span>

      {["en", "de"].map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale as "en" | "de")}
          className={`
            px-3 py-1 rounded-full text-sm font-semibold
            transition-colors duration-200
            ${
              currentLocale === locale
                ? "bg-brand-primary text-white shadow"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
          aria-label={`Switch to ${locale === "en" ? "English" : "Deutsch"}`}
        >
          {t(locale)}
        </button>
      ))}
    </div>
  );
}
