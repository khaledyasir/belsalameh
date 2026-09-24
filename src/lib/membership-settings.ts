import "server-only";
import { db } from "./db";
import { MEMBERSHIP, type MembershipPlan } from "./membership";

export type MembershipSettings = MembershipPlan;

/** The plan being sold right now: the admin's saved settings, or the built-in defaults if none saved yet. */
export async function getMembershipSettings(): Promise<MembershipSettings> {
  const row = await db.membershipSettings.findUnique({ where: { id: "default" } });
  return {
    name: MEMBERSHIP.name,
    currency: MEMBERSHIP.currency,
    priceMinor: row?.priceMinor ?? MEMBERSHIP.priceMinor,
    durationMonths: row?.durationMonths ?? MEMBERSHIP.durationMonths,
  };
}

export async function saveMembershipSettings(input: {
  priceMinor: number;
  durationMonths: number;
}): Promise<void> {
  await db.membershipSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...input },
    update: input,
  });
}
