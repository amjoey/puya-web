const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

// Shared SEO defaults — see CLAUDE.md > SEO ("metadata for every page: title,
// description, openGraph. Use JSON-LD.").
export const SEO = {
  siteUrl: SITE_URL,
  siteName: "PUYA Beach Villa",
  defaultTitle: "PUYA Beach Villa | Private Beachfront Pool Villa Rental",
  defaultDescription:
    "Book a private beachfront pool villa for up to 15 guests at PUYA Beach Villa. Two luxury villas with private pools, BBQ decks, and direct beach access.",
  defaultOgImage: "/demo/hero.svg",
} as const;
