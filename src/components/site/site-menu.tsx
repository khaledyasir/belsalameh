"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site-content";
import { FOOTER_EXPLORE_LINKS, FOOTER_LEGAL_LINKS } from "@/lib/site-nav";

/**
 * Header burger menu. Content and styling deliberately reuse the footer's
 * link lists and CSS classes (.footer__col-title, .footer__links) so the
 * two stay identical instead of hand-duplicating the same links twice.
 */
export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="navbar__burger"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="site-menu" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <button
              type="button"
              className="site-menu__backdrop"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <div className="site-menu__panel">
              <div className="site-menu__head">
                <span id={titleId} className="site-menu__brand">
                  Belsalameh
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  className="site-menu__close"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X aria-hidden />
                </button>
              </div>

              <div className="footer__col">
                <p className="footer__col-title">Explore</p>
                <ul className="footer__links">
                  {FOOTER_EXPLORE_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} onClick={() => setOpen(false)}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer__col">
                <p className="footer__col-title">Legal</p>
                <ul className="footer__links">
                  {FOOTER_LEGAL_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} onClick={() => setOpen(false)}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
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
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
