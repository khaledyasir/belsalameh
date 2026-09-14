"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

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
  analyticsEvent = "membership_started",
}: {
  className?: string;
  children: React.ReactNode;
  /** Which funnel event this particular CTA reports (see src/lib/analytics.ts). */
  analyticsEvent?: "membership_started" | "hero_cta_clicked";
}) {
  const { open } = useJoin();
  return (
    <button
      type="button"
      onClick={() => {
        trackEvent(analyticsEvent);
        open();
      }}
      className={className}
    >
      {children}
    </button>
  );
}

/**
 * Persistent floating "bubble" on every public page. Hidden once the footer
 * scrolls into view — being `position: fixed`, it would otherwise sit on
 * top of the footer's links for the rest of the scroll, on every page, on
 * every device (worst on mobile, where the bubble is a larger tap target
 * relative to the screen). The final-CTA section right above the footer
 * already has its own "Activate membership" button, so nothing is lost.
 */
function JoinBubble() {
  const { open, isOpen } = useJoin();
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), {
      rootMargin: "0px 0px -1px 0px",
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={open}
      aria-hidden={footerVisible}
      tabIndex={footerVisible ? -1 : 0}
      className={cn(
        "fixed bottom-5 end-5 z-40 inline-flex items-center gap-2 rounded-full",
        "bg-brand-orange px-5 py-3 text-sm font-semibold text-brand-indigo shadow-lg",
        "transition duration-base ease-premium hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-indigo",
        footerVisible ? "pointer-events-none translate-y-4 opacity-0" : "pointer-events-auto translate-y-0 opacity-100",
      )}
    >
      <Plane className="h-4 w-4" aria-hidden />
      Get your membership
    </button>
  );
}
