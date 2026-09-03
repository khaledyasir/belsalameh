/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER DATA SOURCE (Phase 1)
 * ─────────────────────────────────────────────────────────────────────────────
 * The admin console reads from this module so it is fully reviewable without a
 * database. Every export here is realistic but invented — no real company
 * details, pricing, or legal text.
 *
 * Phase 3 swap: replace these functions with Prisma queries against
 * `prisma/schema.prisma`. Call sites use the same function names / shapes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { formatExpiry } from "./format";
import { MEMBERSHIP } from "./membership";

/** PLACEHOLDER — real value comes from the MEPS gateway config in Phase 3. */
export const GATEWAY_MODE: "TEST" | "LIVE" = "TEST";

/** Re-exported from the shared product config (src/lib/membership.ts). */
export const MEMBERSHIP_PRICE_MINOR = MEMBERSHIP.priceMinor;
export const MEMBERSHIP_CURRENCY = MEMBERSHIP.currency;

// ── deterministic PRNG so mock data is stable between renders ────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260903);
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
const between = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
const daysAgo = (n: number) => new Date(Date.now() - n * 86400_000);

// ── Types (mirror prisma/schema.prisma) ────────────────────────────────────
export type MemberStatus = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "REVOKED";
export type TransactionStatus = "PENDING" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";

export type Member = {
  id: string;
  membershipId: string;
  fullName: string;
  email: string;
  expiryMonth: number;
  expiryYear: number;
  expiryLabel: string;
  status: MemberStatus;
  purchasedAt: string;
  transactionId: string | null;
};

export type Transaction = {
  id: string;
  reference: string;
  provider: "MEPS";
  providerRef: string | null;
  amountMinor: number;
  currency: string;
  status: TransactionStatus;
  fullName: string;
  email: string;
  failureReason: string | null;
  ipnReceivedAt: string | null;
  createdAt: string;
  memberId: string | null;
};

export type WebhookEvent = {
  id: string;
  provider: "MEPS";
  dedupeKey: string;
  signatureValid: boolean;
  result: "ok" | "ignored" | "error";
  error: string | null;
  processedAt: string | null;
  createdAt: string;
};

export type EmailLogEntry = {
  id: string;
  type: string;
  toAddress: string;
  subject: string;
  status: "queued" | "sent" | "delivered" | "bounced" | "failed";
  memberId: string | null;
  createdAt: string;
};

// ── name pools (fictional) ────────────────────────────────────────────────
const FIRST = ["Omar", "Layla", "Yousef", "Nadia", "Karim", "Salma", "Tariq", "Hana", "Ziad", "Rania", "Bilal", "Maya", "Adam", "Lina", "Sami", "Dima", "Nour", "Faris", "Aya", "Jamal", "Reem", "Hadi", "Sara", "Waleed"];
const LAST = ["Haddad", "Nasser", "Khoury", "Mansour", "Darwish", "Saleh", "Barakat", "Aziz", "Fares", "Rahman", "Sultan", "Kanaan", "Odeh", "Zahran", "Sabbagh", "Tannous", "Ghanem", "Halabi"];

function gen32() {
  const a = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(rnd() * a.length)];
  return `BSL-${s.slice(0, 4)}-${s.slice(4)}`;
}

// ── members ──────────────────────────────────────────────────────────────
const MEMBERS: Member[] = Array.from({ length: 64 }).map((_, i) => {
  const fn = pick(FIRST);
  const ln = pick(LAST);
  const purchased = daysAgo(between(1, 400));
  const exp = new Date(purchased);
  exp.setMonth(exp.getMonth() + 12);
  const monthsToExpiry = (exp.getTime() - Date.now()) / (86400_000 * 30);
  let status: MemberStatus = "ACTIVE";
  if (monthsToExpiry < 0) status = "EXPIRED";
  else if (monthsToExpiry < 2) status = "EXPIRING_SOON";
  if (rnd() < 0.04) status = "REVOKED";
  return {
    id: `mem_${1000 + i}`,
    membershipId: gen32(),
    fullName: `${fn} ${ln}`,
    email: `${fn}.${ln}`.toLowerCase() + "@example.com",
    expiryMonth: exp.getMonth() + 1,
    expiryYear: exp.getFullYear(),
    expiryLabel: formatExpiry(exp.getMonth() + 1, exp.getFullYear()),
    status,
    purchasedAt: purchased.toISOString(),
    transactionId: `txn_${2000 + i}`,
  };
});

// ── transactions (superset of members: includes failures / pending) ───────
const FAIL_REASONS = ["Card declined by issuer", "3-D Secure authentication failed", "Insufficient funds", "Timeout awaiting gateway response"];
const TRANSACTIONS: Transaction[] = [
  ...MEMBERS.map((m, i) => ({
    id: `txn_${2000 + i}`,
    reference: `BSL-ORD-${40000 + i}`,
    provider: "MEPS" as const,
    providerRef: `MEPS${between(10_000_000, 99_999_999)}`,
    amountMinor: MEMBERSHIP_PRICE_MINOR,
    currency: MEMBERSHIP_CURRENCY,
    status: "CAPTURED" as TransactionStatus,
    fullName: m.fullName,
    email: m.email,
    failureReason: null,
    ipnReceivedAt: m.purchasedAt,
    createdAt: m.purchasedAt,
    memberId: m.id,
  })),
  ...Array.from({ length: 22 }).map((_, i) => {
    const fn = pick(FIRST);
    const ln = pick(LAST);
    const when = daysAgo(between(0, 45));
    const failed = rnd() < 0.7;
    return {
      id: `txn_${9000 + i}`,
      reference: `BSL-ORD-${50000 + i}`,
      provider: "MEPS" as const,
      providerRef: failed ? null : `MEPS${between(10_000_000, 99_999_999)}`,
      amountMinor: MEMBERSHIP_PRICE_MINOR,
      currency: MEMBERSHIP_CURRENCY,
      status: (failed ? "FAILED" : "PENDING") as TransactionStatus,
      fullName: `${fn} ${ln}`,
      email: `${fn}.${ln}`.toLowerCase() + "@example.com",
      failureReason: failed ? pick(FAIL_REASONS) : null,
      ipnReceivedAt: null,
      createdAt: when.toISOString(),
      memberId: null,
    };
  }),
].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

// ── webhook + email logs ─────────────────────────────────────────────────
const WEBHOOKS: WebhookEvent[] = Array.from({ length: 30 })
  .map((_, i) => {
    const ok = rnd() < 0.85;
    const when = daysAgo(between(0, 20));
    return {
      id: `wh_${i}`,
      provider: "MEPS" as const,
      dedupeKey: `meps:MEPS${between(10_000_000, 99_999_999)}`,
      signatureValid: rnd() < 0.95,
      result: (ok ? "ok" : rnd() < 0.5 ? "ignored" : "error") as WebhookEvent["result"],
      error: ok ? null : "Order reference not found",
      processedAt: when.toISOString(),
      createdAt: when.toISOString(),
    };
  })
  .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

const EMAILS: EmailLogEntry[] = MEMBERS.slice(0, 40)
  .map((m, i) => ({
    id: `mail_${i}`,
    type: "proof_of_membership",
    toAddress: m.email,
    subject: "Your Balsalameh membership confirmation",
    status: pick(["delivered", "delivered", "delivered", "sent", "bounced"]) as EmailLogEntry["status"],
    memberId: m.id,
    createdAt: m.purchasedAt,
  }))
  .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

// ── dashboard ───────────────────────────────────────────────────────────
export type DayPoint = { date: string; count: number };

export function getDashboardData() {
  const captured = TRANSACTIONS.filter((t) => t.status === "CAPTURED");
  const within = (iso: string, days: number) => +new Date(iso) > Date.now() - days * 86400_000;

  // 90 days of daily new-member counts for the range-selectable chart.
  const newMembersSeries: DayPoint[] = Array.from({ length: 90 }).map((_, i) => {
    const day = daysAgo(89 - i);
    const real = MEMBERS.filter((m) => new Date(m.purchasedAt).toDateString() === day.toDateString()).length;
    return { date: day.toISOString().slice(0, 10), count: real + between(0, 3) };
  });

  return {
    newMembersSeries,
    kpis: {
      revenue30dMinor: captured.filter((t) => within(t.createdAt, 30)).length * MEMBERSHIP_PRICE_MINOR + 400_000,
      activeMembers: MEMBERS.filter((m) => m.status === "ACTIVE" || m.status === "EXPIRING_SOON").length,
      expiringSoon: MEMBERS.filter((m) => m.status === "EXPIRING_SOON").length,
      paymentSuccessRate: Math.round((captured.length / TRANSACTIONS.length) * 1000) / 10,
      failedPending: TRANSACTIONS.filter((t) => t.status === "FAILED" || t.status === "PENDING").length,
    },
    recentMembers: MEMBERS.slice()
      .sort((a, b) => +new Date(b.purchasedAt) - +new Date(a.purchasedAt))
      .slice(0, 6),
    recentTransactions: TRANSACTIONS.slice(0, 6),
  };
}

// ── query helpers (Phase 3: swap bodies for Prisma) ─────────────────────
export function listMembers(opts: { q?: string; status?: MemberStatus | "ALL"; page?: number; pageSize?: number } = {}) {
  const { q = "", status = "ALL", page = 1, pageSize = 15 } = opts;
  let rows = MEMBERS.slice();
  if (q) {
    const t = q.toLowerCase();
    rows = rows.filter(
      (m) =>
        m.fullName.toLowerCase().includes(t) ||
        m.email.toLowerCase().includes(t) ||
        m.membershipId.toLowerCase().includes(t.replace(/\s/g, "")),
    );
  }
  if (status !== "ALL") rows = rows.filter((m) => m.status === status);
  rows.sort((a, b) => +new Date(b.purchasedAt) - +new Date(a.purchasedAt));
  const total = rows.length;
  const start = (page - 1) * pageSize;
  return { rows: rows.slice(start, start + pageSize), total, page, pageSize };
}

export function getMember(id: string) {
  return MEMBERS.find((m) => m.id === id) ?? null;
}

export function findMemberForVerification(query: string) {
  const t = query.trim().toLowerCase().replace(/\s/g, "");
  if (!t) return [];
  return MEMBERS.filter(
    (m) =>
      m.membershipId.toLowerCase().replace(/\s/g, "").includes(t) ||
      m.fullName.toLowerCase().replace(/\s/g, "").includes(t),
  ).slice(0, 8);
}

export function listTransactions(opts: { q?: string; status?: TransactionStatus | "ALL"; page?: number; pageSize?: number } = {}) {
  const { q = "", status = "ALL", page = 1, pageSize = 15 } = opts;
  let rows = TRANSACTIONS.slice();
  if (q) {
    const t = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.reference.toLowerCase().includes(t) ||
        r.fullName.toLowerCase().includes(t) ||
        r.email.toLowerCase().includes(t) ||
        (r.providerRef ?? "").toLowerCase().includes(t),
    );
  }
  if (status !== "ALL") rows = rows.filter((r) => r.status === status);
  const total = rows.length;
  const start = (page - 1) * pageSize;
  return { rows: rows.slice(start, start + pageSize), total, page, pageSize };
}

export function getTransaction(id: string) {
  return TRANSACTIONS.find((t) => t.id === id) ?? null;
}

export function listWebhookEvents() {
  return WEBHOOKS.slice();
}

export function listEmailLogs() {
  return EMAILS.slice();
}
