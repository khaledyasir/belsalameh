import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { roleLabel } from "@/lib/rbac";

export const metadata: Metadata = { title: "My profile" };

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const { user } = session;

  return (
    <div className="max-w-xl">
      <PageHeader title="My profile" crumbs={[{ label: "Admin", href: "/admin" }, { label: "My profile" }]} />
      <Card>
        <CardBody className="space-y-4">
          <Field label="Name">{(p) => <Input {...p} defaultValue={user.name} disabled />}</Field>
          <Field label="Email">{(p) => <Input {...p} defaultValue={user.email} disabled />}</Field>
          <Field label="Role">{(p) => <Input {...p} defaultValue={roleLabel(user.role)} disabled />}</Field>
          <Button disabled title="Editing wired in Phase 3">Save</Button>
        </CardBody>
      </Card>
    </div>
  );
}
