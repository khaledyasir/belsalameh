import type { Metadata } from "next";
import { Plane } from "lucide-react";
import { JoinTrigger } from "@/components/site/join";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { Container } from "@/components/ui/container";
import { SITE, CONTACT_EMAIL } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about Belsalameh membership, eligibility, payments, and the launch micro-excess baggage service.",
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SITE.faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Container className="max-w-2xl py-section-md">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <h1 className="font-display text-display-2 font-bold text-ink">{SITE.faq.heading}</h1>
      <p className="mt-2 text-body-sm text-ink-muted" id="support">
        Still stuck? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <div className="mt-8">
        <FaqAccordion items={SITE.faq.items} filterable categories={SITE.faq.categories} />
      </div>

      <div className="mt-10">
        <JoinTrigger className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-body-sm font-semibold text-primary-ink shadow-sm transition duration-fast ease-premium hover:-translate-y-0.5 hover:shadow-md">
          <Plane className="h-4 w-4" aria-hidden />
          Activate membership
        </JoinTrigger>
      </div>
    </Container>
  );
}
