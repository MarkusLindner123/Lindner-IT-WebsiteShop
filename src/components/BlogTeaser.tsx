"use client";

// Blog-Übersicht als Sektion auf dem Onepager (alle Artikel).
// Neuester Artikel als "Featured"-Bühne mit Aurora-Verlauf, die übrigen
// als Spotlight-Cards (Border folgt dem Cursor) + "Wunschthema"-Karte.
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { POSTS } from "@/content/posts";
import type { AppLocale } from "@/i18n/routing";
import "./BlogTeaser.css";

// Cursor-Position als CSS-Variablen für den Spotlight-Effekt
function handleSpot(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function BlogTeaser({ locale }: { locale: string }) {
  const t = useTranslations("blog");
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = posts;
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
  const featuredContent =
    featured.content[locale as AppLocale] ?? featured.content.de;

  return (
    <div>
      <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10 mb-4">
        {t("kicker")}
      </div>
      <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-black font-headline mb-10">
        {t("homeTitle")}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Featured: neuester Artikel */}
        <Link
          href={`/blog/${featured.slug}`}
          className="blog-featured md:col-span-3"
        >
          <span className="blog-blob blog-blob--1" aria-hidden="true" />
          <span className="blog-blob blog-blob--2" aria-hidden="true" />
          <span className="blog-ghost" aria-hidden="true">
            01
          </span>
          <span className="blog-f-meta">
            <span className="blog-f-tag">{t("featuredTag")}</span>
            <span className="blog-f-date">
              {dateFormatter.format(new Date(featured.date))} ·{" "}
              {featured.readingMinutes} {t("minutes")}
            </span>
          </span>
          <h3>{featuredContent.title}</h3>
          <p className="blog-f-desc">{featuredContent.description}</p>
          <span className="blog-f-link">
            {t("readMore")} <span className="blog-arr">→</span>
          </span>
        </Link>

        {/* Übrige Artikel als Spotlight-Cards */}
        {rest.map((post, i) => {
          const content = post.content[locale as AppLocale] ?? post.content.de;
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-spot"
              onMouseMove={handleSpot}
            >
              <span className="blog-bar" aria-hidden="true" />
              <span className="blog-s-ghost" aria-hidden="true">
                {String(i + 2).padStart(2, "0")}
              </span>
              <p className="blog-s-meta">
                {dateFormatter.format(new Date(post.date))} ·{" "}
                {post.readingMinutes} {t("minutes")}
              </p>
              <h3 className="text-primary-dark">{content.title}</h3>
              <p className="blog-s-desc">{content.description}</p>
              <span className="blog-s-link">
                {t("readMore")} <span className="blog-arr">→</span>
              </span>
            </Link>
          );
        })}

        {/* Wunschthema → Kontakt */}
        <a href="#contact" className="blog-spot" onMouseMove={handleSpot}>
          <span className="blog-bar" aria-hidden="true" />
          <span className="blog-s-ghost" aria-hidden="true">
            +
          </span>
          <p className="blog-s-meta">{t("suggestKicker")}</p>
          <h3 className="text-primary-dark">{t("suggestTitle")}</h3>
          <p className="blog-s-desc">{t("suggestText")}</p>
          <span className="blog-s-link">
            {t("suggestCta")} <span className="blog-arr">→</span>
          </span>
        </a>
      </div>
    </div>
  );
}
