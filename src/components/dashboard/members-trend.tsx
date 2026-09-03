"use client";

import { useMemo, useState } from "react";

type DayPoint = { date: string; count: number };
const RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
] as const;

/**
 * New members over time, single series, with a selectable date range.
 * dataviz notes applied: one series -> no legend (the card title names it);
 * single hue for magnitude; bars anchored to baseline with rounded top;
 * recessive axis; per-bar hover tooltip; text stays in ink tokens.
 */
export function MembersTrend({ series }: { series: DayPoint[] }) {
  const [days, setDays] = useState<number>(30);
  const [hover, setHover] = useState<number | null>(null);

  const data = useMemo(() => series.slice(-days), [series, days]);
  const total = useMemo(() => data.reduce((s, d) => s + d.count, 0), [data]);
  const max = Math.max(...data.map((d) => d.count), 1);
  const height = 180;
  const barW = 100 / data.length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-3xl font-bold tabular-nums text-ink">{total}</p>
          <p className="text-xs text-ink-muted">new members in the last {days} days</p>
        </div>
        <div role="group" aria-label="Date range" className="flex rounded border border-border p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setDays(r.days)}
              aria-pressed={days === r.days}
              className={
                "rounded px-2.5 py-1 text-xs font-medium transition-colors " +
                (days === r.days ? "bg-brand-indigo text-white" : "text-ink-muted hover:text-ink")
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4">
        <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="h-44 w-full" role="img" aria-label={`New members per day, last ${days} days`}>
          <line
            x1={0}
            y1={height - 16}
            x2={100}
            y2={height - 16}
            stroke="rgb(var(--border))"
            strokeWidth={0.5}
            vectorEffect="non-scaling-stroke"
          />
          {data.map((d, i) => {
            const h = (d.count / max) * (height - 24);
            const x = i * barW;
            return (
              <g key={d.date}>
                <rect
                  x={x + barW * 0.18}
                  y={height - 16 - h}
                  width={barW * 0.64}
                  height={Math.max(h, 0.5)}
                  rx={1.2}
                  fill="#2E3A6E"
                  opacity={hover === null || hover === i ? 1 : 0.35}
                />
                <rect
                  x={x}
                  y={0}
                  width={barW}
                  height={height}
                  fill="transparent"
                  tabIndex={0}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`${d.date}: ${d.count} new member${d.count === 1 ? "" : "s"}`}
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
            <span className="font-medium">
              {data[hover].count} new member{data[hover].count === 1 ? "" : "s"}
            </span>
            <span className="ml-1.5 text-brand-cream/70">{data[hover].date.slice(5)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
