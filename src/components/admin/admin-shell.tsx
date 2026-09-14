"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { SidebarNav } from "./sidebar";
import { AccountMenu } from "./account-menu";
import { Wordmark } from "@/components/wordmark";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  user: { name: string; email: string };
  /** PLACEHOLDER: sourced from the MEPS gateway config once wired (Phase 3). */
  gatewayMode: "TEST" | "LIVE";
  children: React.ReactNode;
};

export function AdminShell({ user, gatewayMode, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-canvas">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-brand-indigo focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      {/* Topbar */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-surface px-3 sm:px-4">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded hover:bg-surface-muted lg:hidden"
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>

        <Link href="/admin" className="hidden lg:block">
          <Wordmark tone="dark" />
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Badge
            tone={gatewayMode === "LIVE" ? "danger" : "warning"}
            className="font-semibold uppercase"
            title="Payment gateway environment"
          >
            {gatewayMode === "LIVE" ? "● Live" : "● Test mode"}
          </Badge>

          <form
            role="search"
            action="/admin/members"
            className="hidden items-center gap-2 rounded border border-border bg-surface-muted/60 px-2.5 md:flex"
          >
            <Search className="h-4 w-4 text-ink-subtle" aria-hidden />
            <label htmlFor="global-search" className="sr-only">
              Search members and transactions
            </label>
            <input
              id="global-search"
              name="q"
              placeholder="Search members, transactions…"
              className="h-9 w-52 bg-transparent text-sm outline-none placeholder:text-ink-subtle lg:w-64"
            />
          </form>

          <AccountMenu name={user.name} email={user.email} />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[100rem]">
        {/* Desktop sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 overflow-y-auto bg-brand-indigo lg:block">
          <SidebarNav />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-brand-indigo/40 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <div
              className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-y-auto bg-brand-indigo"
              role="dialog"
              aria-label="Navigation"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <Wordmark />
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded text-white hover:bg-white/10"
                  aria-label="Close navigation"
                  onClick={() => setDrawerOpen(false)}
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <SidebarNav onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main id="admin-main" className={cn("min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8")}>
          {children}
        </main>
      </div>
    </div>
  );
}
