// src/app/[locale]/blog/[slug]/page.tsx — Artikelseite
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { POSTS, getPost } from "@/content/posts";
import type { AppLocale } from "@/i18n/routing";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const content = post.content[locale as AppLocale] ?? post.content.de;
  return {
    title: content.title,
    description: content.description,
    openGraph: {
      type: "article",
      title: content.title,
      description: content.description,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPost(slug);
  if (!post) notFound();

  const content = post.content[locale as AppLocale] ?? post.content.de;
  const t = await getTranslations("blog");
  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(new Date(post.date));

  return (
    <main className="max-w-3xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20">
      <Link
        href="/#blog"
        className="inline-flex items-center gap-2 text-neutral hover:text-link transition-colors mb-8"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        {t("back")}
      </Link>

      <article className="card">
        <header className="mb-10">
          <p className="text-sm text-neutral mb-4">
            {formattedDate} · {post.readingMinutes} {t("minutes")}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-black font-headline">
            {content.title}
          </h1>
        </header>

        <p className="text-lg md:text-xl text-primary-dark leading-relaxed mb-10">
          {content.intro}
        </p>

        {content.sections.map((section, i) => (
          <section key={i} className="mb-10">
            {section.heading && (
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                {section.heading}
              </h2>
            )}
            {section.paragraphs?.map((paragraph, j) => (
              <p key={j} className="text-neutral leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className="list-disc pl-6 space-y-2">
                {section.bullets.map((bullet, j) => (
                  <li key={j} className="text-neutral leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="text-neutral leading-relaxed border-l-4 border-accent-one pl-4 mb-12">
          {content.outro}
        </p>

        {/* CTA */}
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 md:p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-2">
            {t("ctaTitle")}
          </h2>
          <p className="text-neutral mb-6">{t("ctaText")}</p>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-6 py-4 border border-black/30 rounded-full text-black hover:bg-black/10 hover:-translate-y-1 transition-transform duration-300"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </article>
    </main>
  );
}
