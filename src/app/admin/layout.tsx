import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { GATEWAY_MODE } from "@/lib/mock-data";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");

  return (
    <AdminShell user={{ name: session.user.name, email: session.user.email }} gatewayMode={GATEWAY_MODE}>
      {children}
    </AdminShell>
  );
}
