import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { PlaceholderNote } from "@/components/ui/placeholder-badge";
import { SettingsTabs } from "../tabs";
import { SettingsGroup } from "@/components/admin/settings-group";

export const metadata: Metadata = { title: "Settings · Email" };

export default async function EmailSettingsPage() {
  const { allowed, role } = await guard("settings:view");
  if (!allowed) return <PermissionDenied area="settings" />;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Email"
        description="Transactional email provider used to send the Proof of Membership. Deliverability depends on SPF, DKIM and DMARC on the sending domain."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings", href: "/admin/settings" }, { label: "Email" }]}
      />
      <SettingsTabs />

      <PlaceholderNote>
        Provider not yet chosen (candidates: Resend, Postmark, Amazon SES). Needs
        access to the sending domain&rsquo;s DNS to configure DKIM. Decision:
        whether the Proof of Membership is an HTML body only or also a PDF
        attachment.
      </PlaceholderNote>

      <div className="mt-4">
        <SettingsGroup group="email" canEdit={["ADMIN", "OWNER"].includes(role)} />
      </div>
    </div>
  );
}
