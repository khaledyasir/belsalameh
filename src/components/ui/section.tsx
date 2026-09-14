import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Small label above the heading, e.g. "Founding partner · Royal Jordanian". */
  eyebrow?: React.ReactNode;
  heading?: React.ReactNode;
  lead?: React.ReactNode;
  /** `start` (default, logical — reads as left in LTR / right in RTL) or `center`. */
  align?: "start" | "center";
  headingClassName?: string;
  containerClassName?: string;
};

/**
 * Section shell every homepage/marketing section builds on: consistent
 * vertical rhythm (`py-section-*`) and an optional eyebrow/heading/lead
 * header block, laid out with logical (RTL-ready) alignment.
 */
export function Section({
  eyebrow,
  heading,
  lead,
  align = "start",
  className,
  containerClassName,
  headingClassName,
  children,
  ...props
}: SectionProps) {
  const isCentered = align === "center";

  return (
    <section className={cn("py-section-md", className)} {...props}>
      <Container className={containerClassName}>
        {(eyebrow || heading || lead) && (
          <div className={cn(isCentered ? "text-center" : "text-start", isCentered && "mx-auto max-w-2xl")}>
            {eyebrow && (
              <p className="text-caption font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
            )}
            {heading && (
              <h2 className={cn("mt-3 font-display text-display-2 font-bold text-ink", headingClassName)}>{heading}</h2>
            )}
            {lead && <p className="mt-4 text-body-lg text-ink-muted">{lead}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
