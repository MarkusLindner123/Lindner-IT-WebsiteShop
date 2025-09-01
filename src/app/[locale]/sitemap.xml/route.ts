import { NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";

const PAGES = ["/", "/privacy", "/impressum"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.pathname.split("/")[1] as AppLocale;

  if (!routing.locales.includes(locale)) {
    return new NextResponse("Locale not found", { status: 404 });
  }

  const buildDate = new Date().toISOString();

  const urls = PAGES.map(
    (path) => `<url>
  <loc>${process.env.NEXT_PUBLIC_SITE_URL}/${locale}${path}</loc>
  <lastmod>${buildDate}</lastmod>
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
