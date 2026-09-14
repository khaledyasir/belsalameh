import Link from "next/link";
import { Table, THead, Th, TBody, Tr, Td } from "./table";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** show in the stacked mobile card */
  mobile?: boolean;
  className?: string;
};

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  caption,
  rowHref,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  caption: string;
  rowHref?: (row: T) => string;
  empty?: { title: string; description?: string };
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={empty?.title ?? "Nothing to show yet"}
        description={empty?.description ?? "Records will appear here once data is available."}
      />
    );
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden rounded-lg border border-border bg-surface sm:block">
        <Table>
          <caption className="sr-only">{caption}</caption>
          <THead>
            <tr>
              {columns.map((c) => (
                <Th key={c.key} className={c.className}>
                  {c.header}
                </Th>
              ))}
            </tr>
          </THead>
          <TBody>
            {rows.map((row) => {
              const href = rowHref?.(row);
              return (
                <Tr key={row.id} className={cn(href && "cursor-pointer")}>
                  {columns.map((c, ci) => (
                    <Td key={c.key} className={c.className}>
                      {href && ci === 0 ? (
                        <Link href={href} className="block font-medium text-brand-indigo hover:underline">
                          {c.cell(row)}
                        </Link>
                      ) : (
                        c.cell(row)
                      )}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </TBody>
        </Table>
      </div>

      {/* Mobile stacked cards */}
      <ul className="space-y-2 sm:hidden">
        {rows.map((row) => {
          const href = rowHref?.(row);
          const inner = (
            <div className="rounded-lg border border-border bg-surface p-3">
              {columns
                .filter((c) => c.mobile ?? true)
                .map((c, ci) => (
                  <div key={c.key} className={cn("flex justify-between gap-3 py-1", ci === 0 && "font-medium text-ink")}>
                    <span className="text-xs text-ink-subtle">{c.header}</span>
                    <span className="text-right text-sm">{c.cell(row)}</span>
                  </div>
                ))}
            </div>
          );
          return <li key={row.id}>{href ? <Link href={href}>{inner}</Link> : inner}</li>;
        })}
      </ul>
    </>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  baseHref,
}: {
  page: number;
  pageSize: number;
  total: number;
  baseHref: string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const mk = (p: number) => `${baseHref}${baseHref.includes("?") ? "&" : "?"}page=${p}`;
  return (
    <nav className="mt-4 flex items-center justify-between text-sm" aria-label="Pagination">
      <p className="text-ink-muted">
        Page {page} of {pages} · {total} records
      </p>
      <div className="flex gap-1">
        <PageLink href={mk(Math.max(1, page - 1))} disabled={page <= 1}>
          Previous
        </PageLink>
        <PageLink href={mk(Math.min(pages, page + 1))} disabled={page >= pages}>
          Next
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({ href, disabled, children }: { href: string; disabled: boolean; children: React.ReactNode }) {
  if (disabled) {
    return <span className="rounded border border-border px-3 py-1.5 text-ink-subtle opacity-50">{children}</span>;
  }
  return (
    <Link href={href} className="rounded border border-border px-3 py-1.5 text-ink hover:bg-surface-muted">
      {children}
    </Link>
  );
}
