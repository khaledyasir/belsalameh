import "server-only";
import { randomBytes, scrypt, timingSafeEqual, type BinaryLike, type ScryptOptions } from "node:crypto";
import { promisify } from "node:util";
import { db } from "./db";

/**
 * Admin account access (SQL Server, `AdminUsers` table).
 *
 * Passwords are stored as scrypt(salt, password) — `passwordHash` +
 * `passwordSalt` columns. No plaintext, no reversible encryption.
 *
 * `passwordHash` is `<N>$<hex>` so the work factor can be raised later without
 * locking out existing accounts; a bare hex string (no `$`) is a legacy hash at
 * the old default N=16384.
 */

const scryptAsync = promisify(scrypt) as (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
  options: ScryptOptions,
) => Promise<Buffer>;
const N = 32768; // ~33 MB work per hash; r/p fixed below
const R = 8;
const P = 1;
const KEYLEN = 64;
const MAXMEM = 64 * 1024 * 1024;

export type AdminRecord = {
  id: string;
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
};

/** A well-formed record to hash against when the username is unknown, so login
 *  timing does not reveal whether an account exists. */
const DUMMY_CREDENTIAL = { passwordHash: "0".repeat(128), passwordSalt: "0".repeat(32) };

async function deriveHash(password: string, salt: string, n = N): Promise<string> {
  const buf = await scryptAsync(password, salt, KEYLEN, { N: n, r: R, p: P, maxmem: MAXMEM });
  return buf.toString("hex");
}

export async function makeCredential(password: string): Promise<{ passwordHash: string; passwordSalt: string }> {
  const passwordSalt = randomBytes(16).toString("hex");
  return { passwordSalt, passwordHash: `${N}$${await deriveHash(password, passwordSalt)}` };
}

export async function verifyPassword(
  record: Pick<AdminRecord, "passwordHash" | "passwordSalt">,
  password: string,
): Promise<boolean> {
  const [nStr, hex] = record.passwordHash.includes("$")
    ? record.passwordHash.split("$")
    : ["16384", record.passwordHash];
  const attempt = Buffer.from(await deriveHash(password, record.passwordSalt, Number(nStr)), "hex");
  const stored = Buffer.from(hex, "hex");
  return attempt.length === stored.length && timingSafeEqual(attempt, stored);
}

/** Verify against a dummy record (constant-time padding for unknown usernames). */
export async function verifyDummy(password: string): Promise<void> {
  await verifyPassword(DUMMY_CREDENTIAL, password).catch(() => {});
}

export async function getAdminById(id: string): Promise<AdminRecord | null> {
  return db.adminUser.findUnique({ where: { id } });
}

export async function getAdminByUsername(username: string): Promise<AdminRecord | null> {
  return db.adminUser.findUnique({ where: { username: username.trim().toLowerCase() } });
}

export async function recordLogin(id: string): Promise<void> {
  await db.adminUser.update({ where: { id }, data: { lastLoginAt: new Date() } });
}

export async function updateProfile(id: string, input: { name: string; email: string }): Promise<void> {
  await db.adminUser.update({
    where: { id },
    data: { name: input.name.trim(), email: input.email.trim().toLowerCase() },
  });
}

/** Returns true on success (current password matched). */
export async function changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
  const admin = await getAdminById(id);
  if (!admin || !(await verifyPassword(admin, currentPassword))) return false;
  await db.adminUser.update({ where: { id }, data: await makeCredential(newPassword) });
  return true;
}

/** Append-only audit trail. Failures are swallowed — never block the action. */
export async function audit(
  action: string,
  opts: { actorId?: string; entity?: string; entityId?: string; detail?: string } = {},
): Promise<void> {
  await db.auditLog
    .create({
      data: {
        action,
        entity: opts.entity ?? "AdminUser",
        entityId: opts.entityId ?? "-",
        detail: opts.detail,
        actorId: opts.actorId,
      },
    })
    .catch(() => {});
}
