import { PARTNER } from "@/lib/site-content";

/**
 * The hero's signature visual: a baggage-tag card carrying the 23–27 kg
 * story in one glance — departure-board mono numerals, a decorative
 * (non-scannable) barcode strip, a punched string-hole. Static on mobile
 * (full width, no rotation, no overflow risk); tilted and overlapping on
 * desktop where there's room for it.
 */
export function LuggageTagVisual() {
  return (
    <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none lg:rotate-[-4deg] lg:transition-transform lg:duration-slow lg:ease-premium lg:hover:rotate-[-1deg]">
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-surface p-5 shadow-pop sm:p-7">
        {/* string hole */}
        <span
          aria-hidden
          className="absolute start-6 top-6 h-3.5 w-3.5 rounded-full border-2 border-primary/25 bg-canvas"
        />

        <div className="ps-8">
          <p className="font-mono text-caption font-bold uppercase tracking-[0.2em] text-primary/60">
            Belsalameh &middot; Baggage Tag
          </p>

          {/* Sized well below text-display-1: this card's own width (not the
              viewport) bounds it, and at 320–375px that width is much
              tighter than a full-bleed hero headline ever is. flex-wrap is a
              second safety net — KG drops to its own line rather than the
              row forcing the card (and page) wider. */}
          <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-mono text-[clamp(1.75rem,1rem+5vw,3.5rem)] font-bold leading-none tracking-tight text-primary">
              23<span className="mx-1 text-accent">&rarr;</span>27
            </span>
            <span className="font-mono text-heading-3 font-bold text-ink-subtle">KG</span>
          </div>
          <p className="mt-2 font-mono text-body-sm font-bold uppercase tracking-wide text-accent-ink">
            Member range &middot; protected rate
          </p>
        </div>

        <div aria-hidden className="mt-6 h-2 bsl-perforation text-border" />

        <div className="mt-6 flex items-center justify-between gap-4 ps-8">
          <div aria-hidden className="h-8 flex-1 bsl-barcode text-primary/30" />
        </div>

        <p className="mt-4 ps-8 font-mono text-caption uppercase tracking-wide text-ink-subtle">
          Partner: {PARTNER}
        </p>
      </div>
    </div>
  );
}
