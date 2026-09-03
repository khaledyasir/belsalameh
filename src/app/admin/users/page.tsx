import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listAdminUsers, type AdminUser } from "@/lib/mock-data";
import { roleLabel } from "@/lib/rbac";
import { formatDateTime } from "@/lib/format";
import { UsersTabs } from "./tabs";

export const metadata: Metadata = { title: "Admin users" };

export default async function AdminUsersPage() {
  const { allowed, role } = await guard("users:view");
  if (!allowed) return <PermissionDenied area="user management" />;
  const canManage = ["ADMIN", "OWNER"].includes(role);

  const columns: Column<AdminUser>[] = [
    { key: "name", header: "Name", cell: (u) => u.name },
    { key: "email", header: "Email", cell: (u) => <span className="text-ink-muted">{u.email}</span> },
    { key: "role", header: "Role", cell: (u) => <Badge tone="brand">{roleLabel(u.role)}</Badge> },
    {
      key: "status",
      header: "Status",
      cell: (u) => (
        <Badge tone={u.status === "ACTIVE" ? "success" : u.status === "INVITED" ? "warning" : "danger"}>
          {u.status.charAt(0) + u.status.slice(1).toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "2fa",
      header: "2FA",
      cell: (u) => <Badge tone={u.twoFactorEnabled ? "success" : "warning"}>{u.twoFactorEnabled ? "On" : "Off"}</Badge>,
    },
    { key: "seen", header: "Last sign-in", cell: (u) => (u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "Never") },
  ];

  return (
    <div>
      <PageHeader
        title="Users & roles"
        description="Staff accounts for the admin console. Buyers never have accounts — the only member-facing artefact is the Proof of Membership email."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Users & roles" }]}
        actions={<Button disabled={!canManage} title={canManage ? "Invite flow in Phase 3" : "Requires Admin"}>Invite user</Button>}
      />
      <UsersTabs />

      <Card>
        <CardBody>
          <DataTable caption="Admin users" columns={columns} rows={listAdminUsers()} />
        </CardBody>
      </Card>

      <p className="mt-3 text-xs text-ink-muted">
        Phase 3: mandatory TOTP 2FA for every role, invite-only onboarding,
        suspend / reset-2FA controls, and forced sign-out on role change.
      </p>
    </div>
  );
}
