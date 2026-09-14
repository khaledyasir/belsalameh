import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { DataTable, Pagination, type Column } from "@/components/ui/data-table";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { TransactionStatusBadge } from "@/components/ui/status-badge";
import { listTransactions, type Transaction, type TransactionStatus } from "@/lib/queries";
import { formatMoney, formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Transactions" };

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "CAPTURED", label: "Captured" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await guard();

  const sp = await searchParams;
  const q = sp.q ?? "";
  const status = (sp.status || "ALL") as TransactionStatus | "ALL";
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const { rows, total, pageSize } = await listTransactions({ q, status, page });

  const columns: Column<Transaction>[] = [
    { key: "ref", header: "Reference", cell: (t) => <span className="font-mono text-xs">{t.reference}</span> },
    { key: "name", header: "Name", cell: (t) => t.fullName },
    { key: "email", header: "Email", cell: (t) => <span className="text-ink-muted">{t.email}</span> },
    { key: "amount", header: "Amount", cell: (t) => formatMoney(t.amountMinor, t.currency) },
    { key: "status", header: "Status", cell: (t) => <TransactionStatusBadge status={t.status} /> },
    { key: "date", header: "Created", cell: (t) => formatDateTime(t.createdAt) },
  ];

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (status !== "ALL") qs.set("status", status);
  const baseHref = `/admin/transactions${qs.toString() ? `?${qs}` : ""}`;

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Created PENDING at checkout and moved to CAPTURED on payment confirmation. Amounts use the placeholder membership price / currency until confirmed; MEPS webhook confirmation lands in Phase 3."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Transactions" }]}
      />

      <TableToolbar
        action="/admin/transactions"
        q={q}
        filters={[{ name: "status", label: "Status", value: sp.status, options: STATUS_OPTIONS }]}
      />

      <Card>
        <CardBody>
          <DataTable
            caption="All transactions"
            columns={columns}
            rows={rows}
            rowHref={(t) => `/admin/transactions/${t.id}`}
            empty={{ title: "No transactions match" }}
          />
          <Pagination page={page} pageSize={pageSize} total={total} baseHref={baseHref} />
        </CardBody>
      </Card>
    </div>
  );
}
