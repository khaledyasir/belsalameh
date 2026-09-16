import Link from "next/link";
import { JoinTrigger } from "./join";

// Prefixed with "/" so these work from any page, not just the homepage -
// a bare "#home" only scrolls if you're already on / (nothing to scroll to
// on /checkout, /faq, etc). "/#id" navigates to the homepage first.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Member Services", href: "/#member-services" },
  { label: "FAQ", href: "/#faq" },
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

        <JoinTrigger className="btn btn--pill navbar__cta">Activate Membership</JoinTrigger>
      </div>
    </header>
  );
}
