import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Hero from "@/components/Hero"; // ⬅️ NEU

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-dvh">
      {/* Animierter Hero-Bereich */}
      <Hero />

      {/* Später weitere Sektionen */}
      <div className="pt-10 flex items-center justify-center">
        <LanguageSwitcher />
      </div>
    </main>
  );
}

// Optional: Lokalisierte Meta-Daten pro Seite
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("title"),
  } as const;
}
