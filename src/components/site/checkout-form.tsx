"use client";

import { useActionState, useId, useRef, useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import {
  MAX_PEOPLE,
  checkoutSchema,
  toFieldErrors,
  initialCheckoutState,
  type CheckoutFieldErrors,
} from "@/lib/checkout";
import type { MembershipPlan } from "@/lib/membership";
import { formatMoney } from "@/lib/format";
import { startCheckout } from "./checkout-actions";
import { cn } from "@/lib/utils";

type Values = {
  fullName: string;
  email: string;
  confirmEmail: string;
  agreeTerms: boolean;
  confirmPrivacy: boolean;
  confirmAdult: boolean;
};

/** A row in the "add family or friends" list. `key` keeps typed text on the right row after a removal. */
type PartyRow = { key: number; fullName: string; email: string };

const EMPTY: Values = {
  fullName: "",
  email: "",
  confirmEmail: "",
  agreeTerms: false,
  confirmPrivacy: false,
  confirmAdult: false,
};

const FIELD_ORDER: (keyof Values)[] = ["fullName", "email", "confirmEmail", "agreeTerms", "confirmPrivacy", "confirmAdult"];
const LABELS: Record<keyof Values, string> = {
  fullName: "Full name",
  email: "Email address",
  confirmEmail: "Confirm email address",
  agreeTerms: "Terms & Conditions and Fair Usage Policy",
  confirmPrivacy: "Data protection confirmation",
  confirmAdult: "Age confirmation (18+)",
};

export function CheckoutForm({ plan }: { plan: MembershipPlan }) {
  const [serverState, formAction, isPending] = useActionState(startCheckout, initialCheckoutState);
  const [values, setValues] = useState<Values>(EMPTY);
  const [party, setParty] = useState<PartyRow[]>([]);
  const [clientErrors, setClientErrors] = useState<CheckoutFieldErrors>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const nextKey = useRef(1);
  const uid = useId();
  const fid = (k: string) => `${uid}-${k}`;

  // Server errors only show for fields the user has not since edited.
  const errors: CheckoutFieldErrors = { ...serverState.errors, ...clientErrors };

  const people = 1 + party.length;
  const total = plan.priceMinor * people;

  function validate(nextValues: Values, nextParty: PartyRow[]): CheckoutFieldErrors {
    const parsed = checkoutSchema.safeParse({
      ...nextValues,
      party: nextParty.map(({ fullName, email }) => ({ fullName, email })),
    });
    return parsed.success ? {} : toFieldErrors(parsed.error);
  }

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues({ ...values, [key]: value });
    // Clear this field's error as the user corrects it.
    setClientErrors((e) => {
      if (!e[key]) return e;
      const copy = { ...e };
      delete copy[key];
      return copy;
    });
  }

  function onBlur(key: keyof Values) {
    const all = validate(values, party);
    setClientErrors((e) => ({ ...e, ...(all[key] ? { [key]: all[key] } : {}) }));
  }

  function addPerson() {
    if (people >= MAX_PEOPLE) return;
    setParty((p) => [...p, { key: nextKey.current++, fullName: "", email: "" }]);
  }

  function removePerson(key: number) {
    setParty((p) => p.filter((r) => r.key !== key));
    // Row indexes shift after a removal, so stale per-row errors would land on the wrong person.
    setClientErrors((e) => ({ ...e, party: undefined, partyList: undefined }));
  }

  function setPerson(key: number, field: "fullName" | "email", value: string) {
    setParty((p) => p.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
    setClientErrors((e) => ({ ...e, party: undefined, partyList: undefined }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const found = validate(values, party);
    if (Object.keys(found).length > 0) {
      e.preventDefault();
      setClientErrors(found);
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
    // otherwise: let the form submit to the server action
  }

  const summaryErrors: { id: string; label: string; message: string }[] = [
    ...FIELD_ORDER.flatMap((k) => (errors[k] ? [{ id: fid(k), label: LABELS[k], message: errors[k]! }] : [])),
    ...party.flatMap((row, i) => {
      const rowErr = errors.party?.[i];
      return [
        ...(rowErr?.fullName ? [{ id: fid(`p${row.key}-name`), label: `Person ${i + 2} name`, message: rowErr.fullName }] : []),
        ...(rowErr?.email ? [{ id: fid(`p${row.key}-email`), label: `Person ${i + 2} email`, message: rowErr.email }] : []),
      ];
    }),
    ...(errors.partyList ? [{ id: fid("addPerson"), label: "Additional people", message: errors.partyList }] : []),
  ];

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="space-y-6">
      {summaryErrors.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm"
        >
          <p className="font-medium text-danger">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-danger">
            {summaryErrors.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="underline">
                  {s.label}: {s.message}
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

      {/* Family & friends: one payment, one membership (and Membership ID) per person. */}
      <fieldset className="space-y-3 rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-medium text-ink">Joining with family or friends? (optional)</legend>
        <p className="text-xs text-ink-muted">
          Add them here and pay once. Everyone gets their own Membership ID (you can add up to{" "}
          {MAX_PEOPLE - 1} more people). Use each person&apos;s name exactly as on their passport.
        </p>

        {party.map((row, i) => (
          <div key={row.key} className="space-y-3 rounded-lg bg-surface-muted/60 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">Person {i + 2}</p>
              <button
                type="button"
                onClick={() => removePerson(row.key)}
                aria-label={`Remove person ${i + 2}`}
                className="grid h-7 w-7 place-items-center rounded-full text-ink-muted transition hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <Text
              id={fid(`p${row.key}-name`)}
              name="partyName"
              label="Full name (as on passport)"
              autoComplete="off"
              value={row.fullName}
              error={errors.party?.[i]?.fullName}
              onChange={(v) => setPerson(row.key, "fullName", v)}
            />
            <Text
              id={fid(`p${row.key}-email`)}
              name="partyEmail"
              type="email"
              label="Email address (optional)"
              hint="If you add one, they also get their own confirmation email. Otherwise it goes to you."
              autoComplete="off"
              inputMode="email"
              optional
              value={row.email}
              error={errors.party?.[i]?.email}
              onChange={(v) => setPerson(row.key, "email", v)}
            />
          </div>
        ))}

        <button
          id={fid("addPerson")}
          type="button"
          onClick={addPerson}
          disabled={people >= MAX_PEOPLE}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-medium text-brand-indigo transition hover:bg-surface-muted disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {party.length === 0 ? "Add another person" : "Add one more person"}
        </button>
        {people >= MAX_PEOPLE && (
          <p className="text-xs text-ink-muted">That&apos;s the maximum of {MAX_PEOPLE} people per order.</p>
        )}
      </fieldset>

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

        <Check
          id={fid("confirmAdult")}
          name="confirmAdult"
          checked={values.confirmAdult}
          error={errors.confirmAdult}
          onChange={(v) => set("confirmAdult", v)}
        >
          {people > 1
            ? "I confirm that I and everyone I am adding are 18 years of age or older."
            : "I confirm that I am 18 years of age or older."}
        </Check>
      </fieldset>

      <div className="rounded-xl bg-brand-cream/70 px-4 py-3 text-sm" aria-live="polite">
        <div className="flex items-center justify-between">
          <span className="text-ink-muted">
            {people} {people === 1 ? "membership" : "memberships"} × {formatMoney(plan.priceMinor, plan.currency)}
          </span>
          <span className="font-display text-lg font-bold text-ink">{formatMoney(total, plan.currency)}</span>
        </div>
      </div>

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
  optional,
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
  optional?: boolean;
  onChange: (v: string) => void;
  onBlur?: () => void;
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
        required={!optional}
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
