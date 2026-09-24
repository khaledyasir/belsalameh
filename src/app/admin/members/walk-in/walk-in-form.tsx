"use client";

import { useActionState, useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DurationPicker } from "@/components/admin/duration-picker";
import { durationLabel, expiryFrom, planTotal, type MembershipPlan } from "@/lib/membership";
import { formatExpiry, formatMoney } from "@/lib/format";
import { initialWalkInState } from "@/lib/walk-in";
import { addWalkInMember } from "./actions";

export function WalkInForm({ plan }: { plan: MembershipPlan }) {
  const [state, formAction, isPending] = useActionState(addWalkInMember, initialWalkInState);
  const [months, setMonths] = useState<number | null>(plan.durationMonths);
  const end = months !== null ? expiryFrom(new Date(), months) : null;

  return (
    <form action={formAction} className="space-y-5">
      {state.formError && (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm font-medium text-danger">
          {state.formError}
        </p>
      )}

      <Field label="Full name (as on passport)" required error={state.errors.fullName}>
        {(props) => <Input {...props} name="fullName" autoComplete="name" required />}
      </Field>

      <Field label="Email address" required error={state.errors.email}>
        {(props) => <Input {...props} name="email" type="email" autoComplete="email" required />}
      </Field>

      <DurationPicker name="durationMonths" defaultMonths={plan.durationMonths} onChange={setMonths} error={state.errors.durationMonths} />

      <div className="rounded-xl bg-brand-cream/70 px-4 py-3 text-sm" aria-live="polite">
        {months !== null && end ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="text-ink-muted">Amount to collect for {durationLabel(months)}</span>
              <span className="font-display text-lg font-bold text-ink">{formatMoney(planTotal(plan, months), plan.currency)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Valid until {formatExpiry(end.month, end.year)}. Calculated from the plan in Settings (
              {formatMoney(plan.priceMinor, plan.currency)} for {durationLabel(plan.durationMonths)}).
            </p>
          </>
        ) : (
          <p className="text-ink-muted">Choose a valid duration to see the amount.</p>
        )}
      </div>

      <Button type="submit" disabled={isPending || months === null}>
        {isPending ? "Creating membership…" : "Create membership & send confirmation"}
      </Button>
    </form>
  );
}
