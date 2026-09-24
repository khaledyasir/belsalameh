import { createHash, timingSafeEqual } from "node:crypto";
import { sendMembershipEndedEmails } from "@/lib/expiry-emails";

const digest = (s: string) => createHash("sha256").update(s).digest();

/**
 * Daily job: emails members whose membership has ended. Called by a scheduler (see DEPLOY.md)
 * with `Authorization: Bearer <CRON_SECRET>`. Refuses to run at all if CRON_SECRET is not set.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return new Response("CRON_SECRET is not configured", { status: 503 });

  const given = req.headers.get("authorization") ?? "";
  if (!timingSafeEqual(digest(given), digest(`Bearer ${secret}`))) return new Response("Unauthorised", { status: 401 });

  return Response.json(await sendMembershipEndedEmails());
}
