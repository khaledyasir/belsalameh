import { redirect } from "next/navigation";
import { getSession, type Session } from "./auth";

/**
 * Auth gate for admin pages, route handlers and server actions.
 * Phase 1 has a single admin account, so this only enforces authentication.
 * (Role-based checks were removed at the project's request.)
 */
export async function guard(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
