import { BackgroundAircraft } from "./background-aircraft";
import { PlaneIcon } from "./plane-icon";
import { JoinTrigger } from "./join";

const HEADLINE =
  "SLIGHTLY Overweight Luggage? Why Pay Full Heavy Weight Fees When You Can Pay Less at the Airport?";
const SUBHEADLINE =
  "Yes, right at the counter. No pre-booking, no pre-paying. Belsalameh unlocks access to unlisted member services and protected flat rates for 1–4 kg excess baggage, co-created with founding partner Royal Jordanian.";
const MICROCOPY = ["One-time annual fee", "Early Bird access through Dec 31, 2028", "Zero auto-renewals"];
const TAG_MIN = 23;
const TAG_MAX = 27;

export function Hero() {
  const [emphasis, ...rest] = HEADLINE.split(" ");

  return (
    <section id="home" className="hero">
      <BackgroundAircraft />
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">Founding Partner: Royal Jordanian</p>
          <h1 className="hero__headline">
            <span className="hero__headline-emphasis">{emphasis}</span> {rest.join(" ")}
          </h1>
          <p className="hero__sub">{SUBHEADLINE}</p>
          <div className="hero__cta-row">
            <JoinTrigger className="btn btn--pill">Unlock Member Rates</JoinTrigger>
            <p className="hero__microcopy">
              {MICROCOPY.map((item, i) => (
                <span key={item}>
                  {i > 0 && (
                    <span className="hero__dot" aria-hidden="true">
                      •
                    </span>
                  )}
                  {item}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="baggage-tag">
            <span className="baggage-tag__hole" />
            <p className="baggage-tag__label">Belsalameh · Baggage Tag</p>
            <div className="baggage-tag__weight">
              <span className="baggage-tag__num">{TAG_MIN}</span>
              <span className="baggage-tag__arrow">→</span>
              <span className="baggage-tag__num baggage-tag__num--accent">{TAG_MAX}</span>
              <span className="baggage-tag__unit">KG</span>
            </div>
            <p className="baggage-tag__caption">Member Range · Protected Rate</p>
            <div className="baggage-tag__perforation" />
            <div className="baggage-tag__barcode" />
            <p className="baggage-tag__partner">
              <PlaneIcon className="baggage-tag__partner-icon" />
              Partner: Royal Jordanian
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
