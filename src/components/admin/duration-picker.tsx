"use client";

import { useEffect, useRef, useState } from "react";
import { DURATION_PRESETS, MAX_MONTHS, MIN_MONTHS, durationLabel } from "@/lib/membership";
import { cn } from "@/lib/utils";

/**
 * 1 / 2 / 3 years or a custom number of months. Submits the resulting number of
 * months in a hidden field called `name`, and reports it (or null while the
 * custom value is invalid) through `onChange` for live previews.
 */
export function DurationPicker({
  name,
  defaultMonths,
  onChange,
  error,
}: {
  name: string;
  defaultMonths: number;
  onChange?: (months: number | null) => void;
  error?: string;
}) {
  const isPreset = (DURATION_PRESETS as readonly number[]).includes(defaultMonths);
  const [choice, setChoice] = useState<string>(isPreset ? String(defaultMonths) : "custom");
  const [custom, setCustom] = useState(isPreset ? "" : String(defaultMonths));

  const raw = choice === "custom" ? custom : choice;
  const n = /^\d+$/.test(raw) ? Number(raw) : NaN;
  const months = n >= MIN_MONTHS && n <= MAX_MONTHS ? n : null;

  const cb = useRef(onChange);
  cb.current = onChange;
  useEffect(() => cb.current?.(months), [months]);

  const options = [...DURATION_PRESETS.map((m) => ({ value: String(m), label: durationLabel(m) })), { value: "custom", label: "Custom" }];

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-ink">Duration</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
              choice === o.value ? "border-brand-indigo bg-brand-indigo text-white" : "border-border text-ink hover:bg-surface-muted",
            )}
          >
            <input
              type="radio"
              className="sr-only"
              name={`${name}-choice`}
              value={o.value}
              checked={choice === o.value}
              onChange={() => setChoice(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
      {choice === "custom" && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={MIN_MONTHS}
            max={MAX_MONTHS}
            step={1}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            aria-label="Custom duration in months"
            aria-invalid={custom !== "" && months === null ? true : undefined}
            className="h-10 w-28 rounded border border-border bg-surface px-3 text-sm text-ink focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-primary aria-[invalid=true]:border-danger"
          />
          <span className="text-sm text-ink-muted">months ({MIN_MONTHS}–{MAX_MONTHS})</span>
        </div>
      )}
      <input type="hidden" name={name} value={months ?? ""} />
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </fieldset>
  );
}
