import "server-only";
import { headers } from "next/headers";

/**
 * Fixed-window in-memory rate limiter.
 *
 * ponytail: per-instance (a Map in process memory). Fine for a single Node
 * server or a low-traffic serverless deploy; move the counter to Vercel KV /
 * Upstash Redis if the app ever runs multi-instance.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** Returns true if the action is allowed, false if the caller is over the limit. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (now >= v.resetAt) buckets.delete(k);
    }
    return true;
  }
  if (b.count >= limit) return false;
  b.count++;
  return true;
}

/** Best-effort client IP from proxy headers (Vercel / ngrok set x-forwarded-for). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
