import Link from "next/link";
import { ShieldCheck, Ban, RefreshCcwDot, MailCheck, Plane, Check } from "lucide-react";
import { JoinTrigger } from "@/components/site/join";
import { AirplanePattern } from "@/components/site/airplane-pattern";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { SITE, PARTNER } from "@/lib/site-content";

const PRIMARY_PILL =
  "inline-flex items-center gap-2 rounded-full bg-brand-indigo px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-indigo/90 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-indigo";
const GHOST_PILL =
  "inline-flex items-center gap-2 rounded-full border border-brand-indigo/20 bg-white/70 px-6 py-3 text-sm font-semibold text-brand-indigo transition hover:bg-white";
const ORANGE_PILL =
  "inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-brand-indigo shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-md";

const BENEFIT_ICONS = [ShieldCheck, Ban, RefreshCcwDot, MailCheck];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-cream">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60rem 32rem at 82% 8%, rgba(247,166,99,0.55), rgba(250,220,168,0.28) 38%, rgba(255,243,224,0) 68%)",
          }}
        />
        <AirplanePattern className="-z-10 text-brand-orange opacity-[0.07]" />

        <div className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pb-28 sm:pt-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-purple">
              <Plane className="h-3.5 w-3.5" aria-hidden />
              {SITE.hero.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] text-brand-indigo sm:text-6xl">
              {SITE.hero.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{SITE.hero.body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <JoinTrigger className={PRIMARY_PILL}>
                <Plane className="h-4 w-4" aria-hidden />
                {SITE.hero.primaryCta}
              </JoinTrigger>
              <Link href="#how-it-works" className={GHOST_PILL}>
                See how it works
              </Link>
            </div>

            <p className="mt-5 text-sm text-ink-subtle">{SITE.hero.microcopy}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {["1–4 kg excess covered", "Bags up to 27 kg", "Pay at the counter"].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-indigo/15 bg-white/70 px-3 py-1 text-xs font-medium text-brand-indigo"
                >
                  <Check className="h-3.5 w-3.5 text-brand-orange" aria-hidden />
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <svg
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 w-full text-surface sm:h-24"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path d="M0,56 C240,110 480,10 720,34 C960,58 1200,104 1440,52 L1440,100 L0,100 Z" fill="currentColor" />
        </svg>
      </section>

      {/* ── Partnership + trust bar ──────────────────────────── */}
      <section className="border-b border-brand-sand/60 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle">
            In visionary partnership with
          </p>
          <p className="font-display text-xl font-bold text-brand-indigo">
            {PARTNER} <span className="text-sm font-medium text-ink-muted">(Founding Partner)</span>
          </p>
          <ul className="mt-1 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-muted">
            {SITE.trustBadges.map((b) => (
              <li key={b} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-brand-orange" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Early Bird banner ───────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="flex flex-col items-start gap-2 rounded-2xl border border-brand-orange/40 bg-brand-orange/10 p-5 sm:flex-row sm:items-center sm:gap-4">
          <span className="rounded-full bg-brand-orange px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-indigo">
            Early Bird
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-brand-indigo">{SITE.earlyBird.title}</p>
            <p className="mt-0.5 text-sm text-ink-muted">{SITE.earlyBird.body}</p>
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl font-bold text-brand-indigo">{SITE.benefits.heading}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.benefits.items.map((it, i) => {
            const Icon = BENEFIT_ICONS[i] ?? ShieldCheck;
            return (
              <div
                key={it.title}
                className="rounded-2xl border border-brand-sand/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-orange/15 text-brand-orange">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-brand-indigo">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{it.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Service overview ────────────────────────────────── */}
      <section id="member-services" className="scroll-mt-20 bg-brand-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-brand-indigo">{SITE.service.heading}</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">{SITE.service.intro}</p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-brand-indigo/15 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-purple">Launch service</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-brand-indigo">{SITE.service.launchTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{SITE.service.launchBody}</p>
            </div>

            <div className="rounded-2xl border border-brand-sand/70 bg-white p-6 shadow-sm">
              <h3 className="font-display text-xl font-semibold text-brand-indigo">{SITE.memberServices.heading}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{SITE.memberServices.body}</p>
              <p className="mt-4 inline-flex rounded-full bg-brand-cream px-3 py-1 text-xs font-medium text-ink-subtle">
                Published rate card coming at launch
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-20">
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

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="font-display text-3xl font-bold text-brand-indigo">{SITE.faq.heading}</h2>
          <div className="mt-6">
            <FaqAccordion items={SITE.faq.items.slice(0, 6)} />
          </div>
          <Link href="/faq" className="mt-4 inline-block text-sm font-medium text-brand-purple hover:underline">
            See all {SITE.faq.items.length} questions
          </Link>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-brand-indigo px-6 py-14 text-center sm:px-12">
          <AirplanePattern className="text-white opacity-[0.06]" />
          <h2 className="relative font-display text-3xl font-bold text-white">{SITE.finalCta.heading}</h2>
          <p className="relative mx-auto mt-3 max-w-2xl text-brand-cream/80">{SITE.finalCta.body}</p>
          <div className="relative mt-7 flex justify-center">
            <JoinTrigger className={ORANGE_PILL}>
              <Plane className="h-4 w-4" aria-hidden />
              {SITE.finalCta.cta}
            </JoinTrigger>
          </div>
          <p className="relative mt-5 font-display text-lg text-brand-cream">{SITE.finalCta.tagline}</p>
        </div>
      </section>
    </>
  );
}
