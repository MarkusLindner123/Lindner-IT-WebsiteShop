// ServicesSection.tsx
"use client";

import { useEffect, useRef, useLayoutEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, Variants } from "framer-motion";
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

} from "lucide-react";
import ReactDOMServer from "react-dom/server";

interface FloatingElement {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
}

export default function ServicesSection() {
  const t = useTranslations("services");
  const animationContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

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

  useLayoutEffect(() => {
    const container = animationContainerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(() => {
      setContainerSize({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;
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
    const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;
    const padding = 20;

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
        "text-services-tag-text",
        "bg-services-tag-bg",
        "backdrop-blur-sm",
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

      floatingElements.push({
        el: shape,
        x: getRandom(padding, containerSize.width - width - padding),
        y: getRandom(padding, containerSize.height - height - padding),
        vx: getRandom(0.5, 1) * (Math.random() < 0.5 ? 1 : -1),
        vy: getRandom(0.5, 1) * (Math.random() < 0.5 ? 1 : -1),
        width,
        height,
      });
    }

    function animate() {
      for (const el of floatingElements) {
        el.x += el.vx;
        el.y += el.vy;
        if (el.x < 0 || el.x + el.width > containerSize.width) {
          el.vx *= -1;
          el.x = Math.max(0, Math.min(el.x, containerSize.width - el.width));
        }
        if (el.y < 0 || el.y + el.height > containerSize.height) {
          el.vy *= -1;
          el.y = Math.max(0, Math.min(el.y, containerSize.height - el.height));
        }
        el.el.style.transform = `translate(${el.x}px, ${el.y}px)`;
      }
      requestAnimationFrame(animate);
    }

    animate();
  }, [containerSize]);

  return (
    <section aria-label="Services" className="relative overflow-hidden">
      {/* Background container */}
      <div className="absolute inset-0 bg-services-bg rounded-2xl" />

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
          <motion.div variants={fadeUp} className="relative z-10">


            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-black font-headline mb-8">
              <span className="block">{t("title")}</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {(["webDesign", "softwareDevelopment"] as const).map((key) => {
                const features: string[] = [];
                for (let i = 1; i <= 5; i++) {
                  const feature = t(`${key}.feature${i}`);
                  if (feature) features.push(feature);
                }

                return (
                  <motion.div 
                    key={key} 
                    variants={fadeUp}
                    className="bg-services-card p-6 rounded-xl shadow-lg"
                  >
                    <h2 className="text-2xl font-semibold mb-2 text-white">{t(`${key}.title`)}</h2>
                    <p className="text-services-card mb-4">{t(`${key}.description`)}</p>
                    <ul className="space-y-2">
                      {features.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full services-bullet flex-shrink-0" />
                          <span className="text-services-card">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
