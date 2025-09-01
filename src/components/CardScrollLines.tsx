"use client";

import { useLayoutEffect, useRef, useState } from "react";

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

  useLayoutEffect(() => {
    const newPositions: CardPosition[] = cardIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return { top: 0, bottom: 0, width: 0, left: 0 };
      return {
        top: el.offsetTop,
        bottom: el.offsetTop + el.offsetHeight,
        width: el.offsetWidth,
        left: el.offsetLeft,
      };
    });

    if (newPositions.length > 1) {
      let toggleRight = Math.random() < 0.5;
      const newLines: LinePoints[] = newPositions.slice(0, -1).map((pos, i) => {
        const next = newPositions[i + 1];

        const startX = toggleRight
          ? pos.left + pos.width * 0.6 + Math.random() * pos.width * 0.3
          : pos.left + pos.width * 0.1 + Math.random() * pos.width * 0.3;

        const endX = toggleRight
          ? next.left + next.width * 0.1 + Math.random() * next.width * 0.3
          : next.left + next.width * 0.6 + Math.random() * next.width * 0.3;

        const startY = pos.bottom;
        const endY = next.top;

        const mid1X = startX;
        const mid1Y = (startY + endY) / 2;
        const mid2X = endX;
        const mid2Y = mid1Y;

        toggleRight = !toggleRight;

        return { startX, startY, mid1X, mid1Y, mid2X, mid2Y, endX, endY };
      });

      setLines(newLines);
    }
  }, [cardIds]);

  useLayoutEffect(() => {
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
      (path as SVGPathElement).style.strokeDasharray = `${length}`;
      (path as SVGPathElement).style.strokeDashoffset = `${length}`;
      observer.observe(path);
    });

    return () => observer.disconnect();
  }, [lines]);

  if (!lines.length) return null;

  return (
    <svg
      ref={svgRef}
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
