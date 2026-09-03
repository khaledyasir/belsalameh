import Link from "next/link";
import { Sparkles, ShieldCheck, Clock, Plane } from "lucide-react";
import { JoinTrigger } from "@/components/site/join";
import { AirplanePattern } from "@/components/site/airplane-pattern";
import { SITE } from "@/lib/site-content";
import { MEMBERSHIP } from "@/lib/membership";
import { formatMoney } from "@/lib/format";

const PRIMARY_PILL =
  "inline-flex items-center gap-2 rounded-full bg-brand-indigo px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-indigo/90 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-indigo";
const GHOST_PILL =
  "inline-flex items-center gap-2 rounded-full border border-brand-indigo/20 bg-white/70 px-6 py-3 text-sm font-semibold text-brand-indigo transition hover:bg-white";
const ORANGE_PILL =
  "inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-brand-indigo shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-md";

const INCLUDED_ICONS = [Sparkles, ShieldCheck, Clock];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-cream">
        {/* soft sunrise glow */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60rem 32rem at 82% 8%, rgba(247,166,99,0.55), rgba(250,220,168,0.28) 38%, rgba(255,243,224,0) 68%)",
          }}
        />
        <AirplanePattern className="-z-10 text-brand-orange opacity-[0.07]" />

        <div className="mx-auto max-w-6xl px-4 pb-28 pt-20 sm:px-6 sm:pb-32 sm:pt-28">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-purple">
              <Plane className="h-3.5 w-3.5" aria-hidden />
              {SITE.hero.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] text-brand-indigo sm:text-6xl">
              {SITE.hero.heading}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">{SITE.hero.body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <JoinTrigger className={PRIMARY_PILL}>
                <Plane className="h-4 w-4" aria-hidden />
                {SITE.hero.primaryCta}
              </JoinTrigger>
              <Link href="#how-it-works" className={GHOST_PILL}>
                {SITE.hero.secondaryCta}
              </Link>
            </div>

            <p className="mt-5 text-sm text-ink-subtle">
              One simple membership ·{" "}
              <span className="font-medium text-ink">
                {formatMoney(MEMBERSHIP.priceMinor, MEMBERSHIP.currency)}
              </span>{" "}
              <span>(placeholder price)</span>
            </p>
          </div>
        </div>

        {/* gentle wave into the next section */}
        <svg
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 w-full text-surface sm:h-24"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path d="M0,56 C240,110 480,10 720,34 C960,58 1200,104 1440,52 L1440,100 L0,100 Z" fill="currentColor" />
        </svg>
      </section>

      {/* ── What's included ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl font-bold text-brand-indigo">{SITE.included.heading}</h2>
        <p className="mt-1 text-sm text-ink-subtle">{SITE.included.note}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {SITE.included.items.map((it, i) => {
            const Icon = INCLUDED_ICONS[i] ?? Sparkles;
            return (
              <div
                key={it.title}
                className="rounded-2xl border border-brand-sand/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-orange/15 text-brand-orange">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-brand-indigo">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{it.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-20 bg-brand-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="font-display text-3xl font-bold text-brand-indigo">{SITE.steps.heading}</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {SITE.steps.items.map((s, i) => (
              <li key={s.title}>
                <span
                  className="grid h-10 w-10 place-items-center rounded-full font-display text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #F7A663, #B48DBF)" }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-brand-indigo">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FAQ teaser ────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl font-bold text-brand-indigo">{SITE.faq.heading}</h2>
        <dl className="mt-6 divide-y divide-brand-sand/70">
          {SITE.faq.items.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="font-display text-lg font-semibold text-brand-indigo">{f.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
        <Link href="/faq" className="mt-3 inline-block text-sm font-medium text-brand-purple hover:underline">
          Read all questions
        </Link>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-brand-indigo px-6 py-14 text-center sm:px-12">
          <AirplanePattern className="text-white opacity-[0.06]" />
          <h2 className="relative font-display text-3xl font-bold text-white">{SITE.finalCta.heading}</h2>
          <p className="relative mt-2 text-brand-cream/80">{SITE.finalCta.body}</p>
          <div className="relative mt-7 flex justify-center">
            <JoinTrigger className={ORANGE_PILL}>
              <Plane className="h-4 w-4" aria-hidden />
              {SITE.finalCta.cta}
            </JoinTrigger>
          </div>
        </div>
      </section>
    </>
  );
}
