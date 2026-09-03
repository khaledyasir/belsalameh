import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { launchReadiness } from "@/lib/mock-data";
import { SettingsTabs } from "../tabs";

export const metadata: Metadata = { title: "Settings · Launch readiness" };

export default async function LaunchReadinessPage() {
  const { allowed, role } = await guard("settings:view");
  if (!allowed) return <PermissionDenied area="settings" />;

  const { items, ready, total, canGoLive } = launchReadiness();
  const pct = Math.round((ready / total) * 100);
  const byArea = items.reduce<Record<string, typeof items>>((acc, it) => {
    (acc[it.area] ??= []).push(it);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Launch readiness"
        description="Every placeholder and unset requirement that must be resolved before the public website can go live. The go-live toggle stays disabled until this list is complete."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings", href: "/admin/settings" }, { label: "Launch readiness" }]}
      />
      <SettingsTabs />

      <Card className="mb-4">
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-ink">{ready} of {total} ready</span>
              <span className="text-ink-muted">{pct}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-brand-indigo" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <Button disabled={!canGoLive || role !== "OWNER"} title={role !== "OWNER" ? "Only the Owner can toggle go-live" : "Complete every item first"}>
            {canGoLive ? "Go live" : "Go live (blocked)"}
          </Button>
        </CardBody>
      </Card>

      <div className="space-y-4">
        {Object.entries(byArea).map(([area, list]) => (
          <Card key={area}>
            <CardBody>
              <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wide text-ink-subtle">{area}</h2>
              <ul className="divide-y divide-border">
                {list.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 py-2.5">
                    {it.ready ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-label="ready" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-label="not ready" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink">{it.label}</p>
                      <p className="text-xs text-ink-muted">{it.hint}</p>
                    </div>
                    <Badge tone={it.ready ? "success" : "warning"}>{it.ready ? "Ready" : "Pending"}</Badge>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
