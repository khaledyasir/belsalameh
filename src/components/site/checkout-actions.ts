"use server";

import { redirect } from "next/navigation";
import { checkoutSchema, toFieldErrors, type CheckoutState } from "@/lib/checkout";

/**
 * Validates the checkout form and hands off to payment.
 *
 * PHASE 3 will replace the hand-off body with: create a Transaction(PENDING),
 * store the agreed legal-document versions, sign the request per the MEPS
 * manual, and redirect to the MEPS hosted payment page. For now it redirects to
 * a placeholder page that stands in for the gateway.
 */
export async function startCheckout(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    confirmEmail: formData.get("confirmEmail"),
    agreeTerms: formData.get("agreeTerms"),
    confirmPrivacy: formData.get("confirmPrivacy"),
  });

  if (!parsed.success) {
    return { errors: toFieldErrors(parsed.error), formError: "Please correct the highlighted fields." };
  }

  const ref = "BSL-ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  redirect(`/checkout/processing?ref=${ref}`);
}
