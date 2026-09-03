import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { listWebhookEvents, type WebhookEvent } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Webhook / IPN log" };

export default async function WebhooksPage() {
  await guard();

  const rows = listWebhookEvents();

  const columns: Column<WebhookEvent>[] = [
    { key: "key", header: "Dedupe key", cell: (w) => <span className="font-mono text-xs">{w.dedupeKey}</span> },
    {
      key: "sig",
      header: "Signature",
      cell: (w) => <Badge tone={w.signatureValid ? "success" : "danger"}>{w.signatureValid ? "Valid" : "Invalid"}</Badge>,
    },
    {
      key: "result",
      header: "Result",
      cell: (w) => (
        <Badge tone={w.result === "ok" ? "success" : w.result === "ignored" ? "neutral" : "danger"}>{w.result}</Badge>
      ),
    },
    { key: "error", header: "Detail", cell: (w) => <span className="text-ink-muted">{w.error ?? "—"}</span> },
    { key: "at", header: "Received", cell: (w) => formatDateTime(w.createdAt) },
  ];

  return (
    <div>
      <PageHeader
        title="Webhook / IPN log"
        description="Every inbound payment notification from MEPS. Processing is idempotent — a repeated event with the same dedupe key is a no-op. Invalid-signature events are rejected."
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Transactions", href: "/admin/transactions" },
          { label: "Webhook / IPN log" },
        ]}
      />
      <Card>
        <CardBody>
          <DataTable caption="Webhook events" columns={columns} rows={rows} empty={{ title: "No events yet" }} />
        </CardBody>
      </Card>
    </div>
  );
}
