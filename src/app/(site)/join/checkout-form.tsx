"use client";

import { useActionState, useId, useRef, useState } from "react";
import Link from "next/link";
import { checkoutSchema, toFieldErrors, initialCheckoutState, type CheckoutFieldErrors } from "@/lib/checkout";
import { startCheckout } from "./actions";
import { cn } from "@/lib/utils";

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

export function CheckoutForm() {
  const [serverState, formAction, isPending] = useActionState(startCheckout, initialCheckoutState);
  const [values, setValues] = useState<Values>(EMPTY);
  const [clientErrors, setClientErrors] = useState<CheckoutFieldErrors>({});
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

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      e.preventDefault();
      setClientErrors(found);
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
    // otherwise: let the form submit to the server action
  }

  const summaryErrors = FIELD_ORDER.map((k) => [k, errors[k]] as const).filter(([, m]) => Boolean(m));
  const showSummary = summaryErrors.length > 0;

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="space-y-6">
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
          <Link href="/legal/terms" target="_blank" className="font-medium text-brand-indigo underline">
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
          <Link href="/legal/privacy" target="_blank" className="font-medium text-brand-indigo underline">
            privacy guidelines
          </Link>
          .
        </Check>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center rounded bg-brand-indigo text-sm font-semibold text-white transition-colors hover:bg-brand-indigo/90 disabled:opacity-60"
      >
        {isPending ? "Starting secure payment…" : "Continue to payment"}
      </button>

      <p className="text-center text-xs text-ink-subtle">
        You will be taken to the payment provider&apos;s secure page. Card details are
        never handled by this website.
      </p>
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
