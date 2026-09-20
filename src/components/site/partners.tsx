export function Partners() {
  return (
    <>
      <section id="partners" className="section partners">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Our airline partners</p>
            <h2>Growing, gradually and honestly.</h2>
          </div>

          <div className="partner-strip">
            <div className="plogo">
              <span className="plogo__name">Royal Jordanian</span>
              <span className="plogo__tag">Baggage relief — live</span>
            </div>
            <div className="plogo">
              <span className="plogo__name">More airlines</span>
              <span className="plogo__tag plogo__tag--soon">Coming soon</span>
            </div>
          </div>

          <a href="#partner-detail" className="btn btn--outline section-cta">
            Discover partners
          </a>

          <p className="disclosure">
            All services are pay-per-use and paid directly to your airline at the check-in counter. Services are
            provided, priced, and fulfilled directly by our airline partners exclusively to Belsalameh members,
            subject to route availability and airline policy. Belsalameh provides membership access only, with
            services introduced gradually across partner networks. Membership fees are non-refundable.
          </p>
        </div>
      </section>

      <section id="partner-detail" className="section">
        <div className="wrap">
          <p className="eyebrow">Our partners</p>

          <div className="partner-card">
            <h3>Royal Jordanian</h3>
            <p>
              Jordan&apos;s flagship carrier — an expanding fleet carrying the warmth of Levantine hospitality to
              50+ destinations across four continents.
            </p>
            <div className="partner-card__actions">
              <a href="https://www.rj.com/" target="_blank" rel="noreferrer" className="btn btn--gold">
                Follow the Crown
              </a>
            </div>
          </div>

          <div className="jordan-card">
            <h3>Experience Jordan</h3>
            <p>
              Make Jordan your next stopover destination. Step back in time at ancient Petra, indulge in a mud
              treatment at the Dead Sea, take in the majestic views of Wadi Rum, and explore so much more.
            </p>
            <a
              href="https://www.rj.com/en/explore-jordan"
              target="_blank"
              rel="noreferrer"
              className="btn btn--outline"
            >
              ExplorJordan
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
