import { BackgroundAircraft } from "./background-aircraft";
import { JoinTrigger } from "./join";

const CTA_FLEET = [
  { top: "10%", left: "14%", size: 30, duration: "44s", delay: "0s", direction: "drift-right" as const, opacity: 0.14, rotate: 20 },
  { top: "22%", left: "82%", size: 20, duration: "36s", delay: "-10s", direction: "drift-left" as const, opacity: 0.1, rotate: -25 },
  { top: "46%", left: "48%", size: 26, duration: "50s", delay: "-24s", direction: "drift-vertical" as const, opacity: 0.12, rotate: 34 },
  { top: "62%", left: "8%", size: 18, duration: "34s", delay: "-6s", direction: "drift-right" as const, opacity: 0.1, rotate: 8 },
  { top: "72%", left: "90%", size: 24, duration: "42s", delay: "-18s", direction: "drift-left" as const, opacity: 0.13, rotate: -18 },
  { top: "85%", left: "30%", size: 16, duration: "30s", delay: "-3s", direction: "drift-right" as const, opacity: 0.11, rotate: 28 },
];

export function FinalCTA() {
  return (
    <section id="activate" className="final-cta">
      <BackgroundAircraft fleet={CTA_FLEET} />
      <div className="final-cta__content">
        <p className="eyebrow eyebrow--light">Stay Connected</p>
        <h2>Be First to Know About New Airport Services</h2>
        <p className="final-cta__body">
          We are continuously developing new, unlisted micro-services at the airport alongside full-service partner
          carriers. Follow our official Instagram page to receive instant updates as new partner carriers and
          exclusive services go live.
        </p>
        <JoinTrigger className="btn btn--pill">Activate Membership Now</JoinTrigger>
        <p className="final-cta__tagline">Join Belsalameh today and Fly in relief™.</p>
      </div>
    </section>
  );
}
