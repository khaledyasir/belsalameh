import { siteEnabled } from "@/lib/site-content";

/**
 * Thin banner shown until PUBLIC_SITE_ENABLED=true. Makes it unmistakable that
 * the copy and pricing on screen are not final.
 */
export function PreviewRibbon() {
  if (siteEnabled) return null;
  return (
    <div className="bg-brand-indigo px-4 py-1.5 text-center text-xs font-medium text-brand-cream">
      Preview: placeholder content and pricing, pending final copy from the company
    </div>
  );
}
