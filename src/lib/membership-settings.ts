import "server-only";
import { db } from "./db";
import { MEMBERSHIP, type MembershipPlan } from "./membership";

export type MembershipSettings = MembershipPlan & { sendExpiryEmail: boolean };

/** The plan being sold right now: the admin's saved settings, or the built-in defaults if none saved yet. */
export async function getMembershipSettings(): Promise<MembershipSettings> {
  const row = await db.membershipSettings.findUnique({ where: { id: "default" } });
  return {
    name: MEMBERSHIP.name,
    currency: MEMBERSHIP.currency,
    priceMinor: row?.priceMinor ?? MEMBERSHIP.priceMinor,
    durationMonths: row?.durationMonths ?? MEMBERSHIP.durationMonths,
    sendExpiryEmail: row?.sendExpiryEmail ?? MEMBERSHIP.sendExpiryEmail,
  };
}

export async function saveMembershipSettings(input: {
  priceMinor: number;
  durationMonths: number;
  sendExpiryEmail: boolean;
}): Promise<void> {
  await db.membershipSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...input },
    update: input,
  });
}
