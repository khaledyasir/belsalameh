import "server-only";
import { db } from "./db";
import { formatExpiry } from "./format";

/**
 * Admin read layer (SQL Server via Prisma). View-model types are kept stable so
 * the admin pages don't depend on Prisma's generated types.
 */

export type MemberStatus = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "REVOKED";
export type TransactionStatus = "PENDING" | "CAPTURED" | "FAILED" | "REFUNDED";

export type Member = {
  id: string;
  membershipId: string;
  fullName: string;
  email: string;
  expiryMonth: number;
  expiryYear: number;
  expiryLabel: string;
  status: MemberStatus;
  purchasedAt: Date;
  transactionId: string | null;
};

export type Transaction = {
  id: string;
  reference: string;
  provider: string;
  providerRef: string | null;
  amountMinor: number;
  currency: string;
  status: TransactionStatus;
  fullName: string;
  email: string;
  failureReason: string | null;
  ipnReceivedAt: Date | null;
  createdAt: Date;
  memberId: string | null;
};

export type WebhookEvent = {
  id: string;
  provider: string;
  dedupeKey: string;
  signatureValid: boolean;
  result: "ok" | "ignored" | "error" | null;
  error: string | null;
  processedAt: Date | null;
  createdAt: Date;
};

export type EmailLogEntry = {
  id: string;
  type: string;
  toAddress: string;
  subject: string;
  status: "queued" | "sent" | "delivered" | "bounced" | "failed";
  memberId: string | null;
  createdAt: Date;
};

type MemberRow = {
  id: string;
  membershipId: string;
  fullName: string;
  email: string;
  expiryMonth: number;
  expiryYear: number;
  status: string;
  purchasedAt: Date;
  transactionId: string | null;
};

/** Overlay the display-only EXPIRING_SOON / EXPIRED state on the stored status. */
function toMemberVM(row: MemberRow): Member {
  let status = row.status as MemberStatus;
  if (status === "ACTIVE") {
    const endOfExpiryMonth = new Date(row.expiryYear, row.expiryMonth, 0, 23, 59, 59);
    const monthsLeft = (endOfExpiryMonth.getTime() - Date.now()) / (86_400_000 * 30);
    if (monthsLeft < 0) status = "EXPIRED";
    else if (monthsLeft <= 2) status = "EXPIRING_SOON";
  }
  return {
    id: row.id,
    membershipId: row.membershipId,
    fullName: row.fullName,
    email: row.email,
    expiryMonth: row.expiryMonth,
    expiryYear: row.expiryYear,
    expiryLabel: formatExpiry(row.expiryMonth, row.expiryYear),
    status,
    purchasedAt: row.purchasedAt,
    transactionId: row.transactionId,
  };
}

// ── Members ──────────────────────────────────────────────────────────────
export async function listMembers(
  opts: { q?: string; status?: MemberStatus | "ALL"; page?: number; pageSize?: number } = {},
) {
  const { q = "", status = "ALL", page = 1, pageSize = 15 } = opts;

  const where = q
    ? {
        OR: [
          { fullName: { contains: q } },
          { email: { contains: q } },
          { membershipId: { contains: q.replace(/\s/g, "") } },
        ],
      }
    : {};

  // Fetch matching rows, then apply the computed-status filter + pagination in
  // memory (volumes are small early on; revisit if Members grows large).
  const rows = (await db.member.findMany({ where, orderBy: { purchasedAt: "desc" }, take: 2000 })).map(toMemberVM);
  const filtered = status === "ALL" ? rows : rows.filter((m) => m.status === status);
  const start = (page - 1) * pageSize;
  return { rows: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize };
}

export async function getMember(id: string): Promise<Member | null> {
  const row = await db.member.findUnique({ where: { id } });
  return row ? toMemberVM(row) : null;
}

export async function findMemberForVerification(query: string): Promise<Member[]> {
  const t = query.trim().replace(/\s/g, "");
  if (!t) return [];
  const rows = await db.member.findMany({
    where: { OR: [{ membershipId: { contains: t } }, { fullName: { contains: query.trim() } }] },
    take: 8,
  });
  return rows.map(toMemberVM);
}

// ── Transactions ─────────────────────────────────────────────────────────
function toTxnVM(row: {
  id: string; reference: string; provider: string; providerRef: string | null;
  amountMinor: number; currency: string; status: string; fullName: string; email: string;
  failureReason: string | null; ipnReceivedAt: Date | null; createdAt: Date;
  member?: { id: string } | null;
}): Transaction {
  return {
    id: row.id,
    reference: row.reference,
    provider: row.provider,
    providerRef: row.providerRef,
    amountMinor: row.amountMinor,
    currency: row.currency,
    status: row.status as TransactionStatus,
    fullName: row.fullName,
    email: row.email,
    failureReason: row.failureReason,
    ipnReceivedAt: row.ipnReceivedAt,
    createdAt: row.createdAt,
    memberId: row.member?.id ?? null,
  };
}

export async function listTransactions(
  opts: { q?: string; status?: TransactionStatus | "ALL"; page?: number; pageSize?: number } = {},
) {
  const { q = "", status = "ALL", page = 1, pageSize = 15 } = opts;
  const where = {
    ...(status !== "ALL" ? { status } : {}),
    ...(q
      ? {
          OR: [
            { reference: { contains: q } },
            { fullName: { contains: q } },
            { email: { contains: q } },
            { providerRef: { contains: q } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    db.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { member: { select: { id: true } } },
    }),
    db.transaction.count({ where }),
  ]);
  return { rows: rows.map(toTxnVM), total, page, pageSize };
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  const row = await db.transaction.findUnique({ where: { id }, include: { member: { select: { id: true } } } });
  return row ? toTxnVM(row) : null;
}

// ── Webhooks / email log ─────────────────────────────────────────────────
export async function listWebhookEvents(): Promise<WebhookEvent[]> {
  const rows = await db.webhookEvent.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return rows.map((w) => ({ ...w, result: (w.result as WebhookEvent["result"]) ?? null }));
}

export async function listEmailLogs(): Promise<EmailLogEntry[]> {
  const rows = await db.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return rows.map((e) => ({ ...e, status: e.status as EmailLogEntry["status"] }));
}

// ── Dashboard ────────────────────────────────────────────────────────────
export async function getDashboardData() {
  const since90 = new Date(Date.now() - 90 * 86_400_000);
  const since30 = new Date(Date.now() - 30 * 86_400_000);

  const [members90, activeMembers, recentMemberRows, recentTxnRows, capturedAgg, capturedCount, totalTxns, failedPending, expiringActive] =
    await Promise.all([
      db.member.findMany({ where: { purchasedAt: { gte: since90 } }, select: { purchasedAt: true } }),
      db.member.count({ where: { status: "ACTIVE" } }),
      db.member.findMany({ orderBy: { purchasedAt: "desc" }, take: 6 }),
      db.transaction.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { member: { select: { id: true } } } }),
      db.transaction.aggregate({ _sum: { amountMinor: true }, where: { status: "CAPTURED", createdAt: { gte: since30 } } }),
      db.transaction.count({ where: { status: "CAPTURED" } }),
      db.transaction.count(),
      db.transaction.count({ where: { status: { in: ["FAILED", "PENDING"] } } }),
      db.member.findMany({ where: { status: "ACTIVE" }, select: { expiryMonth: true, expiryYear: true } }),
    ]);

  // 90-day daily new-member counts
  const buckets = new Map<string, number>();
  for (let i = 89; i >= 0; i--) {
    buckets.set(new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10), 0);
  }
  for (const m of members90) {
    const key = m.purchasedAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const newMembersSeries = [...buckets.entries()].map(([date, count]) => ({ date, count }));

  const expiringSoon = expiringActive.filter((m) => {
    const end = new Date(m.expiryYear, m.expiryMonth, 0).getTime();
    const days = (end - Date.now()) / 86_400_000;
    return days >= 0 && days <= 60;
  }).length;

  return {
    newMembersSeries,
    kpis: {
      revenue30dMinor: capturedAgg._sum.amountMinor ?? 0,
      activeMembers,
      expiringSoon,
      paymentSuccessRate: totalTxns > 0 ? Math.round((capturedCount / totalTxns) * 1000) / 10 : 0,
      failedPending,
    },
    recentMembers: recentMemberRows.map(toMemberVM),
    recentTransactions: recentTxnRows.map(toTxnVM),
  };
}
