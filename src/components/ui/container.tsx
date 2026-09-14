import * as React from "react";
import { cn } from "@/lib/utils";

/** Page-width wrapper. Logical inline padding so it's RTL-ready with no changes. */
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl ps-6 pe-6 sm:ps-8 sm:pe-8", className)}
      {...props}
    />
  );
}
