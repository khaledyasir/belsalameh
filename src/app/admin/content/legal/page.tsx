import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceholderBadge, PlaceholderNote } from "@/components/ui/placeholder-badge";
import { LEGAL_DOCS } from "@/lib/mock-data";
import { ContentTabs } from "../tabs";

export const metadata: Metadata = { title: "Content · Legal documents" };

export default async function LegalDocsPage() {
  const { allowed, role } = await guard("content:view");
  if (!allowed) return <PermissionDenied area="content" />;
  const canPublish = ["ADMIN", "OWNER"].includes(role);

  return (
    <div>
      <PageHeader
        title="Legal documents"
        description="Versioned, effective-dated documents rendered on the public site and referenced by the two mandatory checkout checkboxes."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Content", href: "/admin/content" }, { label: "Legal documents" }]}
      />
      <ContentTabs />

      <div className="mb-4">
        <PlaceholderNote>
          <strong>Pending legal review.</strong> These are empty stubs. The company
          must supply the Terms &amp; Conditions, Fair Usage Policy, and Privacy
          Policy text; it is then reviewed by counsel before publish is enabled.
        </PlaceholderNote>
      </div>

      <div className="space-y-3">
        {LEGAL_DOCS.map((doc) => (
          <Card key={doc.slug}>
            <CardHeader>
              <div>
                <CardTitle>{doc.title}</CardTitle>
                <p className="mt-0.5 text-xs text-ink-subtle">
                  /legal/{doc.slug} · version <span className="font-mono">{doc.version}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {doc.isPlaceholder && <PlaceholderBadge label="Pending legal" />}
                <Badge tone={doc.published ? "success" : "neutral"}>{doc.published ? "Published" : "Unpublished"}</Badge>
              </div>
            </CardHeader>
            <CardBody className="flex items-center justify-between gap-3">
              <p className="text-sm text-ink-muted">
                Effective date: {doc.effectiveAt ?? "not set"}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={!canPublish}>
                  Edit draft
                </Button>
                <Button size="sm" disabled title="Blocked until text is supplied and reviewed">
                  Publish
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
