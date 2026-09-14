import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="font-display text-4xl font-bold text-brand-indigo">404</p>
      <h1 className="mt-2 font-display text-lg font-semibold text-ink">Page not found</h1>
      <p className="mt-1 text-sm text-ink-muted">The record or page you were looking for does not exist.</p>
      <Link
        href="/admin"
        className="mt-4 inline-block rounded border border-border px-3 py-1.5 text-sm text-ink hover:bg-surface-muted"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
