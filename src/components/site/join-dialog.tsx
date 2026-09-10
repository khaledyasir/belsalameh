"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { CheckoutForm } from "./checkout-form";
import { MEMBERSHIP } from "@/lib/membership";

/**
 * Checkout modal. Loaded on demand (next/dynamic) so its form + zod bundle
 * only reaches pages where someone actually opens it.
 *
 * Escape and backdrop clicks do NOT close — dismissed only with the X, by request.
 */
export function JoinDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
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
          Activate your membership
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          One-time annual fee, zero auto-renewals. Enter your details, agree to the
          policies, and continue to the secure payment page.
        </p>

        <div className="mt-4 rounded-xl bg-brand-cream/70 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">{MEMBERSHIP.name}</span>
            <span className="font-medium text-ink">Annual · one-time fee</span>
          </div>
          <p className="mt-1 text-xs text-ink-subtle">
            The membership fee is shown on the secure payment page before you pay.
          </p>
        </div>

        <div className="mt-5">
          <CheckoutForm />
        </div>
      </div>
    </div>,
    document.body,
  );
}
