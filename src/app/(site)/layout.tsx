import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { JoinProvider } from "@/components/site/join";
import { siteEnabled, CONTACT_EMAIL } from "@/lib/site-content";

export const metadata: Metadata = {
  // Keep the public site out of search results until launch (PUBLIC_SITE_ENABLED=true).
  robots: siteEnabled ? undefined : { index: false, follow: false },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Belsalameh",
  url: SITE_URL,
  email: CONTACT_EMAIL,
  description: "An independent travel membership platform unlocking member-only airport micro-services with partner airlines.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Belsalameh",
  url: SITE_URL,
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <JoinProvider>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <div className="flex min-h-dvh flex-col bg-surface">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </JoinProvider>
  );
}
