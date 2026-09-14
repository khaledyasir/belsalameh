"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/lib/hooks/use-reveal";

/** Fades/slides a section into view once scrolled into the viewport. See globals.css `.reveal`. */
export function Reveal({
  as: Tag = "div",
  delay,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: "div" | "section" | "li"; delay?: number }) {
  const { ref, isVisible } = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn("reveal", isVisible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
