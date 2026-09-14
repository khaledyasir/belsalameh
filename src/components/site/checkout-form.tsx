"use client";

import { useActionState, useId, useRef, useState } from "react";
import Link from "next/link";
import { Check as CheckIcon, Pencil } from "lucide-react";
import { checkoutSchema, toFieldErrors, initialCheckoutState, type CheckoutFieldErrors } from "@/lib/checkout";
import { startCheckout } from "./checkout-actions";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Values = {
  fullName: string;
  email: string;
  confirmEmail: string;
  agreeTerms: boolean;
  confirmPrivacy: boolean;
};

const EMPTY: Values = {
  fullName: "",
  email: "",
  confirmEmail: "",
  agreeTerms: false,
  confirmPrivacy: false,
};

const FIELD_ORDER: (keyof Values)[] = ["fullName", "email", "confirmEmail", "agreeTerms", "confirmPrivacy"];
const LABELS: Record<keyof Values, string> = {
  fullName: "Full name",
  email: "Email address",
  confirmEmail: "Confirm email address",
  agreeTerms: "Terms & Conditions and Fair Usage Policy",
  confirmPrivacy: "Data protection confirmation",
};

type Step = "details" | "review";
const DETAIL_FIELDS: (keyof Values)[] = ["fullName", "email", "confirmEmail"];

export function CheckoutForm() {
  const [serverState, formAction, isPending] = useActionState(startCheckout, initialCheckoutState);
  const [values, setValues] = useState<Values>(EMPTY);
  const [clientErrors, setClientErrors] = useState<CheckoutFieldErrors>({});
  const [step, setStep] = useState<Step>("details");
  const summaryRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const fid = (k: keyof Values) => `${uid}-${k}`;

  // Server errors only show for fields the user has not since edited.
  const errors: CheckoutFieldErrors = { ...serverState.errors, ...clientErrors };

  function validate(next: Values): CheckoutFieldErrors {
    const parsed = checkoutSchema.safeParse(next);
    return parsed.success ? {} : toFieldErrors(parsed.error);
  }

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    // Clear this field's error as the user corrects it.
    setClientErrors((e) => {
      if (!e[key]) return e;
      const copy = { ...e };
      delete copy[key];
      return copy;
    });
  }

  function onBlur(key: keyof Values) {
    const all = validate(values);
    setClientErrors((e) => ({ ...e, ...(all[key] ? { [key]: all[key] } : {}) }));
  }

  function tryAdvanceToReview() {
    const found = validate(values);
    const detailErrors = Object.fromEntries(DETAIL_FIELDS.map((k) => [k, found[k]]).filter(([, m]) => m));
    if (Object.keys(detailErrors).length > 0) {
      setClientErrors((e) => ({ ...e, ...detailErrors }));
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStep("review");
    trackEvent("membership_details_completed");
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Never let an implicit submit (e.g. Enter in a text field, which browsers
    // may route to the review step's <button type="submit"> even while it's
    // `hidden`) skip the review step — only an explicit review-step submit reaches the server action.
    if (step === "details") {
      e.preventDefault();
      tryAdvanceToReview();
      return;
    }

    const found = validate(values);
    if (Object.keys(found).length > 0) {
      e.preventDefault();
      setClientErrors(found);
      if (DETAIL_FIELDS.some((k) => found[k])) setStep("details");
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
    // otherwise: let the form submit to the server action
  }

  const visibleKeys = step === "details" ? DETAIL_FIELDS : FIELD_ORDER;
  const summaryErrors = visibleKeys.map((k) => [k, errors[k]] as const).filter(([, m]) => Boolean(m));
  const showSummary = summaryErrors.length > 0;

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Step indicator */}
      <ol className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wide text-ink-subtle">
        {(["details", "review"] as const).map((s, i) => (
          <li key={s} className={cn("flex items-center gap-2", step === s && "text-primary")}>
            {i > 0 && <span aria-hidden className="h-px w-4 bg-border" />}
            <span
              className={cn(
                "grid h-5 w-5 place-items-center rounded-full text-[10px]",
                step === s ? "bg-primary text-primary-ink" : "bg-surface-muted text-ink-subtle",
              )}
            >
              {i + 1}
            </span>
            {s === "details" ? "Details" : "Review"}
          </li>
        ))}
      </ol>

      {showSummary && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm"
        >
          <p className="font-medium text-danger">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-danger">
            {summaryErrors.map(([k, m]) => (
              <li key={k}>
                <a href={`#${fid(k)}`} className="underline">
                  {LABELS[k]}: {m}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div hidden={step !== "details"} className="space-y-6">
        <Text
          id={fid("fullName")}
          name="fullName"
          label="Full name (as on your passport)"
          hint="Enter it exactly as printed in your passport."
          autoComplete="name"
          value={values.fullName}
          error={errors.fullName}
          onChange={(v) => set("fullName", v)}
          onBlur={() => onBlur("fullName")}
        />

        <Text
          id={fid("email")}
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          error={errors.email}
          onChange={(v) => set("email", v)}
          onBlur={() => onBlur("email")}
        />

        <Text
          id={fid("confirmEmail")}
          name="confirmEmail"
          type="email"
          label="Confirm email address"
          autoComplete="email"
          inputMode="email"
          value={values.confirmEmail}
          error={errors.confirmEmail}
          onChange={(v) => set("confirmEmail", v)}
          onBlur={() => onBlur("confirmEmail")}
        />

        <button
          type="button"
          onClick={tryAdvanceToReview}
          className="flex h-12 w-full items-center justify-center rounded bg-primary text-body-sm font-semibold text-primary-ink transition-colors hover:bg-primary/90"
        >
          Continue to review
        </button>
      </div>

      <div hidden={step !== "review"} className="space-y-6">
        <div className="rounded-xl border border-border bg-surface-muted/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-caption font-semibold uppercase tracking-wide text-ink-subtle">Your details</p>
            <button
              type="button"
              onClick={() => setStep("details")}
              className="inline-flex items-center gap-1 text-caption font-medium text-primary hover:underline"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Edit
            </button>
          </div>
          <dl className="mt-2 space-y-1 text-body-sm">
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-ink-muted">Full name</dt>
              <dd className="min-w-0 break-words text-end text-ink">{values.fullName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-ink-muted">Email</dt>
              <dd className="min-w-0 break-words text-end text-ink">{values.email}</dd>
            </div>
          </dl>
        </div>

        <ul className="space-y-2 text-body-sm text-ink-muted">
          {[
            "Membership is annual; this launch offer holds Early Bird benefits through Dec 31, 2028 at no extra cost.",
            "Fees are non-refundable and non-recurring — we never set up auto-renewal.",
            "Activate at least 14 days before you travel, per our activation policy.",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              {line}
            </li>
          ))}
        </ul>

        <fieldset className="space-y-3">
          <legend className="sr-only">Required confirmations</legend>

          <Check
            id={fid("agreeTerms")}
            name="agreeTerms"
            checked={values.agreeTerms}
            error={errors.agreeTerms}
            onChange={(v) => set("agreeTerms", v)}
          >
            I agree to the{" "}
            <Link href="/legal/terms" target="_blank" className="font-medium text-primary underline">
              Terms &amp; Conditions and Fair Usage Policy
            </Link>
            .
          </Check>

          <Check
            id={fid("confirmPrivacy")}
            name="confirmPrivacy"
            checked={values.confirmPrivacy}
            error={errors.confirmPrivacy}
            onChange={(v) => set("confirmPrivacy", v)}
          >
            I confirm that my data is protected under strict{" "}
            <Link href="/legal/privacy" target="_blank" className="font-medium text-primary underline">
              privacy guidelines
            </Link>
            .
          </Check>
        </fieldset>

        <button
          type="submit"
          disabled={isPending}
          className="flex h-12 w-full items-center justify-center rounded bg-primary text-body-sm font-semibold text-primary-ink transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {isPending ? "Starting secure payment…" : "Continue to payment"}
        </button>

        <p className="text-center text-caption text-ink-subtle">
          You will be taken to the payment provider&apos;s secure page. Card details are
          never handled by this website.
        </p>
      </div>
    </form>
  );
}

/* ── field primitives (local, so ids are stable for the error summary) ── */

function Text({
  id,
  name,
  label,
  hint,
  type = "text",
  value,
  error,
  autoComplete,
  inputMode,
  onChange,
  onBlur,
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  type?: string;
  value: string;
  error?: string;
  autoComplete?: string;
  inputMode?: "email" | "text";
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errId].filter(Boolean).join(" ") || undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          "h-11 w-full rounded border bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle",
          "focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-primary",
          error ? "border-danger" : "border-border",
        )}
      />
      {error && (
        <p id={errId} className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function Check({
  id,
  name,
  checked,
  error,
  onChange,
  children,
}: {
  id: string;
  name: string;
  checked: boolean;
  error?: string;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  const errId = error ? `${id}-err` : undefined;
  return (
    <div>
      <div className="flex gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          aria-invalid={error ? true : undefined}
          aria-describedby={errId}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand-indigo"
        />
        <label htmlFor={id} className="text-sm text-ink">
          {children}
        </label>
      </div>
      {error && (
        <p id={errId} className="mt-1 pl-7 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
