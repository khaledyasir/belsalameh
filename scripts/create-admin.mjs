/**
 * One-time admin bootstrap for release-bundle deploys (where the Prisma CLI /
 * `npm run db:seed` are not available). Same result as `prisma/seed.ts`.
 *
 *   node --env-file=.env scripts/create-admin.mjs
 *
 * Reads ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_EMAIL / ADMIN_NAME + DATABASE_URL.
 * Idempotent: updates the account if it already exists.
 */
import { PrismaClient } from "@prisma/client";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const N = 32768; // must match src/lib/admin-store.ts

async function makeCredential(password) {
  const passwordSalt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, passwordSalt, 64, { N, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return { passwordSalt, passwordHash: `${N}$${buf.toString("hex")}` };
}

const db = new PrismaClient();
const username = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
const email = (process.env.ADMIN_EMAIL || "admin@belsalameh.com").toLowerCase();
const name = process.env.ADMIN_NAME || "Administrator";
const password = process.env.ADMIN_PASSWORD;

if (!password) {
  console.error("ADMIN_PASSWORD is not set (check .env / --env-file).");
  process.exit(1);
}

const cred = await makeCredential(password);
const existing = await db.adminUser.findUnique({ where: { username } });
if (existing) {
  await db.adminUser.update({ where: { username }, data: { email, name, ...cred } });
  console.log(`Updated admin "${username}".`);
} else {
  await db.adminUser.create({ data: { username, email, name, ...cred } });
  console.log(`Created admin "${username}".`);
}
await db.$disconnect();
