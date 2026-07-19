// src/app/[locale]/blog/page.tsx
// Die Blog-Übersicht lebt als Sektion auf dem Onepager (Card id="blog").
// /blog leitet dorthin weiter, damit alte Links und Lesezeichen
// nicht ins Leere laufen.
import { redirect } from "next/navigation";

export default async function BlogIndexRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(locale === "de" ? "/#blog" : `/${locale}#blog`);
}
