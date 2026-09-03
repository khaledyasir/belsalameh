import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { SITE } from "@/lib/site-content";
import { MEMBERSHIP } from "@/lib/membership";
import { formatMoney } from "@/lib/format";

export default function LandingPage() {
  return (
    <>
      {/* Hero — CSS gradient only, no image, to stay fast on airport Wi-Fi */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-orange/30 via-brand-mauve/20 to-brand-indigo/10"
        />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
              {SITE.hero.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
              {SITE.hero.heading}
            </h1>
            <p className="mt-4 text-lg text-ink-muted">{SITE.hero.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/join" className={buttonClasses("primary", "md")}>
                {SITE.hero.primaryCta}
              </Link>
              <Link href="#how-it-works" className={buttonClasses("secondary", "md")}>
                {SITE.hero.secondaryCta}
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-subtle">
              One membership · {formatMoney(MEMBERSHIP.priceMinor, MEMBERSHIP.currency)}{" "}
              <span className="text-ink-subtle">(placeholder price)</span>
            </p>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-ink">{SITE.included.heading}</h2>
        <p className="mt-1 text-sm text-ink-subtle">{SITE.included.note}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {SITE.included.items.map((it) => (
            <div key={it.title} className="rounded-lg border border-border bg-surface p-5">
              <h3 className="font-display text-lg font-semibold text-ink">{it.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{it.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-ink">{SITE.steps.heading}</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {SITE.steps.items.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-indigo font-display text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-ink">{SITE.faq.heading}</h2>
        <dl className="mt-6 divide-y divide-border">
          {SITE.faq.items.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="font-medium text-ink">{f.q}</dt>
              <dd className="mt-1 text-sm text-ink-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
        <Link href="/faq" className="mt-2 inline-block text-sm text-brand-indigo hover:underline">
          All questions
        </Link>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-indigo">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white">{SITE.finalCta.heading}</h2>
          <p className="mt-2 text-brand-cream/80">{SITE.finalCta.body}</p>
          <Link
            href="/join"
            className="mt-6 inline-flex items-center justify-center rounded bg-brand-orange px-5 py-2.5 text-sm font-semibold text-brand-indigo hover:bg-brand-orange/90"
          >
            {SITE.finalCta.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
