"use client";

import { useId, useRef, useState } from "react";
import { CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import { JoinTrigger } from "@/components/site/join";
import { PARTNER } from "@/lib/site-content";
import { trackEvent } from "@/lib/analytics";

type YesNo = "yes" | "no" | null;

const MIN = 20;
const MAX = 30;

function Toggle({
  value,
  onChange,
  id,
}: {
  value: YesNo;
  onChange: (v: YesNo) => void;
  id: string;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-border" role="group" aria-labelledby={id}>
      {(["yes", "no"] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
          className={cn(
            "px-4 py-2 text-body-sm font-semibold capitalize transition-colors duration-fast",
            value === opt ? "bg-primary text-primary-ink" : "bg-surface text-ink-muted hover:bg-surface-muted",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function EligibilityChecker() {
  const [pnrIsRj, setPnrIsRj] = useState<YesNo>(null);
  const [kg, setKg] = useState(24.5);
  const airlineId = useId();
  const pnrId = useId();
  const weightId = useId();
  const tracked = useRef(false);

  function onAnswer(v: YesNo) {
    setPnrIsRj(v);
    if (!tracked.current) {
      tracked.current = true;
      trackEvent("eligibility_checker_used");
    }
  }

  const answered = pnrIsRj !== null;
  const eligible = pnrIsRj === "yes" && kg > 23 && kg <= 27;
  const outsideReason =
    pnrIsRj === "no"
      ? `Codeshare and interline itineraries are currently excluded — the launch service applies only to flights operated directly by ${PARTNER} (PNR starting with "RJ").`
      : kg <= 23
        ? "Your bag is within the standard allowance — there's no excess to cover."
        : "Bags over 27 kg total are outside the launch service; standard airline excess-baggage rates apply.";

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p id={airlineId} className="text-body-sm font-semibold uppercase tracking-wide text-ink-subtle">
            Airline
          </p>
          <select
            aria-labelledby={airlineId}
            defaultValue={PARTNER}
            disabled
            className="mt-2 h-11 w-full rounded border border-border bg-surface-muted px-3 text-body text-ink"
          >
            <option>{PARTNER}</option>
          </select>
          <p className="mt-1.5 text-caption text-ink-subtle">More partner airlines are being added.</p>
        </div>

        <div>
          <p id={pnrId} className="text-body-sm font-semibold uppercase tracking-wide text-ink-subtle">
            Is this flight operated directly by {PARTNER}? (PNR starts with &ldquo;RJ&rdquo;)
          </p>
          <div className="mt-2">
            <Toggle id={pnrId} value={pnrIsRj} onChange={onAnswer} />
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <label htmlFor={weightId} className="text-body-sm font-semibold uppercase tracking-wide text-ink-subtle">
              Checked bag weight
            </label>
            <p className="font-display text-heading-2 tabular-nums text-ink" aria-hidden>
              {kg.toFixed(1)} <span className="text-body-sm font-sans font-normal text-ink-muted">kg</span>
            </p>
          </div>
          <input
            id={weightId}
            type="range"
            min={MIN}
            max={MAX}
            step={0.1}
            value={kg}
            onChange={(e) => setKg(Number(e.target.value))}
            aria-valuetext={`${kg.toFixed(1)} kilograms`}
            className="bsl-weight-slider mt-3 w-full bg-border"
          />
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6" aria-live="polite">
        {!answered ? (
          <p className="text-body-sm text-ink-subtle">Answer the question above to check eligibility.</p>
        ) : eligible ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-body font-semibold text-success">
              <CircleCheck className="h-5 w-5 shrink-0" aria-hidden />
              Likely within service range
            </p>
            <JoinTrigger className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-body-sm font-semibold text-primary-ink shadow-sm transition duration-base ease-premium hover:-translate-y-0.5 hover:shadow-md">
              Activate membership
            </JoinTrigger>
          </div>
        ) : (
          <p className="flex items-start gap-2 text-body font-semibold text-ink-muted">
            <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-ink-subtle" aria-hidden />
            <span>
              Outside current service range
              <span className="mt-1 block text-body-sm font-normal text-ink-muted">{outsideReason}</span>
            </span>
          </p>
        )}
        <p className="mt-4 text-caption text-ink-subtle">
          This is a guide only. Final eligibility remains subject to the current service terms and airline
          operational conditions.
        </p>
      </div>
    </div>
  );
}
