import "server-only";
import { randomBytes } from "node:crypto";
import { db } from "./db";
import { expiryFrom } from "./membership";
import { getMembershipSettings } from "./membership-settings";
import { CONSENT_VERSION } from "./config";
import { newMembershipId } from "./membership-id";
import { formatExpiry } from "./format";
import { deliverMembershipEmails, notifySubject, proofSubject, type MemberFacts } from "./emails";
import { EMAIL_COMPANY_NOTIFY } from "./config";

/**
 * Payment lifecycle. Both the manual "confirm" affordance on the hand-off page
 * and the Phase 3 MEPS webhook call `capturePayment()` — it is the single place
 * a Member is created, and it is idempotent.
 *
 * One payment can cover several people (the payer + family/friends): the price
 * is per person and every person gets their own Membership ID.
 */

type PartyEntry = { fullName: string; email: string };

function newReference(): string {
  // Unguessable: the reference is the only key the /checkout/success page and the
  // MEPS return URL carry, so it must not be enumerable.
  return "BSL-ORD-" + randomBytes(12).toString("base64url").toUpperCase();
}

function parseParty(json: string | null): PartyEntry[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Called from the checkout form (server action) once validation passes. */
export async function createPendingTransaction(input: {
  fullName: string;
  email: string;
  /** Extra people covered by this payment; `email` may be "" (then the payer's is used). */
  party?: PartyEntry[];
  adultConfirmed?: boolean;
  /** Per-person price and length for this order. Omit to use the plan currently on sale (the online checkout). */
  plan?: { priceMinor: number; durationMonths: number };
}): Promise<{ reference: string }> {
  const reference = newReference();
  const party = input.party ?? [];
  const settings = await getMembershipSettings();
  const plan = input.plan ?? settings;
  await db.transaction.create({
    data: {
      reference,
      provider: "MEPS",
      // The amount is always computed here, never taken from the client. The length is
      // stored so a later change to the plan can't alter an order that is already in flight.
      amountMinor: plan.priceMinor * (1 + party.length),
      currency: settings.currency,
      durationMonths: plan.durationMonths,
      status: "PENDING",
      fullName: input.fullName,
      email: input.email,
      party: party.length ? JSON.stringify(party) : null,
      consentTermsAccepted: true,
      consentPrivacyAccepted: true,
      consentAdultConfirmed: input.adultConfirmed ?? false,
      consentVersion: CONSENT_VERSION,
    },
  });
  return { reference };
}

export type CaptureResult =
  | {
      ok: true;
      alreadyProcessed: boolean;
      /** The payer's membership (first person on the order). */
      membershipId: string;
      expiryLabel: string;
      fullName: string;
      reference: string;
      /** Everyone on the order, the payer first. */
      people: { fullName: string; membershipId: string }[];
    }
  | { ok: false; reason: "not_found" | "failed" };

/**
 * Mark a transaction CAPTURED and create the Member(s). Safe to call more than
 * once for the same reference (idempotent) — the second call returns the
 * existing memberships.
 */
export async function capturePayment(
  reference: string,
  opts: { providerRef?: string; rawResponse?: unknown } = {},
): Promise<CaptureResult> {
  console.log(`[payment] capture requested — reference=${reference} providerRef=${opts.providerRef ?? "(none)"}`);

  const txn = await db.transaction.findUnique({
    where: { reference },
    include: { members: { orderBy: { createdAt: "asc" } } },
  });
  if (!txn) {
    console.warn(`[payment] capture failed — no transaction found for reference ${reference}`);
    return { ok: false, reason: "not_found" };
  }

  if (txn.status === "CAPTURED" && txn.members.length > 0) {
    const primary = txn.members.find((m) => m.fullName === txn.fullName) ?? txn.members[0];
    console.log(`[payment] reference ${reference} already captured — membership ${primary.membershipId} (no duplicate emails sent)`);
    return {
      ok: true,
      alreadyProcessed: true,
      membershipId: primary.membershipId,
      expiryLabel: formatExpiry(primary.expiryMonth, primary.expiryYear),
      fullName: primary.fullName,
      reference,
      people: [primary, ...txn.members.filter((m) => m !== primary)].map((m) => ({
        fullName: m.fullName,
        membershipId: m.membershipId,
      })),
    };
  }

  const now = new Date();
  const { month: expiryMonth, year: expiryYear } = expiryFrom(now, txn.durationMonths);

  // The payer first, then everyone they added. An added person without their own
  // address is filed under the payer's email (the confirmation goes to the payer).
  const party = parseParty(txn.party);
  const people = [
    { fullName: txn.fullName, email: txn.email, ownEmail: true },
    ...party.map((p) => ({ fullName: p.fullName, email: p.email || txn.email, ownEmail: Boolean(p.email) })),
  ];

  // Distinct Membership IDs; retry a couple of times on the (very unlikely) collision.
  const taken = new Set<string>();
  const ids: string[] = [];
  for (let i = 0; i < people.length; i++) {
    let id = newMembershipId();
    for (let attempt = 0; attempt < 3; attempt++) {
      if (!taken.has(id) && !(await db.member.findUnique({ where: { membershipId: id } }))) break;
      id = newMembershipId();
    }
    taken.add(id);
    ids.push(id);
  }

  const facts: MemberFacts[] = people.map((p, i) => ({
    fullName: p.fullName,
    email: p.email,
    membershipId: ids[i],
    expiryMonth,
    expiryYear,
    reference,
  }));

  const logs = await db.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id: txn.id },
      data: {
        status: "CAPTURED",
        providerRef: opts.providerRef ?? txn.providerRef,
        ipnReceivedAt: now,
        rawResponse: opts.rawResponse ? JSON.stringify(opts.rawResponse) : txn.rawResponse,
      },
    });

    const memberIds: string[] = [];
    for (let i = 0; i < people.length; i++) {
      const member = await tx.member.create({
        data: {
          membershipId: ids[i],
          fullName: people[i].fullName,
          email: people[i].email,
          expiryMonth,
          expiryYear,
          status: "ACTIVE",
          purchasedAt: now,
          transactionId: txn.id,
        },
      });
      memberIds.push(member.id);
      await tx.auditLog.create({
        data: { action: "member.created", entity: "Member", entityId: member.id, detail: `reference ${reference}` },
      });
    }

    // One email to the payer covers everyone on the order.
    const proofLog = await tx.emailLog.create({
      data: {
        type: "proof_of_membership",
        toAddress: people[0].email,
        subject: proofSubject(facts),
        status: "queued",
        memberId: memberIds[0],
      },
    });
    const notifyLog = await tx.emailLog.create({
      data: {
        type: "internal_notification",
        toAddress: EMAIL_COMPANY_NOTIFY,
        subject: notifySubject(facts),
        status: "queued",
        memberId: memberIds[0],
      },
    });
    // Added people who were given their own address also get an individual copy.
    const extras: { logId: string; person: MemberFacts }[] = [];
    for (let i = 1; i < people.length; i++) {
      if (!people[i].ownEmail) continue;
      const log = await tx.emailLog.create({
        data: {
          type: "proof_of_membership",
          toAddress: people[i].email,
          subject: proofSubject([facts[i]]),
          status: "queued",
          memberId: memberIds[i],
        },
      });
      extras.push({ logId: log.id, person: facts[i] });
    }

    return { proofLogId: proofLog.id, notifyLogId: notifyLog.id, extras };
  }, { timeout: 20_000 }); // up to 10 members + logs; the 5s default is too tight over a network

  console.log(`[payment] captured — reference=${reference} memberships=${ids.join(",")} amount=${txn.amountMinor} ${txn.currency}`);

  // Payment is already captured — a failed send must never surface as an error.
  try {
    await deliverMembershipEmails({
      proofLogId: logs.proofLogId,
      notifyLogId: logs.notifyLogId,
      people: facts,
      extras: logs.extras,
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
    membershipId: ids[0],
    expiryLabel: formatExpiry(expiryMonth, expiryYear),
    fullName: people[0].fullName,
    reference,
    people: people.map((p, i) => ({ fullName: p.fullName, membershipId: ids[i] })),
  };
}
