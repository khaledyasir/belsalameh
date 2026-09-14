/**
 * Single source of truth for the one product the site sells.
 *
 * ⚠️ PLACEHOLDER VALUES — price, currency and duration must be confirmed with
 * the business (see docs/ROADMAP.md open questions). The admin console and the
 * public checkout both read from here.
 */
export const MEMBERSHIP = {
  name: "Belsalameh Membership",
  /** minor units — 25000 = 25.000 JOD (placeholder) */
  priceMinor: 25_000,
  currency: "JOD",
  /** months from purchase date; drives the "Month YYYY" expiry (placeholder) */
  durationMonths: 12,
} as const;
