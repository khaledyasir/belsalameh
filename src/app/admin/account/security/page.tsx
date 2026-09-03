import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlaceholderNote } from "@/components/ui/placeholder-badge";

export const metadata: Metadata = { title: "Password & 2FA" };

export default async function SecurityPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Password & two-factor"
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Security" }]}
      />

      <PlaceholderNote>
        Phase 0 stub. Phase 3 replaces authentication with Auth.js: email +
        password (Argon2id), mandatory TOTP two-factor for every role, and step-up
        re-auth for sensitive actions.
      </PlaceholderNote>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <Badge tone={session.user.twoFactorEnabled ? "success" : "warning"}>
            {session.user.twoFactorEnabled ? "Enabled" : "Not enabled"}
          </Badge>
        </CardHeader>
        <CardBody>
          <Button disabled>Manage 2FA</Button>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardBody>
          <Button variant="secondary" disabled>Change password</Button>
        </CardBody>
      </Card>
    </div>
  );
}
