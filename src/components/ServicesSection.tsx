"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, Variants, useAnimation } from "framer-motion";
import { AnimatedButton } from "@/components/AnimatedButton";
import {
  Globe,
  Shield,
  Server,
  Wifi,
  Database,
  Code,
  Cpu,
  Terminal,
  Monitor,
  Cloud,
  Lock,
  Router,
  Settings,
  HardDrive,
  ChevronDown,
  LayoutDashboard,
  Box,
  Package,
  type LucideIcon,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

const TAGS: { text: string; icon: LucideIcon }[] = [
  { text: "Websites", icon: Globe },
  { text: "IT Support", icon: Terminal },
  { text: "Network", icon: Wifi },
  { text: "Cybersecurity", icon: Shield },
  { text: "Servers", icon: Server },
  { text: "Database", icon: Database },
  { text: "Cloud", icon: Cloud },
  { text: "Monitoring", icon: Monitor },
  { text: "Hardware", icon: HardDrive },
  { text: "Firewall", icon: Lock },
  { text: "Router", icon: Router },
  { text: "Configuration", icon: Settings },
  { text: "Development", icon: Code },
  { text: "UI/UX Design", icon: LayoutDashboard },
  { text: "Automation", icon: Cpu },
  { text: "Backup", icon: Database },
  { text: "Optimization", icon: Cpu },
  { text: "Integration", icon: Code },
  { text: "Security Audit", icon: Shield },
  { text: "Deployment", icon: Box },
  { text: "Package Management", icon: Package },
  { text: "Performance", icon: Monitor },
  { text: "Maintenance", icon: Terminal },
  { text: "Support Tools", icon: Cpu },
  { text: "Analytics", icon: LayoutDashboard },
];

interface TagPhysics {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-gray-300 pt-3">
      <button
        className="w-full flex justify-between items-center text-left font-medium text-services-card-title"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {question}
        <ChevronDown
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </button>
      {open && <p className="mt-2 text-services-card-description">{answer}</p>}
    </div>
  );
}

export default function ServicesSection() {
  const t = useTranslations("services");
  const animationContainerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const physicsRef = useRef<TagPhysics[] | null>(null);
  const [animationRunning, setAnimationRunning] = useState(true);

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const buttonControls = useAnimation();
  const [buttonRef, inView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    buttonControls.start(
      inView
        ? { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
        : { opacity: 0, scale: 0.8, transition: { duration: 0.5, ease: "easeIn" } }
    );
  }, [inView, buttonControls]);

  // Bewegung standardmäßig aus, wenn das System reduzierte Bewegung wünscht
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimationRunning(false);
    }
  }, []);

  // Floating-Tags-Physik: Positionen/Transforms laufen imperativ über Refs,
  // damit React nicht 60× pro Sekunde neu rendert. Pausiert außerhalb des
  // Viewports (IntersectionObserver).
  useLayoutEffect(() => {
    const container = animationContainerRef.current;
    if (!container || !animationRunning) return;

    const els = tagRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (!els.length) return;

    const getRandom = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const overlaps = (a: TagPhysics, b: TagPhysics, gap = 10) =>
      !(
        a.x + a.width + gap < b.x ||
        a.x > b.x + b.width + gap ||
        a.y + a.height + gap < b.y ||
        a.y > b.y + b.height + gap
      );

    // Startpositionen nur einmal berechnen (bleiben beim Toggle erhalten)
    if (!physicsRef.current) {
      const padding = 20;
      const placed: TagPhysics[] = [];
      els.forEach((el) => {
        const width = el.offsetWidth;
        const height = el.offsetHeight;
        let candidate: TagPhysics;
        let tries = 0;
        do {
          candidate = {
            x: getRandom(padding, Math.max(padding + 1, container.offsetWidth - width - padding)),
            y: getRandom(padding, Math.max(padding + 1, container.offsetHeight - height - padding)),
            vx: getRandom(0.5, 1) * (Math.random() < 0.5 ? 1 : -1),
            vy: getRandom(0.5, 1) * (Math.random() < 0.5 ? 1 : -1),
            width,
            height,
          };
          tries++;
        } while (tries <= 100 && placed.some((other) => overlaps(candidate, other)));
        placed.push(candidate);
      });
      physicsRef.current = placed;
    }

    const physics = physicsRef.current;
    els.forEach((el, i) => {
      const p = physics[i];
      if (p) el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });

    let rafId: number | null = null;

    const step = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;

      physics.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x + p.width > w) p.vx *= -1;
        if (p.y < 0 || p.y + p.height > h) p.vy *= -1;

        for (let j = i + 1; j < physics.length; j++) {
          const other = physics[j];
          if (
            p.x + p.width + 4 > other.x &&
            p.x < other.x + other.width + 4 &&
            p.y + p.height + 4 > other.y &&
            p.y < other.y + other.height + 4
          ) {
            const tmpVx = p.vx;
            const tmpVy = p.vy;
            p.vx = other.vx;
            p.vy = other.vy;
            other.vx = tmpVx;
            other.vy = tmpVy;
          }
        }

        const el = els[i];
        if (el) el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      });

      rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (rafId === null) rafId = requestAnimationFrame(step);
    };
    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    observer.observe(container);

    return () => {
      stop();
      observer.disconnect();
    };
  }, [animationRunning]);

  // Sichtbarkeit der Tags folgt dem Toggle
  useEffect(() => {
    tagRefs.current.forEach((el) => {
      if (el) el.style.opacity = animationRunning ? "1" : "0";
    });
  }, [animationRunning]);

  return (
    <div className="relative">
      <div
        ref={animationContainerRef}
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 rounded-2xl"
      >
        {TAGS.map((tag, i) => (
          <div
            key={i}
            ref={(el) => {
              tagRefs.current[i] = el;
            }}
            className="floating-tag absolute inline-flex items-center gap-2"
            style={{ opacity: 0, transition: "opacity 0.3s ease" }}
          >
            <tag.icon size={16} aria-hidden="true" />
            <span>{tag.text}</span>
          </div>
        ))}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10">
        <motion.div variants={fadeUp}>
          <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10 mb-4">
            {t("kicker")}
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-black font-headline mb-4">
            <span className="block">{t("title")}</span>
          </h2>

          {/* Animation Toggle */}
          <div className="flex justify-center items-center mb-8 gap-3">
            <label
              htmlFor="tag-animation-toggle"
              className="text-black font-medium cursor-pointer"
            >
              {t("startAnimation")}
            </label>
            <span className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="tag-animation-toggle"
                className="sr-only peer"
                checked={animationRunning}
                onChange={() => setAnimationRunning(!animationRunning)}
              />
              <span className="w-11 h-6 rounded-full bg-gray-500 peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-two transition-colors block" />
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md peer-checked:translate-x-5 transition-transform block" />
            </span>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {(
              ["webDesign", "itSupport", "networkSetup", "cyberSecurity"] as const
            ).map((key) => {
              const features: string[] = [];
              for (let i = 1; i <= 5; i++) {
                const feature = t(`${key}.feature${i}`);
                if (feature) features.push(feature);
              }
              const faqs = [];
              for (let i = 1; i <= 6; i++) {
                faqs.push({
                  q: t(`${key}.faq${i}.question`),
                  a: t(`${key}.faq${i}.answer`),
                });
              }
              return (
                <motion.article
                  key={key}
                  variants={fadeUp}
                  className="bg-services-card p-6 rounded-xl shadow-lg relative z-20"
                  aria-labelledby={`${key}-title`}
                >
                  <h3 id={`${key}-title`} className="text-2xl font-semibold mb-2 text-services-card-title">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="text-services-card-description mb-4">
                    {t(`${key}.description`)}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full services-bullet flex-shrink-0" />
                        <span className="text-services-card-description">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {faqs.map((f, idx) => (
                    <FAQItem key={idx} question={f.q} answer={f.a} />
                  ))}
                </motion.article>
              );
            })}
          </div>

          {/* CTA Button */}
          <div ref={buttonRef} className="mt-12 flex justify-center">
            <motion.div animate={buttonControls}>
              <AnimatedButton>{t("ctaPrimary")}</AnimatedButton>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
