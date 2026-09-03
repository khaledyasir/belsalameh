import "server-only";
import { db } from "./db";
import { MEMBERSHIP } from "./membership";
import { CONSENT_VERSION } from "./config";
import { newMembershipId } from "./membership-id";
import { formatExpiry } from "./format";

/**
 * Payment lifecycle. Both the manual "confirm" affordance on the hand-off page
 * and the Phase 3 MEPS webhook call `capturePayment()` — it is the single place
 * a Member is created, and it is idempotent.
 */

function newReference(): string {
  return "BSL-ORD-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

/** Called from the checkout form (server action) once validation passes. */
export async function createPendingTransaction(input: {
  fullName: string;
  email: string;
}): Promise<{ reference: string }> {
  const reference = newReference();
  await db.transaction.create({
    data: {
      reference,
      provider: "MEPS",
      amountMinor: MEMBERSHIP.priceMinor,
      currency: MEMBERSHIP.currency,
      status: "PENDING",
      fullName: input.fullName,
      email: input.email,
      consentTermsAccepted: true,
      consentPrivacyAccepted: true,
      consentVersion: CONSENT_VERSION,
    },
  });
  return { reference };
}

export type CaptureResult =
  | { ok: true; alreadyProcessed: boolean; membershipId: string; expiryLabel: string; fullName: string; reference: string }
  | { ok: false; reason: "not_found" | "failed" };

/**
 * Mark a transaction CAPTURED and create the Member. Safe to call more than once
 * for the same reference (idempotent) — the second call returns the existing
 * membership.
 */
export async function capturePayment(
  reference: string,
  opts: { providerRef?: string; rawResponse?: unknown } = {},
): Promise<CaptureResult> {
  const txn = await db.transaction.findUnique({ where: { reference }, include: { member: true } });
  if (!txn) return { ok: false, reason: "not_found" };

  if (txn.status === "CAPTURED" && txn.member) {
    return {
      ok: true,
      alreadyProcessed: true,
      membershipId: txn.member.membershipId,
      expiryLabel: formatExpiry(txn.member.expiryMonth, txn.member.expiryYear),
      fullName: txn.member.fullName,
      reference,
    };
  }

  const now = new Date();
  const expiry = new Date(now);
  expiry.setMonth(expiry.getMonth() + MEMBERSHIP.durationMonths);
  const expiryMonth = expiry.getMonth() + 1;
  const expiryYear = expiry.getFullYear();

  // Retry a couple of times on the (very unlikely) Membership ID collision.
  let membershipId = newMembershipId();
  for (let attempt = 0; attempt < 3; attempt++) {
    const clash = await db.member.findUnique({ where: { membershipId } });
    if (!clash) break;
    membershipId = newMembershipId();
  }

  const member = await db.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id: txn.id },
      data: {
        status: "CAPTURED",
        providerRef: opts.providerRef ?? txn.providerRef,
        ipnReceivedAt: now,
        rawResponse: opts.rawResponse ? JSON.stringify(opts.rawResponse) : txn.rawResponse,
      },
    });

    const created = await tx.member.create({
      data: {
        membershipId,
        fullName: txn.fullName,
        email: txn.email,
        expiryMonth,
        expiryYear,
        status: "ACTIVE",
        purchasedAt: now,
        transactionId: txn.id,
      },
    });

    await tx.emailLog.create({
      data: {
        type: "proof_of_membership",
        toAddress: txn.email,
        subject: "Your Balsalameh membership confirmation",
        status: "queued", // Phase 3: hand to the email provider and update status
        memberId: created.id,
      },
    });

    await tx.auditLog.create({
      data: { action: "member.created", entity: "Member", entityId: created.id, detail: `reference ${reference}` },
    });

    return created;
  });

  return {
    ok: true,
    alreadyProcessed: false,
    membershipId: member.membershipId,
    expiryLabel: formatExpiry(expiryMonth, expiryYear),
    fullName: member.fullName,
    reference,
  };
}
