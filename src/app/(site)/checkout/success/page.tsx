import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { formatExpiry } from "@/lib/format";
import { MembershipPass } from "@/components/site/membership-pass";

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
    <div className="mx-auto max-w-lg px-4 py-section-lg sm:px-6">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
        <h1 className="mt-4 font-display text-heading-1 font-bold text-ink">
          {member ? "You're ready to fly in relief." : "Payment received"}
        </h1>
        <p className="mt-2 text-body-sm text-ink-muted">
          {member
            ? `Your Proof of Membership has been sent to ${member.email}. Save it — you'll show it at check-in.`
            : "Your Proof of Membership has been recorded and will be emailed to you. Please keep it."}{" "}
          Validation at the airport is done by visually matching your name and Membership ID.
        </p>
      </div>

      <div className="mt-8">
        <MembershipPass
          fullName={member?.fullName ?? "[Your name]"}
          membershipId={member?.membershipId ?? "BSL-XXXX-XXXX"}
          expiry={member ? formatExpiry(member.expiryMonth, member.expiryYear) : "Month YYYY"}
          email={member?.email}
        />
      </div>

      {!member && (
        <p className="mt-4 text-center text-caption text-ink-subtle" role="status">
          No confirmed membership found for this reference yet. Once payment is
          confirmed, your name, Membership ID, and expiry will appear here and in
          your confirmation email.
        </p>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="text-body-sm text-brand-purple hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
