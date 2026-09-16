import { CONTACT_EMAIL } from "@/lib/site-content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="site-footer" className="footer">
      <div className="footer__inner">
        <div className="footer__brand-col">
          <img src="/logo-plane.png" alt="Belsalameh" className="footer__logo" />
          <p className="footer__tagline">Fly in relief™</p>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Explore</p>
          <ul className="footer__links">
            <li>
              <a href="#how-it-works">How It Works</a>
            </li>
            <li>
              <a href="#member-services">Member Services</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Legal</p>
          <ul className="footer__links">
            <li>
              <a href="/legal/terms">Terms &amp; Conditions</a>
            </li>
            <li>
              <a href="/legal/privacy">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Help</p>
          <ul className="footer__links">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Follow Us</p>
          <ul className="footer__links footer__social">
            <li>
              <a href="https://www.instagram.com/blsalameh/" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <p className="footer__copy">© {year} Belsalameh. All rights reserved.</p>
      </div>
    </footer>
  );
}
