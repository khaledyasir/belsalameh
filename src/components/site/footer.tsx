import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site-content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="site-footer" className="footer">
      <div className="footer__inner">
        <div className="footer__brand-col">
          <img src="/logo-plane.png" alt="Belsalameh" className="footer__logo" />
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Explore</p>
          <ul className="footer__links">
            <li>
              <Link href="/#how-it-works">How It Works</Link>
            </li>
            <li>
              <Link href="/#member-services">Member Services</Link>
            </li>
            <li>
              <Link href="/#faq">FAQ</Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Legal</p>
          <ul className="footer__links">
            <li>
              <Link href="/legal/terms">Terms &amp; Conditions</Link>
            </li>
            <li>
              <Link href="/legal/privacy">Privacy Policy</Link>
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
              <a href="https://www.instagram.com/belsalameh/" target="_blank" rel="noreferrer">
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
