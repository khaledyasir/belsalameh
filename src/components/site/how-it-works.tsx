const STEPS = [
  {
    number: 1,
    title: "Enter Your Details & Pay",
    description:
      "Enter your full name (exactly as it appears on your passport) and your email address. Confirm your email and complete payment.",
  },
  {
    number: 2,
    title: "Save Your Confirmation Email",
    description:
      "Once payment is successful, you will instantly receive an automated confirmation email. Keep this email saved on your phone as your official proof of membership for as long as it remains active. No logins or account creation required.",
  },
  {
    number: 3,
    title: "Show Email at Check-In & Fly in Relief",
    description:
      "Arrive at the airport check-in counter as usual. If your luggage weighs up to 27 kg max (1 to 4 kg over standard allowance), show your confirmation email to the check-in agent to access unlisted member rates and pay directly at the counter.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="how">
      <div className="how__inner">
        <p className="eyebrow">The Process</p>
        <h2>How It Works</h2>
        <ol className="steps">
          {STEPS.map((step) => (
            <li className="step" key={step.number}>
              <span className="step__num" aria-hidden="true">
                {step.number}
              </span>
              <span className="step__label">Step {step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
