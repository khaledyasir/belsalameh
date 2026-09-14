"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/site-content";
import { JoinTrigger } from "@/components/site/join";

/** Animated drawer for the header nav links, shown below `lg`. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const overlay = (
    // Always mounted (not conditionally rendered) so the slide-in is a real
    // transition, not a mount-time flash. Hidden from layout/AT when closed.
    // overflow-hidden here is load-bearing: the drawer panel below is
    // translated off-screen via transform when closed, but an
    // absolutely-positioned descendant that extends past the viewport still
    // expands the *document's* scrollable width even while invisible.
    //
    // Portaled to document.body rather than rendered inline in <header>:
    // the header uses backdrop-blur, and per spec `backdrop-filter` (like
    // `filter`) establishes a new containing block for `position: fixed`
    // descendants — so a fixed inset-0 overlay left inside the header was
    // actually being sized to the header's own ~72px box, not the viewport.
    <div
      className={cn(
        "fixed inset-0 z-50 overflow-hidden transition-opacity duration-base ease-premium",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          "absolute inset-y-0 end-0 flex w-72 max-w-[85vw] flex-col gap-1 bg-surface p-6 shadow-pop",
          "transition-transform duration-base ease-premium",
          open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <p className="font-display text-heading-3 font-semibold text-ink">Menu</p>
          <button
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-muted hover:bg-surface-muted"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-1" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-body font-medium text-ink hover:bg-surface-muted"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <JoinTrigger className="flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-body-sm font-semibold text-primary-ink shadow-sm">
            Activate membership
          </JoinTrigger>
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {mounted && createPortal(overlay, document.body)}
    </div>
  );
}
