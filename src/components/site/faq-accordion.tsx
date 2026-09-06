import { ChevronDown } from "lucide-react";

/**
 * Click-to-expand FAQ. Native <details>/<summary> — works without JS, accessible
 * by default. The chevron rotates via the `[open]` selector (see globals.css).
 */
export function FaqAccordion({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-brand-sand/70 rounded-2xl border border-brand-sand/70 bg-white">
      {items.map((f) => (
        <details key={f.q} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-semibold text-brand-indigo">
            {f.q}
            <ChevronDown
              className="h-5 w-5 shrink-0 text-brand-purple transition-transform duration-200 group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="pb-5 pr-9 text-sm leading-relaxed text-ink-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
