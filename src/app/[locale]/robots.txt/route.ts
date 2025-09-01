import { NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";

export async function GET(request: Request) {
  const url = new URL(request.url);
  // /de/robots.txt → erstes Segment ist "de"
  const locale = url.pathname.split("/")[1] as AppLocale;

  if (!routing.locales.includes(locale)) {
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
