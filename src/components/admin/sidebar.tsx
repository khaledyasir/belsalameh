"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { can, type Role } from "@/lib/rbac";
import { NavIcon } from "./icon";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SidebarNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="flex flex-col gap-6 px-3 py-4">
      {NAV.map((group, gi) => {
        const items = group.items.filter((it) => can(role, it.permission));
        if (items.length === 0) return null;
        return (
          <div key={gi}>
            {group.heading && (
              <p className="px-2 pb-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-brand-cream/60">
                {group.heading}
              </p>
            )}
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active = isActive(pathname, item.href);
                const children = (item.children ?? []).filter((c) => can(role, c.permission));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded px-2 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-white/15 text-white"
                          : "text-brand-cream/85 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <NavIcon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                    {active && children.length > 1 && (
                      <ul className="mb-1 ml-4 mt-0.5 space-y-0.5 border-l border-white/15 pl-3">
                        {children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={onNavigate}
                              aria-current={pathname === c.href ? "page" : undefined}
                              className={cn(
                                "block rounded px-2 py-1.5 text-[0.8rem] transition-colors",
                                pathname === c.href
                                  ? "text-white"
                                  : "text-brand-cream/70 hover:text-white",
                              )}
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
