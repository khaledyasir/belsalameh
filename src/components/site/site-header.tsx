import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { JoinTrigger } from "./join";
import { NAV_LINKS } from "@/lib/site-content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-sand/60 bg-brand-cream/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Belsalameh home" className="flex items-center">
          <Wordmark tone="dark" className="h-9 w-auto sm:h-10" />
        </Link>

        <nav className="flex items-center gap-1 lg:gap-3" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hidden rounded-full px-3 py-1.5 text-sm text-ink-muted hover:text-ink lg:block"
            >
              {l.label}
            </Link>
          ))}
          <JoinTrigger className="inline-flex items-center rounded-full bg-brand-indigo px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-indigo/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-indigo sm:px-5">
            Activate membership
          </JoinTrigger>
        </nav>
      </div>
    </header>
  );
}
