import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsTabs } from "./tabs";
import { SettingsGroup } from "@/components/admin/settings-group";

export const metadata: Metadata = { title: "Settings · General" };

export default async function GeneralSettingsPage() {
  const { allowed, role } = await guard("settings:view");
  if (!allowed) return <PermissionDenied area="settings" />;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Settings"
        description="Platform configuration. Fields marked as placeholders are surfaced on the Launch readiness checklist and block go-live until set."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
      />
      <SettingsTabs />
      <SettingsGroup group="general" canEdit={["ADMIN", "OWNER"].includes(role)} />
    </div>
  );
}
