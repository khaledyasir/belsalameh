import { JoinTrigger } from "./join";
import { MEMBERSHIP } from "@/lib/membership";
import { formatMoney } from "@/lib/format";

const MICROCOPY = ["One-time annual fee", "Early Bird access through Dec 31, 2028", "Zero auto-renewals"];

export function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__inner">
        <p className="eyebrow eyebrow--light">Founding partner: Royal Jordanian</p>
        <h1>Slightly overweight luggage? Pay less, right at the counter.</h1>
        <p className="hero__sub">
          No pre-booking, no pre-paying. Belsalameh unlocks protected flat rates for 1–4 kg of excess baggage,
          co-created with founding partner Royal Jordanian, paid directly at check-in.
        </p>
        <div className="hero__cta-row">
          <JoinTrigger className="btn btn--gold">
            Join Belsalameh — {formatMoney(MEMBERSHIP.priceMinor, MEMBERSHIP.currency)}
          </JoinTrigger>
          <a href="#services" className="btn btn--ghost">
            See what&apos;s included
          </a>
        </div>
        <p className="hero__microcopy">
          {MICROCOPY.map((item, i) => (
            <span key={item}>
              {i > 0 && (
                <span className="hero__dot" aria-hidden="true">
                  ·
                </span>
              )}
              {item}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
