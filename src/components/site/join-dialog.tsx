"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Check, TriangleAlert, X } from "lucide-react";
import { CheckoutForm } from "./checkout-form";
import { durationLabel, expiryFrom, type MembershipPlan } from "@/lib/membership";
import { formatExpiry, formatMoney } from "@/lib/format";
import { PARTNER, SITE } from "@/lib/site-content";

/**
 * Checkout modal. Loaded on demand (next/dynamic) so its form + zod bundle
 * only reaches pages where someone actually opens it.
 *
 * Two steps: first a summary of what the fee gets you (services, price, end date,
 * and what it does NOT cover), then the details form.
 *
 * Escape and backdrop clicks do NOT close — dismissed only with the X, by request.
 */
export function JoinDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const [step, setStep] = useState<"info" | "form">("info");
  // The plan (price + length) is whatever the admin has saved right now, fetched fresh each time the pop-up opens.
  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [planError, setPlanError] = useState(false);

  const loadPlan = useCallback(() => {
    setPlanError(false);
    fetch("/api/membership", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((p: MembershipPlan) => setPlan(p))
      .catch(() => setPlanError(true));
  }, []);
  useEffect(() => {
    if (open) loadPlan();
  }, [open, loadPlan]);

  useEffect(() => setMounted(true), []);

  // Move focus to the new step's heading so screen readers announce the change.
  useEffect(() => {
    if (mounted) titleRef.current?.focus();
  }, [step, mounted]);

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

        {step === "info" ? <InfoStep titleId={titleId} titleRef={titleRef} plan={plan} error={planError} onRetry={loadPlan} onContinue={() => setStep("form")} /> : (
          <>
            <button
              type="button"
              onClick={() => setStep("info")}
              className="mb-2 inline-flex items-center gap-1 text-sm text-ink-muted transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </button>
            <h2 id={titleId} ref={titleRef} tabIndex={-1} className="font-display text-2xl font-bold text-ink outline-none">
              Activate your membership
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              One-time fee for {plan ? durationLabel(plan.durationMonths) : "your membership"}, zero auto-renewals. Enter your details, agree to the
              policies, and continue to the secure payment page.
            </p>

            <div className="mt-5">
              {plan && <CheckoutForm plan={plan} />}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** Step 1: what you get, what it costs, when it ends, and what it does not cover. */
function InfoStep({
  titleId,
  titleRef,
  plan,
  error,
  onRetry,
  onContinue,
}: {
  titleId: string;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  plan: MembershipPlan | null;
  error: boolean;
  onRetry: () => void;
  onContinue: () => void;
}) {
  // Same rule capturePayment() uses, so the date shown here matches the confirmation email.
  const end = plan ? expiryFrom(new Date(), plan.durationMonths) : null;
  const validUntil = end ? formatExpiry(end.month, end.year) : "";

  return (
    <>
      <h2 id={titleId} ref={titleRef} tabIndex={-1} className="pr-8 font-display text-2xl font-bold text-ink outline-none">
        What your membership includes
      </h2>

      <div className="mt-4 rounded-xl bg-brand-cream/70 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">{plan?.name ?? "Membership"}</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <p className="font-display text-3xl font-bold text-ink">
            {plan ? formatMoney(plan.priceMinor, plan.currency) : "…"}
            <span className="ml-1.5 text-sm font-medium text-ink-muted">per person</span>
          </p>
        </div>
        <dl className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Valid for</dt>
            <dd className="text-right text-ink">{plan ? `${durationLabel(plan.durationMonths)}, until ${validUntil}` : "…"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Payment</dt>
            <dd className="text-right text-ink">One-time fee, no auto-renewal</dd>
          </div>
        </dl>
      </div>

      <h3 className="mt-5 text-sm font-semibold text-ink">Included service</h3>
      <p className="mt-1 text-sm font-medium text-brand-indigo">{SITE.service.name}</p>
      <p className="text-xs text-ink-muted">{SITE.service.eligibility}</p>
      <ul className="mt-2 space-y-1.5">
        {SITE.service.points.map((p) => (
          <li key={p} className="flex gap-2 text-sm text-ink">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
            {p}
          </li>
        ))}
      </ul>

      <div role="note" className="mt-5 flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-[#7a4d0f]">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">Please note: this price doesn&apos;t cover all services</p>
          <p className="mt-1">
            The membership fee unlocks access to the member service listed above only. It does not pay for the
            services themselves: their charges (for example the fixed member rate for 1–3 kg of excess baggage) are
            paid separately at the airport check-in counter, and only apply to {PARTNER} flights with an RJ booking
            reference. Anything outside the listed service is charged at the airline&apos;s standard rates.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          We couldn&apos;t load the current price.{" "}
          <button type="button" onClick={onRetry} className="font-medium underline">
            Try again
          </button>
        </p>
      )}

      <button
        type="button"
        onClick={onContinue}
        disabled={!plan}
        className="mt-6 flex h-12 w-full items-center justify-center rounded bg-brand-indigo text-sm font-semibold text-white transition-colors hover:bg-brand-indigo/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
      >
        I understand, continue
      </button>
      <p className="mt-2 text-center text-xs text-ink-subtle">Joining with family or friends? You can add them on the next step.</p>
    </>
  );
}
