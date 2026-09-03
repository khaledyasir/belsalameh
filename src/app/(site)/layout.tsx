import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { PreviewRibbon } from "@/components/site/preview-ribbon";
import { JoinProvider } from "@/components/site/join";
import { siteEnabled } from "@/lib/site-content";

export const metadata: Metadata = {
  // Pre-launch: keep the public site out of search results. Remove at launch
  // (Phase 4) once PUBLIC_SITE_ENABLED=true.
  robots: siteEnabled ? undefined : { index: false, follow: false },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <JoinProvider>
      <div className="flex min-h-dvh flex-col bg-surface">
        <PreviewRibbon />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </JoinProvider>
  );
}
