import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db } from "./db";

/**
 * Admin account access (SQL Server, `AdminUsers` table).
 *
 * Passwords are stored as scrypt(salt, password) — `passwordHash` +
 * `passwordSalt` columns. No plaintext, no reversible encryption.
 */

export type AdminRecord = {
  id: string;
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
};

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

export function makeCredential(password: string): { passwordHash: string; passwordSalt: string } {
  const passwordSalt = randomBytes(16).toString("hex");
  return { passwordSalt, passwordHash: hashPassword(password, passwordSalt) };
}

export function verifyPassword(record: Pick<AdminRecord, "passwordHash" | "passwordSalt">, password: string): boolean {
  const attempt = Buffer.from(hashPassword(password, record.passwordSalt), "hex");
  const stored = Buffer.from(record.passwordHash, "hex");
  return attempt.length === stored.length && timingSafeEqual(attempt, stored);
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
  if (!admin || !verifyPassword(admin, currentPassword)) return false;
  await db.adminUser.update({ where: { id }, data: makeCredential(newPassword) });
  return true;
}
