import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Redirecting to payment" };

export default async function ProcessingPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand-indigo" aria-hidden />
      <h1 className="mt-6 font-display text-2xl font-bold text-ink">Taking you to the payment page…</h1>
      <p className="mt-2 text-sm text-ink-muted">
        In production this is where you are handed to the payment provider&apos;s
        secure hosted page to complete payment. Your Proof of Membership is emailed
        as soon as the payment is confirmed.
      </p>

      {ref && (
        <p className="mt-4 text-xs text-ink-subtle">
          Order reference: <span className="font-mono text-ink">{ref}</span>
        </p>
      )}

      <div className="mt-8 rounded-lg border border-warning/40 bg-warning/10 p-4 text-left text-sm text-[#7a4d0f]">
        <p className="font-medium">Phase 2 placeholder</p>
        <p className="mt-1">
          Payment integration (MEPS hosted page, webhook/IPN handling, Membership
          creation and the Proof of Membership email) is Phase 3.
        </p>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Link
          href={`/checkout/success${ref ? `?ref=${ref}` : ""}`}
          className="rounded bg-brand-indigo px-4 py-2 text-sm font-semibold text-white hover:bg-brand-indigo/90"
        >
          Simulate successful payment
        </Link>
        <Link href="/" className="rounded border border-border px-4 py-2 text-sm text-ink hover:bg-surface-muted">
          Back to home
        </Link>
      </div>
    </div>
  );
}
