import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { formatExpiry } from "@/lib/format";
import { MEMBERSHIP } from "@/lib/membership";

export const metadata: Metadata = { title: "Payment received" };

export default function SuccessPage() {
  const now = new Date();
  const exp = new Date(now);
  exp.setMonth(exp.getMonth() + MEMBERSHIP.durationMonths);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">Payment received</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Your Proof of Membership has been sent to your email address. Please keep
          it — validation at the airport is done by visually matching your name and
          Membership ID.
        </p>
      </div>

      {/* Example proof — clearly labelled as a preview, not a real record */}
      <div className="mt-8 rounded-lg border border-border bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          Proof of Membership — example preview
        </p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Full name (as on passport)</dt>
            <dd className="text-ink">[Your name]</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Membership ID</dt>
            <dd className="font-mono text-ink">BSL-XXXX-XXXX</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Expiry</dt>
            <dd className="text-ink">{formatExpiry(exp.getMonth() + 1, exp.getFullYear())}</dd>
          </div>
        </dl>
        <p className="mt-3 border-t border-border pt-3 text-xs text-ink-subtle">
          Phase 2 placeholder screen. The real email (with your details and a unique
          Membership ID) is generated on successful payment in Phase 3.
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-brand-indigo hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
