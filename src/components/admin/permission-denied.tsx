import Link from "next/link";
import { Lock } from "lucide-react";

export function PermissionDenied({ area }: { area: string }) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-surface p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface-muted">
        <Lock className="h-5 w-5 text-ink-muted" aria-hidden />
      </div>
      <h1 className="mt-4 font-display text-lg font-bold text-ink">Access restricted</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Your role does not have permission to view {area}. Contact an administrator
        if you need access.
      </p>
      <Link
        href="/admin"
        className="mt-4 inline-block rounded border border-border px-3 py-1.5 text-sm text-ink hover:bg-surface-muted"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
