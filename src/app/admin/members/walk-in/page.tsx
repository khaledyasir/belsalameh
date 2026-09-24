import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { getMembershipSettings } from "@/lib/membership-settings";
import { WalkInForm } from "./walk-in-form";

export const metadata: Metadata = { title: "Add walk-in member" };

export default async function WalkInPage() {
  await guard();
  const plan = await getMembershipSettings();

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Add walk-in member"
        description="For members who pay in person instead of through the website, e.g. at the airport counter. Pick how long the membership lasts; the amount is calculated from the plan in Settings. The same confirmation email the online checkout sends goes out immediately."
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Members", href: "/admin/members" },
          { label: "Add walk-in member" },
        ]}
      />

      <Card>
        <CardBody>
          <WalkInForm plan={plan} />
        </CardBody>
      </Card>
    </div>
  );
}
