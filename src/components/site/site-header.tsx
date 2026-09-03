import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { buttonClasses } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Balsalameh home">
          <Wordmark tone="dark" />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4" aria-label="Primary">
          <Link href="/#how-it-works" className="hidden rounded px-2 py-1 text-sm text-ink-muted hover:text-ink sm:block">
            How it works
          </Link>
          <Link href="/faq" className="hidden rounded px-2 py-1 text-sm text-ink-muted hover:text-ink sm:block">
            FAQ
          </Link>
          <Link href="/join" className={buttonClasses("primary", "sm")}>
            Get membership
          </Link>
        </nav>
      </div>
    </header>
  );
}
