import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PermissionDenied } from "@/components/admin/permission-denied";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { PlaceholderNote } from "@/components/ui/placeholder-badge";
import { SettingsTabs } from "../tabs";
import { SettingsGroup } from "@/components/admin/settings-group";

export const metadata: Metadata = { title: "Settings · Branding" };

const SWATCHES = [
  { name: "Indigo", hex: "#2E3A6E" },
  { name: "Purple", hex: "#6D5FA3" },
  { name: "Mauve", hex: "#B48DBF" },
  { name: "Orange", hex: "#F7A663" },
  { name: "Sand", hex: "#FADCA8" },
  { name: "Cream", hex: "#FFF3E0" },
];

export default async function BrandingSettingsPage() {
  const { allowed, role } = await guard("settings:view");
  if (!allowed) return <PermissionDenied area="settings" />;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Branding"
        description="Logo, colours and typography that feed both the admin console and the public website. Current values come from the supplied brand guidelines."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings", href: "/admin/settings" }, { label: "Branding" }]}
      />
      <SettingsTabs />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Palette (from brand guidelines)</CardTitle>
        </CardHeader>
        <CardBody>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {SWATCHES.map((s) => (
              <li key={s.hex} className="text-center">
                <span
                  className="block h-14 w-full rounded border border-border"
                  style={{ backgroundColor: s.hex }}
                  aria-hidden
                />
                <span className="mt-1 block text-xs font-medium text-ink">{s.name}</span>
                <span className="block font-mono text-[0.7rem] text-ink-subtle">{s.hex}</span>
              </li>
            ))}
          </ul>
          <PlaceholderNote>
            Accessibility note: orange <code>#F7A663</code> and mauve
            <code> #B48DBF</code> do not meet AA contrast for body text on white —
            reserve them for large headings, fills, and accents; use indigo for text
            and links. The final vector logo and licensed font files (Crimson,
            Abd&nbsp;ElRady) are still to be supplied.
          </PlaceholderNote>
        </CardBody>
      </Card>

      <SettingsGroup group="branding" canEdit={["ADMIN", "OWNER"].includes(role)} />
    </div>
  );
}
