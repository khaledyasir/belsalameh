"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

// The checkout modal (form + zod) is a separate chunk, fetched only when opened.
const JoinDialog = dynamic(() => import("./join-dialog").then((m) => m.JoinDialog), { ssr: false });

type JoinContextValue = { open: () => void; close: () => void; isOpen: boolean };
const JoinContext = createContext<JoinContextValue | null>(null);

export function useJoin() {
  const ctx = useContext(JoinContext);
  if (!ctx) throw new Error("useJoin must be used inside <JoinProvider>");
  return ctx;
}

export function JoinProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Deep link: /join redirects to /?join=1, which opens the modal here.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("join")) setIsOpen(true);
  }, []);

  return (
    <JoinContext.Provider value={{ open, close, isOpen }}>
      {children}
      <JoinBubble />
      {isOpen && <JoinDialog open onClose={close} />}
    </JoinContext.Provider>
  );
}

/** Anything that should open the checkout modal. Renders a real <button>. */
export function JoinTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useJoin();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}

/** Persistent floating "bubble" on every public page. */
function JoinBubble() {
  const { open, isOpen } = useJoin();
  if (isOpen) return null;
  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        "fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full",
        "bg-brand-orange px-5 py-3 text-sm font-semibold text-brand-indigo shadow-lg",
        "transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-indigo",
      )}
    >
      <Plane className="h-4 w-4" aria-hidden />
      Get your membership
    </button>
  );
}
