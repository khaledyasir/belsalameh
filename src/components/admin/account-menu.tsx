"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, User, LogOut, KeyRound } from "lucide-react";
import { roleLabel, type Role } from "@/lib/rbac";
import { signOutAction } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

export function AccountMenu({ name, email, role }: { name: string; email: string; role: Role }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-indigo text-xs font-semibold text-white">
          {name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block font-medium leading-tight text-ink">{name}</span>
          <span className="block text-xs leading-tight text-ink-muted">{roleLabel(role)}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-ink-muted" aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1.5 w-56 overflow-hidden rounded-lg border border-border bg-surface shadow-pop"
        >
          <div className="border-b border-border px-3 py-2.5">
            <p className="text-sm font-medium text-ink">{name}</p>
            <p className="truncate text-xs text-ink-muted">{email}</p>
          </div>
          <div className="py-1">
            <MenuLink href="/admin/account" icon={User} label="My profile" onClick={() => setOpen(false)} />
            <MenuLink href="/admin/account/security" icon={KeyRound} label="Password & 2FA" onClick={() => setOpen(false)} />
          </div>
          <form
            action={async () => {
              await signOutAction();
              router.push("/login");
            }}
            className="border-t border-border py-1"
          >
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-surface-muted"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: typeof User;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className={cn("flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-surface-muted")}
    >
      <Icon className="h-4 w-4 text-ink-muted" aria-hidden />
      {label}
    </Link>
  );
}
