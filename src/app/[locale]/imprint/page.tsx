// src/app/[locale]/imprint/page.tsx
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

// Eigene Metadata: ohne sie erben die Rechtsseiten Canonical + Title der
// Startseite und gelten für Google als deren Duplikat (SEO-Audit-Fund).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impressum" });
  const path = locale === "de" ? "/imprint" : `/${locale}/imprint`;
  return {
    title: t("title"),
    alternates: {
      canonical: path,
      languages: {
        de: "/imprint",
        en: "/en/imprint",
        pl: "/pl/imprint",
        "x-default": "/imprint",
      },
    },
  };
}

export default function ImprintPage() {
  const t = useTranslations("impressum");

  return (
    <main className="max-w-3xl mx-auto px-4 pt-32 md:pt-40 pb-16 text-gray-900">
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
          <a href="tel:+491628036905" className="text-link hover:underline">
            +49 162 8036 905
          </a>
        </p>
        <p>
          {t("email")}:{" "}
          <a href="mailto:markuslindner1998@gmail.com" className="text-link hover:underline">
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
