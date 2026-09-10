import "server-only";
import { db } from "./db";
import { EMAILS_ENABLED, EMAIL_FROM, EMAIL_COMPANY_NOTIFY } from "./config";
import { CONTACT_EMAIL } from "./site-content";
import { formatExpiry, formatMoney, formatDateTime } from "./format";

/**
 * Transactional email via the SendGrid v3 HTTP API (no SMTP, no SDK).
 * Sending is a no-op unless EMAILS_ENABLED (see config.ts) — a missing key or
 * flag never breaks checkout.
 */

type Mail = { to: string; subject: string; text: string; html?: string };
type SendResult = { ok: boolean; messageId?: string; error?: string };

/** "Name <addr@x>" -> {name, email}; "addr@x" -> {email}. */
function parseAddress(v: string): { email: string; name?: string } {
  const m = v.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { name: m[1] || undefined, email: m[2] } : { email: v.trim() };
}

export async function sendEmail({ to, subject, text, html }: Mail): Promise<SendResult> {
  if (!EMAILS_ENABLED) return { ok: false, error: "email disabled" };
  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: parseAddress(EMAIL_FROM),
        reply_to: { email: CONTACT_EMAIL },
        subject,
        // SendGrid requires text/plain before text/html.
        content: [
          { type: "text/plain", value: text },
          ...(html ? [{ type: "text/html", value: html }] : []),
        ],
      }),
    });
    if (res.ok) return { ok: true, messageId: res.headers.get("x-message-id") ?? undefined };
    return { ok: false, error: `sendgrid ${res.status}: ${(await res.text()).slice(0, 300)}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// ── Templates ────────────────────────────────────────────────────────────

type MemberFacts = {
  fullName: string;
  email: string;
  membershipId: string;
  expiryMonth: number;
  expiryYear: number;
  reference: string;
};

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

/** Customer email — this IS the proof of membership shown at check-in. */
function memberConfirmation(m: MemberFacts): Mail {
  const expiry = formatExpiry(m.expiryMonth, m.expiryYear);
  const rows: [string, string][] = [
    ["Name (as on passport)", m.fullName],
    ["Membership ID", m.membershipId],
    ["Valid until", expiry],
    ["Order reference", m.reference],
  ];
  const text = `Hi ${m.fullName},

Your payment has been received and your Belsalameh membership is now active.
Keep this email. It is your proof of membership. At check-in the agent matches
the name and Membership ID below.

  Name (as on passport):  ${m.fullName}
  Membership ID:          ${m.membershipId}
  Valid until:            ${expiry}
  Order reference:        ${m.reference}

What it covers
  The 1-4 kg Micro-Excess Baggage Service, for Royal Jordanian flights with an
  RJ booking reference. If your checked bag is 1 to 4 kg over the standard 23 kg
  allowance (up to 27 kg total), show this email at the check-in counter and pay
  the fixed member rate instead of standard excess fees.

Questions? Reply to this email or contact ${CONTACT_EMAIL}.

Belsalameh
Fly in relief`;

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px;margin:0 auto;color:#2E3A6E">
  <p style="font-size:16px">Hi ${esc(m.fullName)},</p>
  <p style="font-size:14px;line-height:1.6;color:#4a4a5a">Your payment has been received and your <strong>Belsalameh</strong> membership is now active. Keep this email &mdash; it is your proof of membership. At check-in the agent matches the name and Membership ID below.</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#FFF3E0;border-radius:12px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:10px 16px;font-size:12px;color:#6b6b7b;white-space:nowrap">${esc(k)}</td><td style="padding:10px 16px;font-size:14px;font-weight:600;text-align:right">${esc(v)}</td></tr>`,
      )
      .join("")}
  </table>
  <p style="font-size:13px;line-height:1.6;color:#4a4a5a"><strong>What it covers.</strong> The 1&ndash;4 kg Micro-Excess Baggage Service, for Royal Jordanian flights with an RJ booking reference. If your checked bag is 1 to 4 kg over the standard 23 kg allowance (up to 27 kg total), show this email at the check-in counter and pay the fixed member rate instead of standard excess fees.</p>
  <p style="font-size:13px;color:#4a4a5a">Questions? Reply to this email or contact <a href="mailto:${CONTACT_EMAIL}" style="color:#6D5FA3">${CONTACT_EMAIL}</a>.</p>
  <p style="font-size:13px;color:#6D5FA3;margin-top:24px">Belsalameh &mdash; Fly in relief</p>
</div>`;

  return { to: m.email, subject: `Your Belsalameh membership is active - ${m.membershipId}`, text, html };
}

/** Internal copy to the company for every captured payment. */
function companyNotification(
  m: MemberFacts & { amountMinor: number; currency: string; providerRef: string | null; capturedAt: Date },
): Mail {
  const text = `A membership was just activated.

  Name:            ${m.fullName}
  Email:           ${m.email}
  Membership ID:   ${m.membershipId}
  Valid until:     ${formatExpiry(m.expiryMonth, m.expiryYear)}
  Amount:          ${formatMoney(m.amountMinor, m.currency)}
  Order reference: ${m.reference}
  Provider ref:    ${m.providerRef ?? "-"}
  Captured at:     ${formatDateTime(m.capturedAt)}`;
  return { to: EMAIL_COMPANY_NOTIFY, subject: `New membership: ${m.fullName} (${m.membershipId})`, text };
}

// ── Orchestration (called from capturePayment after the DB transaction) ───

export async function deliverMembershipEmails(input: {
  proofLogId: string;
  notifyLogId: string;
  member: MemberFacts;
  amountMinor: number;
  currency: string;
  providerRef: string | null;
  capturedAt: Date;
}): Promise<void> {
  // Email off / no key: leave both log rows "queued" for a later manual resend.
  if (!EMAILS_ENABLED) return;

  const [customer, company] = await Promise.all([
    sendEmail(memberConfirmation(input.member)),
    sendEmail(companyNotification({ ...input.member, amountMinor: input.amountMinor, currency: input.currency, providerRef: input.providerRef, capturedAt: input.capturedAt })),
  ]);

  const patch = (r: SendResult) => ({
    status: r.ok ? "sent" : "failed",
    providerMessageId: r.messageId ?? null,
    error: r.ok ? null : (r.error ?? "unknown").slice(0, 400),
  });

  await Promise.all([
    db.emailLog.update({ where: { id: input.proofLogId }, data: patch(customer) }).catch(() => {}),
    db.emailLog.update({ where: { id: input.notifyLogId }, data: patch(company) }).catch(() => {}),
  ]);

  if (!customer.ok || !company.ok) {
    console.warn("[emails] membership delivery:", { customer: customer.error, company: company.error });
  }
}
