// src/app/[locale]/privacy/page.tsx
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
  const t = await getTranslations({ locale, namespace: "datenschutz" });
  const path = locale === "de" ? "/privacy" : `/${locale}/privacy`;
  return {
    title: t("title"),
    alternates: {
      canonical: path,
      languages: {
        de: "/privacy",
        en: "/en/privacy",
        pl: "/pl/privacy",
        "x-default": "/privacy",
      },
    },
  };
}

export default function PrivacyPage() {
  const t = useTranslations("datenschutz");

  return (
    <main className="max-w-3xl mx-auto px-4 pt-32 md:pt-40 pb-16 text-gray-900">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      {/* Company Info */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("company")}</h2>
        <p>Markus Lindner</p>
        <p>Frankfurter Allee 216</p>
        <p>10365 Berlin</p>
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

      {/* Data Collection / Tools */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("dataCollection")}</h2>
        <p>{t("dataCollectionText")}</p>
      </section>

      {/* Purpose of Processing */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("purpose")}</h2>
        <p>{t("purposeText")}</p>
      </section>

      {/* User Rights */}
      <section>
        <h2 className="text-xl font-semibold mb-2">{t("rights")}</h2>
        <ul className="list-disc ml-6">
          <li>{t("rightAccess")}</li>
          <li>{t("rightCorrection")}</li>
          <li>{t("rightDeletion")}</li>
          <li>{t("rightRestriction")}</li>
          <li>{t("rightDataPortability")}</li>
          <li>{t("rightObjection")}</li>
        </ul>
      </section>
    </main>
  );
}
