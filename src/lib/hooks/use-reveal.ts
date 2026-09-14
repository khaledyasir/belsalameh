"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adds `.reveal` to an element and flips `is-visible` once it scrolls into
 * view. Styling/gating lives in globals.css (`.motion-ready .reveal`) — with
 * JS disabled, or before hydration, the element is never hidden.
 */
export function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isVisible };
}
