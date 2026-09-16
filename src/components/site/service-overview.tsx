"use client";

import { SuitcaseIcon } from "./suitcase-icon";
import { PlaneIcon } from "./plane-icon";
import { useCountUp } from "./use-count-up";

export function ServiceOverview() {
  const { value: weight, ref: scaleRef } = useCountUp(27, 23, 1200);
  const standardPct = (23 / 27) * 100;

  return (
    <section id="member-services" className="overview">
      <div className="overview__inner">
        <div className="overview__visual" ref={scaleRef} aria-hidden="true">
          <span className="scale__eyebrow">Micro-Excess Coverage</span>
          <div className="scale__display">
            <SuitcaseIcon className="scale__suitcase" />
            <div className="scale__platform" />
            <div className="scale__readout">
              <span className="scale__number">{weight.toFixed(1)}</span>
              <span className="scale__unit">KG</span>
            </div>
          </div>
          <div className="scale__bar">
            <div className="scale__bar-fill" style={{ width: `${standardPct}%` }} />
          </div>
          <div className="scale__labels">
            <span>Standard 23kg</span>
            <span className="scale__labels-accent">Covered to 27kg</span>
          </div>
        </div>

        <div className="overview__content">
          <p className="eyebrow">Introduction</p>
          <h2>Exclusive Airport Micro-Services, Co-Created for Modern Travelers</h2>
          <p className="overview__body overview__body--lead">
            Airlines don&apos;t advertise this. We do. Belsalameh unlocks member-only airport rates the moment you
            join — no public listing, no fine print, no guessing what you&apos;ll pay at the counter. Co-launched
            with founding partner Royal Jordanian, built for the one moment that matters: bag slightly over,
            confidence fully intact.
          </p>

          <div className="overview__divider" aria-hidden="true">
            <span className="overview__divider-line" />
            <PlaneIcon className="overview__divider-icon" />
            <span className="overview__divider-line" />
          </div>

          <div className="overview__service">
            <span className="pill-tag">Launch Service · Royal Jordanian Passengers Only</span>
            <h3>1–4 kg Micro-Excess Baggage Service</h3>
            <p className="overview__body">
              Slightly over your standard 23 kg baggage allowance? Avoid steep charges at the airport. Available
              exclusively for Royal Jordanian travelers, our premiere service unlocks unlisted member rates for
              minor excess baggage (covering 1.00 kg up to 4.00 kg, capping your bag at a maximum of 27.00 kg).
            </p>
            <p className="overview__callout">
              No online glitches. No hidden fees. No counter stress. No refund chaos. Pay your protected member rate
              directly at the check-in counter with total price transparency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
