"use client";

import { useEffect, useRef, useState } from "react";

export interface FlightPoint {
  x: number;
  y: number;
  angle: number;
}

/**
 * Tracks scroll progress between two elements (by id) and samples a point
 * (plus tangent angle) along an SVG path ref for that progress, winding
 * through the path a few times so the plane drifts side to side repeatedly
 * over the full journey rather than crossing the curve just once.
 *
 * One passive scroll listener, throttled to one requestAnimationFrame per
 * event - no perpetual loop. Returns null while inactive or under
 * prefers-reduced-motion, so callers can simply not render anything.
 */
export function useFlightPath(
  startId: string,
  endId: string,
  pathRef: React.RefObject<SVGPathElement | null>,
  windings = 3,
) {
  const [point, setPoint] = useState<FlightPoint | null>(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    function measure() {
      tickingRef.current = false;
      const start = document.getElementById(startId);
      const end = document.getElementById(endId);
      const path = pathRef.current;
      if (!start || !end || !path) return;

      const startTop = start.getBoundingClientRect().top + window.scrollY;
      const endTop = end.getBoundingClientRect().top + window.scrollY;
      const viewportAnchor = window.scrollY + window.innerHeight * 0.35;
      const span = endTop - startTop || 1;
      const progress = (viewportAnchor - startTop) / span;

      if (progress < -0.02 || progress > 1.02) {
        setPoint(null);
        return;
      }

      const clamped = Math.min(1, Math.max(0, progress));
      const total = path.getTotalLength();
      const length = (clamped * windings * total) % total;
      const p1 = path.getPointAtLength(length);
      const p2 = path.getPointAtLength(Math.min(total, length + 1));
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

      setPoint({ x: p1.x, y: clamped * 100, angle });
    }

    function onScroll() {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(measure);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [startId, endId, pathRef, windings]);

  return point;
}
