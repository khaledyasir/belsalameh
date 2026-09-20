import Link from "next/link";
import { JoinTrigger } from "./join";

// Prefixed with "/" so these work from any page, not just the homepage -
// a bare "#services" only scrolls if you're already on / (nothing to scroll
// to on /checkout, /faq, etc). "/#id" navigates to the homepage first.
const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Partners", href: "/#partners" },
  { label: "FAQ", href: "/faq" },
];

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link href="/" className="navbar__brand" aria-label="Belsalameh home">
          <img src="/logo-dark.png" alt="Belsalameh" className="navbar__brand-icon" />
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <JoinTrigger className="btn btn--gold btn--pill navbar__cta">Join</JoinTrigger>
      </div>
    </header>
  );
}
