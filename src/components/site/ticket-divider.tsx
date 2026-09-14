import { cn } from "@/lib/utils";

/** Torn-ticket perforation seam between two sections, instead of a plain edge. */
export function TicketDivider({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-3 bsl-perforation", className)} />;
}
