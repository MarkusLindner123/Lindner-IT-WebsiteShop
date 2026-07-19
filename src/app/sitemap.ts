import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { POSTS } from "@/content/posts";

// Deutsch läuft ohne URL-Präfix (localePrefix: "as-needed"),
// daher ist die de-Variante die kanonische URL.
const PAGES = [
  "/",
  "/imprint",
  "/privacy",
  "/blog",
  ...POSTS.map((post) => `/blog/${post.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => {
    const dePath = path === "/" ? "" : path;
    return {
      url: `${SITE_URL}${dePath || "/"}`,
      lastModified: new Date(),
      changeFrequency: path === "/" || path === "/blog" ? "weekly" : "yearly",
      priority: path === "/" ? 1 : path.startsWith("/blog") ? 0.7 : 0.5,
      alternates: {
        languages: {
          de: `${SITE_URL}${dePath || "/"}`,
          en: `${SITE_URL}/en${dePath}`,
          pl: `${SITE_URL}/pl${dePath}`,
        },
      },
    };
  });
}
