import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-muted text-ink-muted ring-border",
  success: "bg-success/10 text-success ring-success/30",
  warning: "bg-warning/15 text-[#8a5a12] ring-warning/40",
  danger: "bg-danger/10 text-danger ring-danger/30",
  info: "bg-info/10 text-info ring-info/30",
  brand: "bg-brand-indigo/10 text-brand-indigo ring-brand-indigo/25",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
