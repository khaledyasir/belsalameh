import type { Permission } from "./rbac";

export type NavItem = {
  label: string;
  href: string;
  icon: string; // lucide-react icon name
  permission: Permission;
  children?: { label: string; href: string; permission: Permission }[];
};

export type NavGroup = {
  heading: string | null;
  items: NavItem[];
};

/**
 * Admin information architecture (plan §3). `icon` maps to a lucide-react
 * component in components/admin/icon.tsx.
 */
export const NAV: NavGroup[] = [
  {
    heading: null,
    items: [
      { label: "Dashboard", href: "/admin", icon: "LayoutDashboard", permission: "dashboard:view" },
    ],
  },
  {
    heading: "Operations",
    items: [
      {
        label: "Members",
        href: "/admin/members",
        icon: "Users",
        permission: "members:view",
        children: [
          { label: "All members", href: "/admin/members", permission: "members:view" },
          { label: "Verify member", href: "/admin/members/verify", permission: "members:verify" },
        ],
      },
      {
        label: "Transactions",
        href: "/admin/transactions",
        icon: "CreditCard",
        permission: "transactions:view",
        children: [
          { label: "All transactions", href: "/admin/transactions", permission: "transactions:view" },
          { label: "Webhook / IPN log", href: "/admin/transactions/webhooks", permission: "webhooks:view" },
        ],
      },
    ],
  },
  {
    heading: "Content",
    items: [
      {
        label: "Content",
        href: "/admin/content",
        icon: "FileText",
        permission: "content:view",
        children: [
          { label: "Pages", href: "/admin/content", permission: "content:view" },
          { label: "Legal documents", href: "/admin/content/legal", permission: "content:view" },
          { label: "FAQ", href: "/admin/content/faq", permission: "content:view" },
          { label: "Email templates", href: "/admin/content/emails", permission: "content:view" },
        ],
      },
      { label: "Membership product", href: "/admin/membership", icon: "BadgeCheck", permission: "membership:configure" },
    ],
  },
  {
    heading: "Administration",
    items: [
      {
        label: "Users & roles",
        href: "/admin/users",
        icon: "ShieldCheck",
        permission: "users:view",
        children: [
          { label: "Admin users", href: "/admin/users", permission: "users:view" },
          { label: "Roles & permissions", href: "/admin/users/roles", permission: "users:view" },
          { label: "Activity log", href: "/admin/users/audit", permission: "audit:view" },
        ],
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: "Settings",
        permission: "settings:view",
        children: [
          { label: "General", href: "/admin/settings", permission: "settings:view" },
          { label: "Branding", href: "/admin/settings/branding", permission: "settings:view" },
          { label: "Payment gateway", href: "/admin/settings/payment", permission: "settings:view" },
          { label: "Email", href: "/admin/settings/email", permission: "settings:view" },
          { label: "Launch readiness", href: "/admin/settings/launch-readiness", permission: "settings:view" },
        ],
      },
    ],
  },
];
