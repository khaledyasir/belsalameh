import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionStatusBadge } from "@/components/ui/status-badge";
import { getTransaction, getMember } from "@/lib/mock-data";
import { formatMoney, formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Transaction" };

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { allowed, role } = await guard("transactions:view");
  if (!allowed) return <PermissionDenied area="transactions" />;

  const { id } = await params;
  const txn = getTransaction(id);
  if (!txn) notFound();

  const member = txn.memberId ? getMember(txn.memberId) : null;
  const canRefund = (role === "FINANCE" || role === "ADMIN" || role === "OWNER") && txn.status === "CAPTURED";

  const timeline = [
    { label: "Transaction created", at: txn.createdAt, done: true },
    { label: "Redirected to MEPS hosted page", at: txn.createdAt, done: true },
    { label: "Gateway response received", at: txn.ipnReceivedAt, done: Boolean(txn.ipnReceivedAt) },
    {
      label: txn.status === "CAPTURED" ? "Payment captured (IPN verified)" : txn.status === "FAILED" ? "Payment failed" : "Awaiting IPN",
      at: txn.ipnReceivedAt,
      done: txn.status === "CAPTURED" || txn.status === "FAILED",
    },
    { label: "Member created + Proof of Membership email queued", at: member?.purchasedAt ?? null, done: Boolean(member) },
  ];

  return (
    <div>
      <PageHeader
        title={txn.reference}
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Transactions", href: "/admin/transactions" }, { label: txn.reference }]}
        actions={
          <>
            <Button variant="secondary" disabled title="Wired in Phase 3">
              Re-check with gateway
            </Button>
            {canRefund && (
              <Button variant="danger" disabled title="Requires step-up re-auth; wired in Phase 3">
                Refund
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <TransactionStatusBadge status={txn.status} />
          </CardHeader>
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Detail label="Amount" value={formatMoney(txn.amountMinor, txn.currency)} />
            <Detail label="Provider" value={txn.provider} />
            <Detail label="Gateway reference" value={txn.providerRef ? <span className="font-mono">{txn.providerRef}</span> : "—"} />
            <Detail label="Created" value={formatDateTime(txn.createdAt)} />
            <Detail label="Name on order" value={txn.fullName} />
            <Detail label="Email" value={txn.email} />
            {txn.failureReason && <Detail label="Failure reason" value={<span className="text-danger">{txn.failureReason}</span>} />}
            <Detail
              label="Member"
              value={
                member ? (
                  <Link href={`/admin/members/${member.id}`} className="text-brand-indigo hover:underline">
                    {member.fullName} ({member.membershipId})
                  </Link>
                ) : (
                  "Not created"
                )
              }
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardBody>
            <ol className="space-y-3">
              {timeline.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${t.done ? "bg-success" : "bg-border"}`}
                    aria-hidden
                  />
                  <div>
                    <p className={`text-sm ${t.done ? "text-ink" : "text-ink-subtle"}`}>{t.label}</p>
                    {t.at && <p className="text-xs text-ink-muted">{formatDateTime(t.at)}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Raw gateway payloads</CardTitle>
          <span className="text-xs text-ink-subtle">Stored for dispute handling; purged after the retention window</span>
        </CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded bg-brand-indigo/95 p-4 text-xs text-brand-cream">
{JSON.stringify(
  {
    request: { order: txn.reference, amount: txn.amountMinor, currency: txn.currency, note: "PLACEHOLDER — real field names come from the MEPS manual" },
    response: txn.providerRef ? { transactionId: txn.providerRef, result: txn.status } : null,
  },
  null,
  2,
)}
          </pre>
        </CardBody>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-subtle">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}
