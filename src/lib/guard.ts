import { redirect } from "next/navigation";
import { getSession } from "./auth";
import { can, type Permission, type Role } from "./rbac";

/**
 * Server-side permission gate for admin pages and actions.
 * UI hiding (RoleGate / nav filtering) is convenience only — this is the
 * boundary. Every page calls it; every server action must call it too.
 */
export async function guard(permission: Permission): Promise<{ role: Role; name: string; allowed: boolean }> {
  const session = await getSession();
  if (!session) redirect("/login");
  return {
    role: session.user.role,
    name: session.user.name,
    allowed: can(session.user.role, permission),
  };
}
