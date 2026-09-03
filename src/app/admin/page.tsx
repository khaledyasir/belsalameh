import type { Metadata } from "next";
import Link from "next/link";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/dashboard/stat-tile";
import { TrendBars } from "@/components/dashboard/trend-chart";
import { DataTable, type Column } from "@/components/ui/data-table";
import { MemberStatusBadge, TransactionStatusBadge } from "@/components/ui/status-badge";
import { getDashboardData, type Member, type Transaction } from "@/lib/mock-data";
import { formatMoney, formatDate, relativeTime } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { allowed } = await guard("dashboard:view");
  if (!allowed) return <PermissionDenied area="the dashboard" />;

  const d = getDashboardData();
  const spark = d.signupsByDay.map((x) => x.count);

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
        description="Overview of membership activity. All figures below are sample data until the database and payment gateway are connected (Phase 3)."
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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="New · today" value={String(d.kpis.newMembersToday)} sub="vs. 7-day average" spark={spark.slice(-10)} />
        <StatTile label="New · 30 days" value={String(d.kpis.newMembers30d)} spark={spark} />
        <StatTile label="Revenue · 30 days" value={formatMoney(d.kpis.revenue30dMinor, "JOD")} sub="Placeholder price × volume" tone="accent" />
        <StatTile label="Success rate" value={`${d.kpis.paymentSuccessRate}%`} sub="Captured ÷ all attempts" />
        <StatTile label="Active memberships" value={String(d.kpis.activeMembers)} sample={false} />
        <StatTile label="Expiring · 60 days" value={String(d.kpis.expiringSoon)} tone="accent" sample={false} />
        <StatTile label="New · 7 days" value={String(d.kpis.newMembers7d)} spark={spark.slice(-7)} />
        <StatTile label="Failed / pending" value={String(d.recentTransactions.filter((t) => t.status !== "CAPTURED").length)} sample={false} />
      </div>

      {/* Charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sign-ups — last 30 days</CardTitle>
          </CardHeader>
          <CardBody>
            <TrendBars
              data={d.signupsByDay.map((x) => ({
                date: x.date,
                value: x.count,
                label: `${x.count} sign-up${x.count === 1 ? "" : "s"}`,
              }))}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue — last 30 days</CardTitle>
          </CardHeader>
          <CardBody>
            <TrendBars
              data={d.revenueByDay.map((x) => ({
                date: x.date,
                value: x.amountMinor,
                label: formatMoney(x.amountMinor, "JOD"),
              }))}
              hue="#6D5FA3"
            />
          </CardBody>
        </Card>
      </div>

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

      {/* System health */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>System health</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Health label="Gateway mode" value={d.health.gatewayMode} tone={d.health.gatewayMode === "LIVE" ? "danger" : "warning"} />
          <Health label="Last webhook" value={d.health.lastWebhookAt ? relativeTime(d.health.lastWebhookAt) : "—"} tone="info" />
          <Health label="Last proof email" value={d.health.lastEmailAt ? relativeTime(d.health.lastEmailAt) : "—"} tone="info" />
          <Health
            label="Email provider"
            value={d.health.emailProviderConfigured ? "Configured" : "Not configured"}
            tone={d.health.emailProviderConfigured ? "success" : "warning"}
          />
        </CardBody>
      </Card>
    </div>
  );
}

function Health({ label, value, tone }: { label: string; value: string; tone: "success" | "warning" | "danger" | "info" }) {
  return (
    <div className="rounded border border-border p-3">
      <p className="text-xs text-ink-subtle">{label}</p>
      <div className="mt-1.5">
        <Badge tone={tone}>{value}</Badge>
      </div>
    </div>
  );
}
