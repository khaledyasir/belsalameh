import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

/**
 * Decorative animated background: soft clouds + scattered airplane silhouettes
 * drifting gently back and forth. Each plane is an individually-positioned
 * icon (not a repeating image tile) so there are no visible seams/grid lines —
 * a tiled `background-image` pattern was tried first and read as a grid.
 * Rotation is passed via the `--r` custom property (not a literal `transform`)
 * because the drift keyframes also animate `transform`, which would otherwise
 * silently discard any other rotation value for the duration of the animation.
 * Pure CSS (`bsl-plane-drift-x` / `-y` in globals.css); frozen automatically
 * under prefers-reduced-motion (see the global rule in globals.css).
 */
type Props = { variant?: "gold" | "white"; className?: string };

interface Aircraft {
  top: string;
  left: string;
  size: number;
  duration: string;
  delay: string;
  axis: "x" | "y";
  travel: number;
  opacity: number;
  rotate: number;
}

const CLOUDS =
  "radial-gradient(45% 60% at 18% 40%, rgba(255,255,255,0.55), transparent 70%)," +
  "radial-gradient(38% 55% at 52% 62%, rgba(255,255,255,0.42), transparent 72%)," +
  "radial-gradient(50% 55% at 84% 34%, rgba(255,255,255,0.5), transparent 72%)";

const FLEET: Aircraft[] = [
  { top: "10%", left: "8%", size: 26, duration: "18s", delay: "0s", axis: "x", travel: 36, opacity: 1, rotate: 22 },
  { top: "20%", left: "76%", size: 18, duration: "14s", delay: "-4s", axis: "x", travel: -30, opacity: 1, rotate: -12 },
  { top: "34%", left: "40%", size: 32, duration: "22s", delay: "-9s", axis: "y", travel: 26, opacity: 1, rotate: 30 },
  { top: "50%", left: "16%", size: 16, duration: "13s", delay: "-2s", axis: "x", travel: 24, opacity: 1, rotate: 6 },
  { top: "58%", left: "88%", size: 22, duration: "19s", delay: "-11s", axis: "x", travel: -28, opacity: 1, rotate: -25 },
  { top: "70%", left: "58%", size: 20, duration: "16s", delay: "-6s", axis: "y", travel: -22, opacity: 1, rotate: 15 },
  { top: "82%", left: "24%", size: 28, duration: "21s", delay: "-15s", axis: "y", travel: 20, opacity: 1, rotate: -18 },
  { top: "88%", left: "68%", size: 15, duration: "12s", delay: "-1s", axis: "x", travel: 26, opacity: 1, rotate: 28 },
];

export function AnimatedSky({ variant = "gold", className }: Props) {
  const color = variant === "gold" ? "rgb(var(--accent))" : "rgba(255,255,255,0.85)";
  const baseOpacity = variant === "gold" ? 0.16 : 0.14;

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: CLOUDS,
          backgroundSize: "1100px 70%",
          backgroundPosition: "0 28%",
          filter: "blur(10px)",
        }}
      />
      {FLEET.map((plane, i) => (
        <Plane
          key={i}
          aria-hidden
          className="absolute"
          style={
            {
              top: plane.top,
              left: plane.left,
              width: plane.size,
              height: plane.size,
              color,
              opacity: plane.opacity * baseOpacity,
              animation: `bsl-plane-drift-${plane.axis} ${plane.duration} ease-in-out infinite alternate`,
              animationDelay: plane.delay,
              "--r": `${plane.rotate}deg`,
              "--t": `${plane.travel}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
