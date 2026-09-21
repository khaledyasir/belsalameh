import { Hero } from "@/components/site/hero";
import { Services } from "@/components/site/services";
import { OurBelief } from "@/components/site/our-belief";
import { HowItWorks } from "@/components/site/how-it-works";
import { Partners } from "@/components/site/partners";
import { FinalCTA } from "@/components/site/final-cta";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Services />
      <OurBelief />
      <HowItWorks />
      <Partners />
      <FinalCTA />
    </>
  );
}
