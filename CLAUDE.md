# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

pnpm is the package manager.

- `pnpm dev` — dev server (Turbopack) at http://localhost:3000
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm lint` — ESLint via `next lint`

There is no test suite.

## Architecture

Single-page marketing site for "Lindner IT" (IT freelancer, Berlin): Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 3. Comments in the codebase are mostly German.

### i18n (next-intl)

- Locales `de` (default), `en`, `pl` are defined in `src/i18n/routing.ts` with `localePrefix: 'as-needed'` (German has no URL prefix).
- All UI text lives in `messages/{de,en,pl}.json`; components read it via `useTranslations`. New user-facing strings must be added to all three files.
- `src/middleware.ts` wraps the next-intl middleware and forces redirects to `/de` when the first path segment is not a valid locale.
- There is no root `src/app/layout.tsx` — `src/app/[locale]/layout.tsx` is the root layout (renders `<html lang>`, loads fonts, metadata, providers). It calls `setRequestLocale` + `generateStaticParams` so pages render statically. `src/app/[locale]/[...rest]/page.tsx` catches unknown paths and triggers `not-found.tsx`.
- `robots.ts` and `sitemap.ts` are Next metadata routes at the `src/app/` root (crawlers expect them at `/robots.txt`, not `/de/robots.txt`). Both build URLs from `SITE_URL` in `src/lib/site.ts`, which reads `NEXT_PUBLIC_SITE_URL` (must be set in production).

### Page composition & section IDs (load-bearing)

The homepage (`src/app/[locale]/page.tsx`) stacks section components inside `Card` wrappers with the IDs `home`, `services`, `about`, `contact`, `testimonials`, `blog`. These IDs are shared contracts referenced by:

- `Header.tsx` — `NAV_ITEMS` hrefs, IntersectionObserver scroll-spy, and click-to-scroll. Anchor entries (`#...`) scroll to sections; page entries (e.g. `/blog`) navigate via the next-intl router and are marked active from the pathname.
- `CardScrollLines.tsx` — draws the animated SVG connector lines between the cards
- `Hero.tsx` / `AnimatedButton.tsx` — scroll-to-section buttons (`#services`, `#contact`)

Renaming, adding, or reordering a section requires updating `cardIds` in `page.tsx` and `NAV_ITEMS` in `Header.tsx` together. The header's `HEADER_CONFIG` mobile values are sized for five icons on 360px screens — adding a sixth icon requires shrinking them.

### Styling

- Design tokens are CSS variables in `:root` of `src/app/globals.css`. `tailwind.config.ts` mirrors the color values as hex (so opacity modifiers like `bg-accent-two/20` work) — **changing a brand color means updating both files**.
- Many classes used by components (`.card`, `.header-glass`, `.border-gradient`, `.floating-tag`, `.jumper`, `.bg-services-card`) are hand-written utilities in `globals.css`, not Tailwind — search there first when a class name doesn't resolve.
- Fonts: Montserrat (`--font-sans`) and Poppins (`--font-headline`) are self-hosted via `next/font` in the locale layout (no Google Fonts request — GDPR). `latin-ext` subsets are required for Polish.
- Reduced motion: CSS animations are disabled via a global `prefers-reduced-motion` block in `globals.css`; framer-motion via `MotionProvider` (`reducedMotion="user"`); the hand-rolled GSAP/rAF effects check `matchMedia` individually. New animations must respect all three paths.

### Animation systems

Three separate systems, all in `"use client"` components:

- **framer-motion** — fade/stagger entrance variants (Hero, Services, Contact, Testimonials) and the infinite vertical image-gallery loop in `Hero.tsx`.
- **GSAP** — the "gooey" header nav in `Header.tsx`: two SVG rects animated behind a `feGaussianBlur` filter, positioned from the `HEADER_CONFIG` pixel constants (separate desktop/mobile values).
- **Hand-rolled requestAnimationFrame** — floating tag physics in `ServicesSection.tsx` (DOM nodes created imperatively with collision detection), the rotating gradient border in `AnimatedButton.tsx`, and the scroll-progress word/brush highlight in `AboutSection/`.

### Blog

- Articles live as plain data in `src/content/posts.ts` — one `Post` entry with content for **all three locales** (no CMS, no MDX). Adding an article means adding it there; the sitemap and the homepage blog section pick it up automatically via the `POSTS` import.
- The blog overview is the `blog` section on the homepage (`BlogTeaser.tsx`, all posts). `/blog` only redirects to `/#blog`; articles render at `/blog/[slug]` (`generateStaticParams` over slugs).
- On subpages the header's section anchors don't exist; `Header.tsx` falls back to navigating to `/{locale}#section`.
- The fixed header nav REQUIRES its explicit `top-0` class: without it, its position depends on the homepage hero card's collapsing margin and shifts on subpages. `HEADER_CONFIG.topPosition` values are absolute viewport offsets.

### Misc

- The contact form posts directly to Formspree (`https://formspree.io/f/mqadbwyk`) — there is no API route.
- Legal pages (`imprint`, `privacy`) live under `src/app/[locale]/`.
- `src/components/StructuredData.tsx` renders JSON-LD (ProfessionalService + AggregateRating) on the homepage for Google rich results.
- The AboutSection brush-highlight effect only marks words listed in the `highlightWords{De,En,Pl}` arrays in `AboutSection.tsx` — **changing the about texts in `messages/*.json` requires updating those arrays** (words must literally appear in the text).
- CV and certificate PDFs are served from `public/docs/` and linked from the About section.
