"use server";

import { redirect } from "next/navigation";
import { guard } from "@/lib/guard";
import { walkInSchema, toWalkInFieldErrors, type WalkInState } from "@/lib/walk-in";
import { createPendingTransaction, capturePayment } from "@/lib/payments";
import { getMembershipSettings } from "@/lib/membership-settings";
import { planTotal } from "@/lib/membership";
import { audit } from "@/lib/admin-store";
import { checkPeople } from "@/lib/identity";
import { db } from "@/lib/db";

/**
 * Records a membership sold in person and sends the buyer the same
 * confirmation email the online checkout sends. Reuses capturePayment() so
 * member creation, the Membership ID and the email are identical to a real
 * MEPS payment — only providerRef ("WALKIN") differs from a gateway ref. The admin picks
 * the duration; the price is always calculated here from the saved plan, never sent by the browser.
 */
export async function addWalkInMember(_prev: WalkInState, formData: FormData): Promise<WalkInState> {
  const session = await guard();

  const parsed = walkInSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    durationMonths: formData.get("durationMonths"),
  });
  if (!parsed.success) {
    return { errors: toWalkInFieldErrors(parsed.error), formError: "Please correct the highlighted fields." };
  }

  // One active membership per name. (The same email under another name is allowed.)
  const [check] = await checkPeople([parsed.data]);
  if (check.nameTaken) {
    return {
      errors: { fullName: "A membership under this name is already active, so it can't be registered again." },
      formError: "Please correct the highlighted fields.",
    };
  }

  const { durationMonths } = parsed.data;
  const priceMinor = planTotal(await getMembershipSettings(), durationMonths);
  const { reference } = await createPendingTransaction({
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    plan: { priceMinor, durationMonths },
  });
  const result = await capturePayment(reference, {
    providerRef: "WALKIN",
    rawResponse: { source: "walk-in", adminId: session.user.id, durationMonths, priceMinor },
  });

  if (!result.ok) {
    return { errors: {}, formError: "Could not create the membership. Please try again." };
  }

  const member = await db.member.findUnique({ where: { membershipId: result.membershipId }, select: { id: true } });

  await audit("member.created.walkin", {
    actorId: session.user.id,
    entity: "Member",
    entityId: member?.id ?? "-",
    detail: `reference ${reference}, ${durationMonths} months, ${priceMinor} minor units`,
  });

  redirect(member ? `/admin/members/${member.id}` : "/admin/members");
}
