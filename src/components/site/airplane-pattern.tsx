import { cn } from "@/lib/utils";

/**
 * The gold airplane motif from the brand guidelines, as a lightweight repeating
 * SVG texture (no raster image — keeps the page fast). Colour comes from
 * `currentColor`; set it and the opacity on the wrapper.
 */
export function AirplanePattern({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="bsl-planes"
          width="140"
          height="104"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-12)"
        >
          <path
            d="M2 21 L23 12 L2 3 v7 l15 2 l-15 2 z"
            transform="translate(14 16) scale(1.15)"
            fill="currentColor"
          />
          <path
            d="M2 21 L23 12 L2 3 v7 l15 2 l-15 2 z"
            transform="translate(84 64) scale(0.85)"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bsl-planes)" />
    </svg>
  );
}
