import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Hero-number tile (dataviz: a single headline value is "not a chart").
 * Value/label wear text tokens; an optional sparkline sits behind, recessive.
 */
export function StatTile({
  label,
  value,
  sub,
  spark,
  tone = "default",
  sample = true,
}: {
  label: string;
  value: string;
  sub?: string;
  spark?: number[];
  tone?: "default" | "accent";
  sample?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
        {sample && (
          <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[0.6rem] font-medium uppercase text-ink-subtle">
            Sample
          </span>
        )}
      </div>
      <p
        className={cn(
          "mt-2 font-display text-2xl font-bold tabular-nums",
          tone === "accent" ? "text-brand-indigo" : "text-ink",
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-ink-muted">{sub}</p>}
      {spark && spark.length > 1 && <Sparkline data={spark} />}
    </Card>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const w = 120;
  const h = 28;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((d, i) => `${i * step},${h - ((d - min) / range) * (h - 2) - 1}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-3 h-7 w-full text-brand-purple/70"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
