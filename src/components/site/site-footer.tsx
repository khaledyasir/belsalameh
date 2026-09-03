import Link from "next/link";
import { SITE } from "@/lib/site-content";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-base font-semibold text-ink">Balsalameh</p>
          <p className="mt-1 text-ink-muted">{SITE.footer.companyLine.replace("{year}", String(year))}</p>
        </div>

        <nav aria-label="Footer">
          <p className="font-medium text-ink">Legal</p>
          <ul className="mt-2 space-y-1.5 text-ink-muted">
            <li>
              <Link href="/legal/terms" className="hover:text-ink hover:underline">
                Terms &amp; Conditions and Fair Usage Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="hover:text-ink hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="font-medium text-ink">Support</p>
          <p className="mt-2 text-ink-muted">{SITE.footer.supportEmail}</p>
          <p className="mt-4 text-xs text-ink-subtle">{SITE.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
