import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { getMembershipSettings } from "@/lib/membership-settings";
import { PlanForm } from "./plan-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await guard();
  const settings = await getMembershipSettings();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Settings"
        description="Decide how the membership is sold. Changes apply immediately to the public website, its checkout, and the walk-in tab."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Membership plan</CardTitle>
        </CardHeader>
        <CardBody>
          <PlanForm
            initial={{
              priceMinor: settings.priceMinor,
              durationMonths: settings.durationMonths,
              sendExpiryEmail: settings.sendExpiryEmail,
            }}
            currency={settings.currency}
          />
        </CardBody>
      </Card>
    </div>
  );
}
