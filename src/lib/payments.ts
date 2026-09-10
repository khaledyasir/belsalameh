import "server-only";
import { randomBytes } from "node:crypto";
import { db } from "./db";
import { MEMBERSHIP } from "./membership";
import { CONSENT_VERSION } from "./config";
import { newMembershipId } from "./membership-id";
import { formatExpiry } from "./format";
import { deliverMembershipEmails } from "./emails";
import { EMAIL_COMPANY_NOTIFY } from "./config";

/**
 * Payment lifecycle. Both the manual "confirm" affordance on the hand-off page
 * and the Phase 3 MEPS webhook call `capturePayment()` — it is the single place
 * a Member is created, and it is idempotent.
 */

function newReference(): string {
  // Unguessable: the reference is the only key the /checkout/success page and the
  // MEPS return URL carry, so it must not be enumerable.
  return "BSL-ORD-" + randomBytes(12).toString("base64url").toUpperCase();
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

  const { member, proofLogId, notifyLogId } = await db.$transaction(async (tx) => {
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

    const proofLog = await tx.emailLog.create({
      data: {
        type: "proof_of_membership",
        toAddress: txn.email,
        subject: `Your Belsalameh membership is active - ${membershipId}`,
        status: "queued",
        memberId: created.id,
      },
    });
    const notifyLog = await tx.emailLog.create({
      data: {
        type: "internal_notification",
        toAddress: EMAIL_COMPANY_NOTIFY,
        subject: `New membership: ${txn.fullName} (${membershipId})`,
        status: "queued",
        memberId: created.id,
      },
    });

    await tx.auditLog.create({
      data: { action: "member.created", entity: "Member", entityId: created.id, detail: `reference ${reference}` },
    });

    return { member: created, proofLogId: proofLog.id, notifyLogId: notifyLog.id };
  });

  // Payment is already captured — a failed send must never surface as an error.
  try {
    await deliverMembershipEmails({
      proofLogId,
      notifyLogId,
      member: {
        fullName: member.fullName,
        email: member.email,
        membershipId: member.membershipId,
        expiryMonth,
        expiryYear,
        reference,
      },
      amountMinor: txn.amountMinor,
      currency: txn.currency,
      providerRef: opts.providerRef ?? txn.providerRef,
      capturedAt: now,
    });
  } catch (e) {
    console.warn("[capturePayment] email delivery threw:", e);
  }

  return {
    ok: true,
    alreadyProcessed: false,
    membershipId: member.membershipId,
    expiryLabel: formatExpiry(expiryMonth, expiryYear),
    fullName: member.fullName,
    reference,
  };
}
