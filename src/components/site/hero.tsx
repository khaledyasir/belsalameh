import { JoinTrigger } from "./join";

export function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__inner">
        <p className="eyebrow">&ldquo;You&apos;re cleared for stress-free boarding.&rdquo;</p>
        <h1>Fly in relief. Skip the surprises at the counter.</h1>
        <p className="hero__sub">
          Avoid heavy airport counter penalties and hand-luggage stress. Belsalameh unlocks exclusive airline
          perks, made only for members.
        </p>
        <p className="hero__sub hero__sub--muted">Small perks, real savings, provided directly by our airline partners.</p>
        <div className="hero__cta-row">
          <JoinTrigger className="btn btn--gold">Join Belsalameh for $39</JoinTrigger>
          <a href="#services" className="btn btn--ghost">
            See how it works
          </a>
        </div>
        <p className="hero__microcopy">
          Early-bird: <b>Access through Dec 31, 2029 for $39</b>, then $39/year
        </p>
      </div>
    </section>
  );
}
