import Link from "next/link";
import { ShieldCheck, Ban, RefreshCcwDot, MailCheck, Plane, Check, Sparkles } from "lucide-react";
import { JoinTrigger } from "@/components/site/join";
import { AnimatedSky } from "@/components/site/animated-sky";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { WeightSimulator } from "@/components/site/weight-simulator";
import { MembershipPass } from "@/components/site/membership-pass";
import { LuggageTagVisual } from "@/components/site/luggage-tag-visual";
import { TicketDivider } from "@/components/site/ticket-divider";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SITE, PARTNER, EARLY_BIRD_DATE } from "@/lib/site-content";

const PRIMARY_PILL =
  "inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-body-sm font-semibold text-primary-ink shadow-sm transition duration-fast ease-premium hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const GHOST_PILL =
  "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface/70 px-6 py-3 text-body-sm font-semibold text-primary transition duration-fast ease-premium hover:bg-surface";
const ORANGE_PILL =
  "inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-body-sm font-semibold text-accent-ink shadow-sm transition duration-fast ease-premium hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md";

const BENEFIT_ICONS = [ShieldCheck, Ban, RefreshCcwDot, MailCheck];

/** Small heading block reused across blocks that no longer own a full Section. */
function BlockHeading({
  eyebrow,
  heading,
  lead,
  align = "start",
}: {
  eyebrow?: string;
  heading: string;
  lead?: string;
  align?: "start" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "text-start"}>
      {eyebrow && <p className="text-caption font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>}
      <h2 className="mt-3 font-display text-display-2 font-bold text-ink">{heading}</h2>
      {lead && <p className="mt-4 text-body-lg text-ink-muted">{lead}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      {/* ══════════ Zone 1 — Arrival: hero → service, one continuous canvas ══════════ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-brand-cream via-brand-cream to-surface">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 32rem at 82% 8%, rgba(247,166,99,0.45), rgba(250,220,168,0.22) 38%, rgba(255,243,224,0) 68%)",
          }}
        />
        <AnimatedSky variant="gold" />
        <div aria-hidden className="bsl-grain absolute inset-0" />
        {/* The thread connecting hero → service visually, not just spacing. */}
        <div aria-hidden className="bsl-route-line absolute top-24 bottom-24 start-[4%] hidden lg:block" />

        {/* Hero */}
        <Container className="relative z-10 pb-14 pt-section-md">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-surface/70 px-3 py-1 text-caption font-semibold uppercase tracking-[0.16em] text-brand-purple">
                <Plane className="h-3.5 w-3.5" aria-hidden />
                {SITE.hero.eyebrow}
              </p>
              <h1 className="mt-4 font-display text-display-1 font-bold text-ink">{SITE.hero.heading}</h1>
              <p className="mt-5 max-w-2xl text-body-lg text-ink-muted">{SITE.hero.body}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <JoinTrigger className={PRIMARY_PILL} analyticsEvent="hero_cta_clicked">
                  <Plane className="h-4 w-4" aria-hidden />
                  {SITE.hero.primaryCta}
                </JoinTrigger>
                <Link href="#how-it-works" className={GHOST_PILL}>
                  See how it works
                </Link>
              </div>

              <p className="mt-4 text-body-sm text-ink-subtle">{SITE.hero.microcopy}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["No pre-booking", "No auto-renewal", "Pay at the counter"].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface px-4 py-2 text-body-sm font-semibold text-ink shadow-sm"
                  >
                    <Check className="h-4 w-4 text-accent" aria-hidden />
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <LuggageTagVisual />
          </div>
        </Container>

        {/* Trust bar — a divider, not a new box */}
        <Container className="relative z-10 flex flex-col items-center gap-4 border-t border-primary/10 pt-10 text-center">
          <p className="text-caption font-semibold uppercase tracking-[0.18em] text-ink-subtle">
            In visionary partnership with
          </p>
          <p className="flex items-center gap-2 font-display text-heading-1 font-bold text-ink">
            <Plane className="h-6 w-6 shrink-0 -rotate-45 text-accent" aria-hidden />
            {PARTNER} <span className="text-body-sm font-medium text-ink-muted">(Founding Partner)</span>
          </p>
          <ul className="mt-1 flex flex-wrap items-center justify-center gap-2">
            {SITE.trustBadges.map((b) => (
              <li
                key={b}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-surface px-4 py-2 text-body-sm font-semibold text-ink shadow-sm"
              >
                <Check className="h-4 w-4 text-accent" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </Container>

        {/* Early Bird banner — a limited-time ticket stub, not a flat notice box */}
        <Container className="relative z-10 mt-10">
          <Reveal className="relative overflow-hidden rounded-2xl border-2 border-dashed border-accent/50 bg-gradient-to-br from-accent/15 via-accent/5 to-transparent p-5 sm:p-6">
            <div aria-hidden className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-accent px-3.5 py-1.5 text-caption font-bold uppercase tracking-wide text-accent-ink">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Early Bird
              </span>
              <div className="flex-1">
                <p className="font-display text-heading-3 font-semibold text-ink">{SITE.earlyBird.title}</p>
                <p className="mt-0.5 text-body-sm text-ink-muted">{SITE.earlyBird.body}</p>
              </div>
              <span className="shrink-0 self-start rounded-lg border border-accent/30 bg-surface/80 px-3 py-1.5 font-mono text-caption font-bold uppercase tracking-wide text-accent-ink sm:self-center">
                Ends {EARLY_BIRD_DATE}
              </span>
            </div>
          </Reveal>
        </Container>

        {/* Interactive weight simulator */}
        <Container id="member-services" className="relative z-10 mt-16 scroll-mt-20 sm:mt-20">
          <Reveal>
            <BlockHeading
              eyebrow="See where your membership helps"
              heading="Where does your bag fall?"
              lead="Drag the slider to your checked-bag weight and see instantly whether the launch service applies."
            />
          </Reveal>
          <Reveal className="mt-8">
            <WeightSimulator />
          </Reveal>
        </Container>

        {/* The service — overlaps the zone's bottom seam instead of sitting in its own rectangle */}
        <Container className="relative z-10 mt-16 pb-section-sm sm:mt-20">
          <Reveal className="max-w-3xl">
            <h2 className="font-display text-display-2 font-bold text-ink">{SITE.service.heading}</h2>
            <p className="mt-4 text-body-lg text-ink-muted">{SITE.service.lead}</p>
          </Reveal>

          <Reveal delay={80} className="relative z-10 mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-pop">
            {/* Soft accent glow — pure CSS, clipped by overflow-hidden. No image request. */}
            <div aria-hidden className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative p-6 sm:p-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-caption font-semibold uppercase tracking-wide text-primary-ink">
                <Plane className="h-3.5 w-3.5" aria-hidden />
                Launch service · {PARTNER} only
              </span>
              <h3 className="mt-4 font-display text-heading-1 font-bold text-ink">{SITE.service.name}</h3>
              <p className="mt-1 text-body-sm text-ink-muted">{SITE.service.eligibility}</p>

              <p className="mt-6 text-body-lg text-ink-muted">{SITE.service.body}</p>
            </div>

            {/* Torn-ticket seam — the description above is the "service", the
                checklist below reads like the boarding stub's fine print. */}
            <div aria-hidden className="h-2 bsl-perforation text-border" />

            <div className="relative p-6 pt-6 sm:p-8 sm:pt-6">
              <p className="text-caption font-semibold uppercase tracking-wide text-ink-subtle">What&apos;s included</p>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {SITE.service.points.map((pt, i) => (
                  <li key={pt} className="flex gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-accent/40 bg-accent/10 font-mono text-caption font-bold text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-body text-ink-muted">{pt}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-t border-border pt-4 text-caption text-ink-subtle">{SITE.service.ratesNote}</p>
            </div>
          </Reveal>
        </Container>

        <TicketDivider className="relative z-10 text-primary" />
      </div>

      {/* ══════════ Zone 2 — dark contrast: How it works, departure-board motif ══════════ */}
      <section id="how-it-works" className="relative scroll-mt-20 overflow-hidden bg-primary">
        <div aria-hidden className="bsl-grain absolute inset-0" />
        <AnimatedSky variant="white" />
        <Container className="relative py-section-md">
          <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">Departures</p>
          <h2 className="mt-3 font-display text-display-2 font-bold text-white">{SITE.steps.heading}</h2>

          <ol className="relative mt-10 grid gap-8 sm:grid-cols-3">
            <div aria-hidden className="absolute inset-x-0 top-6 hidden h-px bg-white/15 sm:block" />
            {SITE.steps.items.map((s, i) => (
              <Reveal key={s.title} as="li" delay={i * 80} className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-lg border border-accent/40 bg-primary font-mono text-heading-2 font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-heading-2 font-semibold text-white">{s.title}</h3>
                <p className="mt-1.5 text-body text-white/70">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
        <TicketDivider className="relative text-canvas" />
      </section>

      {/* ══════════ Zone 3 — the rest of the journey, one soft canvas ══════════ */}
      <div className="relative bg-gradient-to-b from-brand-cream via-surface to-surface">
        {/* Benefits */}
        <Container className="relative py-section-md">
          <Reveal>
            <h2 className="font-display text-display-2 font-bold text-ink">{SITE.benefits.heading}</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SITE.benefits.items.map((it, i) => {
              const Icon = BENEFIT_ICONS[i] ?? ShieldCheck;
              return (
                <Reveal
                  key={it.title}
                  delay={i * 60}
                  className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition duration-base ease-premium hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-accent/15 text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-heading-3 font-semibold text-ink">{it.title}</h3>
                  <p className="mt-2 text-body text-ink-muted">{it.body}</p>
                </Reveal>
              );
            })}
          </div>
        </Container>

        {/* Membership vs airport payment */}
        <Container className="relative py-section-sm">
          <Reveal>
            <BlockHeading
              eyebrow="Two very different payments"
              heading="What you pay, and where"
              lead="Your membership and the airport service are billed separately, to two different parties."
            />
          </Reveal>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Reveal className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface p-6">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-caption font-semibold uppercase tracking-wide text-primary">
                  Belsalameh
                </span>
                <h3 className="mt-3 font-display text-heading-2 font-semibold text-ink">Membership access</h3>
                <p className="mt-2 text-body-sm text-ink-muted">
                  A one-time annual fee, paid online when you activate. Zero auto-renewals.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-dashed border-border bg-surface/60 p-6">
                <span className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-caption font-semibold uppercase tracking-wide text-accent-ink">
                  {PARTNER}
                </span>
                <h3 className="mt-3 font-display text-heading-2 font-semibold text-ink">Eligible airport service</h3>
                <p className="mt-2 text-body-sm text-ink-muted">
                  Paid directly to the check-in agent, at the counter, on the day you travel.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <MembershipPass fullName="Alex J. Traveler" membershipId="BSL-XXXX-XXXX" expiry="Month YYYY" />
              <p className="mt-3 text-caption text-ink-subtle">
                Illustrative preview — no barcode/QR by design; validation is a visual name + ID match at check-in.
              </p>
            </Reveal>
          </div>
        </Container>

        {/* Future services */}
        <Container className="relative py-section-sm">
          <Reveal>
            <BlockHeading
              eyebrow="What's next"
              heading="More ways to fly in relief"
              lead={SITE.finalCta.body}
              align="center"
            />
          </Reveal>
          <div className="mt-6 flex justify-center">
            <JoinTrigger className={PRIMARY_PILL}>
              <Plane className="h-4 w-4" aria-hidden />
              {SITE.finalCta.cta}
            </JoinTrigger>
          </div>
        </Container>

        {/* FAQ */}
        <Container className="max-w-3xl py-section-md">
          <h2 className="font-display text-display-2 font-bold text-ink">{SITE.faq.heading}</h2>
          <div className="mt-6">
            <FaqAccordion items={SITE.faq.items.slice(0, 6)} />
          </div>
          <Link href="/faq" className="mt-4 inline-block text-body-sm font-medium text-brand-purple hover:underline">
            See all {SITE.faq.items.length} questions
          </Link>
        </Container>
      </div>

      {/* ══════════ Final CTA — floats on the canvas, not another band ══════════ */}
      <Container className="py-section-md">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-12">
          <AnimatedSky variant="white" />
          <h2 className="relative font-display text-display-2 font-bold text-white">{SITE.footer.tagline}</h2>
          <div className="relative mt-7 flex justify-center">
            <JoinTrigger className={ORANGE_PILL}>
              <Plane className="h-4 w-4" aria-hidden />
              Activate membership
            </JoinTrigger>
          </div>
          <p className="relative mt-5 text-body-sm text-brand-cream/80">
            No auto-renewal · Confirmation by email · Pay airport services at the counter
          </p>
        </div>
      </Container>
    </>
  );
}
