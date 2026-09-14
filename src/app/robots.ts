import type { MetadataRoute } from "next";
import { siteEnabled } from "@/lib/site-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  if (!siteEnabled) {
    // Pre-launch: keep crawlers out entirely (the noindex meta tag is the
    // per-page belt; this is the site-wide suspenders).
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/checkout", "/api"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
