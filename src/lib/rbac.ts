/**
 * Role-based access control.
 *
 * Roles are ordered by privilege. UI uses `can()` to hide controls; every
 * server action / route handler MUST re-check independently — hidden UI is a
 * convenience, not a security boundary.
 */
export const ROLES = ["VIEWER", "SUPPORT", "FINANCE", "ADMIN", "OWNER"] as const;
export type Role = (typeof ROLES)[number];

export type Permission =
  | "dashboard:view"
  | "members:view"
  | "members:edit"
  | "members:verify"
  | "members:export"
  | "transactions:view"
  | "transactions:refund"
  | "webhooks:view"
  | "content:view"
  | "content:edit"
  | "content:publish"
  | "legal:publish"
  | "membership:configure"
  | "users:view"
  | "users:manage"
  | "audit:view"
  | "settings:view"
  | "settings:edit"
  | "settings:gateway"
  | "launch:toggle";

const MATRIX: Record<Role, Permission[]> = {
  VIEWER: ["dashboard:view", "members:view", "transactions:view", "content:view", "audit:view", "settings:view"],
  SUPPORT: [
    "dashboard:view", "members:view", "members:edit", "members:verify", "members:export",
    "transactions:view", "webhooks:view", "content:view", "audit:view", "settings:view",
  ],
  FINANCE: [
    "dashboard:view", "members:view", "members:verify", "members:export",
    "transactions:view", "transactions:refund", "webhooks:view",
    "content:view", "membership:configure", "audit:view", "settings:view",
  ],
  ADMIN: [
    "dashboard:view", "members:view", "members:edit", "members:verify", "members:export",
    "transactions:view", "transactions:refund", "webhooks:view",
    "content:view", "content:edit", "content:publish", "legal:publish", "membership:configure",
    "users:view", "users:manage", "audit:view", "settings:view", "settings:edit",
  ],
  OWNER: ["settings:gateway", "launch:toggle"], // plus everything ADMIN has (see `can`)
};

export const ALL_PERMISSIONS: { key: Permission; label: string }[] = [
  { key: "dashboard:view", label: "View dashboard" },
  { key: "members:view", label: "View members" },
  { key: "members:edit", label: "Edit member name / email" },
  { key: "members:verify", label: "Use member verifier" },
  { key: "members:export", label: "Export members CSV" },
  { key: "transactions:view", label: "View transactions" },
  { key: "transactions:refund", label: "Issue refunds" },
  { key: "webhooks:view", label: "View webhook / IPN log" },
  { key: "content:view", label: "View content" },
  { key: "content:edit", label: "Edit content" },
  { key: "content:publish", label: "Publish content" },
  { key: "legal:publish", label: "Publish legal documents" },
  { key: "membership:configure", label: "Configure membership product" },
  { key: "users:view", label: "View admin users" },
  { key: "users:manage", label: "Invite / manage admin users" },
  { key: "audit:view", label: "View activity log" },
  { key: "settings:view", label: "View settings" },
  { key: "settings:edit", label: "Edit settings" },
  { key: "settings:gateway", label: "Edit payment gateway credentials" },
  { key: "launch:toggle", label: "Toggle go-live" },
];

export function can(role: Role, permission: Permission): boolean {
  if (role === "OWNER") {
    return MATRIX.OWNER.includes(permission) || MATRIX.ADMIN.includes(permission);
  }
  return MATRIX[role]?.includes(permission) ?? false;
}

export function roleLabel(role: Role): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}
