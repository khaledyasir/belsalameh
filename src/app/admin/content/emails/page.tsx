import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceholderBadge, PlaceholderNote } from "@/components/ui/placeholder-badge";
import { EMAIL_TEMPLATES } from "@/lib/mock-data";
import { ContentTabs } from "../tabs";

export const metadata: Metadata = { title: "Content · Email templates" };

export default async function EmailTemplatesPage() {
  const { allowed, role } = await guard("content:view");
  if (!allowed) return <PermissionDenied area="content" />;
  const canEdit = ["ADMIN", "OWNER"].includes(role);

  return (
    <div>
      <PageHeader
        title="Email templates"
        description="Transactional emails. The Proof of Membership email is the one required by the spec; it is sent automatically on successful payment (Phase 3)."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Content", href: "/admin/content" }, { label: "Email templates" }]}
      />
      <ContentTabs />

      <div className="space-y-4">
        {EMAIL_TEMPLATES.map((t) => (
          <Card key={t.key}>
            <CardHeader>
              <div>
                <CardTitle>Proof of Membership</CardTitle>
                <p className="mt-0.5 font-mono text-xs text-ink-subtle">{t.key}</p>
              </div>
              <div className="flex items-center gap-2">
                {t.isPlaceholder && <PlaceholderBadge />}
                <Button size="sm" variant="secondary" disabled={!canEdit}>
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Subject</p>
                <p className="text-sm text-ink">{t.subject}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Available tokens</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {t.variables.map((v) => (
                    <code key={v} className="rounded bg-surface-muted px-1.5 py-0.5 text-xs text-ink">
                      {v}
                    </code>
                  ))}
                </div>
              </div>
              <PlaceholderNote>{t.note}</PlaceholderNote>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
