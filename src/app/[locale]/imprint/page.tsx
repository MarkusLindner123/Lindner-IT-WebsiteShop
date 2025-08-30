// src/app/[locale]/imprint/page.tsx
import { useTranslations } from "next-intl";

export default function ImprintPage() {
  const t = useTranslations("impressum");

  return (
    <main className="max-w-3xl mx-auto px-4 pt-32 pb-16 text-gray-900">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      {/* Company Info */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("company")}</h2>
        <p>{t("name")}</p>
        <p>{t("address")}</p>
        <p>{t("city")}</p>
      </section>

      {/* Contact */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("contact")}</h2>
        <p>
          {t("phone")}:{" "}
          <a href="tel:+491628036905" className="text-accent-one hover:underline">
            +49 162 8036 905
          </a>
        </p>
        <p>
          {t("email")}:{" "}
          <a href="mailto:markuslindner1998@gmail.com" className="text-accent-one hover:underline">
            markuslindner1998@gmail.com
          </a>
        </p>
      </section>

      {/* Legal Info */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("legal")}</h2>
        <p>{t("legalForm")}</p>
        <p>{t("taxNumber")}</p>
      </section>

      {/* Disclaimer */}
      <section>
        <h2 className="text-xl font-semibold mb-2">{t("disclaimer")}</h2>
        <p>{t("disclaimerText")}</p>
      </section>
    </main>
  );
}
