"use server";

import { redirect } from "next/navigation";
import { capturePayment } from "@/lib/payments";
import { ALLOW_SIMULATED_PAYMENT } from "@/lib/config";

/**
 * Manual stand-in for the MEPS payment callback, used on the hand-off page
 * while payments are not live. Phase 3 removes this; the MEPS webhook route
 * calls the same `capturePayment()`.
 */
export async function confirmSimulatedPayment(formData: FormData) {
  if (!ALLOW_SIMULATED_PAYMENT) redirect("/"); // opt-in only; never on by default

  const reference = String(formData.get("ref") ?? "");
  const result = await capturePayment(reference, { providerRef: "SIMULATED", rawResponse: { simulated: true } });

  if (!result.ok) redirect(`/checkout/processing?ref=${encodeURIComponent(reference)}&error=1`);
  redirect(`/checkout/success?ref=${encodeURIComponent(reference)}`);
}
