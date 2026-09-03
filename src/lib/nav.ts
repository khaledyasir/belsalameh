export type NavChild = { label: string; href: string };

export type NavItem = {
  label: string;
  href: string;
  icon: string; // lucide-react icon name — see components/admin/icon.tsx
  children?: NavChild[];
};

/** Admin navigation. Phase 1 scope: Dashboard, Members, Transactions. */
export const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  {
    label: "Members",
    href: "/admin/members",
    icon: "Users",
    children: [
      { label: "All members", href: "/admin/members" },
      { label: "Verify member", href: "/admin/members/verify" },
    ],
  },
  {
    label: "Transactions",
    href: "/admin/transactions",
    icon: "CreditCard",
    children: [
      { label: "All transactions", href: "/admin/transactions" },
      { label: "Webhook / IPN log", href: "/admin/transactions/webhooks" },
    ],
  },
];
