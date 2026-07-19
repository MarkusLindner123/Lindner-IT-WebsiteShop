"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import "./ReferencesSection.css";

// Screenshots liegen in public/references/ (800×1297, aus 1280er-Captures
// der Live-Seiten erzeugt) — bei Redesigns der Kundenseiten neu generieren.
const SHOT_W = 800;
const SHOT_H = 1297;

const WEBSITES = [
  {
    key: "elektro" as const,
    domain: "lindner-elektrotechnik.com",
    url: "https://lindner-elektrotechnik.com",
    img: "/references/elektro.jpg",
    warm: true,
    flip: false,
  },
  {
    key: "korff" as const,
    domain: "anwaltskanzlei-korff.de",
    url: "https://anwaltskanzlei-korff.de",
    img: "/references/korff.jpg",
    warm: false,
    flip: true,
  },
];

const MARQUEE_ITEMS = [
  "Lindner Elektrotechnik",
  "Anwaltskanzlei Korff",
  "Haus Phönix",
  "Siemens",
  "CodinGame Top 1 %",
  "IHK Berlin",
];

const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 3D-Tilt + Glare. Auf Touch-Geräten gibt es keinen Hover — dort startet
   stattdessen der Auto-Scroll (Klasse ref-autoplay), sobald die Karte
   halb sichtbar ist. */
function TiltCard({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    const glare = glareRef.current;
    if (!wrap || !inner) return;

    if (window.matchMedia("(hover: none)").matches) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) =>
            wrap.classList.toggle("ref-autoplay", e.intersectionRatio >= 0.5)
          ),
        { threshold: [0, 0.5] }
      );
      io.observe(wrap);
      return () => io.disconnect();
    }

    if (reduceMotion()) return;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      inner.style.transform = `rotateX(${((0.5 - py) * 9).toFixed(2)}deg) rotateY(${((px - 0.5) * 11).toFixed(2)}deg)`;
      if (glare) {
        glare.style.opacity = "0.45";
        glare.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.5), transparent 55%)`;
      }
    };
    const onLeave = () => {
      inner.style.transform = "rotateX(0deg) rotateY(0deg)";
      if (glare) glare.style.opacity = "0";
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="ref-tilt">
      <div ref={innerRef} className="ref-tilt-inner">
        {children}
        <div ref={glareRef} className="ref-glare" aria-hidden="true" />
      </div>
    </div>
  );
}

function BrowserWindow({
  domain,
  img,
  alt,
  hint,
  priority = false,
}: {
  domain: string;
  img: string;
  alt: string;
  hint: string;
  priority?: boolean;
}) {
  return (
    <div className="ref-browser">
      <div className="ref-chrome">
        <div className="ref-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="ref-urlbar">
          <span aria-hidden="true">🔒</span>
          <span className="ref-domain">{domain}</span>
        </div>
      </div>
      <div className="ref-shot">
        <Image
          src={img}
          alt={alt}
          width={SHOT_W}
          height={SHOT_H}
          sizes="(min-width: 900px) 520px, 100vw"
          priority={priority}
          className="ref-shot-img"
        />
        <div className="ref-hint" aria-hidden="true">
          <b>↕</b> {hint}
        </div>
      </div>
    </div>
  );
}

/* Terminal mit Typewriter-Loop — startet erst, wenn sichtbar.
   Bei reduced motion werden die Zeilen statisch gerendert. */
function Terminal({
  title,
  lines,
}: {
  title: string;
  lines: { cls: string; text: string }[];
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [staticRender, setStaticRender] = useState(false);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    if (reduceMotion()) {
      setStaticRender(true);
      return;
    }

    let li = 0;
    let ci = 0;
    let cur: HTMLDivElement | null = null;
    let timer: number | undefined;
    let cancelled = false;
    let started = false;

    const caret = () => {
      const c = document.createElement("span");
      c.className = "ref-caret";
      return c;
    };

    const step = () => {
      if (cancelled) return;
      if (li >= lines.length) {
        timer = window.setTimeout(() => {
          body.innerHTML = "";
          li = 0;
          ci = 0;
          cur = null;
          step();
        }, 6000);
        return;
      }
      if (!cur) {
        cur = document.createElement("div");
        cur.className = `ref-term-line ${lines[li].cls}`;
        body.appendChild(cur);
      }
      const text = lines[li].text;
      if (ci <= text.length) {
        cur.textContent = text.slice(0, ci);
        cur.appendChild(caret());
        ci++;
        timer = window.setTimeout(step, 16);
      } else {
        cur.querySelector(".ref-caret")?.remove();
        cur = null;
        ci = 0;
        li++;
        timer = window.setTimeout(step, 340);
      }
    };

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            step();
          }
        }),
      { threshold: 0.3 }
    );
    io.observe(body);

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      io.disconnect();
    };
  }, [lines]);

  return (
    <div className="ref-terminal">
      <div className="ref-chrome">
        <div className="ref-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="ref-term-title">{title}</div>
      </div>
      <div ref={bodyRef} className="ref-term-body" aria-hidden="true">
        {staticRender &&
          lines.map((l, i) => (
            <div key={i} className={`ref-term-line ${l.cls}`}>
              {l.text}
            </div>
          ))}
      </div>
    </div>
  );
}

/* Zähler, der hochzählt, sobald er in den Viewport kommt */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion()) {
      el.textContent = String(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io.disconnect();
          let t0: number | null = null;
          const tick = (ts: number) => {
            if (t0 === null) t0 = ts;
            const p = Math.min((ts - t0) / 1200, 1);
            el.textContent = String(Math.round(value * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <em ref={ref}>0</em>;
}

export default function ReferencesSection() {
  const t = useTranslations("references");

  const termLines = useMemo(
    () => [
      { cls: "ref-t-p", text: "$ python run_survey.py --anonym" },
      { cls: "ref-t-ok", text: `✔ ${t("phoenix.term1")}` },
      { cls: "ref-t-dim", text: `… ${t("phoenix.term2")}` },
      { cls: "ref-t-y", text: `▶ ${t("phoenix.term3")}` },
      { cls: "ref-t-p", text: "$ _" },
    ],
    [t]
  );

  return (
    <div>
      {/* Kicker + Headline im Stil der übrigen Sektionen */}
      <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10 mb-4">
        {t("kicker")}
      </div>
      <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-black font-headline mb-4">
        {t("title")}
      </h2>
      <p className="text-neutral max-w-2xl mb-8">{t("intro")}</p>

      {/* Marquee (rein dekorativ) */}
      <div className="ref-marquee mb-6" aria-hidden="true">
        <div className="ref-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className="ref-marquee-item">
              <span>◆</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Website-Projekte: Browser-Fenster mit Tilt + Auto-Scroll */}
      {WEBSITES.map(({ key, domain, url, img, warm, flip }, idx) => (
        <div
          key={key}
          className="grid grid-cols-1 gap-10 md:gap-12 md:grid-cols-2 items-center mt-14 md:mt-20"
        >
          <div className={flip ? "md:order-2" : ""}>
            <span className={`ref-cat ${warm ? "ref-cat--warm" : ""}`}>
              {t(`${key}.category`)}
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-4 mb-3">
              {t(`${key}.title`)}
            </h3>
            <p className="text-neutral mb-5">{t(`${key}.text`)}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {([1, 2, 3] as const).map((i) => (
                <span key={i} className="ref-chip">
                  {t(`${key}.tag${i}`)}
                </span>
              ))}
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 font-bold text-link"
            >
              {t("visit")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className={flip ? "md:order-1" : ""}>
            <TiltCard>
              <BrowserWindow
                domain={domain}
                img={img}
                alt={t("shotAlt", { domain })}
                hint={t("scrollHint")}
                priority={idx === 0}
              />
            </TiltCard>
          </div>
        </div>
      ))}

      {/* Haus Phönix: Terminal + Website-Fenster im Stapel */}
      <div className="grid grid-cols-1 gap-10 md:gap-12 md:grid-cols-2 items-center mt-14 md:mt-20">
        <div>
          <span className="ref-cat ref-cat--warm">{t("phoenix.category")}</span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-4 mb-3">
            {t("phoenix.title")}
          </h3>
          <p className="text-neutral mb-5">{t("phoenix.text")}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {([1, 2, 3] as const).map((i) => (
              <span key={i} className="ref-chip">
                {t(`phoenix.tag${i}`)}
              </span>
            ))}
          </div>
          <a
            href="https://haus-phoenix.de"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 font-bold text-link"
          >
            {t("visit")}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="ref-stack">
          <div className="ref-stack-back" aria-hidden="true">
            <div className="ref-chrome">
              <div className="ref-dots">
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="ref-stack-mini">
              <Image
                src="/references/phoenix.jpg"
                alt=""
                width={SHOT_W}
                height={SHOT_H}
                sizes="300px"
              />
            </div>
          </div>
          <Terminal title="umfrage-tool — markus@lindner-it" lines={termLines} />
        </div>
      </div>

      {/* Siemens / Enterprise */}
      <div className="ref-enterprise mt-14 md:mt-20">
        <span className="ref-cat ref-cat--dark">{t("siemens.category")}</span>
        <h3 className="text-2xl md:text-3xl font-extrabold mt-4 mb-3">
          {t("siemens.title")}
        </h3>
        <p className="max-w-xl text-sm md:text-base text-gray-300 mb-8">
          {t("siemens.text")}
        </p>
        <div className="flex flex-wrap gap-10 md:gap-14">
          <div>
            <div className="ref-stat-num">
              <CountUp value={5} /> {t("siemens.yearsSuffix")}
            </div>
            <div className="ref-stat-label">{t("siemens.stat1Label")}</div>
          </div>
          <div>
            <div className="ref-stat-num">
              Top <CountUp value={1} />
              &nbsp;%
            </div>
            <div className="ref-stat-label">{t("siemens.stat2Label")}</div>
          </div>
          <div>
            <div className="ref-stat-num">
              Top <CountUp value={2} />
              &nbsp;%
            </div>
            <div className="ref-stat-label">{t("siemens.stat3Label")}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-8">
          {([1, 2, 3] as const).map((i) => (
            <span key={i} className="ref-chip ref-chip--dark">
              {t(`siemens.tag${i}`)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
