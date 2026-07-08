import type { MetadataRoute } from "next";

import { SEO } from "@/lib/constants/seo";

// Disallows /admin (never meant to be discoverable) and /booking (the
// multi-step booking/payment/confirmation flow — guest-specific, dynamic,
// no evergreen content worth crawling; see also the per-page `robots:
// noindex` metadata on those routes for defense in depth).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/booking"],
    },
    sitemap: `${SEO.siteUrl}/sitemap.xml`,
  };
}
