import { z } from "zod";
import { MAX_MONTHS, MIN_MONTHS } from "./membership";

/** JOD has three decimals: 25.500 JOD is stored as 25500. */
export const JOD_MINOR_UNITS = 1000;

export const durationMonthsSchema = z.coerce
  .number({ invalid_type_error: "Enter the number of months" })
  .int("Use whole months")
  .min(MIN_MONTHS, `At least ${MIN_MONTHS} month`)
  .max(MAX_MONTHS, `At most ${MAX_MONTHS} months`);

/** "25", "25.5" or "25.500" (JOD) -> minor units. */
export const priceSchema = z
  .string()
  .trim()
  .regex(/^\d{1,6}(\.\d{1,3})?$/, "Enter an amount like 25 or 25.500")
  .transform((v) => Math.round(parseFloat(v) * JOD_MINOR_UNITS))
  .refine((v) => v > 0, "The price must be more than 0");

/** What the admin edits in Settings › Membership plan. */
export const planSettingsSchema = z.object({
  price: priceSchema,
  durationMonths: durationMonthsSchema,
});

export type PlanFieldErrors = Partial<Record<"price" | "durationMonths", string>>;
export type PlanState = { errors: PlanFieldErrors; formError?: string; saved?: boolean };
export const initialPlanState: PlanState = { errors: {} };

export function firstErrors<K extends string>(error: z.ZodError): Partial<Record<K, string>> {
  const out: Partial<Record<string, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out as Partial<Record<K, string>>;
}
