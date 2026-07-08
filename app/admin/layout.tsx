import type { Metadata } from "next";

// Admin pages are never meant to be discoverable — see CLAUDE.md > SEO.
// Layout-level metadata covers every nested /admin/** page automatically.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
