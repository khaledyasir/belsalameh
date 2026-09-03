import type { Metadata } from "next";
import { guard } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfileAction, changePasswordAction } from "@/app/(auth)/actions";

export const metadata: Metadata = { title: "My profile" };

const PASSWORD_MSG: Record<string, { tone: "ok" | "err"; text: string }> = {
  ok: { tone: "ok", text: "Password changed." },
  badcurrent: { tone: "err", text: "Your current password is incorrect." },
  mismatch: { tone: "err", text: "The new passwords do not match." },
  weak: { tone: "err", text: "Use at least 8 characters for the new password." },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ profile?: string; password?: string }>;
}) {
  const { user: admin } = await guard();
  const sp = await searchParams;
  const pwMsg = sp.password ? PASSWORD_MSG[sp.password] : undefined;

  return (
    <div className="max-w-xl">
      <PageHeader title="My profile" crumbs={[{ label: "Admin", href: "/admin" }, { label: "My profile" }]} />

      {/* Name + email */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <form action={updateProfileAction}>
          <CardBody className="space-y-4">
            {sp.profile === "ok" && (
              <p role="status" className="rounded border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
                Profile updated.
              </p>
            )}
            {sp.profile === "err" && (
              <p role="alert" className="rounded border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                Enter a name and a valid email address.
              </p>
            )}
            <Field label="Name" required>
              {(p) => <Input {...p} name="name" defaultValue={admin.name} required />}
            </Field>
            <Field label="Email" required>
              {(p) => <Input {...p} name="email" type="email" defaultValue={admin.email} required />}
            </Field>
            <p className="text-xs text-ink-muted">
              Username <span className="font-mono text-ink">{admin.username}</span> is fixed in Phase 1.
            </p>
          </CardBody>
          <CardFooter>
            <span className="text-xs text-ink-subtle">Saved to the local admin store</span>
            <Button type="submit">Save details</Button>
          </CardFooter>
        </form>
      </Card>

      {/* Change password */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <form action={changePasswordAction}>
          <CardBody className="space-y-4">
            {pwMsg && (
              <p
                role={pwMsg.tone === "ok" ? "status" : "alert"}
                className={
                  "rounded px-3 py-2 text-sm " +
                  (pwMsg.tone === "ok"
                    ? "border border-success/30 bg-success/10 text-success"
                    : "border border-danger/30 bg-danger/10 text-danger")
                }
              >
                {pwMsg.text}
              </p>
            )}
            <Field label="Current password" hint="Required to confirm the change" required>
              {(p) => <Input {...p} name="current" type="password" autoComplete="current-password" required />}
            </Field>
            <Field label="New password" hint="At least 8 characters" required>
              {(p) => <Input {...p} name="next" type="password" autoComplete="new-password" required />}
            </Field>
            <Field label="Confirm new password" required>
              {(p) => <Input {...p} name="confirm" type="password" autoComplete="new-password" required />}
            </Field>
          </CardBody>
          <CardFooter>
            <span className="text-xs text-ink-subtle">You stay signed in on this device</span>
            <Button type="submit">Update password</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
