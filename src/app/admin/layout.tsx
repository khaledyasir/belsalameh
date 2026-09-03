import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSetting } from "@/lib/mock-data";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");

  const gatewayMode = (getSetting("gateway.mode") as "TEST" | "LIVE") ?? "TEST";

  return (
    <AdminShell
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }}
      gatewayMode={gatewayMode}
    >
      {children}
    </AdminShell>
  );
}
