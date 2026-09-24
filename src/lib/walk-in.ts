import { z } from "zod";
import { durationMonthsSchema } from "./plan-schema";

/**
 * Manual, in-person signup — an admin enters the buyer's details instead of
 * them using the public checkout form (e.g. someone who pays at the airport
 * counter instead of online). Same two stored fields as checkout.
 */
export const walkInSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter the member's full name as it appears on their passport")
    .max(120, "That name is too long"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  /** Membership length chosen by the admin; the price is worked out server-side from the saved plan. */
  durationMonths: durationMonthsSchema,
});

export type WalkInInput = z.infer<typeof walkInSchema>;
export type WalkInFieldErrors = Partial<Record<keyof WalkInInput, string>>;

export type WalkInState = { errors: WalkInFieldErrors; formError?: string };
export const initialWalkInState: WalkInState = { errors: {} };

export function toWalkInFieldErrors(error: z.ZodError): WalkInFieldErrors {
  const out: WalkInFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof WalkInInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
