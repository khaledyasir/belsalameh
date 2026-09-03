import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { ALL_PERMISSIONS, ROLES, can, roleLabel } from "@/lib/rbac";
import { Check, Minus } from "lucide-react";
import { UsersTabs } from "../tabs";

export const metadata: Metadata = { title: "Roles & permissions" };

export default async function RolesPage() {
  const { allowed } = await guard("users:view");
  if (!allowed) return <PermissionDenied area="roles & permissions" />;

  const roles = ROLES.slice().reverse();

  return (
    <div>
      <PageHeader
        title="Roles & permissions"
        description="Fixed role set for Phase 1. Server actions re-check these independently of the UI. Custom roles can be added later if needed."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Users & roles", href: "/admin/users" }, { label: "Roles & permissions" }]}
      />
      <UsersTabs />

      <Card>
        <CardBody className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-sm">
              <caption className="sr-only">Permission matrix by role</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                    Permission
                  </th>
                  {roles.map((r) => (
                    <th key={r} scope="col" className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                      {roleLabel(r)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ALL_PERMISSIONS.map((perm) => (
                  <tr key={perm.key}>
                    <th scope="row" className="px-4 py-2.5 text-left font-normal text-ink">
                      {perm.label}
                      <span className="ml-2 font-mono text-[0.7rem] text-ink-subtle">{perm.key}</span>
                    </th>
                    {roles.map((r) => (
                      <td key={r} className="px-3 py-2.5 text-center">
                        {can(r, perm.key) ? (
                          <Check className="mx-auto h-4 w-4 text-success" aria-label="allowed" />
                        ) : (
                          <Minus className="mx-auto h-4 w-4 text-ink-subtle/50" aria-label="not allowed" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
