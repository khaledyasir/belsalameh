import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { JoinTrigger } from "./join";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-sand/60 bg-brand-cream/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Balsalameh home">
          <Wordmark tone="dark" />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4" aria-label="Primary">
          <Link
            href="/#how-it-works"
            className="hidden rounded-full px-3 py-1.5 text-sm text-ink-muted hover:text-ink sm:block"
          >
            How it works
          </Link>
          <Link
            href="/faq"
            className="hidden rounded-full px-3 py-1.5 text-sm text-ink-muted hover:text-ink sm:block"
          >
            FAQ
          </Link>
          <JoinTrigger className="inline-flex items-center rounded-full bg-brand-indigo px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-indigo/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-indigo">
            Get membership
          </JoinTrigger>
        </nav>
      </div>
    </header>
  );
}
