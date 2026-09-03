/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER DATA SOURCE (Phase 1)
 * ─────────────────────────────────────────────────────────────────────────────
 * The admin console reads from this module so it is fully reviewable without a
 * database. Every export here is realistic but invented — no real company
 * details, pricing, or legal text.
 *
 * Phase 3 swap: replace these functions with Prisma queries against
 * `prisma/schema.prisma`. Call sites use the same function names / shapes, so
 * pages should not need structural changes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { formatExpiry } from "./format";

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

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "FINANCE" | "SUPPORT" | "VIEWER";
  status: "INVITED" | "ACTIVE" | "SUSPENDED";
  twoFactorEnabled: boolean;
  lastLoginAt: string | null;
};

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
};

// ── name pools (fictional) ────────────────────────────────────────────────
const FIRST = ["Omar", "Layla", "Yousef", "Nadia", "Karim", "Salma", "Tariq", "Hana", "Ziad", "Rania", "Bilal", "Maya", "Adam", "Lina", "Sami", "Dima", "Nour", "Faris", "Aya", "Jamal", "Reem", "Hadi", "Sara", "Waleed"];
const LAST = ["Haddad", "Nasser", "Khoury", "Mansour", "Darwish", "Saleh", "Barakat", "Aziz", "Fares", "Rahman", "Sultan", "Kanaan", "Odeh", "Zahran", "Sabbagh", "Tannous", "Ghanem", "Halabi"];

// ── generate members ──────────────────────────────────────────────────────
function gen32() {
  const a = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(rnd() * a.length)];
  return `BSL-${s.slice(0, 4)}-${s.slice(4)}`;
}

const MEMBERS: Member[] = Array.from({ length: 64 }).map((_, i) => {
  const fn = pick(FIRST);
  const ln = pick(LAST);
  const purchased = daysAgo(between(1, 400));
  const durationMonths = 12;
  const exp = new Date(purchased);
  exp.setMonth(exp.getMonth() + durationMonths);
  const monthsToExpiry = (exp.getTime() - Date.now()) / (86400_000 * 30);
  let status: MemberStatus = "ACTIVE";
  if (monthsToExpiry < 0) status = "EXPIRED";
  else if (monthsToExpiry < 2) status = "EXPIRING_SOON";
  if (rnd() < 0.04) status = "REVOKED";
  return {
    id: `mem_${1000 + i}`,
    membershipId: gen32(),
    fullName: `${fn} ${ln}`,
    email: `${fn}.${ln}`.toLowerCase() + `@example.com`,
    expiryMonth: exp.getMonth() + 1,
    expiryYear: exp.getFullYear(),
    expiryLabel: formatExpiry(exp.getMonth() + 1, exp.getFullYear()),
    status,
    purchasedAt: purchased.toISOString(),
    transactionId: `txn_${2000 + i}`,
  };
});

// ── generate transactions (superset of members: includes failures/pending) ─
const FAIL_REASONS = ["Card declined by issuer", "3-D Secure authentication failed", "Insufficient funds", "Timeout awaiting gateway response"];
const TRANSACTIONS: Transaction[] = [
  ...MEMBERS.map((m, i) => ({
    id: `txn_${2000 + i}`,
    reference: `BSL-ORD-${40000 + i}`,
    provider: "MEPS" as const,
    providerRef: `MEPS${between(10_000_000, 99_999_999)}`,
    amountMinor: 25_000, // PLACEHOLDER price — see Settings › Membership product
    currency: "JOD",
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
      amountMinor: 25_000,
      currency: "JOD",
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
const WEBHOOKS: WebhookEvent[] = Array.from({ length: 30 }).map((_, i) => {
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
}).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

const EMAILS: EmailLogEntry[] = MEMBERS.slice(0, 40).map((m, i) => ({
  id: `mail_${i}`,
  type: "proof_of_membership",
  toAddress: m.email,
  subject: "Your Balsalameh membership confirmation",
  status: pick(["delivered", "delivered", "delivered", "sent", "bounced"]) as EmailLogEntry["status"],
  memberId: m.id,
  createdAt: m.purchasedAt,
})).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

// ── admin users + audit ─────────────────────────────────────────────────
const ADMIN_USERS: AdminUser[] = [
  { id: "u_owner", name: "Dana Owner", email: "owner@balsalameh.example", role: "OWNER", status: "ACTIVE", twoFactorEnabled: true, lastLoginAt: daysAgo(0).toISOString() },
  { id: "u_admin", name: "Adam Admin", email: "admin@balsalameh.example", role: "ADMIN", status: "ACTIVE", twoFactorEnabled: true, lastLoginAt: daysAgo(1).toISOString() },
  { id: "u_finance", name: "Farah Finance", email: "finance@balsalameh.example", role: "FINANCE", status: "ACTIVE", twoFactorEnabled: true, lastLoginAt: daysAgo(3).toISOString() },
  { id: "u_support", name: "Sami Support", email: "support@balsalameh.example", role: "SUPPORT", status: "ACTIVE", twoFactorEnabled: false, lastLoginAt: daysAgo(2).toISOString() },
  { id: "u_viewer", name: "Vera Viewer", email: "viewer@balsalameh.example", role: "VIEWER", status: "INVITED", twoFactorEnabled: false, lastLoginAt: null },
];

const AUDIT: AuditEntry[] = Array.from({ length: 24 }).map((_, i) => {
  const when = daysAgo(between(0, 30));
  const [action, entity] = pick([
    ["member.created", "Member"],
    ["member.revoked", "Member"],
    ["email.resent", "EmailLog"],
    ["setting.updated", "Setting"],
    ["legal.published", "LegalDocument"],
    ["user.invited", "AdminUser"],
    ["transaction.refunded", "Transaction"],
  ]);
  return {
    id: `aud_${i}`,
    actor: pick(ADMIN_USERS).name,
    action,
    entity,
    entityId: `${entity.toLowerCase()}_${between(1000, 9999)}`,
    createdAt: when.toISOString(),
  };
}).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

// ── settings (typed key/value) ──────────────────────────────────────────
type SettingValue = string | number | boolean;
const SETTINGS: Record<string, { value: SettingValue; group: string; placeholder: boolean; label: string }> = {
  "general.siteName": { value: "Balsalameh", group: "general", placeholder: false, label: "Site name" },
  "general.supportEmail": { value: "support@example.com", group: "general", placeholder: true, label: "Support email" },
  "general.timezone": { value: "Asia/Amman", group: "general", placeholder: false, label: "Timezone" },
  "general.companyLegalName": { value: "[Registered company name]", group: "general", placeholder: true, label: "Registered company name" },
  "general.companyAddress": { value: "[Registered address]", group: "general", placeholder: true, label: "Registered address" },

  "membership.priceMinor": { value: 25000, group: "membership", placeholder: true, label: "Membership price (minor units)" },
  "membership.currency": { value: "JOD", group: "membership", placeholder: true, label: "Currency" },
  "membership.durationMonths": { value: 12, group: "membership", placeholder: true, label: "Membership duration (months)" },
  "membership.idPrefix": { value: "BSL", group: "membership", placeholder: true, label: "Membership ID prefix" },

  "branding.logoUrl": { value: "", group: "branding", placeholder: true, label: "Logo file" },
  "branding.primaryColor": { value: "#2E3A6E", group: "branding", placeholder: false, label: "Primary colour" },
  "branding.accentColor": { value: "#F7A663", group: "branding", placeholder: false, label: "Accent colour" },

  "gateway.mode": { value: "TEST", group: "gateway", placeholder: false, label: "Gateway environment" },
  "gateway.merchantId": { value: "", group: "gateway", placeholder: true, label: "MEPS merchant ID" },
  "gateway.apiBase": { value: "", group: "gateway", placeholder: true, label: "MEPS API base URL" },
  "gateway.webhookConfigured": { value: false, group: "gateway", placeholder: true, label: "Webhook / IPN configured" },

  "email.provider": { value: "", group: "email", placeholder: true, label: "Email provider" },
  "email.fromAddress": { value: "membership@example.com", group: "email", placeholder: true, label: "From address" },
  "email.dkimVerified": { value: false, group: "email", placeholder: true, label: "DKIM verified" },
};

// ── content ─────────────────────────────────────────────────────────────
export const CONTENT_PAGES = [
  { slug: "home", title: "Home", blocks: ["hero", "what-is-membership", "how-it-works", "faq-teaser", "cta"] },
  { slug: "how-it-works", title: "How it works", blocks: ["intro", "steps"] },
  { slug: "about", title: "About", blocks: ["intro"] },
  { slug: "contact", title: "Contact", blocks: ["intro", "form-intro"] },
].map((p) => ({
  ...p,
  blockDetails: p.blocks.map((key) => ({
    key,
    heading: `[${p.title} — ${key}] heading`,
    body: "Neutral placeholder copy. Final English text will be supplied by the company and pasted here.",
    isPlaceholder: true,
    published: false,
  })),
}));

export const LEGAL_DOCS = [
  { slug: "terms", title: "Terms & Conditions and Fair Usage Policy", version: "draft-0", effectiveAt: null, published: false, isPlaceholder: true },
  { slug: "privacy", title: "Privacy Policy", version: "draft-0", effectiveAt: null, published: false, isPlaceholder: true },
];

export const FAQ_ITEMS = Array.from({ length: 6 }).map((_, i) => ({
  id: `faq_${i}`,
  question: `[Placeholder question ${i + 1}] — to be provided by the company`,
  answer: "Neutral placeholder answer. Replace with company-approved wording.",
  sortOrder: i,
  published: false,
  isPlaceholder: true,
}));

export const EMAIL_TEMPLATES = [
  {
    key: "proof_of_membership",
    subject: "Your Balsalameh membership confirmation",
    isPlaceholder: true,
    variables: ["{{fullName}}", "{{membershipId}}", "{{expiry}}", "{{supportEmail}}", "{{companyLegalName}}"],
    note: "Spec-locked fields: welcome message, full name as on passport, unique Membership ID, expiry as Month YYYY. No barcode / QR code.",
  },
];

// ── dashboard series ────────────────────────────────────────────────────
export function getDashboardData() {
  const captured = TRANSACTIONS.filter((t) => t.status === "CAPTURED");
  const last30 = (iso: string) => +new Date(iso) > Date.now() - 30 * 86400_000;
  const last7 = (iso: string) => +new Date(iso) > Date.now() - 7 * 86400_000;

  const signupsByDay = Array.from({ length: 30 }).map((_, i) => {
    const day = daysAgo(29 - i);
    const count = MEMBERS.filter(
      (m) => new Date(m.purchasedAt).toDateString() === day.toDateString(),
    ).length + between(0, 3);
    return { date: day.toISOString().slice(0, 10), count };
  });

  const revenueByDay = signupsByDay.map((d) => ({
    date: d.date,
    amountMinor: d.count * 25_000,
  }));

  return {
    kpis: {
      newMembersToday: MEMBERS.filter((m) => new Date(m.purchasedAt).toDateString() === new Date().toDateString()).length + between(0, 4),
      newMembers7d: MEMBERS.filter((m) => last7(m.purchasedAt)).length + between(2, 8),
      newMembers30d: MEMBERS.filter((m) => last30(m.purchasedAt)).length + between(6, 20),
      revenue30dMinor: captured.filter((t) => last30(t.createdAt)).length * 25_000 + 400_000,
      activeMembers: MEMBERS.filter((m) => m.status === "ACTIVE" || m.status === "EXPIRING_SOON").length,
      expiringSoon: MEMBERS.filter((m) => m.status === "EXPIRING_SOON").length,
      paymentSuccessRate:
        Math.round((captured.length / TRANSACTIONS.length) * 1000) / 10,
    },
    signupsByDay,
    revenueByDay,
    recentMembers: MEMBERS.slice()
      .sort((a, b) => +new Date(b.purchasedAt) - +new Date(a.purchasedAt))
      .slice(0, 6),
    recentTransactions: TRANSACTIONS.slice(0, 6),
    health: {
      gatewayMode: SETTINGS["gateway.mode"].value as string,
      lastWebhookAt: WEBHOOKS[0]?.createdAt ?? null,
      lastEmailAt: EMAILS[0]?.createdAt ?? null,
      emailProviderConfigured: Boolean(SETTINGS["email.provider"].value),
      webhookConfigured: Boolean(SETTINGS["gateway.webhookConfigured"].value),
    },
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

export function listAdminUsers() {
  return ADMIN_USERS.slice();
}

export function listAuditEntries() {
  return AUDIT.slice();
}

export function getSetting(key: string): SettingValue | undefined {
  return SETTINGS[key]?.value;
}

export function listSettings(group?: string) {
  return Object.entries(SETTINGS)
    .filter(([, v]) => !group || v.group === group)
    .map(([key, v]) => ({ key, ...v }));
}

/** Everything still holding placeholder content — powers Launch readiness. */
export function launchReadiness() {
  const items: { area: string; label: string; ready: boolean; hint: string }[] = [];

  for (const s of listSettings()) {
    if (s.placeholder) {
      const unset = s.value === "" || s.value === false || String(s.value).startsWith("[");
      items.push({
        area: "Settings",
        label: s.label,
        // A placeholder value is never "ready" until the company confirms it,
        // even when a plausible default is pre-filled.
        ready: false,
        hint: unset ? `${s.key} — not set` : `${s.key} — placeholder value, confirm with the company`,
      });
    }
  }
  for (const d of LEGAL_DOCS) {
    items.push({
      area: "Legal",
      label: d.title,
      ready: d.published && !d.isPlaceholder,
      hint: "Awaiting company-supplied text + legal review",
    });
  }
  for (const p of CONTENT_PAGES) {
    const pending = p.blockDetails.filter((b) => b.isPlaceholder || !b.published).length;
    items.push({
      area: "Content",
      label: `${p.title} page`,
      ready: pending === 0,
      hint: `${pending} block(s) still placeholder / unpublished`,
    });
  }
  for (const t of EMAIL_TEMPLATES) {
    items.push({
      area: "Email",
      label: `Template: ${t.key}`,
      ready: !t.isPlaceholder,
      hint: "Populate with company-approved copy",
    });
  }

  const ready = items.filter((i) => i.ready).length;
  return { items, ready, total: items.length, canGoLive: ready === items.length };
}
