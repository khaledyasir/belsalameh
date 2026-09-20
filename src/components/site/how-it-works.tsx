import { JoinTrigger } from "./join";

const STEPS = [
  {
    title: "Join Belsalameh",
    description: "Enter your name as it appears on your passport and your email. Confirm and pay.",
  },
  {
    title: "Save your confirmation email",
    description: "It arrives instantly and is your only proof of membership — no login, no account.",
  },
  {
    title: "Show it at check-in",
    description: "If your bag is up to 27 kg, show the email to unlock your member rate at the counter.",
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
