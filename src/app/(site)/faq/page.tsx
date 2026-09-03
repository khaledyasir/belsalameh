import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site-content";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">{SITE.faq.heading}</h1>
      <p className="mt-2 text-sm text-ink-subtle">
        Placeholder questions and answers — final wording to be provided by the company.
      </p>

      <dl className="mt-8 divide-y divide-border">
        {SITE.faq.items.map((f) => (
          <div key={f.q} className="py-5">
            <dt className="font-display text-lg font-semibold text-ink">{f.q}</dt>
            <dd className="mt-1.5 text-sm text-ink-muted">{f.a}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <Link href="/join" className={buttonClasses("primary", "md")}>
          Get your membership
        </Link>
      </div>
    </div>
  );
}
