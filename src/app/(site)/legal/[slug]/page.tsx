import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEGAL_DOCS } from "@/lib/legal-content";

export function generateStaticParams() {
  return Object.keys(LEGAL_DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: LEGAL_DOCS[slug]?.title ?? "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug];
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-brand-indigo">{doc.title}</h1>
      <p className="mt-1 text-xs uppercase tracking-wide text-ink-subtle">Last updated: {doc.updated}</p>

      <p className="mt-6 text-sm leading-relaxed text-ink-muted">{doc.intro}</p>

      <div className="mt-8 space-y-8">
        {doc.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-lg font-semibold text-brand-indigo">{s.heading}</h2>
            <div className="mt-2 space-y-2">
              {s.body.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-ink-muted">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 flex gap-4 text-sm">
        <Link href="/legal/terms" className="text-brand-purple hover:underline">
          Terms &amp; Conditions
        </Link>
        <Link href="/legal/privacy" className="text-brand-purple hover:underline">
          Privacy Policy
        </Link>
        <Link href="/" className="text-brand-purple hover:underline">
          Home
        </Link>
      </div>
    </div>
  );
}
