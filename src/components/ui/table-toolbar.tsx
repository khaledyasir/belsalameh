import { Search } from "lucide-react";
import { Button } from "./button";

/**
 * Filters live in one row above the table (dataviz/interaction convention).
 * Plain GET form — no client JS; the page reads `searchParams`.
 */
export function TableToolbar({
  action,
  q,
  filters,
  children,
}: {
  action: string;
  q?: string;
  filters?: { name: string; label: string; value?: string; options: { value: string; label: string }[] }[];
  children?: React.ReactNode;
}) {
  return (
    <form
      method="get"
      action={action}
      className="mb-3 flex flex-wrap items-end gap-2"
      role="search"
    >
      <div className="min-w-[12rem] flex-1">
        <label htmlFor="tt-q" className="mb-1 block text-xs font-medium text-ink-muted">
          Search
        </label>
        <div className="flex h-10 items-center gap-2 rounded border border-border bg-surface px-2.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-primary">
          <Search className="h-4 w-4 text-ink-subtle" aria-hidden />
          <input
            id="tt-q"
            name="q"
            defaultValue={q}
            placeholder="Name, email, ID, reference…"
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-ink-subtle"
          />
        </div>
      </div>

      {filters?.map((f) => (
        <div key={f.name}>
          <label htmlFor={`tt-${f.name}`} className="mb-1 block text-xs font-medium text-ink-muted">
            {f.label}
          </label>
          <select
            id={`tt-${f.name}`}
            name={f.name}
            defaultValue={f.value ?? ""}
            className="h-10 rounded border border-border bg-surface px-2 pr-8 text-sm focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-primary"
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      <Button type="submit" variant="secondary">
        Apply
      </Button>
      {children}
    </form>
  );
}
