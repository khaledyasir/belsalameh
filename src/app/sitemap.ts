import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Public marketing routes only — admin/auth/checkout/api are intentionally excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/faq", "/legal/terms", "/legal/privacy"];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
