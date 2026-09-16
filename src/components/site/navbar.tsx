import { JoinTrigger } from "./join";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Member Services", href: "#member-services" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a href="#home" className="navbar__brand" aria-label="Belsalameh home">
          <img src="/logo-dark.png" alt="Belsalameh" className="navbar__brand-icon" />
        </a>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <JoinTrigger className="btn btn--pill navbar__cta">Activate Membership</JoinTrigger>
      </div>
    </header>
  );
}
