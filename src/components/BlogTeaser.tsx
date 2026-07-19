// Blog-Teaser auf der Startseite: die drei neuesten Artikel
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { POSTS } from "@/content/posts";
import type { AppLocale } from "@/i18n/routing";

export default async function BlogTeaser({ locale }: { locale: string }) {
  const t = await getTranslations("blog");
  const posts = [...POSTS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  return (
    <div>
      <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10 mb-4">
        {t("kicker")}
      </div>
      <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-black font-headline mb-10">
        {t("homeTitle")}
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => {
          const content = post.content[locale as AppLocale] ?? post.content.de;
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-6 rounded-xl bg-gray-50 border border-gray-200 transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="text-sm text-neutral mb-3">
                {dateFormatter.format(new Date(post.date))} ·{" "}
                {post.readingMinutes} {t("minutes")}
              </p>
              <h3 className="text-xl font-bold text-primary-dark mb-3 leading-snug">
                {content.title}
              </h3>
              <p className="text-neutral text-sm mb-4">{content.description}</p>
              <span className="font-semibold text-link text-sm">
                {t("readMore")} →
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex items-center justify-center px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
        >
          {t("homeAll")}
        </Link>
      </div>
    </div>
  );
}
