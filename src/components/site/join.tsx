"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Plane, X } from "lucide-react";
import { CheckoutForm } from "./checkout-form";
import { MEMBERSHIP } from "@/lib/membership";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

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
      <JoinDialog open={isOpen} onClose={close} />
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

function JoinDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);

    // Trap Tab inside the panel. Escape and backdrop clicks do NOT close —
    // the modal is dismissed only with the X button, by request.
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
      {/* Scrim greys the page. Clicking it does nothing. */}
      <div className="fixed inset-0 bg-brand-indigo/60 backdrop-blur-sm" aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 my-6 w-full max-w-lg rounded-2xl bg-surface p-6 shadow-pop sm:my-10 sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-surface-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <h2 id={titleId} className="font-display text-2xl font-bold text-ink">
          Get your membership
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Enter your details, agree to the policies, and continue to the secure
          payment page.
        </p>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-brand-cream/70 px-4 py-3">
          <span className="text-sm text-ink-muted">{MEMBERSHIP.name}</span>
          <span className="font-display text-lg font-bold text-ink">
            {formatMoney(MEMBERSHIP.priceMinor, MEMBERSHIP.currency)}
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-subtle">
          Placeholder amount. Final price to be confirmed before launch.
        </p>

        <div className="mt-5">
          <CheckoutForm />
        </div>
      </div>
    </div>,
    document.body,
  );
}
