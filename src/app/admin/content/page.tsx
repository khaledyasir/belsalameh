import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceholderBadge, PlaceholderNote } from "@/components/ui/placeholder-badge";
import { Button } from "@/components/ui/button";
import { CONTENT_PAGES } from "@/lib/mock-data";
import { ContentTabs } from "./tabs";

export const metadata: Metadata = { title: "Content · Pages" };

export default async function ContentPagesPage() {
  const { allowed, role } = await guard("content:view");
  if (!allowed) return <PermissionDenied area="content" />;
  const canEdit = ["ADMIN", "OWNER"].includes(role);

  return (
    <div>
      <PageHeader
        title="Content"
        description="Structured content for the public website. Each block is a placeholder until the company supplies final English copy."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Content" }]}
      />
      <ContentTabs />

      <div className="mb-4">
        <PlaceholderNote>
          Publishing is disabled while blocks hold placeholder copy. The public
          website (Phase 2) reads these records; nothing goes live until Launch
          readiness is green.
        </PlaceholderNote>
      </div>

      <div className="space-y-4">
        {CONTENT_PAGES.map((page) => (
          <Card key={page.slug}>
            <CardHeader>
              <div>
                <CardTitle>{page.title} page</CardTitle>
                <p className="mt-0.5 text-xs text-ink-subtle">/{page.slug}</p>
              </div>
              <Badge tone="neutral">{page.blockDetails.length} blocks</Badge>
            </CardHeader>
            <CardBody className="divide-y divide-border">
              {page.blockDetails.map((b) => (
                <div key={b.key} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{b.heading}</p>
                    <p className="truncate text-xs text-ink-muted">{b.body}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {b.isPlaceholder && <PlaceholderBadge />}
                    <Badge tone={b.published ? "success" : "neutral"}>{b.published ? "Published" : "Draft"}</Badge>
                    <Button size="sm" variant="secondary" disabled={!canEdit} title={canEdit ? "Editor UI in Phase 2" : "Requires Admin"}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
