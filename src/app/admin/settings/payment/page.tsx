import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceholderNote } from "@/components/ui/placeholder-badge";
import { SettingsTabs } from "../tabs";
import { SettingsGroup } from "@/components/admin/settings-group";
import { getSetting } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Settings · Payment gateway" };

export default async function PaymentSettingsPage() {
  const { allowed, role } = await guard("settings:view");
  if (!allowed) return <PermissionDenied area="settings" />;
  const canEditGateway = role === "OWNER"; // settings:gateway

  const mode = String(getSetting("gateway.mode") ?? "TEST");

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Payment gateway"
        description="MEPS integration configuration. Credentials are held in a secret manager, never in the database. Gateway credential edits require the Owner role and step-up re-auth."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings", href: "/admin/settings" }, { label: "Payment gateway" }]}
        actions={<Badge tone={mode === "LIVE" ? "danger" : "warning"} className="uppercase">{mode} mode</Badge>}
      />
      <SettingsTabs />

      <PlaceholderNote>
        Integration is Phase 3. Blocked on the official <strong>MEPS Integration
        Manual / API docs</strong> and merchant credentials for both TEST and LIVE:
        hosted-page vs. direct API, request-signing hash algorithm, IPN/webhook
        schema, return-URL configuration, 3-D Secure behaviour, currency, and the
        refund API.
      </PlaceholderNote>

      <div className="mt-4">
        <SettingsGroup group="gateway" canEdit={canEditGateway} />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Go-live checklist (Phase 3)</CardTitle>
        </CardHeader>
        <CardBody>
          <ul className="space-y-1.5 text-sm text-ink-muted">
            {[
              "Separate TEST and LIVE credentials stored in the secret manager",
              "Webhook / IPN endpoint URL registered with MEPS",
              "Signature verification confirmed against MEPS test vectors",
              "Amount + currency + order-reference assertions in the handler",
              "Idempotency test: duplicate IPN is a no-op",
              "Reconciliation job scheduled for stuck PENDING transactions",
              "PCI SAQ-A documented (hosted page — no card data on our servers)",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-ink-subtle">☐</span>
                {item}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
