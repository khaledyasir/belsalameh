/**
 * The membership being sold.
 *
 * `MEMBERSHIP` holds the built-in DEFAULTS, used until an admin saves a plan in
 * Admin › Settings (stored in the MembershipSettings table and read through
 * `getMembershipSettings()` in membership-settings.ts). Everything that shows or
 * charges a price reads the saved plan, not this constant.
 *
 * ⚠️ PLACEHOLDER VALUES — price, currency and duration must be confirmed with
 * the business (see docs/ROADMAP.md open questions).
 */
export const MEMBERSHIP = {
  name: "Belsalameh Membership",
  /** minor units — 25000 = 25.000 JOD (placeholder) */
  priceMinor: 25_000,
  currency: "JOD",
  /** months from purchase date; drives the "Month YYYY" expiry (placeholder) */
  durationMonths: 12,
} as const;

/** The plan customers are offered right now: `priceMinor` is the total for `durationMonths`, per person. */
export type MembershipPlan = {
  name: string;
  priceMinor: number;
  currency: string;
  durationMonths: number;
};

/** Quick-pick lengths in the admin; anything else is a custom number of months. */
export const DURATION_PRESETS = [12, 24, 36] as const;
export const MIN_MONTHS = 1;
export const MAX_MONTHS = 120;

/** Price for `months` at the plan's rate (price ÷ plan months × months), to the nearest minor unit. */
export function planTotal(plan: Pick<MembershipPlan, "priceMinor" | "durationMonths">, months: number): number {
  return Math.round((plan.priceMinor * months) / plan.durationMonths);
}

/** "1 year", "2 years", "18 months", "1 month". */
export function durationLabel(months: number): string {
  if (months % 12 === 0) {
    const y = months / 12;
    return y === 1 ? "1 year" : `${y} years`;
  }
  return months === 1 ? "1 month" : `${months} months`;
}

/** Expiry month/year for a membership bought at `from` — the single rule used at capture, in the UI and in emails. */
export function expiryFrom(from: Date, months: number): { month: number; year: number } {
  const end = new Date(from);
  end.setMonth(end.getMonth() + months);
  return { month: end.getMonth() + 1, year: end.getFullYear() };
}

/** A membership runs to the end of its expiry month. */
export function hasEnded(m: { expiryMonth: number; expiryYear: number }, now = new Date()): boolean {
  return now.getTime() > new Date(m.expiryYear, m.expiryMonth, 0, 23, 59, 59).getTime();
}
