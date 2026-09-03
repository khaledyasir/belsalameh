"use client";

import { useState } from "react";

export type TrendPoint = { date: string; value: number; label: string };

/**
 * Single-series time trend. dataviz notes applied:
 *  - one series -> no legend, the title (rendered by the caller) names it
 *  - single hue for magnitude; text stays in ink tokens
 *  - bars anchored to baseline with rounded top; recessive axis
 *  - hover layer with per-bar tooltip
 *
 * `label` is pre-formatted server-side (no function props across the RSC
 * boundary).
 */
export function TrendBars({
  data,
  height = 160,
  hue = "#2E3A6E",
}: {
  data: TrendPoint[];
  height?: number;
  hue?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = 100 / data.length;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="h-40 w-full"
        role="img"
        aria-label="Trend over the last 30 days"
      >
        <line
          x1={0}
          y1={height - 18}
          x2={100}
          y2={height - 18}
          stroke="rgb(var(--border))"
          strokeWidth={0.5}
          vectorEffect="non-scaling-stroke"
        />
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 26);
          const x = i * barW;
          return (
            <g key={d.date}>
              <rect
                x={x + barW * 0.15}
                y={height - 18 - h}
                width={barW * 0.7}
                height={Math.max(h, 0.5)}
                rx={1.5}
                fill={hue}
                opacity={hover === null || hover === i ? 1 : 0.35}
              />
              <rect
                x={x}
                y={0}
                width={barW}
                height={height}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`${d.date}: ${d.label}`}
              />
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[0.7rem] text-ink-subtle">
        <span>{data[0]?.date.slice(5)}</span>
        <span>{data[data.length - 1]?.date.slice(5)}</span>
      </div>
      {hover !== null && data[hover] && (
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded bg-brand-indigo px-2 py-1 text-xs text-white shadow-pop">
          <span className="font-medium">{data[hover].label}</span>
          <span className="ml-1.5 text-brand-cream/70">{data[hover].date.slice(5)}</span>
        </div>
      )}
    </div>
  );
}
