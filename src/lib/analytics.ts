"use client";

/**
 * Funnel event dispatcher. No analytics provider is wired yet (see ROADMAP
 * open questions on consent/analytics) — this only pushes to `window.dataLayer`
 * when present (no-op otherwise) so wiring GA4/Segment/etc. later is a one-line
 * change here, not a hunt through every component.
 *
 * Never pass payment details / PII — see the event list in the redesign brief.
 */
type AnalyticsEvent =
  | "hero_cta_clicked"
  | "weight_simulator_used"
  | "eligibility_checker_used"
  | "how_it_works_viewed"
  | "faq_opened"
  | "membership_started"
  | "membership_details_completed";

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...payload });
}
