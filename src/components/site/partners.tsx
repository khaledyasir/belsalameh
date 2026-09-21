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
              <span className="plogo__tag">Baggage relief · live</span>
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
              Jordan&apos;s flagship carrier, an expanding fleet carrying authentic Jordanian hospitality to 50+
              destinations across four continents.
            </p>
            <p>
              Whether you are landing or simply passing through, transform your transit into an extraordinary
              journey. Step back in time at ancient Petra, float weightless in the Dead Sea&apos;s mineral waters,
              and take in the majestic landscapes of Wadi Rum, turning a routine connection into a lifetime memory.
            </p>
            <p className="partner-card__flourish">
              To ExploRJordan&hellip;
              <br />
              Just follow the crown!!
            </p>
            <div className="partner-card__actions">
              <a href="https://www.rj.com/" target="_blank" rel="noreferrer" className="btn btn--gold">
                Follow the Crown
              </a>
            </div>
            <p className="partner-card__signoff">RJ in exploRJordan!!</p>
          </div>
        </div>
      </section>
    </>
  );
}
