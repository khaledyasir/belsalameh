"use server";

import { redirect } from "next/navigation";
import { checkoutSchema, toFieldErrors, type CheckoutState } from "@/lib/checkout";
import { createPendingTransaction } from "@/lib/payments";

/**
 * Validates the checkout form, creates a PENDING transaction, and hands off to
 * payment.
 *
 * PHASE 3: replace the redirect target with a signed request to the MEPS hosted
 * payment page. The transaction row and its `reference` are already what the
 * webhook/IPN handler will look up.
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

  const { reference } = await createPendingTransaction({
    fullName: parsed.data.fullName,
    email: parsed.data.email,
  });

  redirect(`/checkout/processing?ref=${encodeURIComponent(reference)}`);
}
