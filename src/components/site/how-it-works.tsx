import { JoinTrigger } from "./join";

const STEPS = [
  {
    title: "Join Belsalameh",
    description: "Sign up online in a couple of minutes. No waiting for a flight to book.",
  },
  {
    title: "Show your membership proof",
    description:
      "Present the confirmation email sent to your inbox at check-in when you need relief, subject to availability and airline policy.",
  },
  {
    title: "Pay the member rate",
    description: "Settled directly with the airline at the counter. No online payment, no refund worries.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">How it works</p>
          <h2>Three simple steps.</h2>
        </div>
        <ol className="steps">
          {STEPS.map((step, i) => (
            <li className="step" key={step.title}>
              <span className="step__num" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <JoinTrigger className="btn btn--gold section-cta">Be a Member</JoinTrigger>
      </div>
    </section>
  );
}
