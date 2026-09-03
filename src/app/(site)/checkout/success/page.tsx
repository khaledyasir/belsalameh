import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { formatExpiry } from "@/lib/format";

export const metadata: Metadata = { title: "Payment received" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  const txn = ref
    ? await db.transaction.findUnique({ where: { reference: ref }, include: { member: true } })
    : null;
  const member = txn?.member ?? null;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
        <h1 className="mt-4 font-display text-2xl font-bold text-brand-indigo">Payment received</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Your Proof of Membership has been recorded and will be emailed to you.
          Please keep it — validation at the airport is done by visually matching
          your name and Membership ID.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-brand-sand/70 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">Proof of Membership</p>
        <dl className="mt-3 space-y-2 text-sm">
          <Row label="Full name (as on passport)" value={member?.fullName ?? "[Your name]"} />
          <Row label="Membership ID" value={member?.membershipId ?? "BSL-XXXX-XXXX"} mono />
          <Row
            label="Expiry"
            value={member ? formatExpiry(member.expiryMonth, member.expiryYear) : "Month YYYY"}
          />
        </dl>
        {!member && (
          <p className="mt-3 border-t border-border pt-3 text-xs text-ink-subtle">
            No confirmed membership found for this reference yet. In Phase 3 the
            details are filled in automatically once MEPS confirms the payment.
          </p>
        )}
        <p className="mt-3 border-t border-border pt-3 text-xs text-ink-subtle">
          The email delivery itself is wired in Phase 3 (a row is logged now).
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-brand-purple hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className={mono ? "font-mono text-ink" : "text-ink"}>{value}</dd>
    </div>
  );
}
