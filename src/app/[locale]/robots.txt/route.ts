import { NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";

interface Params {
  locale: string;
}

export async function GET({ params }: { params: Params }) {
  const { locale } = params;

  // Type-safe check: cast params.locale to AppLocale only if included
  if (!routing.locales.includes(locale as AppLocale)) {
    return new NextResponse("Locale not found", { status: 404 });
  }

  const robotsContent = `
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/sitemap.xml
  `.trim();

  return new NextResponse(robotsContent, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
