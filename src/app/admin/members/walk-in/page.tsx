import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { MEMBERSHIP } from "@/lib/membership";
import { formatMoney } from "@/lib/format";
import { WalkInForm } from "./walk-in-form";

export const metadata: Metadata = { title: "Add walk-in member" };

export default async function WalkInPage() {
  await guard();

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Add walk-in member"
        description={`For members who pay in person instead of through the website — e.g. at the airport counter. Creates the membership for ${formatMoney(MEMBERSHIP.priceMinor, MEMBERSHIP.currency)} and immediately sends the same confirmation email the online checkout sends.`}
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Members", href: "/admin/members" },
          { label: "Add walk-in member" },
        ]}
      />

      <Card>
        <CardBody>
          <WalkInForm />
        </CardBody>
      </Card>
    </div>
  );
}
