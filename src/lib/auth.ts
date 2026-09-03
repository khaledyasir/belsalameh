import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getAdmin, verifyCredentials } from "./admin-store";

/**
 * ⚠️ PHASE 1 AUTH — single admin account, username + password.
 *
 * The session is a stateless signed cookie: `<username>.<hmac>` where the hmac
 * is HMAC-SHA256(username, AUTH_SECRET). Credentials live in the file-based
 * admin store (src/lib/admin-store.ts).
 *
 * Phase 3 replacement: Auth.js (Credentials provider), Argon2id hashing, a
 * hashed row in the database, mandatory TOTP 2FA, and step-up re-auth for
 * sensitive actions. `getSession()` / `signIn()` / `signOut()` keep their shape.
 */

const COOKIE = "bsl_admin_session";
const secret = () => process.env.AUTH_SECRET || "dev-only-secret";

export type Session = {
  user: { username: string; name: string; email: string };
};

function sign(username: string): string {
  return createHmac("sha256", secret()).update(username).digest("hex");
}

function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  const username = token.slice(0, idx);
  const mac = token.slice(idx + 1);
  const expected = sign(username);
  const a = Buffer.from(mac, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return username;
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const username = verifyToken(store.get(COOKIE)?.value);
  if (!username) return null;
  const admin = await getAdmin();
  if (admin.username.toLowerCase() !== username.toLowerCase()) return null;
  return { user: { username: admin.username, name: admin.name, email: admin.email } };
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  return session;
}

/** Returns true on success. */
export async function signIn(username: string, password: string): Promise<boolean> {
  if (!(await verifyCredentials(username, password))) return false;
  const admin = await getAdmin();
  const store = await cookies();
  store.set(COOKIE, `${admin.username}.${sign(admin.username)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * Number(process.env.AUTH_SESSION_TTL_MINUTES ?? 45),
  });
  return true;
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
