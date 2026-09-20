import { JoinTrigger } from "./join";

export function FinalCTA() {
  return (
    <section id="join" className="final-cta">
      <div className="wrap">
        <p className="eyebrow eyebrow--light">Ready when you are</p>
        <h2>Ready to skip the counter stress?</h2>
        <p className="final-cta__body">Join today and lock in Early Bird pricing through December 31, 2028.</p>
        <JoinTrigger className="btn btn--gold section-cta">Activate Membership</JoinTrigger>
        <p className="final-cta__tagline">Fly in relief™.</p>
      </div>
    </section>
  );
}
