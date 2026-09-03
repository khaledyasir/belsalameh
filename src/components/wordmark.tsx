import { cn } from "@/lib/utils";

/**
 * Text wordmark stand-in for the Balsalameh logo.
 * PLACEHOLDER: replace with the supplied vector logo (SVG) in Phase 4/5.
 * The gold dot echoes the airplane motif from the brand guidelines.
 */
export function Wordmark({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 font-display text-lg font-bold tracking-tight",
        tone === "light" ? "text-white" : "text-brand-indigo",
        className,
      )}
    >
      Balsalameh
      <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" aria-hidden />
      <span
        className={cn(
          "text-[0.65rem] font-medium uppercase tracking-[0.2em]",
          tone === "light" ? "text-brand-cream/70" : "text-ink-muted",
        )}
      >
        Airport
      </span>
    </span>
  );
}
