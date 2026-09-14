/**
 * Seeds the first admin account from .env, idempotently.
 *
 *   npm run prisma:generate      # once, and after schema changes
 *   npx prisma db push           # create the tables (or run db/mssql-schema.sql)
 *   npm run db:seed
 *
 * Reads ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_EMAIL / ADMIN_NAME.
 * Re-running updates the name/email and (if ADMIN_PASSWORD changed) the password.
 */
import { PrismaClient } from "@prisma/client";
import { randomBytes, scrypt, type BinaryLike, type ScryptOptions } from "node:crypto";
import { promisify } from "node:util";

const db = new PrismaClient();
const scryptAsync = promisify(scrypt) as (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
  options: ScryptOptions,
) => Promise<Buffer>;

// Must match src/lib/admin-store.ts (N + `<N>$<hex>` format).
const N = 32768;
async function makeCredential(password: string) {
  const passwordSalt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, passwordSalt, 64, { N, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return { passwordSalt, passwordHash: `${N}$${buf.toString("hex")}` };
}

async function main() {
  const username = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin1234";
  const email = (process.env.ADMIN_EMAIL || "admin@balsalameh.example").toLowerCase();
  const name = process.env.ADMIN_NAME || "Administrator";

  const existing = await db.adminUser.findUnique({ where: { username } });

  if (!existing) {
    await db.adminUser.create({ data: { username, email, name, ...(await makeCredential(password)) } });
    console.log(`Created admin "${username}".`);
  } else {
    await db.adminUser.update({
      where: { username },
      data: { email, name, ...(await makeCredential(password)) },
    });
    console.log(`Updated admin "${username}" (name, email, password).`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
