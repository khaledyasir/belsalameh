import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { listAuditEntries, type AuditEntry } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { UsersTabs } from "../tabs";

export const metadata: Metadata = { title: "Activity log" };

export default async function AuditPage() {
  const { allowed } = await guard("audit:view");
  if (!allowed) return <PermissionDenied area="the activity log" />;

  const columns: Column<AuditEntry>[] = [
    { key: "at", header: "When", cell: (a) => formatDateTime(a.createdAt) },
    { key: "actor", header: "Actor", cell: (a) => a.actor },
    { key: "action", header: "Action", cell: (a) => <Badge tone="neutral" className="font-mono">{a.action}</Badge> },
    { key: "entity", header: "Entity", cell: (a) => `${a.entity} · ${a.entityId}` },
  ];

  return (
    <div>
      <PageHeader
        title="Activity log"
        description="Every mutating admin action is recorded with actor, change diff, IP, and user agent. Read-only and retained per the compliance policy."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Users & roles", href: "/admin/users" }, { label: "Activity log" }]}
      />
      <UsersTabs />

      <Card>
        <CardBody>
          <DataTable caption="Audit entries" columns={columns} rows={listAuditEntries()} />
        </CardBody>
      </Card>
    </div>
  );
}
