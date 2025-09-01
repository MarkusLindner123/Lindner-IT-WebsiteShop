// app/[locale]/layout.tsx (ERSETZEN)
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/Layout/Header";
import LanguageSwitcher from "@/components/Layout/LanguageSwitcher";
import Phone from "@/components/Layout/PhoneButton";
import PageLoader from "@/components/Layout/PageLoader";
import Footer from "@/components/Layout/Footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div lang={locale}> {/* Korrekte Sprach-Markierung */}
        <PageLoader>
          <Header />
          {children}
          <Phone />
          <LanguageSwitcher />
          <Footer />
        </PageLoader>
      </div>
    </NextIntlClientProvider>
  );
}

// Lokalisierte Metadaten
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const titles = {
    en: 'Lindner IT - Professional IT Services',
    de: 'Lindner IT - Professionelle IT-Dienstleistungen', 
    pl: 'Lindner IT - Profesjonalne Usługi IT'
  };
  
  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: 'Professional IT Services',
    alternates: {
      languages: {
        'de': '/',
        'en': '/en',
        'pl': '/pl',
      }
    }
  };
}