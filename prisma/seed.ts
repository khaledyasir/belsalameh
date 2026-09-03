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
import { randomBytes, scryptSync } from "node:crypto";

const db = new PrismaClient();

function makeCredential(password: string) {
  const passwordSalt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, passwordSalt, 64).toString("hex");
  return { passwordHash, passwordSalt };
}

async function main() {
  const username = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin1234";
  const email = (process.env.ADMIN_EMAIL || "admin@balsalameh.example").toLowerCase();
  const name = process.env.ADMIN_NAME || "Administrator";

  const existing = await db.adminUser.findUnique({ where: { username } });

  if (!existing) {
    await db.adminUser.create({ data: { username, email, name, ...makeCredential(password) } });
    console.log(`Created admin "${username}".`);
  } else {
    await db.adminUser.update({
      where: { username },
      data: { email, name, ...makeCredential(password) },
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
