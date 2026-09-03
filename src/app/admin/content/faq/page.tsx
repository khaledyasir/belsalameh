import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { FAQ_ITEMS } from "@/lib/mock-data";
import { ContentTabs } from "../tabs";

export const metadata: Metadata = { title: "Content · FAQ" };

export default async function FaqPage() {
  const { allowed, role } = await guard("content:view");
  if (!allowed) return <PermissionDenied area="content" />;
  const canEdit = ["ADMIN", "OWNER"].includes(role);

  return (
    <div>
      <PageHeader
        title="FAQ"
        description="Question-and-answer items shown on the public site. Ordering is drag-to-sort in the Phase 2 editor."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Content", href: "/admin/content" }, { label: "FAQ" }]}
        actions={<Button disabled={!canEdit}>Add question</Button>}
      />
      <ContentTabs />

      <Card>
        <CardBody className="divide-y divide-border">
          {FAQ_ITEMS.map((f) => (
            <div key={f.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{f.question}</p>
                <p className="truncate text-xs text-ink-muted">{f.answer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {f.isPlaceholder && <PlaceholderBadge />}
                <Badge tone={f.published ? "success" : "neutral"}>{f.published ? "Published" : "Draft"}</Badge>
                <Button size="sm" variant="secondary" disabled={!canEdit}>
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
