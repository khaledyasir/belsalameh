"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type FaqItem = { q: string; a: string; category?: string };

/**
 * Click-to-expand FAQ. Native <details>/<summary> — works without JS,
 * accessible by default; the chevron rotates via the `[open]` selector.
 * `filterable` adds a search box + category pills (client-side only).
 */
export function FaqAccordion({
  items,
  filterable = false,
  categories,
}: {
  items: readonly FaqItem[];
  filterable?: boolean;
  categories?: readonly string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!filterable) return items;
    const q = query.trim().toLowerCase();
    return items.filter((f) => {
      const matchesCategory = !category || f.category === category;
      const matchesQuery = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, filterable, query, category]);

  return (
    <div>
      {filterable && (
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute inset-y-0 start-3.5 my-auto h-4 w-4 text-ink-subtle" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions"
              aria-label="Search FAQ"
              className="h-11 w-full rounded-full border border-border bg-surface ps-10 pe-4 text-body text-ink placeholder:text-ink-subtle focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-primary"
            />
          </div>

          {categories && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              <button
                type="button"
                onClick={() => setCategory(null)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-body-sm font-medium transition-colors",
                  category === null ? "bg-primary text-primary-ink" : "bg-surface-muted text-ink-muted hover:text-ink",
                )}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-body-sm font-medium transition-colors",
                    category === c ? "bg-primary text-primary-ink" : "bg-surface-muted text-ink-muted hover:text-ink",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-6 text-center text-body text-ink-muted">
          No questions match &ldquo;{query}&rdquo;. Try a different search or{" "}
          <a href="/faq#support" className="text-primary underline">
            contact support
          </a>
          .
        </p>
      ) : (
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {filtered.map((f) => (
            <details
              key={f.q}
              className="group px-5 [&_summary::-webkit-details-marker]:hidden"
              onToggle={(e) => {
                if (e.currentTarget.open) trackEvent("faq_opened", { question: f.q });
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-heading-3 font-semibold text-ink">
                {f.q}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-primary transition-transform duration-fast group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-5 pe-9 text-body leading-relaxed text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
