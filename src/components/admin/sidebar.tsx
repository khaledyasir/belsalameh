"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { NavIcon } from "./icon";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="flex flex-col gap-1 px-3 py-4">
      <ul className="space-y-0.5">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const children = item.children ?? [];
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded px-2 py-2 text-sm font-medium transition-colors",
                  active ? "bg-white/15 text-white" : "text-brand-cream/85 hover:bg-white/10 hover:text-white",
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
                          pathname === c.href ? "text-white" : "text-brand-cream/70 hover:text-white",
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
    </nav>
  );
}
