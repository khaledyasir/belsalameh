"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from `start` to `end` over `duration` ms once the referenced
 * element scrolls into view. Uses IntersectionObserver (fires once) plus a
 * short-lived requestAnimationFrame loop that stops itself when done, so
 * there is no perpetual polling. Skips straight to the end value for
 * prefers-reduced-motion.
 */
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useCountUp(end: number, start = 0, duration = 1100) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? end : start));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const startTime = performance.now();
        function tick(now: number) {
          const progress = Math.min(1, (now - startTime) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(start + (end - start) * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, start, duration]);

  return { value, ref };
}
