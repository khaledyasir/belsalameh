import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guard } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Button, buttonClasses } from "@/components/ui/button";
import { MemberStatusBadge } from "@/components/ui/status-badge";
import { getMember, getTransaction, listEmailLogs } from "@/lib/mock-data";
import { formatDateTime, formatMoney } from "@/lib/format";
import { EmailStatusBadge } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "Member" };

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await guard();

  const { id } = await params;
  const member = getMember(id);
  if (!member) notFound();

  const txn = member.transactionId ? getTransaction(member.transactionId) : null;
  const emails = listEmailLogs().filter((e) => e.memberId === member.id);

  return (
    <div>
      <PageHeader
        title={member.fullName}
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Members", href: "/admin/members" }, { label: member.fullName }]}
        actions={
          <>
            <Link href={`/admin/members/verify?q=${encodeURIComponent(member.membershipId)}`} className={buttonClasses("secondary")}>
              Open in verifier
            </Link>
            <Button variant="secondary" disabled title="Wired in Phase 3">
              Resend proof email
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Core stored record */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stored record</CardTitle>
            <span className="text-xs text-ink-subtle">The four fields the spec permits</span>
          </CardHeader>
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Detail label="Full name (as on passport)" value={member.fullName} />
            <Detail label="Email address" value={member.email} />
            <Detail label="Membership ID" value={<span className="font-mono">{member.membershipId}</span>} />
            <Detail label="Expiry" value={member.expiryLabel} />
          </CardBody>
        </Card>

        {/* Operational (system-derived) */}
        <Card>
          <CardHeader>
            <CardTitle>System</CardTitle>
            <span className="text-xs text-ink-subtle">Derived — not subscriber data</span>
          </CardHeader>
          <CardBody className="space-y-3">
            <Detail label="Status" value={<MemberStatusBadge status={member.status} />} />
            <Detail label="Purchased" value={formatDateTime(member.purchasedAt)} />
            <Detail
              label="Source transaction"
              value={
                txn ? (
                  <Link href={`/admin/transactions/${txn.id}`} className="font-mono text-brand-indigo hover:underline">
                    {txn.reference}
                  </Link>
                ) : (
                  "—"
                )
              }
            />
            {txn && <Detail label="Amount paid" value={formatMoney(txn.amountMinor, txn.currency)} />}
          </CardBody>
        </Card>
      </div>

      {/* Proof of Membership email history */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Proof of Membership emails</CardTitle>
        </CardHeader>
        <CardBody>
          {emails.length === 0 ? (
            <p className="text-sm text-ink-muted">No emails logged for this member yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {emails.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-ink">{e.subject}</p>
                    <p className="text-xs text-ink-muted">
                      {e.toAddress} · {formatDateTime(e.createdAt)}
                    </p>
                  </div>
                  <EmailStatusBadge status={e.status} />
                </li>
              ))}
            </ul>
          )}
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
