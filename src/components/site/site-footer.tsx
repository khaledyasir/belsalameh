import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { SITE, CONTACT_EMAIL } from "@/lib/site-content";

const EXPLORE = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Member services", href: "/#member-services" },
  { label: "FAQ", href: "/faq" },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-indigo text-brand-cream/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Wordmark tone="light" className="h-10 w-auto" />
          <p className="mt-3 font-display text-base text-brand-cream">{SITE.footer.tagline}</p>
        </div>

        <nav aria-label="Explore">
          <p className="font-medium text-white">Explore</p>
          <ul className="mt-2 space-y-1.5">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="font-medium text-white">Legal</p>
          <ul className="mt-2 space-y-1.5">
            <li>
              <Link href="/legal/terms" className="hover:text-white hover:underline">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="hover:text-white hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="font-medium text-white">Help</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 block hover:text-white hover:underline">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-brand-cream/60 sm:px-6">{SITE.footer.copyright}</p>
      </div>
    </footer>
  );
}
