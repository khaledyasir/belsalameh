import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatExpiry } from "@/lib/format";

/** Quote a CSV cell and neutralise spreadsheet formula injection (a checkout
 *  fullName like `=HYPERLINK(...)` would otherwise execute on open). */
function csvCell(v: unknown): string {
  const s = String(v ?? "");
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await getSession();
  if (!session) return new Response("Unauthorised", { status: 401 });

  const rows = await db.member.findMany({ orderBy: { purchasedAt: "desc" } });
  const header = ["Full name", "Email", "Membership ID", "Expiry"];
  const csv = [
    header.join(","),
    ...rows.map((m) =>
      [m.fullName, m.email, m.membershipId, formatExpiry(m.expiryMonth, m.expiryYear)]
        .map(csvCell)
        .join(","),
    ),
  ].join("\r\n");

  await db.auditLog
    .create({
      data: {
        action: "members.exported",
        entity: "Member",
        entityId: "*",
        detail: `${rows.length} rows`,
        actorId: session.user.id,
      },
    })
    .catch(() => {});

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="balsalameh-members-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
