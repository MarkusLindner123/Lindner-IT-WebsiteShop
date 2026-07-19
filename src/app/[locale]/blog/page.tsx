// src/app/[locale]/blog/page.tsx — Blog-Übersicht
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { POSTS } from "@/content/posts";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20">
      <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10 mb-4">
        {t("kicker")}
      </div>
      <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight text-black font-headline mb-4">
        {t("title")}
      </h1>
      <p className="text-lg md:text-xl text-neutral max-w-2xl mb-12">
        {t("description")}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => {
          const content = post.content[locale as AppLocale] ?? post.content.de;
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card block !p-6 md:!p-8 transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="text-sm text-neutral mb-3">
                {dateFormatter.format(new Date(post.date))} ·{" "}
                {post.readingMinutes} {t("minutes")}
              </p>
              <h2 className="text-2xl font-bold text-primary-dark mb-3 leading-snug">
                {content.title}
              </h2>
              <p className="text-neutral mb-4">{content.description}</p>
              <span className="font-semibold text-link">{t("readMore")} →</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
