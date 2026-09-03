import { LayoutDashboard, Users, CreditCard, type LucideIcon } from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  CreditCard,
};

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = MAP[name] ?? LayoutDashboard;
  return <Cmp className={className} aria-hidden strokeWidth={1.75} />;
}
