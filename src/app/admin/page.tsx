import type { Metadata } from "next";
import Link from "next/link";
import { guard } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { StatTile } from "@/components/dashboard/stat-tile";
import { MembersTrend } from "@/components/dashboard/members-trend";
import { DataTable, type Column } from "@/components/ui/data-table";
import { MemberStatusBadge, TransactionStatusBadge } from "@/components/ui/status-badge";
import { getDashboardData, type Member, type Transaction } from "@/lib/mock-data";
import { formatMoney, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  await guard();
  const d = getDashboardData();

  const memberCols: Column<Member>[] = [
    { key: "name", header: "Member", cell: (m) => m.fullName },
    { key: "id", header: "Membership ID", cell: (m) => <span className="font-mono text-xs">{m.membershipId}</span> },
    { key: "status", header: "Status", cell: (m) => <MemberStatusBadge status={m.status} /> },
    { key: "date", header: "Joined", cell: (m) => formatDate(m.purchasedAt) },
  ];
  const txnCols: Column<Transaction>[] = [
    { key: "ref", header: "Reference", cell: (t) => <span className="font-mono text-xs">{t.reference}</span> },
    { key: "name", header: "Name", cell: (t) => t.fullName },
    { key: "amount", header: "Amount", cell: (t) => formatMoney(t.amountMinor, t.currency) },
    { key: "status", header: "Status", cell: (t) => <TransactionStatusBadge status={t.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of membership activity. All figures are sample data until the database and payment gateway are connected (Phase 3)."
        actions={
          <>
            <Link href="/admin/members/verify" className={buttonClasses("secondary")}>
              Verify a member
            </Link>
            <Link href="/admin/members" className={buttonClasses("primary")}>
              View members
            </Link>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Active memberships" value={String(d.kpis.activeMembers)} sample={false} />
        <StatTile label="Expiring · 60 days" value={String(d.kpis.expiringSoon)} tone="accent" sample={false} />
        <StatTile label="Revenue · 30 days" value={formatMoney(d.kpis.revenue30dMinor, "JOD")} sub="Placeholder price × volume" tone="accent" />
        <StatTile label="Success rate" value={`${d.kpis.paymentSuccessRate}%`} sub="Captured ÷ all attempts" />
        <StatTile label="Failed / pending" value={String(d.kpis.failedPending)} sample={false} />
      </div>

      {/* New members trend with selectable range */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>New members</CardTitle>
        </CardHeader>
        <CardBody>
          <MembersTrend series={d.newMembersSeries} />
        </CardBody>
      </Card>

      {/* Recent tables */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent members</CardTitle>
            <Link href="/admin/members" className="text-sm text-brand-indigo hover:underline">
              All members
            </Link>
          </CardHeader>
          <CardBody>
            <DataTable
              caption="Most recent members"
              columns={memberCols}
              rows={d.recentMembers}
              rowHref={(m) => `/admin/members/${m.id}`}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
            <Link href="/admin/transactions" className="text-sm text-brand-indigo hover:underline">
              All transactions
            </Link>
          </CardHeader>
          <CardBody>
            <DataTable
              caption="Most recent transactions"
              columns={txnCols}
              rows={d.recentTransactions}
              rowHref={(t) => `/admin/transactions/${t.id}`}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
