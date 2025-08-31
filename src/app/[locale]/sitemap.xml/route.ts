import { NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";

// Pages to include
const PAGES = ["/", "/privacy", "/impressum"];

interface Params {
  locale: string;
}

export async function GET({ params }: { params: Params }) {
  const { locale } = params;

  // Validate locale
  if (!routing.locales.includes(locale as AppLocale)) {
    return new NextResponse("Locale not found", { status: 404 });
  }

  // Build sitemap entries
  const urls = PAGES.map(
    (path) =>
      `<url>
  <loc>${process.env.NEXT_PUBLIC_SITE_URL}/${locale}${path}</loc>
  <changefreq>weekly</changefreq>
  <priority>${path === "/" ? "1.0" : "0.8"}</priority>
</url>`
  ).join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
