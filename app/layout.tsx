import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

import { SEO } from "@/lib/constants/seo";

// Typography system fonts — see UI_UX_SPEC.md / PRD.md (Inter + Noto Sans
// Thai cover Latin + Thai scripts; swap in Geist later if preferred for headings).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-sans-thai",
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
    <html lang="th" className={`${inter.variable} ${notoSansThai.variable}`}>
      <body>{children}</body>
    </html>
  );
}
