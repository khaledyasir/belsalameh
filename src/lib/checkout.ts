import { z } from "zod";

/**
 * Checkout form contract — shared by the client form and the server action so
 * validation is identical on both sides.
 *
 * Spec-locked shape:
 *  - Full Name (as on passport), Email, Confirm Email
 *  - NO phone number field
 *  - two mandatory checkboxes before payment can start
 */
export const checkoutSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name as it appears on your passport")
      .max(120, "That name is too long"),
    email: z.string().trim().toLowerCase().email("Enter a valid email address"),
    confirmEmail: z.string().trim().toLowerCase().email("Re-enter your email address"),
    agreeTerms: z.coerce
      .boolean()
      .refine((v) => v === true, "You must accept the Terms & Conditions"),
    confirmPrivacy: z.coerce
      .boolean()
      .refine((v) => v === true, "You must confirm the data protection statement"),
  })
  .refine((d) => d.email === d.confirmEmail, {
    path: ["confirmEmail"],
    message: "The email addresses do not match",
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutFieldErrors = Partial<Record<keyof CheckoutInput, string>>;

/** Return shape of the checkout server action (see join/actions.ts). */
export type CheckoutState = { errors: CheckoutFieldErrors; formError?: string };
export const initialCheckoutState: CheckoutState = { errors: {} };

/** Flatten a ZodError into { field: firstMessage }. */
export function toFieldErrors(error: z.ZodError): CheckoutFieldErrors {
  const out: CheckoutFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof CheckoutInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
