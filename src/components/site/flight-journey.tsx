"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import { PlaneIcon } from "./plane-icon";
import { useFlightPath } from "./use-flight-path";

const PATH_D = "M20,0 C 34,14 6,28 20,44 C 34,58 6,72 20,86 C 30,94 14,98 20,100";

/**
 * A plane that drifts down a narrow corridor in the right margin as the
 * visitor scrolls from Members Benefits through to the footer, following a
 * real curved path (sampled via getPointAtLength) rather than a straight
 * line. Confined entirely to a right-edge gutter so it can never cover
 * text or CTAs. Hidden on narrow phones and under reduced motion.
 */
export function FlightJourney() {
  const pathRef = useRef<SVGPathElement>(null);
  const point = useFlightPath("benefits", "site-footer", pathRef);

  return (
    <div className={`flight-journey ${point ? "flight-journey--active" : ""}`} aria-hidden="true">
      <svg className="flight-journey__rail" viewBox="0 0 40 100" preserveAspectRatio="none">
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="1.5 3"
          strokeLinecap="round"
        />
      </svg>
      {point && (
        <PlaneIcon
          className="flight-journey__plane"
          style={
            {
              "--fj-right": `${8 + (point.x / 40) * 18}px`,
              "--fj-top": `${8 + (point.y / 100) * 78}vh`,
              "--fj-rotate": `${point.angle + 45}deg`,
            } as unknown as CSSProperties
          }
        />
      )}
    </div>
  );
}
