const BENEFITS = [
  {
    title: "Protected Member Rates",
    description:
      "Say goodbye to unpredictable excess fees at check-in. Gain access to unlisted member services and lock in fixed, transparent member pricing.",
  },
  {
    title: "No Online Glitches or Advance Booking",
    description:
      "All service payments are processed directly at the official airport check-in counter upon arrival. No online forms, no tech failures, no refund chaos.",
  },
  {
    title: "Zero Auto-Renewals",
    description: "Pay once for your annual membership. We never set up recurring billing or automatic deductions.",
  },
  {
    title: "Guaranteed Member Pricing",
    description: "Show your confirmation email at check-in to instantly unlock your protected, flat-rate airport pricing.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="journey" aria-labelledby="benefits-heading">
      <div className="journey__header">
        <p className="eyebrow">Member Benefits</p>
        <h2 id="benefits-heading">Why Smart Travelers Join Belsalameh</h2>
      </div>
      <ol className="journey__path">
        {BENEFITS.map((benefit, i) => (
          <li
            className={`journey__stop ${i % 2 === 0 ? "journey__stop--left" : "journey__stop--right"}`}
            key={benefit.title}
            tabIndex={0}
          >
            <span className="journey__marker" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="journey__content">
              <span className="journey__gate">Gate {String(i + 1).padStart(2, "0")}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
