"use client";

import { useActionState, useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DurationPicker } from "@/components/admin/duration-picker";
import { durationLabel, expiryFrom } from "@/lib/membership";
import { JOD_MINOR_UNITS, initialPlanState, priceSchema } from "@/lib/plan-schema";
import { formatExpiry, formatMoney } from "@/lib/format";
import { savePlanSettings } from "./actions";

export function PlanForm({
  initial,
  currency,
}: {
  initial: { priceMinor: number; durationMonths: number };
  currency: string;
}) {
  const [state, formAction, isPending] = useActionState(savePlanSettings, initialPlanState);
  const [price, setPrice] = useState(String(initial.priceMinor / JOD_MINOR_UNITS));
  const [months, setMonths] = useState<number | null>(initial.durationMonths);

  const parsedPrice = priceSchema.safeParse(price);
  const ready = parsedPrice.success && months !== null;
  const end = months !== null ? expiryFrom(new Date(), months) : null;

  return (
    <form action={formAction} className="space-y-6">
      {state.formError && (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm font-medium text-danger">
          {state.formError}
        </p>
      )}
      {state.saved && (
        <p role="status" className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm font-medium text-success">
          Saved. The website and the walk-in tab now use this plan.
        </p>
      )}

      <DurationPicker name="durationMonths" defaultMonths={initial.durationMonths} onChange={setMonths} error={state.errors.durationMonths} />

      <Field
        label={`Price (${currency})`}
        hint="The total a member pays for the duration above. The walk-in tab scales this proportionally for other durations."
        required
        error={state.errors.price}
      >
        {(props) => (
          <Input
            {...props}
            name="price"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="max-w-40"
            required
          />
        )}
      </Field>

      <div className="rounded-xl bg-brand-cream/70 px-4 py-3 text-sm" aria-live="polite">
        {ready && end ? (
          <>
            <p className="font-medium text-ink">
              Anyone who joins now pays {formatMoney(parsedPrice.data, currency)} for {durationLabel(months!)}.
            </p>
            <p className="text-xs text-ink-muted">
              Valid until {formatExpiry(end.month, end.year)} if they join today.
              Existing members keep what they already paid for.
            </p>
          </>
        ) : (
          <p className="text-ink-muted">Enter a valid price and duration to see a preview.</p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save plan"}
      </Button>
    </form>
  );
}
