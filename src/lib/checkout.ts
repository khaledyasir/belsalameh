import { z } from "zod";

/** Most people one order can cover (the payer + 9 others). */
export const MAX_PEOPLE = 10;

const personName = z
  .string()
  .trim()
  .min(2, "Enter the full name as it appears on the passport")
  .max(120, "That name is too long");

/**
 * Checkout form contract — shared by the client form and the server action so
 * validation is identical on both sides.
 *
 * Spec-locked shape:
 *  - Full Name (as on passport), Email, Confirm Email
 *  - NO phone number field
 *  - mandatory checkboxes before payment can start (terms, privacy, 18+)
 *  - optional `party`: other people covered by the same payment (name required,
 *    email optional — if given, that person gets their own confirmation email)
 */
export const partyMemberSchema = z.object({
  fullName: personName,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email address or leave it empty"),
});

export const checkoutSchema = z
  .object({
    fullName: personName,
    email: z.string().trim().toLowerCase().email("Enter a valid email address"),
    confirmEmail: z.string().trim().toLowerCase().email("Re-enter your email address"),
    party: z.array(partyMemberSchema).max(MAX_PEOPLE - 1, `You can add up to ${MAX_PEOPLE - 1} more people`),
    agreeTerms: z.coerce
      .boolean()
      .refine((v) => v === true, "You must accept the Terms & Conditions and Fair Usage Policy"),
    confirmPrivacy: z.coerce
      .boolean()
      .refine((v) => v === true, "You must confirm the data protection statement"),
    confirmAdult: z.coerce
      .boolean()
      .refine((v) => v === true, "You must confirm that everyone on this order is 18 or older"),
  })
  .refine((d) => d.email === d.confirmEmail, {
    path: ["confirmEmail"],
    message: "The email addresses do not match",
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type PartyMember = z.infer<typeof partyMemberSchema>;
export type CheckoutFieldErrors = Partial<Record<Exclude<keyof CheckoutInput, "party">, string>> & {
  /** Per-row errors for the "add more people" list, keyed by row index. */
  party?: Record<number, { fullName?: string; email?: string }>;
  /** Error about the list as a whole (e.g. too many people). */
  partyList?: string;
};

/** Return shape of the checkout server action (see join/actions.ts). */
export type CheckoutState = { errors: CheckoutFieldErrors; formError?: string };
export const initialCheckoutState: CheckoutState = { errors: {} };

/** Flatten a ZodError into { field: firstMessage } (+ per-row party errors). */
export function toFieldErrors(error: z.ZodError): CheckoutFieldErrors {
  const out: CheckoutFieldErrors = {};
  for (const issue of error.issues) {
    const [key, index, sub] = issue.path;
    if (key === "party") {
      if (typeof index === "number" && (sub === "fullName" || sub === "email")) {
        out.party ??= {};
        out.party[index] ??= {};
        out.party[index][sub] ??= issue.message;
      } else if (!out.partyList) {
        out.partyList = issue.message;
      }
    } else if (typeof key === "string" && !(out as Record<string, unknown>)[key]) {
      (out as Record<string, unknown>)[key] = issue.message;
    }
  }
  return out;
}
