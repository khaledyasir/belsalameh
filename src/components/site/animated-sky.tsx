import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

/**
 * Decorative animated background: soft clouds + two parallax layers of the
 * brand airplane pattern drifting sideways. Pure CSS (keyframe `bsl-drift`
 * in globals.css); each layer travels exactly one tile width so it loops
 * seamlessly, and it freezes under prefers-reduced-motion.
 *
 * Assets: /public/planes-{gold,white}.png (keyed from content/Gemini_*).
 * Put it inside a `relative overflow-hidden` parent.
 */
type Props = { variant?: "gold" | "white"; className?: string };

const CLOUDS =
  "radial-gradient(45% 60% at 18% 40%, rgba(255,255,255,0.55), transparent 70%)," +
  "radial-gradient(38% 55% at 52% 62%, rgba(255,255,255,0.42), transparent 72%)," +
  "radial-gradient(50% 55% at 84% 34%, rgba(255,255,255,0.5), transparent 72%)";

function layer(style: CSSProperties): CSSProperties {
  return { animation: "bsl-drift linear infinite", backgroundRepeat: "repeat-x", willChange: "background-position", ...style };
}

export function AnimatedSky({ variant = "gold", className }: Props) {
  const img = variant === "gold" ? "/planes-gold.png" : "/planes-white.png";

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* clouds — slowest, drifting left */}
      <div
        className="absolute inset-0 opacity-70"
        style={layer({
          background: CLOUDS,
          backgroundSize: "1100px 70%",
          backgroundPosition: "0 28%",
          filter: "blur(10px)",
          animationDuration: "120s",
          ["--bsl-drift" as string]: "-1100px",
        } as CSSProperties)}
      />
      {/* far planes — small, very faint, drifting right */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={layer({
          backgroundImage: `url(${img})`,
          backgroundSize: "300px auto",
          backgroundPosition: "0 32%",
          animationDuration: "43s",
          ["--bsl-drift" as string]: "300px",
        } as CSSProperties)}
      />
      {/* near planes — slightly larger, still subtle, drifting right */}
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={layer({
          backgroundImage: `url(${img})`,
          backgroundSize: "440px auto",
          backgroundPosition: "0 74%",
          animationDuration: "34s",
          ["--bsl-drift" as string]: "440px",
        } as CSSProperties)}
      />
    </div>
  );
}
