"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, Variants, useAnimation } from "framer-motion";
import { AnimatedButton } from "@/components/AnimatedButton";
import {
  Code,
  Globe,
  Paintbrush,
  Cloud,
  LayoutDashboard,
  Terminal,
  Database,
  Shield,
  Cpu,
  ChevronDown,
} from "lucide-react";
import ReactDOMServer from "react-dom/server";
import { useInView } from "react-intersection-observer";

interface FloatingElement {
  el: HTMLDivElement;
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
      >
        {question}
        <ChevronDown
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          size={18}
        />
      </button>
      {open && (
        <p className="mt-2 text-services-card-description">{answer}</p>
      )}
    </div>
  );
}

export default function ServicesSection() {
  const t = useTranslations("services");
  const animationContainerRef = useRef<HTMLDivElement>(null);

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

  // Button Animation Controls
  const buttonControls = useAnimation();
  const [buttonRef, inView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      buttonControls.start({ opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } });
    } else {
      buttonControls.start({ opacity: 0, scale: 0.8, transition: { duration: 0.5, ease: "easeIn" } });
    }
  }, [inView, buttonControls]);

  // Floating tags initialisieren (nur einmal)
  useEffect(() => {
    const container = animationContainerRef.current;
    if (!container) return;

    const tags = [
      { text: "Web", icon: Globe },
      { text: "Code", icon: Code },
      { text: "Design", icon: Paintbrush },
      { text: "Software", icon: Terminal },
      { text: "UI/UX", icon: LayoutDashboard },
      { text: "Cloud", icon: Cloud },
      { text: "Database", icon: Database },
      { text: "Security", icon: Shield },
      { text: "AI", icon: Cpu },
    ];

    const numShapes = 12;
    const floatingElements: FloatingElement[] = [];
    const getRandom = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const padding = 20;

    function isOverlapping(a: FloatingElement, b: FloatingElement, gap = 10) {
      return !(
        a.x + a.width + gap < b.x ||
        a.x > b.x + b.width + gap ||
        a.y + a.height + gap < b.y ||
        a.y > b.y + b.height + gap
      );
    }

    for (let i = 0; i < numShapes; i++) {
      const { text, icon: Icon } = tags[i % tags.length];
      const shape = document.createElement("div");
      shape.classList.add(
        "inline-flex",
        "items-center",
        "gap-2",
        "px-4",
        "py-1",
        "rounded-full",
        "text-sm",
        "font-medium",
        "floating-tag",
        "absolute"
      );

      const iconWrapper = document.createElement("span");
      iconWrapper.innerHTML = ReactDOMServer.renderToString(<Icon size={16} />);
      iconWrapper.classList.add("inline-flex", "items-center");
      shape.appendChild(iconWrapper);

      const textSpan = document.createElement("span");
      textSpan.textContent = text;
      shape.appendChild(textSpan);

      container.appendChild(shape);

      const width = shape.offsetWidth;
      const height = shape.offsetHeight;

      let x, y;
      let tries = 0;
      let newEl: FloatingElement;

      do {
        x = getRandom(padding, container.offsetWidth - width - padding);
        y = getRandom(padding, container.offsetHeight - height - padding);
        newEl = {
          el: shape,
          x,
          y,
          vx: getRandom(0.5, 1) * (Math.random() < 0.5 ? 1 : -1),
          vy: getRandom(0.5, 1) * (Math.random() < 0.5 ? 1 : -1),
          width,
          height,
        };
        tries++;
        if (tries > 100) break;
      } while (floatingElements.some((other) => isOverlapping(newEl, other)));

      floatingElements.push(newEl);
    }

    function animate() {
      const w = container?.offsetWidth ?? 0;
      const h = container?.offsetHeight ?? 0;

      for (let i = 0; i < floatingElements.length; i++) {
        const el = floatingElements[i];
        el.x += el.vx;
        el.y += el.vy;

        if (el.x < 0 || el.x + el.width > w) {
          el.vx *= -1;
          el.x = Math.max(0, Math.min(el.x, w - el.width));
        }
        if (el.y < 0 || el.y + el.height > h) {
          el.vy *= -1;
          el.y = Math.max(0, Math.min(el.y, h - el.height));
        }

        for (let j = i + 1; j < floatingElements.length; j++) {
          const other = floatingElements[j];
          if (isOverlapping(el, other, 4)) {
            const tmpVx = el.vx;
            const tmpVy = el.vy;
            el.vx = other.vx;
            el.vy = other.vy;
            other.vx = tmpVx;
            other.vy = tmpVy;
          }
        }

        el.el.style.transform = `translate(${el.x}px, ${el.y}px)`;
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      container.querySelectorAll(".floating-tag").forEach((el) => el.remove());
    };
  }, []);

  return (
    <section aria-label="Services" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-services-section-bg rounded-2xl" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10 p-8 rounded-2xl md:p-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative"
        >
          {/* Floating tags animation container */}
          <div
            ref={animationContainerRef}
            className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 rounded-2xl"
          />

          {/* Content */}
          <motion.div variants={fadeUp} className="relative z-20">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-black font-headline mb-8">
              <span className="block">{t("title")}</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {(
                [
                  "webDesign",
                  "softwareDevelopment",
                  "cloudSolutions",
                  "aiAutomation",
                ] as const
              ).map((key) => {
                const features: string[] = [];
                for (let i = 1; i <= 5; i++) {
                  const feature = t(`${key}.feature${i}`);
                  if (feature) features.push(feature);
                }

                return (
                  <motion.div
                    key={key}
                    variants={fadeUp}
                    className="bg-services-card p-6 rounded-xl shadow-lg relative z-20"
                  >
                    <h2 className="text-2xl font-semibold mb-2 text-services-card-title">
                      {t(`${key}.title`)}
                    </h2>
                    <p className="text-services-card-description mb-4">
                      {t(`${key}.description`)}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {features.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full services-bullet flex-shrink-0" />
                          <span className="text-services-card-description">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* FAQ */}
                    <FAQItem
                      question={t(`${key}.faq1.question`)}
                      answer={t(`${key}.faq1.answer`)}
                    />
                    <FAQItem
                      question={t(`${key}.faq2.question`)}
                      answer={t(`${key}.faq2.answer`)}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div ref={buttonRef} className="mt-12 flex justify-center">
              <motion.div animate={buttonControls}>
                <AnimatedButton href="#contact">{t("ctaPrimary")}</AnimatedButton>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
