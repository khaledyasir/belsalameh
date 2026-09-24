import "server-only";
import { db } from "./db";
import { EMAILS_ENABLED } from "./config";
import { getMembershipSettings } from "./membership-settings";
import { deliverMembershipEndedEmail, membershipEndedSubject } from "./emails";

/** A membership runs to the end of its expiry month (same rule as the admin's EXPIRED status). */
function hasEnded(m: { expiryMonth: number; expiryYear: number }, now: Date): boolean {
  return now.getTime() > new Date(m.expiryYear, m.expiryMonth, 0, 23, 59, 59).getTime();
}

/** The link in the email: the site's join form, which shows the plan and price on sale at that moment. */
function joinUrl(): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
  return `${base}/?join=1`;
}

/**
 * Emails everyone whose membership has ended, once. Meant to run daily (see DEPLOY.md).
 * People sharing an address (a payer who bought for family) get a single email listing all of them.
 * A failed send is left unmarked, so the next run retries it.
 */
export async function sendMembershipEndedEmails(now = new Date()): Promise<{ skipped?: string; sent: number; failed: number }> {
  if (!EMAILS_ENABLED) return { skipped: "emails are disabled", sent: 0, failed: 0 };
  if (!(await getMembershipSettings()).sendExpiryEmail) return { skipped: "switched off in Settings", sent: 0, failed: 0 };

  const candidates = await db.member.findMany({
    where: { expiryEmailSentAt: null, status: "ACTIVE" },
    orderBy: { purchasedAt: "asc" },
    take: 500,
  });
  const due = candidates.filter((m) => hasEnded(m, now));

  const byEmail = new Map<string, typeof due>();
  for (const m of due) {
    const key = m.email.toLowerCase();
    byEmail.set(key, [...(byEmail.get(key) ?? []), m]);
  }

  let sent = 0;
  let failed = 0;
  for (const [to, people] of byEmail) {
    const log = await db.emailLog.create({
      data: {
        type: "membership_ended",
        toAddress: to,
        subject: membershipEndedSubject(people.length),
        status: "queued",
        memberId: people[0].id,
      },
    });
    const ok = await deliverMembershipEndedEmail({ logId: log.id, to, people, joinUrl: joinUrl() });
    if (ok) {
      await db.member.updateMany({ where: { id: { in: people.map((p) => p.id) } }, data: { expiryEmailSentAt: now } });
      sent++;
    } else {
      failed++;
    }
  }
  return { sent, failed };
}
