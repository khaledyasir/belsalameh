import { Badge } from "./badge";
import { cn } from "@/lib/utils";

/**
 * Marks any value or section still holding placeholder content that must be
 * replaced with company-supplied information before launch (plan §7).
 * Every one of these is surfaced on Settings › Launch readiness.
 */
export function PlaceholderBadge({ className, label = "Placeholder" }: { className?: string; label?: string }) {
  return (
    <Badge tone="warning" className={cn("uppercase tracking-wide", className)}>
      <span aria-hidden>⚑</span>
      {label}
    </Badge>
  );
}

export function PlaceholderNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-[#7a4d0f]">
      <span aria-hidden className="mt-0.5">⚑</span>
      <p>{children}</p>
    </div>
  );
}
