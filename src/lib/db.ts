import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton (SQL Server), constructed lazily so that importing
 * this module never throws when `DATABASE_URL` is absent (e.g. during a build
 * before the database is configured). The first actual query is what connects.
 *
 * Connection string, e.g.:
 *   sqlserver://localhost:1433;database=balsalameh;user=sa;password=Pass;encrypt=true;trustServerCertificate=true
 *
 * After editing schema.prisma:  npm run prisma:generate  (then  npm run db:push)
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let client: PrismaClient | undefined;
function getClient(): PrismaClient {
  if (client) return client;
  client =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});

export function dbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
