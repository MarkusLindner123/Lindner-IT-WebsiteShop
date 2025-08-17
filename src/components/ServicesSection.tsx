"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

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

  useEffect(() => {
    const animationContainer = animationContainerRef.current;
    if (!animationContainer) return;

    const tags = ["Web", "Code", "Design", "Software", "UI/UX", "Cloud"];
    const numShapes = 8;
    const floatingElements: FloatingElement[] = [];

    const getRandom = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const containerWidth = animationContainer!.offsetWidth;
    const containerHeight = animationContainer!.offsetHeight;

    for (let i = 0; i < numShapes; i++) {
      const shape = document.createElement("div");
      shape.classList.add(
        "inline-flex",
        "items-center",
        "px-4",
        "py-1",
        "rounded-full",
        "text-sm",
        "font-medium",
        "text-gray-200",
        "bg-white/10",
        "backdrop-blur-sm",
        "floating-tag"
      );

      const textSpan = document.createElement("span");
      textSpan.textContent = tags[Math.floor(Math.random() * tags.length)];
      shape.appendChild(textSpan);

      animationContainer.appendChild(shape);

      let x, y, isColliding;
      do {
        isColliding = false;
        x = getRandom(0, containerWidth - shape.offsetWidth);
        y = getRandom(0, containerHeight - shape.offsetHeight);

        for (const existingEl of floatingElements) {
          if (
            x < existingEl.x + existingEl.width &&
            x + shape.offsetWidth > existingEl.x &&
            y < existingEl.y + existingEl.height &&
            y + shape.offsetHeight > existingEl.y
          ) {
            isColliding = true;
            break;
          }
        }
      } while (isColliding);

      floatingElements.push({
        el: shape,
        x,
        y,
        vx: getRandom(0.5, 1) * (Math.random() < 0.5 ? 1 : -1),
        vy: getRandom(0.5, 1) * (Math.random() < 0.5 ? 1 : -1),
        width: shape.offsetWidth,
        height: shape.offsetHeight,
      });
    }

    function animate() {
      const containerWidth = animationContainer!.offsetWidth;
      const containerHeight = animationContainer!.offsetHeight;

      for (let i = 0; i < floatingElements.length; i++) {
        const el = floatingElements[i];
        el.x += el.vx;
        el.y += el.vy;

        if (el.x + el.width > containerWidth || el.x < 0) {
          el.vx *= -1;
          el.x = el.x < 0 ? 0 : containerWidth - el.width;
        }
        if (el.y + el.height > containerHeight || el.y < 0) {
          el.vy *= -1;
          el.y = el.y < 0 ? 0 : containerHeight - el.height;
        }

        for (let j = i + 1; j < floatingElements.length; j++) {
          const otherEl = floatingElements[j];
          if (
            el.x < otherEl.x + otherEl.width &&
            el.x + el.width > otherEl.x &&
            el.y < otherEl.y + otherEl.height &&
            el.y + el.height > otherEl.y
          ) {
            const tempVx = el.vx;
            const tempVy = el.vy;
            el.vx = otherEl.vx;
            el.vy = otherEl.vy;
            otherEl.vx = tempVx;
            otherEl.vy = tempVy;
          }
        }

        el.el.style.transform = `translate(${el.x}px, ${el.y}px)`;
      }
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <section
      id="services"
      className="relative w-11/12 max-w-6xl mx-auto p-8 md:p-12 rounded-2xl shadow-2xl bg-gray-800/80 text-white min-h-[500px] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Floating Background */}
      <div
        ref={animationContainerRef}
        className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"
      />

      {/* Content */}
      <div className="relative z-10 text-center space-y-8">

        <h2 className="text-4xl md:text-5xl font-bold">{t("title")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">
              {t("webDesign.title")}
            </h3>
            <p className="text-gray-300">{t("webDesign.description")}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">
              {t("softwareDevelopment.title")}
            </h3>
            <p className="text-gray-300">
              {t("softwareDevelopment.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
