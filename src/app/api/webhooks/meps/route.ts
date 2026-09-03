import { db } from "@/lib/db";
import { capturePayment } from "@/lib/payments";

/**
 * MEPS payment notification (IPN / webhook) endpoint.
 *
 * ⚠️ PHASE 3 — the parsing, signature verification and field names below are
 * PLACEHOLDERS pending the official MEPS Integration Manual. The structure is
 * ready: verify signature → dedupe via WebhookEvent → capturePayment().
 *
 * The endpoint is disabled unless MEPS_MODE is set, so a stray POST can't create
 * memberships before the integration is configured.
 */
export async function POST(req: Request) {
  if (!process.env.MEPS_MODE) {
    return new Response("MEPS not configured", { status: 501 });
  }

  const raw = await req.text();

  // TODO(phase-3): verifyMepsSignature(raw, req.headers) per the MEPS manual.
  const signatureValid = false;

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  const providerRef = String(payload.transactionId ?? payload.tranid ?? "");
  const reference = String(payload.orderRef ?? payload.trackid ?? "");
  const dedupeKey = `meps:${providerRef || reference}`;

  const existing = await db.webhookEvent.findUnique({ where: { dedupeKey } });
  if (existing?.processedAt) return Response.json({ ok: true, deduped: true });

  const event =
    existing ??
    (await db.webhookEvent.create({
      data: { provider: "MEPS", dedupeKey, signatureValid, payload: raw },
    }));

  if (!signatureValid) {
    await db.webhookEvent.update({ where: { id: event.id }, data: { result: "error", error: "signature not verified" } });
    return new Response("Invalid signature", { status: 400 });
  }

  const result = await capturePayment(reference, { providerRef, rawResponse: payload });
  await db.webhookEvent.update({
    where: { id: event.id },
    data: {
      processedAt: new Date(),
      result: result.ok ? "ok" : "error",
      error: result.ok ? null : result.reason,
    },
  });

  return Response.json({ ok: result.ok });
}
