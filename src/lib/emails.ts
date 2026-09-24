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
  if (!EMAILS_ENABLED) {
    // Most common cause of "no email" support questions — log it plainly so
    // it shows up in logs\out.log instead of needing a DB query to explain.
    console.log(`[email] skipped (EMAILS_ENABLED is off, or no SENDGRID_API_KEY) — would have sent to ${to}: "${subject}"`);
    return { ok: false, error: "email disabled" };
  }
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
    if (res.ok) {
      const messageId = res.headers.get("x-message-id") ?? undefined;
      console.log(`[email] sent to ${to}: "${subject}" — SendGrid ${res.status}, message-id=${messageId ?? "(none)"}`);
      return { ok: true, messageId };
    }
    // Full SendGrid response body to the log (truncated only in what we store
    // in the DB, below) — this is "what the email server gets" when it rejects.
    const body = await res.text();
    console.error(`[email] FAILED to ${to}: "${subject}" — SendGrid responded ${res.status}: ${body.slice(0, 800)}`);
    return { ok: false, error: `sendgrid ${res.status}: ${body.slice(0, 300)}` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[email] FAILED to ${to}: "${subject}" — request to SendGrid never completed: ${msg}`);
    return { ok: false, error: msg };
  }
}

// ── Templates ────────────────────────────────────────────────────────────

export type MemberFacts = {
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

/** Subject of the proof-of-membership email; also stored on the EmailLog row. */
export function proofSubject(people: Pick<MemberFacts, "membershipId">[]): string {
  return people.length === 1
    ? `Your Belsalameh membership is active - ${people[0].membershipId}`
    : `Your Belsalameh memberships are active - ${people.length} people`;
}

/**
 * Customer email — this IS the proof of membership shown at check-in. Lists one
 * block per person; `paidBy` switches the opening line for someone who was added
 * to another person's order.
 */
function memberConfirmation(people: MemberFacts[], opts: { paidBy?: string } = {}): Mail {
  const single = people.length === 1;
  const ref = people[0].reference;
  const blocks = people.map((m) => ({
    who: m,
    rows: [
      ["Name (as on passport)", m.fullName],
      ["Membership ID", m.membershipId],
      ["Valid until", formatExpiry(m.expiryMonth, m.expiryYear)],
    ] as [string, string][],
  }));
  // A single membership keeps the order reference inside its own block.
  if (single) blocks[0].rows.push(["Order reference", ref]);

  const lead = opts.paidBy
    ? `A Belsalameh membership has been purchased for you by ${opts.paidBy} and is now active.`
    : single
      ? "Your payment has been received and your Belsalameh membership is now active."
      : "Your payment has been received and your Belsalameh memberships are now active.";
  const keep = single
    ? "Keep this email. It is your proof of membership. At check-in the agent matches\nthe name and Membership ID below."
    : "Keep this email. It is the proof of membership for everyone listed below. At\ncheck-in the agent matches each traveller's name and Membership ID.";

  const text = `Hi ${people[0].fullName},

${lead}
${keep}

${blocks
  .map((b) => b.rows.map(([k, v]) => `  ${(k + ":").padEnd(24)}${v}`).join("\n"))
  .join("\n\n")}
${single ? "" : `\n  ${"Order reference:".padEnd(24)}${ref}\n`}
What it covers
  The 1-3 kg Micro-Excess Baggage Service, for Royal Jordanian flights with an
  RJ booking reference. If your checked bag is 1 to 3 kg over the standard 23 kg
  allowance (up to 26 kg total), show this email at the check-in counter and pay
  the fixed member rate instead of standard excess fees.

Questions? Reply to this email or contact ${CONTACT_EMAIL}.

Belsalameh
Fly in relief`;

  const table = (rows: [string, string][]) => `<table style="width:100%;border-collapse:collapse;margin:20px 0;background:#FFF3E0;border-radius:12px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:10px 16px;font-size:12px;color:#6b6b7b;white-space:nowrap">${esc(k)}</td><td style="padding:10px 16px;font-size:14px;font-weight:600;text-align:right">${esc(v)}</td></tr>`,
      )
      .join("")}
  </table>`;

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px;margin:0 auto;color:#2E3A6E">
  <p style="font-size:16px">Hi ${esc(people[0].fullName)},</p>
  <p style="font-size:14px;line-height:1.6;color:#4a4a5a">${esc(lead).replace("Belsalameh", "<strong>Belsalameh</strong>")} Keep this email &mdash; it is ${single ? "your" : "the"} proof of membership${single ? "" : " for everyone listed below"}. At check-in the agent matches the name and Membership ID${single ? " below" : " of each traveller"}.</p>
  ${blocks.map((b) => table(b.rows)).join("\n  ")}
  ${single ? "" : `<p style="font-size:12px;color:#6b6b7b">Order reference: <strong style="color:#2E3A6E">${esc(ref)}</strong></p>`}
  <p style="font-size:13px;line-height:1.6;color:#4a4a5a"><strong>What it covers.</strong> The 1&ndash;3 kg Micro-Excess Baggage Service, for Royal Jordanian flights with an RJ booking reference. If your checked bag is 1 to 3 kg over the standard 23 kg allowance (up to 26 kg total), show this email at the check-in counter and pay the fixed member rate instead of standard excess fees.</p>
  <p style="font-size:13px;color:#4a4a5a">Questions? Reply to this email or contact <a href="mailto:${CONTACT_EMAIL}" style="color:#6D5FA3">${CONTACT_EMAIL}</a>.</p>
  <p style="font-size:13px;color:#6D5FA3;margin-top:24px">Belsalameh &mdash; Fly in relief</p>
</div>`;

  return { to: people[0].email, subject: proofSubject(people), text, html };
}

/** Internal copy to the company for every captured payment. */
function companyNotification(
  people: MemberFacts[],
  m: { amountMinor: number; currency: string; providerRef: string | null; capturedAt: Date },
): Mail {
  const first = people[0];
  const who = people
    .map(
      (p) => `  Name:            ${p.fullName}
  Email:           ${p.email}
  Membership ID:   ${p.membershipId}
  Valid until:     ${formatExpiry(p.expiryMonth, p.expiryYear)}`,
    )
    .join("\n\n");
  const text = `${people.length === 1 ? "A membership was" : `${people.length} memberships were`} just activated.

${who}

  Amount:          ${formatMoney(m.amountMinor, m.currency)}
  Order reference: ${first.reference}
  Provider ref:    ${m.providerRef ?? "-"}
  Captured at:     ${formatDateTime(m.capturedAt)}`;
  return { to: EMAIL_COMPANY_NOTIFY, subject: notifySubject(people), text };
}

/** Subject of the internal notification; also stored on its EmailLog row. */
export function notifySubject(people: Pick<MemberFacts, "fullName" | "membershipId">[]): string {
  return people.length === 1
    ? `New membership: ${people[0].fullName} (${people[0].membershipId})`
    : `New memberships (${people.length}): ${people[0].fullName} + ${people.length - 1} more`;
}

// ── Orchestration (called from capturePayment after the DB transaction) ───

export async function deliverMembershipEmails(input: {
  proofLogId: string;
  notifyLogId: string;
  /** Everyone on the order, the payer first. */
  people: MemberFacts[];
  /** Extra people who were given their own address: they get an individual copy. */
  extras: { logId: string; person: MemberFacts }[];
  amountMinor: number;
  currency: string;
  providerRef: string | null;
  capturedAt: Date;
}): Promise<void> {
  const { people } = input;
  const ids = people.map((p) => p.membershipId).join(", ");

  // Email off / no key: leave every log row "queued" for a later manual resend.
  if (!EMAILS_ENABLED) {
    console.log(`[email] EMAILS_ENABLED is off — leaving emails "queued" for ${ids} (reference ${people[0].reference})`);
    return;
  }

  console.log(`[email] delivering membership emails for ${ids} (reference ${people[0].reference}, to ${people[0].email})`);

  const payer = people[0].fullName;
  const [customer, company, ...extraResults] = await Promise.all([
    sendEmail(memberConfirmation(people)),
    sendEmail(companyNotification(people, input)),
    ...input.extras.map((x) => sendEmail(memberConfirmation([x.person], { paidBy: payer }))),
  ]);

  const patch = (r: SendResult) => ({
    status: r.ok ? "sent" : "failed",
    providerMessageId: r.messageId ?? null,
    error: r.ok ? null : (r.error ?? "unknown").slice(0, 400),
  });

  await Promise.all([
    db.emailLog.update({ where: { id: input.proofLogId }, data: patch(customer) }).catch(() => {}),
    db.emailLog.update({ where: { id: input.notifyLogId }, data: patch(company) }).catch(() => {}),
    ...input.extras.map((x, i) =>
      db.emailLog.update({ where: { id: x.logId }, data: patch(extraResults[i]) }).catch(() => {}),
    ),
  ]);

  if (customer.ok && company.ok && extraResults.every((r) => r.ok)) {
    console.log(`[email] all sent OK for ${ids}`);
  } else {
    console.warn(`[email] delivery had failures for ${ids}:`, {
      customer: customer.ok ? "ok" : customer.error,
      company: company.ok ? "ok" : company.error,
      extras: extraResults.map((r) => (r.ok ? "ok" : r.error)),
    });
  }
}
