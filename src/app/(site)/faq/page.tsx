import type { Metadata } from "next";
import { Plane } from "lucide-react";
import { JoinTrigger } from "@/components/site/join";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { SITE, CONTACT_EMAIL } from "@/lib/site-content";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-brand-indigo">{SITE.faq.heading}</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Still stuck? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-purple underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <div className="mt-8">
        <FaqAccordion items={SITE.faq.items} />
      </div>

      <div className="mt-10">
        <JoinTrigger className="inline-flex items-center gap-2 rounded-full bg-brand-indigo px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-indigo/90 hover:shadow-md">
          <Plane className="h-4 w-4" aria-hidden />
          Activate membership
        </JoinTrigger>
      </div>
    </div>
  );
}
