import { getMembershipSettings } from "@/lib/membership-settings";

/** The plan on sale right now. Public (it is what the join pop-up shows) and never cached, so an admin change is live at once. */
export async function GET() {
  const { name, priceMinor, currency, durationMonths } = await getMembershipSettings();
  return Response.json({ name, priceMinor, currency, durationMonths }, { headers: { "Cache-Control": "no-store" } });
}
