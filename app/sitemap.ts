import type { MetadataRoute } from "next";

import { SEO } from "@/lib/constants/seo";
import { demoVillas } from "@/lib/demo/homeContent";

const STATIC_PATHS = ["", "/villas", "/availability", "/reviews", "/promotions", "/contact"];

// Villa detail pages are statically generated from demo data (see
// generateStaticParams in app/(public)/villas/[slug]/page.tsx) — the
// sitemap mirrors that same source so the two stay in sync.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SEO.siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const villaEntries: MetadataRoute.Sitemap = demoVillas.map((villa) => ({
    url: `${SEO.siteUrl}/villas/${villa.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticEntries, ...villaEntries];
}
