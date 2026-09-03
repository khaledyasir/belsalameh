import type { Metadata } from "next";
import { Plane } from "lucide-react";
import { JoinTrigger } from "@/components/site/join";
import { SITE } from "@/lib/site-content";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-brand-indigo">{SITE.faq.heading}</h1>
      <p className="mt-2 text-sm text-ink-subtle">
        Placeholder questions and answers — final wording to be provided by the company.
      </p>

      <dl className="mt-8 divide-y divide-brand-sand/70">
        {SITE.faq.items.map((f) => (
          <div key={f.q} className="py-5">
            <dt className="font-display text-lg font-semibold text-brand-indigo">{f.q}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">{f.a}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <JoinTrigger className="inline-flex items-center gap-2 rounded-full bg-brand-indigo px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-indigo/90 hover:shadow-md">
          <Plane className="h-4 w-4" aria-hidden />
          Get your membership
        </JoinTrigger>
      </div>
    </div>
  );
}
