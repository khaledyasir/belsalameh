import type { CSSProperties } from "react";
import { PlaneIcon } from "./plane-icon";

interface Aircraft {
  top: string;
  left: string;
  size: number;
  duration: string;
  delay: string;
  direction: "drift-right" | "drift-left" | "drift-vertical";
  opacity: number;
  rotate: number;
}

/** Scattered, irregular positions and sizes (no grid) so it reads as atmosphere rather than a repeating pattern. */
const DEFAULT_FLEET: Aircraft[] = [
  { top: "8%", left: "6%", size: 34, duration: "46s", delay: "0s", direction: "drift-right", opacity: 0.1, rotate: 25 },
  { top: "18%", left: "78%", size: 22, duration: "38s", delay: "-12s", direction: "drift-left", opacity: 0.07, rotate: -15 },
  { top: "32%", left: "38%", size: 44, duration: "58s", delay: "-30s", direction: "drift-vertical", opacity: 0.08, rotate: 40 },
  { top: "48%", left: "12%", size: 18, duration: "34s", delay: "-6s", direction: "drift-right", opacity: 0.09, rotate: 10 },
  { top: "55%", left: "88%", size: 30, duration: "50s", delay: "-22s", direction: "drift-left", opacity: 0.06, rotate: -30 },
  { top: "68%", left: "55%", size: 24, duration: "40s", delay: "-16s", direction: "drift-right", opacity: 0.1, rotate: 18 },
  { top: "80%", left: "22%", size: 38, duration: "52s", delay: "-40s", direction: "drift-vertical", opacity: 0.07, rotate: -22 },
  { top: "88%", left: "70%", size: 20, duration: "36s", delay: "-4s", direction: "drift-left", opacity: 0.09, rotate: 32 },
];

export function BackgroundAircraft({ fleet = DEFAULT_FLEET }: { fleet?: Aircraft[] }) {
  return (
    <div className="bg-aircraft" aria-hidden="true">
      {fleet.map((plane, i) => (
        <PlaneIcon
          key={i}
          className={`bg-aircraft__plane bg-aircraft__plane--${plane.direction}`}
          style={
            {
              top: plane.top,
              left: plane.left,
              width: `${plane.size}px`,
              height: `${plane.size}px`,
              opacity: plane.opacity,
              "--r": `${plane.rotate}deg`,
              animationDuration: plane.duration,
              animationDelay: plane.delay,
            } as unknown as CSSProperties
          }
        />
      ))}
    </div>
  );
}
