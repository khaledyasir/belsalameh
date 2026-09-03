import type { Metadata } from "next";
import Link from "next/link";
import { PAYMENTS_LIVE } from "@/lib/config";
import { confirmSimulatedPayment } from "../actions";

export const metadata: Metadata = { title: "Redirecting to payment" };

export default async function ProcessingPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; error?: string }>;
}) {
  const { ref, error } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-sand border-t-brand-indigo" aria-hidden />
      <h1 className="mt-6 font-display text-2xl font-bold text-brand-indigo">Taking you to the payment page…</h1>
      <p className="mt-2 text-sm text-ink-muted">
        In production this is where you are handed to the payment provider&apos;s
        secure hosted page. Your Proof of Membership is emailed as soon as the
        payment is confirmed.
      </p>

      {ref && (
        <p className="mt-4 text-xs text-ink-subtle">
          Order reference: <span className="font-mono text-ink">{ref}</span>
        </p>
      )}
      {error && (
        <p className="mt-3 rounded border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          That order reference could not be found.
        </p>
      )}

      {!PAYMENTS_LIVE && ref && (
        <div className="mt-8 rounded-lg border border-warning/40 bg-warning/10 p-4 text-left text-sm text-[#7a4d0f]">
          <p className="font-medium">Payment gateway not connected yet (Phase 3)</p>
          <p className="mt-1">
            Use the button below to record a successful payment. It writes the
            transaction and creates the membership in the database — the same thing
            the MEPS webhook will do.
          </p>
          <form action={confirmSimulatedPayment} className="mt-3">
            <input type="hidden" name="ref" value={ref} />
            <button
              type="submit"
              className="rounded-full bg-brand-indigo px-4 py-2 text-sm font-semibold text-white hover:bg-brand-indigo/90"
            >
              Record successful payment
            </button>
          </form>
        </div>
      )}

      <div className="mt-6">
        <Link href="/" className="text-sm text-brand-purple hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
