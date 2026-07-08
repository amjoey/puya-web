import type { Metadata } from "next";

import { ContactInfo } from "@/components/contact/ContactInfo";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "ติดต่อเรา | PUYA Beach Villa",
  description:
    "ติดต่อ PUYA Beach Villa ทางโทรศัพท์ LINE หรือ Facebook และดูเส้นทางมายังวิลล่าริมชายหาด",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "ติดต่อเรา | PUYA Beach Villa",
    description:
      "ติดต่อ PUYA Beach Villa ทางโทรศัพท์ LINE หรือ Facebook",
    images: ["/demo/hero.svg"],
    type: "website",
  },
};

// See PRD.md > Contact Page.
export default function ContactPage() {
  return (
    <main className={cn(CONTAINER_PADDING, "py-8 tablet:py-12")}>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-h2 font-bold text-foreground">ติดต่อเรา</h1>
        <p className="mt-2 text-body text-muted-foreground">
          มีคำถามเกี่ยวกับการเข้าพัก? ติดต่อเราได้ทุกเวลา
        </p>
        <div className="mt-8 grid grid-cols-1 gap-8 tablet:grid-cols-2">
          <ContactInfo />
          <MapEmbed />
        </div>
      </div>
    </main>
  );
}
