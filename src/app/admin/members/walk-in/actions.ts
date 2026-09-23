"use server";

import { redirect } from "next/navigation";
import { guard } from "@/lib/guard";
import { walkInSchema, toWalkInFieldErrors, type WalkInState } from "@/lib/walk-in";
import { createPendingTransaction, capturePayment } from "@/lib/payments";
import { audit } from "@/lib/admin-store";
import { db } from "@/lib/db";

/**
 * Records a membership sold in person and sends the buyer the same
 * confirmation email the online checkout sends. Reuses capturePayment() so
 * member creation, the Membership ID and the email are identical to a real
 * MEPS payment — only providerRef ("WALKIN") differs from a gateway ref.
 */
export async function addWalkInMember(_prev: WalkInState, formData: FormData): Promise<WalkInState> {
  const session = await guard();

  const parsed = walkInSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { errors: toWalkInFieldErrors(parsed.error), formError: "Please correct the highlighted fields." };
  }

  const { reference } = await createPendingTransaction(parsed.data);
  const result = await capturePayment(reference, {
    providerRef: "WALKIN",
    rawResponse: { source: "walk-in", adminId: session.user.id },
  });

  if (!result.ok) {
    return { errors: {}, formError: "Could not create the membership. Please try again." };
  }

  const member = await db.member.findUnique({ where: { membershipId: result.membershipId }, select: { id: true } });

  await audit("member.created.walkin", {
    actorId: session.user.id,
    entity: "Member",
    entityId: member?.id ?? "-",
    detail: `reference ${reference}`,
  });

  redirect(member ? `/admin/members/${member.id}` : "/admin/members");
}
