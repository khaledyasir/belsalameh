const BADGES = ["100% Counter Payment Transparency", "Zero Auto-Renewals", "Instant Email Confirmation"];

export function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="trust-bar__inner">
        <p className="trust-bar__label">In Visionary Partnership With</p>
        <div className="trust-bar__logo-row">
          <img src="/royal-jordanian-logo.svg" alt="Royal Jordanian" className="trust-bar__logo" />
          <span className="trust-bar__founding">Founding Partner</span>
        </div>
        <ul className="trust-bar__badges">
          {BADGES.map((badge) => (
            <li key={badge} className="trust-bar__badge">
              {badge}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
