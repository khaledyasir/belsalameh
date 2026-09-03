import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "./checkout-form";
import { MEMBERSHIP } from "@/lib/membership";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Get your membership" };

export default function JoinPage() {
  const price = formatMoney(MEMBERSHIP.priceMinor, MEMBERSHIP.currency);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-lg lg:mx-0">
        <h1 className="font-display text-3xl font-bold text-ink">Get your membership</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Enter your details, agree to the policies, and continue to the secure
          payment page.
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]">
        {/* Form — the focus of this page */}
        <div className="max-w-lg">
          <CheckoutForm />
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-display text-lg font-semibold text-ink">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">{MEMBERSHIP.name}</dt>
                <dd className="font-medium text-ink">{price}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <dt className="font-medium text-ink">Total</dt>
                <dd className="font-display text-lg font-bold text-ink">{price}</dd>
              </div>
            </dl>
            <ul className="mt-4 space-y-1.5 text-xs text-ink-muted">
              <li>One-time payment for the membership term.</li>
              <li>
                Expiry shown as month and year on your Proof of Membership (e.g.
                “October 2027”).
              </li>
              <li>Proof of Membership emailed immediately after payment.</li>
            </ul>
            <p className="mt-4 border-t border-border pt-3 text-xs text-ink-subtle">
              Placeholder amount — final price to be confirmed before launch.
            </p>
          </div>

          <p className="mt-3 text-xs text-ink-subtle">
            Questions first?{" "}
            <Link href="/faq" className="text-brand-indigo underline">
              Read the FAQ
            </Link>
            .
          </p>
        </aside>
      </div>
    </div>
  );
}
