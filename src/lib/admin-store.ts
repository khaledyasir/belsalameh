import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * ⚠️ PHASE 1 FILE-BASED ADMIN CREDENTIAL STORE.
 *
 * One admin account, persisted to `.data/admin.json` (gitignored). It is seeded
 * from ADMIN_* env vars on first run, then managed from Admin › My profile.
 *
 * Phase 3 replacement: a hashed credential row in the database, verified by
 * Auth.js. The exported functions keep the same signatures.
 */

export type AdminRecord = {
  username: string;
  name: string;
  email: string;
  salt: string;
  hash: string;
  updatedAt: string;
};

const FILE = path.join(process.cwd(), ".data", "admin.json");

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

function makeCredential(password: string): { salt: string; hash: string } {
  const salt = randomBytes(16).toString("hex");
  return { salt, hash: hashPassword(password, salt) };
}

async function seed(): Promise<AdminRecord> {
  const password = process.env.ADMIN_PASSWORD || "admin1234";
  const rec: AdminRecord = {
    username: process.env.ADMIN_USERNAME || "admin",
    name: process.env.ADMIN_NAME || "Administrator",
    email: process.env.ADMIN_EMAIL || "admin@balsalameh.example",
    ...makeCredential(password),
    updatedAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rec, null, 2), "utf8");
  return rec;
}

export async function getAdmin(): Promise<AdminRecord> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as AdminRecord;
  } catch {
    return seed();
  }
}

async function save(rec: AdminRecord): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify({ ...rec, updatedAt: new Date().toISOString() }, null, 2), "utf8");
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const rec = await getAdmin();
  if (username.trim().toLowerCase() !== rec.username.toLowerCase()) return false;
  const attempt = Buffer.from(hashPassword(password, rec.salt), "hex");
  const stored = Buffer.from(rec.hash, "hex");
  return attempt.length === stored.length && timingSafeEqual(attempt, stored);
}

export async function updateProfile(input: { name: string; email: string }): Promise<void> {
  const rec = await getAdmin();
  await save({ ...rec, name: input.name.trim(), email: input.email.trim() });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const rec = await getAdmin();
  if (!(await verifyCredentials(rec.username, currentPassword))) return false;
  await save({ ...rec, ...makeCredential(newPassword) });
  return true;
}
