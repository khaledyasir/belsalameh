"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Luggage } from "lucide-react";
import { cn } from "@/lib/utils";
import { JoinTrigger } from "@/components/site/join";
import { PARTNER } from "@/lib/site-content";
import { trackEvent } from "@/lib/analytics";

const MIN = 20;
const MAX = 30;
const STANDARD_MAX = 23;
const SERVICE_MAX = 27;

type Band = "standard" | "member" | "outside";

function bandFor(kg: number): Band {
  if (kg <= STANDARD_MAX) return "standard";
  if (kg <= SERVICE_MAX) return "member";
  return "outside";
}

const COPY: Record<Band, { label: string; message: string }> = {
  standard: {
    label: "Standard allowance",
    message: `Already included with your eligible ${PARTNER} ticket — nothing extra to pay.`,
  },
  member: {
    label: "Belsalameh member range",
    message:
      "Your additional 1–4 kg falls inside the launch micro-excess service. Show your confirmation email at check-in for the protected member rate.",
  },
  outside: {
    label: "Outside this service",
    message: "Standard airline excess-baggage rules and rates apply.",
  },
};

/** Percentage position (0-100) of a kg value along the MIN–MAX track. */
function pct(kg: number) {
  return ((kg - MIN) / (MAX - MIN)) * 100;
}

export function WeightSimulator() {
  const [kg, setKg] = useState(24.5);
  const id = useId();
  const band = bandFor(kg);
  const copy = COPY[band];
  const tracked = useRef(false);

  function onSlide(next: number) {
    setKg(next);
    if (!tracked.current) {
      tracked.current = true;
      trackEvent("weight_simulator_used");
    }
  }

  const trackBackground = useMemo(() => {
    const standardEnd = pct(STANDARD_MAX);
    const memberEnd = pct(SERVICE_MAX);
    return `linear-gradient(to right,
      rgb(var(--border)) 0%, rgb(var(--border)) ${standardEnd}%,
      rgb(var(--accent)) ${standardEnd}%, rgb(var(--accent)) ${memberEnd}%,
      rgb(var(--border)) ${memberEnd}%, rgb(var(--border)) 100%)`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:gap-10">
        {/* Visual: suitcase fills toward the current weight */}
        <div aria-hidden className="relative grid h-28 w-28 shrink-0 place-items-center rounded-2xl bg-surface-muted">
          <Luggage
            className={cn(
              "h-14 w-14 transition-colors duration-base ease-premium",
              band === "standard" && "text-ink-subtle",
              band === "member" && "text-accent",
              band === "outside" && "text-danger",
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <label htmlFor={id} className="text-body-sm font-semibold uppercase tracking-wide text-ink-subtle">
              Drag to check your bag weight
            </label>
            <p className="font-display text-heading-1 tabular-nums text-ink" aria-hidden>
              {kg.toFixed(1)} <span className="text-body-sm font-sans font-normal text-ink-muted">kg</span>
            </p>
          </div>

          <input
            id={id}
            type="range"
            min={MIN}
            max={MAX}
            step={0.1}
            value={kg}
            onChange={(e) => onSlide(Number(e.target.value))}
            aria-valuetext={`${kg.toFixed(1)} kilograms — ${copy.label}`}
            className="bsl-weight-slider mt-3 w-full"
            style={{ background: trackBackground }}
          />

          <div className="mt-1 flex justify-between text-caption text-ink-subtle">
            <span>{MIN} kg</span>
            <span>{STANDARD_MAX} kg</span>
            <span>{SERVICE_MAX} kg</span>
            <span>{MAX} kg</span>
          </div>

          <div className="mt-5" aria-live="polite">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-caption font-semibold uppercase tracking-wide",
                band === "standard" && "bg-surface-muted text-ink-subtle",
                band === "member" && "bg-accent/15 text-accent-ink",
                band === "outside" && "bg-danger/10 text-danger",
              )}
            >
              {copy.label}
            </span>
            <p className="mt-2 text-body text-ink-muted">{copy.message}</p>
          </div>

          {band === "member" && (
            <div className="mt-4">
              <JoinTrigger className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-body-sm font-semibold text-primary-ink shadow-sm transition duration-base ease-premium hover:-translate-y-0.5 hover:shadow-md">
                Activate membership
              </JoinTrigger>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
