import type { Metadata } from "next";
import Link from "next/link";

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

      <div className="mt-6">
        <Link href="/" className="text-sm text-brand-purple hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
