import { JoinTrigger } from "./join";

export function FinalCTA() {
  return (
    <section id="join" className="final-cta">
      <div className="wrap">
        <h2>Ready to skip the counter stress?</h2>
        <p className="final-cta__body">Join for $39 — access through Dec 31, 2029, early-bird pricing.</p>
        <JoinTrigger className="btn btn--gold section-cta">Join Belsalameh</JoinTrigger>
      </div>
    </section>
  );
}
