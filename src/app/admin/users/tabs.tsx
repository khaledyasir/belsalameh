"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin/users", label: "Admin users" },
  { href: "/admin/users/roles", label: "Roles & permissions" },
  { href: "/admin/users/audit", label: "Activity log" },
];

export function UsersTabs() {
  const pathname = usePathname();
  return (
    <nav className="mb-5 flex flex-wrap gap-1 border-b border-border" aria-label="User management sections">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium",
              active
                ? "border-brand-indigo text-brand-indigo"
                : "border-transparent text-ink-muted hover:border-border hover:text-ink",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
