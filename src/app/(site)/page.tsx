import { Hero } from "@/components/site/hero";
import { TrustBar } from "@/components/site/trust-bar";
import { PromoBanner } from "@/components/site/promo-banner";
import { Benefits } from "@/components/site/benefits";
import { ServiceOverview } from "@/components/site/service-overview";
import { HowItWorks } from "@/components/site/how-it-works";
import { FaqSection } from "@/components/site/faq-section";
import { FinalCTA } from "@/components/site/final-cta";
import { FlightJourney } from "@/components/site/flight-journey";

export default function LandingPage() {
  return (
    <>
      <FlightJourney />
      <Hero />
      <TrustBar />
      <PromoBanner />
      <Benefits />
      <ServiceOverview />
      <HowItWorks />
      <FaqSection />
      <FinalCTA />
    </>
  );
}
