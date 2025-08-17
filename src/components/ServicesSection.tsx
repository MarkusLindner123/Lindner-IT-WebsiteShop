"use client";

import { useEffect, useRef, useLayoutEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
  Smartphone,
  Server,
  Settings,
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
      { text: "Mobile", icon: Smartphone },
      { text: "Server", icon: Server },
      { text: "Config", icon: Settings },
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
    <section
      id="services"
      className="relative w-full min-h-[500px] rounded-2xl shadow-2xl bg-services-bg text-white flex flex-col items-center justify-center overflow-hidden"
    >
      <div
        ref={animationContainerRef}
        className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"
      />

      <div className="relative z-10 text-center space-y-8 max-w-7xl w-full px-6 md:px-12">
        <h2 className="text-4xl md:text-5xl font-bold">{t("title")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {(["webDesign", "softwareDevelopment"] as const).map((key) => {
            const features: string[] = [];
            for (let i = 1; i <= 5; i++) {
              const feature = t(`${key}.feature${i}`);
              if (feature) features.push(feature);
            }

            return (
              <div key={key} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-2">{t(`${key}.title`)}</h3>
                <p className="text-gray-200 mb-4">{t(`${key}.description`)}</p>
                <ul className="space-y-2">
                  {features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
