import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlaceholderNote } from "@/components/ui/placeholder-badge";
import { getSetting } from "@/lib/mock-data";
import { formatExpiry } from "@/lib/format";

export const metadata: Metadata = { title: "Membership product" };

export default async function MembershipPage() {
  const { allowed } = await guard("membership:configure");
  if (!allowed) return <PermissionDenied area="the membership product" />;

  const price = Number(getSetting("membership.priceMinor") ?? 0);
  const currency = String(getSetting("membership.currency") ?? "JOD");
  const duration = Number(getSetting("membership.durationMonths") ?? 12);
  const prefix = String(getSetting("membership.idPrefix") ?? "BSL");

  const sampleExpiry = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + duration);
    return formatExpiry(d.getMonth() + 1, d.getFullYear());
  })();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Membership product"
        description="The single product sold on the site. These values drive checkout pricing, the expiry shown on the Proof of Membership, and the Membership ID format."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Membership product" }]}
      />

      <PlaceholderNote>
        Every value on this page is a placeholder awaiting business confirmation:
        price, currency, tax treatment, membership duration, renewal behaviour, and
        the Membership ID scheme. See the plan&rsquo;s open questions (§9).
      </PlaceholderNote>

      <form className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Price (minor units)" hint="e.g. 25000 = 25.000 JOD" required>
              {(p) => <Input {...p} type="number" defaultValue={price} disabled />}
            </Field>
            <Field label="Currency" required>
              {(p) => (
                <Select {...p} defaultValue={currency} disabled>
                  <option>JOD</option>
                  <option>USD</option>
                  <option>EUR</option>
                </Select>
              )}
            </Field>
            <Field label="Tax / VAT handling" hint="Confirm whether price is tax-inclusive and if an invoice is required" className="sm:col-span-2">
              {(p) => (
                <Select {...p} defaultValue="" disabled>
                  <option value="">Not decided</option>
                  <option>Tax-inclusive</option>
                  <option>Tax added at checkout</option>
                </Select>
              )}
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Duration &amp; expiry</CardTitle>
          </CardHeader>
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Duration (months)" required>
              {(p) => <Input {...p} type="number" defaultValue={duration} disabled />}
            </Field>
            <Field label="Expiry basis">
              {(p) => (
                <Select {...p} defaultValue="rolling" disabled>
                  <option value="rolling">Rolling term from purchase date</option>
                  <option value="fixed">Fixed calendar date</option>
                </Select>
              )}
            </Field>
            <div className="sm:col-span-2 rounded border border-border bg-surface-muted/50 p-3 text-sm">
              A purchase today would show <strong>Expiry: {sampleExpiry}</strong> on the
              Proof of Membership (month and year only, per spec).
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership ID format</CardTitle>
          </CardHeader>
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Prefix" hint="Uppercase, no ambiguous characters">
              {(p) => <Input {...p} defaultValue={prefix} disabled />}
            </Field>
            <Field label="Pattern">
              {(p) => <Input {...p} defaultValue={`${prefix}-XXXX-XXXX`} disabled />}
            </Field>
            <p className="sm:col-span-2 text-xs text-ink-muted">
              Generated server-side at payment capture, unique, and printed on the
              Proof of Membership for visual matching.
            </p>
          </CardBody>
        </Card>

        <Button type="submit" disabled title="Editing wired in Phase 3">
          Save changes
        </Button>
      </form>
    </div>
  );
}
