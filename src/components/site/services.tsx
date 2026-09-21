const UNLOCKS = [
  {
    title: "Micro-Weight Relief",
    description: (
      <>
        1–3 kg overweight at the counter?
        <br />
        Pay the member rate and never leave belongings behind.
      </>
    ),
  },
  {
    title: "Priority Bag Handling",
    description: "Get your bag among the first off the carousel.",
  },
];

export function Services() {
  return (
    <section id="services" className="section">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">What your membership unlocks</p>
          <h2>Relief for the moments that catch you off guard.</h2>
          <p>Pay-per-use flat rates, paid directly to the airline at the check-in counter, for a fraction of the standard fee.</p>
        </div>

        <ol className="unlock-list">
          {UNLOCKS.map((item, i) => (
            <li className="unlock" key={item.title}>
              <span className="unlock__badge" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="unlock__body">
                <p className="eyebrow">Unlock {String(i + 1).padStart(2, "0")}</p>
                <h3>{item.title}</h3>
                <p className="unlock__desc">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <a href="#partners" className="btn btn--outline section-cta">
          Discover availability &amp; rates
        </a>
      </div>
    </section>
  );
}
