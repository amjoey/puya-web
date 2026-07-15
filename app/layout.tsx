import type { Metadata } from "next";
import { Anuphan, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

import { SEO } from "@/lib/constants/seo";

// Typography — "Sea Minimal" theme, see REDESIGN_PLAN.md > Phase 1.
// Anuphan (display, light/airy headings) + IBM Plex Sans Thai (body, full
// Thai support). Exposed as CSS vars and mapped to font-display / font-body
// Tailwind utilities in globals.css @theme. (next/font vars are named after
// the font, not the utility, so they don't self-reference the theme token.)
// Weights limited to those actually used in the UI. font-light (300) had
// zero usages across the app, so it's dropped from both families to keep
// the self-hosted font set and generated @font-face rules lean.
const display = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-anuphan",
  display: "swap",
});

const body = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-thai",
  display: "swap",
});

// Site-wide SEO defaults — see CLAUDE.md > SEO. metadataBase resolves the
// relative OG images/canonical paths set by every page below. Each page
// still defines its own full title/description; this is only the fallback
// for any segment that doesn't.
export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: SEO.defaultTitle,
  description: SEO.defaultDescription,
  openGraph: {
    siteName: SEO.siteName,
    type: "website",
    locale: "th_TH",
    images: [SEO.defaultOgImage],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-white text-ink">{children}</body>
    </html>
  );
}
