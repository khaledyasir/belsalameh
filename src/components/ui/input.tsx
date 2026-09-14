import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded border border-border bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle " +
  "focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-primary disabled:opacity-50 " +
  "aria-[invalid=true]:border-danger aria-[invalid=true]:outline-danger";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(base, "h-10", className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(base, "min-h-[6rem] py-2 leading-relaxed", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn(base, "h-10 pr-8", className)} {...props} />
));
Select.displayName = "Select";
