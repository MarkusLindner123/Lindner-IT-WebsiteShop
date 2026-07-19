"use client";

import { useEffect, useRef, useState } from "react";

interface CardScrollLinesProps {
  cardIds: string[];
}

interface CardPosition {
  top: number;
  bottom: number;
  width: number;
  left: number;
}

interface LinePoints {
  startX: number;
  startY: number;
  mid1X: number;
  mid1Y: number;
  mid2X: number;
  mid2Y: number;
  endX: number;
  endY: number;
}

export default function CardScrollLines({ cardIds }: CardScrollLinesProps) {
  const [lines, setLines] = useState<LinePoints[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const animatedLines = useRef<Set<number>>(new Set());

  // Zufallsfaktoren nur einmal würfeln und wiederverwenden: Neuberechnungen
  // (Resize, Font-Swap, FAQ-Akkordeon, Sprachwechsel) lassen die Linien
  // sonst bei jedem Durchlauf an andere Stellen springen.
  const randomFactorsRef = useRef<{ start: number; end: number }[] | null>(null);
  const firstRightRef = useRef<boolean>(false);

  // String-Key statt Array-Referenz: der Server schickt bei jedem Render
  // (z. B. Sprachwechsel) eine neue Array-Instanz mit gleichem Inhalt.
  const idsKey = cardIds.join(",");

  // Positionen berechnen — und bei jeder Layout-Änderung der Cards neu
  useEffect(() => {
    const ids = idsKey ? idsKey.split(",") : [];
    if (!ids.length) return;

    let rafId: number | null = null;
    let disposed = false;

    const calculate = () => {
      rafId = null;
      if (disposed) return;

      const positions: (CardPosition | null)[] = ids.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return {
          top: el.offsetTop,
          bottom: el.offsetTop + el.offsetHeight,
          width: el.offsetWidth,
          left: el.offsetLeft,
        };
      });

      if (positions.some((pos) => pos === null) || positions.length < 2) {
        setLines([]);
        return;
      }

      if (
        !randomFactorsRef.current ||
        randomFactorsRef.current.length !== ids.length - 1
      ) {
        randomFactorsRef.current = Array.from({ length: ids.length - 1 }, () => ({
          start: Math.random(),
          end: Math.random(),
        }));
        firstRightRef.current = Math.random() < 0.5;
      }

      let toggleRight = firstRightRef.current;
      const factors = randomFactorsRef.current;

      const newLines: LinePoints[] = positions.slice(0, -1).map((pos, i) => {
        const next = positions[i + 1] as CardPosition;
        const card = pos as CardPosition;
        const { start, end } = factors[i];

        const startX = toggleRight
          ? card.left + card.width * (0.6 + start * 0.3)
          : card.left + card.width * (0.1 + start * 0.3);

        const endX = toggleRight
          ? next.left + next.width * (0.1 + end * 0.3)
          : next.left + next.width * (0.6 + end * 0.3);

        const startY = card.bottom;
        const endY = next.top;

        const mid1X = startX;
        const mid1Y = (startY + endY) / 2;
        const mid2X = endX;
        const mid2Y = mid1Y;

        toggleRight = !toggleRight;

        return { startX, startY, mid1X, mid1Y, mid2X, mid2Y, endX, endY };
      });

      // Nur updaten, wenn sich wirklich etwas geändert hat — verhindert
      // Endlosschleifen mit dem ResizeObserver
      setLines((prev) =>
        JSON.stringify(prev) === JSON.stringify(newLines) ? prev : newLines
      );
    };

    const scheduleCalculate = () => {
      if (rafId === null && !disposed) rafId = requestAnimationFrame(calculate);
    };

    scheduleCalculate();

    // Cards ändern ihre Höhe nach dem Mount: Webfonts werden eingewechselt,
    // Bilder laden, FAQ-Akkordeons öffnen sich, Übersetzungen sind
    // unterschiedlich lang. ResizeObserver fängt all das ab.
    const resizeObserver = new ResizeObserver(scheduleCalculate);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) resizeObserver.observe(el);
    });

    window.addEventListener("resize", scheduleCalculate);

    // Nach dem Font-Swap stimmen die Höhen endgültig
    document.fonts?.ready.then(scheduleCalculate);

    return () => {
      disposed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleCalculate);
    };
  }, [idsKey]);

  // Animation der Linien beim Sichtbarwerden
  useEffect(() => {
    if (!lines.length) return;

    const paths = svgRef.current?.querySelectorAll("path");
    if (!paths) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting && !animatedLines.current.has(index)) {
            const path = entry.target as SVGPathElement;
            const length = path.getTotalLength();
            path.style.transition = "stroke-dashoffset 1s ease";
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
            requestAnimationFrame(() => {
              path.style.strokeDashoffset = "0";
            });
            animatedLines.current.add(index);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    paths.forEach((path, i) => {
      path.setAttribute("data-index", String(i));
      const length = (path as SVGPathElement).getTotalLength();

      if (animatedLines.current.has(i)) {
        // Bereits gezeichnete Linien nach einer Neuberechnung (Resize,
        // Sprachwechsel …) sofort voll anzeigen statt sie erneut zu
        // verstecken — sonst bleiben sie unsichtbar, weil der Observer
        // sie als "schon animiert" überspringt.
        (path as SVGPathElement).style.transition = "none";
        (path as SVGPathElement).style.strokeDasharray = `${length}`;
        (path as SVGPathElement).style.strokeDashoffset = "0";
      } else {
        (path as SVGPathElement).style.strokeDasharray = `${length}`;
        (path as SVGPathElement).style.strokeDashoffset = `${length}`;
        observer.observe(path);
      }
    });

    return () => observer.disconnect();
  }, [lines]);

  if (!lines.length) return null;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-40"
    >
      {lines.map((line, i) => (
        <g key={i}>
          <path
            d={`M ${line.startX} ${line.startY} L ${line.mid1X} ${line.mid1Y} L ${line.mid2X} ${line.mid2Y} L ${line.endX} ${line.endY}`}
            stroke="var(--color-accent-two)"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx={line.startX}
            cy={line.startY}
            r={6}
            fill="var(--color-accent-one)"
            stroke="var(--color-primary-dark)"
            strokeWidth={2}
          />
          <circle
            cx={line.endX}
            cy={line.endY}
            r={6}
            fill="var(--color-accent-one)"
            stroke="var(--color-primary-dark)"
            strokeWidth={2}
          />
        </g>
      ))}
    </svg>
  );
}
