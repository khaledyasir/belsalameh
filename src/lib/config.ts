/**
 * Small runtime config that isn't (yet) in the database.
 */

/** PLACEHOLDER — real value comes from the MEPS gateway config in Phase 3. */
export const GATEWAY_MODE: "TEST" | "LIVE" =
  process.env.MEPS_MODE === "LIVE" ? "LIVE" : "TEST";

/** Version stamp stored on a Transaction when the consent checkboxes are ticked. */
export const CONSENT_VERSION = "2026-09-03";

/** While false, the checkout hand-off page exposes a "confirm payment" button
 *  that stands in for the MEPS callback. Set MEPS_MODE / PAYMENTS_LIVE for Phase 3. */
export const PAYMENTS_LIVE = process.env.PAYMENTS_LIVE === "true";
