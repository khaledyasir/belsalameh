import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { audit, getAdminById, getAdminByUsername, recordLogin, verifyDummy, verifyPassword } from "./admin-store";

/**
 * Admin session — a stateless signed cookie: `<adminId>.<hmac>` where the hmac
 * is HMAC-SHA256(`<adminId>.<passwordSalt>`, AUTH_SECRET). Binding the mac to the
 * password salt means a password change (which rotates the salt) invalidates
 * every existing session. Credentials live in the AdminUsers table.
 *
 * Phase 3 can swap this for Auth.js + TOTP 2FA; `getSession` / `signIn` /
 * `signOut` keep their shape.
 */

const COOKIE = "bsl_admin_session";

/** HMAC key for the session cookie. Hard-fails in production if unset/weak so a
 *  misconfigured deploy can't fall back to a publicly-known secret. */
const secret = () => {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be set to a random string of at least 32 characters in production");
  }
  return "dev-only-secret-not-for-production-000000";
};

export type Session = {
  user: { id: string; username: string; name: string; email: string };
};

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function macOK(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const idx = raw.lastIndexOf(".");
  if (idx <= 0) return null;

  const id = raw.slice(0, idx);
  const admin = await getAdminById(id);
  if (!admin) return null;
  if (!macOK(raw.slice(idx + 1), sign(`${id}.${admin.passwordSalt}`))) return null;

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
  // Always run a KDF pass so timing doesn't reveal whether the username exists.
  const ok = admin ? await verifyPassword(admin, password) : (await verifyDummy(password), false);
  if (!admin || !ok) return false;

  const store = await cookies();
  store.set(COOKIE, `${admin.id}.${sign(`${admin.id}.${admin.passwordSalt}`)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * Number(process.env.AUTH_SESSION_TTL_MINUTES ?? 45),
  });
  await recordLogin(admin.id).catch(() => {});
  await audit("admin.login", { actorId: admin.id, entityId: admin.id });
  return true;
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
