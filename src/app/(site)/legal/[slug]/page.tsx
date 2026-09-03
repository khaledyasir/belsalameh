import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEGAL_STUBS } from "@/lib/site-content";

export function generateStaticParams() {
  return Object.keys(LEGAL_STUBS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: LEGAL_STUBS[slug]?.title ?? "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = LEGAL_STUBS[slug];
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">{doc.title}</h1>

      <div className="mt-6 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-[#7a4d0f]">
        <p className="font-medium">This document is not final.</p>
        <p className="mt-1">
          The full text will be provided by the company and reviewed by legal
          counsel before the site goes live. It is referenced here so the checkout
          consent checkboxes link to the right place.
        </p>
      </div>

      <p className="mt-6 text-sm text-ink-muted">
        Placeholder body. Nothing on this page should be relied upon as the
        company&apos;s terms or privacy commitments.
      </p>

      <Link href="/join" className="mt-8 inline-block text-sm text-brand-indigo hover:underline">
        ← Back to checkout
      </Link>
    </div>
  );
}
