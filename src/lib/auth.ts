import { cookies } from "next/headers";
import type { Role } from "./rbac";
import { ROLES } from "./rbac";

/**
 * ⚠️ PHASE 0 AUTH STUB — NOT A REAL AUTH SYSTEM.
 *
 * This module exists so the admin console is reviewable and RBAC is
 * demonstrable now. It reads a single unsigned cookie holding a demo role.
 *
 * Phase 3 replacement plan:
 *  - Swap for Auth.js (NextAuth) with the Credentials provider.
 *  - Argon2id password hashing (AdminUser.passwordHash).
 *  - Mandatory TOTP 2FA (AdminUser.twoFactorSecret / twoFactorEnabled).
 *  - Signed, httpOnly, Secure, SameSite=Lax session cookie.
 *  - Idle + absolute session lifetime (AUTH_SESSION_TTL_MINUTES).
 *  - Step-up re-auth for settings / gateway / refunds / role changes.
 * The `getSession()` / `signIn()` / `signOut()` surface below stays the same,
 * so calling code does not change.
 */

const COOKIE = "bsl_admin_demo_role";

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    twoFactorEnabled: boolean;
  };
};

const DEMO_USERS: Record<Role, Session["user"]> = {
  OWNER: { id: "u_owner", name: "Dana Owner", email: "owner@balsalameh.example", role: "OWNER", twoFactorEnabled: true },
  ADMIN: { id: "u_admin", name: "Adam Admin", email: "admin@balsalameh.example", role: "ADMIN", twoFactorEnabled: true },
  FINANCE: { id: "u_finance", name: "Farah Finance", email: "finance@balsalameh.example", role: "FINANCE", twoFactorEnabled: true },
  SUPPORT: { id: "u_support", name: "Sami Support", email: "support@balsalameh.example", role: "SUPPORT", twoFactorEnabled: false },
  VIEWER: { id: "u_viewer", name: "Vera Viewer", email: "viewer@balsalameh.example", role: "VIEWER", twoFactorEnabled: false },
};

function isRole(v: string | undefined): v is Role {
  return !!v && (ROLES as readonly string[]).includes(v);
}

/** Returns the current session, or null when signed out. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!isRole(raw)) return null;
  return { user: DEMO_USERS[raw] };
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  return session;
}

/** Stub sign-in: records the chosen demo role. */
export async function signIn(role: Role): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * Number(process.env.AUTH_SESSION_TTL_MINUTES ?? 45),
  });
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
