import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { Container } from "@/components/ui/container";
import { JoinTrigger } from "./join";
import { MobileNav } from "./mobile-nav";
import { NAV_LINKS } from "@/lib/site-content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-sand/60 bg-brand-cream/85 backdrop-blur">
      <Container className="flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2">
        <Link href="/" aria-label="Belsalameh home" className="flex items-center">
          <Wordmark tone="dark" className="h-9 w-auto sm:h-10" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex lg:gap-3" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-3 py-1.5 text-body-sm text-ink-muted hover:text-ink">
              {l.label}
            </Link>
          ))}
          <JoinTrigger className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-body-sm font-semibold text-primary-ink shadow-sm transition duration-fast ease-premium hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Activate membership
          </JoinTrigger>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <JoinTrigger className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-body-sm font-semibold text-primary-ink shadow-sm">
            Activate
          </JoinTrigger>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
