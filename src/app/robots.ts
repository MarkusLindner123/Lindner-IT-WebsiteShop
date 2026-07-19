import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Crawler erwarten robots.txt unter der Root-URL (/robots.txt),
// nicht unter /de/robots.txt — deshalb liegt die Datei hier statt in [locale].
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
