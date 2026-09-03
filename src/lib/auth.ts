import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getAdminById, getAdminByUsername, recordLogin, verifyPassword } from "./admin-store";

/**
 * Admin session — a stateless signed cookie: `<adminId>.<hmac>` where the hmac
 * is HMAC-SHA256(adminId, AUTH_SECRET). Credentials live in the AdminUsers
 * table (see admin-store.ts).
 *
 * Phase 3 can swap this for Auth.js + TOTP 2FA; `getSession` / `signIn` /
 * `signOut` keep their shape.
 */

const COOKIE = "bsl_admin_session";
const secret = () => process.env.AUTH_SECRET || "dev-only-secret";

export type Session = {
  user: { id: string; username: string; name: string; email: string };
};

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  const id = token.slice(0, idx);
  const mac = Buffer.from(token.slice(idx + 1), "hex");
  const expected = Buffer.from(sign(id), "hex");
  if (mac.length !== expected.length || !timingSafeEqual(mac, expected)) return null;
  return id;
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const id = verifyToken(store.get(COOKIE)?.value);
  if (!id) return null;
  const admin = await getAdminById(id);
  if (!admin) return null;
  return { user: { id: admin.id, username: admin.username, name: admin.name, email: admin.email } };
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  return session;
}

/** Returns true on success. */
export async function signIn(username: string, password: string): Promise<boolean> {
  const admin = await getAdminByUsername(username);
  if (!admin || !verifyPassword(admin, password)) return false;

  const store = await cookies();
  store.set(COOKIE, `${admin.id}.${sign(admin.id)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * Number(process.env.AUTH_SESSION_TTL_MINUTES ?? 45),
  });
  await recordLogin(admin.id).catch(() => {});
  return true;
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
