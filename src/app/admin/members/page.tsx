import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { DataTable, Pagination, type Column } from "@/components/ui/data-table";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { MemberStatusBadge } from "@/components/ui/status-badge";
import { buttonClasses } from "@/components/ui/button";
import { listMembers, type Member, type MemberStatus } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Members" };

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "EXPIRING_SOON", label: "Expiring soon" },
  { value: "EXPIRED", label: "Expired" },
  { value: "REVOKED", label: "Revoked" },
];

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await guard();

  const sp = await searchParams;
  const q = sp.q ?? "";
  const status = (sp.status || "ALL") as MemberStatus | "ALL";
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const { rows, total, pageSize } = await listMembers({ q, status, page });

  const columns: Column<Member>[] = [
    { key: "name", header: "Full name", cell: (m) => m.fullName },
    { key: "email", header: "Email", cell: (m) => <span className="text-ink-muted">{m.email}</span> },
    { key: "id", header: "Membership ID", cell: (m) => <span className="font-mono text-xs">{m.membershipId}</span> },
    { key: "expiry", header: "Expiry", cell: (m) => m.expiryLabel },
    { key: "status", header: "Status", cell: (m) => <MemberStatusBadge status={m.status} /> },
    { key: "joined", header: "Joined", cell: (m) => formatDate(m.purchasedAt) },
  ];

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (status !== "ALL") qs.set("status", status);
  const baseHref = `/admin/members${qs.toString() ? `?${qs}` : ""}`;

  return (
    <div>
      <PageHeader
        title="Members"
        description="Subscribers to the Balsalameh Membership. Spec-defined stored fields: full name, email, Membership ID, expiry month & year."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Members" }]}
        actions={
          <a href="/admin/members/export" className={buttonClasses("secondary")}>
            Export CSV
          </a>
        }
      />

      <TableToolbar
        action="/admin/members"
        q={q}
        filters={[{ name: "status", label: "Status", value: sp.status, options: STATUS_OPTIONS }]}
      />

      <Card>
        <CardBody className="p-0 sm:p-0">
          <div className="p-3 sm:p-4">
            <DataTable
              caption="All members"
              columns={columns}
              rows={rows}
              rowHref={(m) => `/admin/members/${m.id}`}
              empty={{ title: "No members match", description: "Try a different search term or status filter." }}
            />
            <Pagination page={page} pageSize={pageSize} total={total} baseHref={baseHref} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
