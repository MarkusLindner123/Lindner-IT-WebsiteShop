import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages, getTranslations } from "next-intl/server";
import { Montserrat, Poppins } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import Header from "@/components/Layout/Header";
import LanguageSwitcher from "@/components/Layout/LanguageSwitcher";
import Phone from "@/components/Layout/PhoneButton";
import Footer from "@/components/Layout/Footer";
import MotionProvider from "@/components/MotionProvider";
import "../globals.css";

// Selbst gehostete Fonts via next/font: kein Request an Google-Server (DSGVO),
// kein Layout-Shift dank size-adjust-Fallbacks. latin-ext für polnische Zeichen.
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-headline",
  display: "swap",
});

const OG_LOCALES: Record<string, string> = {
  de: "de_DE",
  en: "en_US",
  pl: "pl_PL",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#1F2937",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const path = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: "%s | Lindner IT",
    },
    description: t("description"),
    alternates: {
      canonical: path,
      languages: {
        de: "/",
        en: "/en",
        pl: "/pl",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Lindner IT",
      title: t("title"),
      description: t("description"),
      url: path,
      locale: OG_LOCALES[locale] ?? OG_LOCALES.de,
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  // Bewusst string statt Locale-Union: Next 15.5+ validiert Layout-Props
  // gegen LayoutProps<"/[locale]"> — die Laufzeitprüfung macht hasLocale.
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MotionProvider>
            <Header />
            {children}
            <Phone />
            <LanguageSwitcher />
            <Footer />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
