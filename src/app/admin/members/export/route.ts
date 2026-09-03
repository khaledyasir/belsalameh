import { getSession } from "@/lib/auth";
import { listMembers } from "@/lib/mock-data";

/**
 * CSV export of members. Phase 3: stream from the database and record an
 * audit entry (member data export is a logged, permissioned action).
 */
export async function GET() {
  const session = await getSession();
  if (!session) return new Response("Unauthorised", { status: 401 });

  const { rows } = listMembers({ pageSize: 100000 });
  const header = ["Full name", "Email", "Membership ID", "Expiry"];
  const csv = [
    header.join(","),
    ...rows.map((m) =>
      [m.fullName, m.email, m.membershipId, m.expiryLabel]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="balsalameh-members-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
