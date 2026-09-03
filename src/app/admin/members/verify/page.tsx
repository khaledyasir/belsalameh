import type { Metadata } from "next";
import Link from "next/link";
import { guard } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MemberStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { findMemberForVerification } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Verify member" };

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await guard();

  const { q = "" } = await searchParams;
  const results = q ? findMemberForVerification(q) : [];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Verify member"
        description="Look up a membership by name or Membership ID, then visually match the passport. Validation is by visual comparison — there is no barcode or QR scan."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Members", href: "/admin/members" }, { label: "Verify" }]}
      />

      <Card>
        <CardBody>
          <form method="get" action="/admin/members/verify" className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="verify-q" className="mb-1 block text-sm font-medium text-ink">
                Name or Membership ID
              </label>
              <input
                id="verify-q"
                name="q"
                defaultValue={q}
                autoFocus
                inputMode="text"
                autoCapitalize="characters"
                placeholder="e.g. BSL-7Q2M-9XKD or Omar Haddad"
                className="h-12 w-full rounded border border-border bg-surface px-3 text-base focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-primary"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" size="md" className="h-12 w-full px-6 sm:w-auto">
                Look up
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="mt-4 space-y-3">
        {q && results.length === 0 && (
          <EmptyState
            title="No match found"
            description="Check the spelling of the name or re-type the Membership ID. If it still doesn't match, the membership may not be valid."
          />
        )}

        {results.map((m) => (
          <Card key={m.id}>
            <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-display text-xl font-bold text-ink">{m.fullName}</p>
                <p className="font-mono text-lg tracking-wide text-brand-indigo">{m.membershipId}</p>
                <p className="text-sm text-ink-muted">
                  Expiry: <span className="font-medium text-ink">{m.expiryLabel}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <MemberStatusBadge status={m.status} />
                <Link href={`/admin/members/${m.id}`} className="text-sm text-brand-indigo hover:underline">
                  Full record
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
