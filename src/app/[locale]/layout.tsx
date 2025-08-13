// src/app/[locale]/layout.tsx
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  // Wir erwarten params als Promise, weil du das so in deinem Projekt benutzt
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;

  // Prüfen, ob die Locale bekannt ist
  if (!hasLocale(routing.locales, locale)) notFound();

  // Locale für serverseitige Übersetzungen setzen und Messages laden
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="antialiased">
      {/* body-Klassen zentralisiert: Hintergrund, Textfarbe und Font kommen aus globals.css / Tailwind */}
      <body className="min-h-screen bg-brand-bg text-brand-text font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
