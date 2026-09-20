const SERVICES = [
  {
    title: "Protected Member Rate",
    description: "Fixed pricing for 1–4 kg over your standard baggage allowance, agreed with the airline in advance.",
  },
  {
    title: "Pay at the Counter",
    description: "No online booking or prepayment. Settle directly with the airline when you check in.",
  },
  {
    title: "Instant Confirmation",
    description: "Your confirmation email is your membership proof — no app, no login, no card to carry.",
  },
];

export function Services() {
  return (
    <section id="services" className="section">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">What your membership unlocks</p>
          <h2>Relief for the moment that catches you off guard.</h2>
          <p>Pay-per-use flat rates, settled directly with the airline at check-in — a fraction of the standard fee.</p>
        </div>

        <div className="grid3">
          {SERVICES.map((service) => (
            <div className="service-card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>

        <a href="#partners" className="btn btn--outline section-cta">
          See our partners
        </a>
      </div>
    </section>
  );
}
