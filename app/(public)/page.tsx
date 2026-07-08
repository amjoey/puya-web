import type { Metadata } from "next";

import { ContactSection } from "@/components/home/ContactSection";
import { FacilitiesSection } from "@/components/home/FacilitiesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { PromotionsPreview } from "@/components/home/PromotionsPreview";
import { ReviewsPreview } from "@/components/home/ReviewsPreview";
import { VillasSection } from "@/components/home/VillasSection";
import { CONTACT_INFO } from "@/lib/constants/contact";

// SEO — see CLAUDE.md > SEO ("metadata for every page: title, description,
// openGraph. Use JSON-LD.").
export const metadata: Metadata = {
  title: "PUYA Beach Villa | วิลล่าริมชายหาดส่วนตัว",
  description:
    "จองวิลล่าริมชายหาดส่วนตัวพร้อมสระว่ายน้ำ รับได้ถึง 15 คน ที่ PUYA Beach Villa มี 2 หลัง พร้อมสระว่ายน้ำ ดาดฟ้าบาร์บีคิว และติดชายหาด",
  alternates: { canonical: "/" },
  openGraph: {
    title: "PUYA Beach Villa | วิลล่าริมชายหาดส่วนตัว",
    description:
      "จองวิลล่าริมชายหาดส่วนตัวพร้อมสระว่ายน้ำ รับได้ถึง 15 คน ที่ PUYA Beach Villa",
    images: ["/demo/hero.svg"],
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "PUYA Beach Villa",
  description:
    "วิลล่าริมชายหาดส่วนตัวพร้อมสระว่ายน้ำ รับได้ถึง 15 คน มี 2 หลัง พร้อมสระว่ายน้ำส่วนตัว ดาดฟ้าบาร์บีคิว และติดชายหาด",
  image: "/demo/hero.svg",
  priceRange: "฿6,900 - ฿7,900",
  telephone: CONTACT_INFO.phone,
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <HeroSection />
        <VillasSection />
        <FacilitiesSection />
        <ReviewsPreview />
        <PromotionsPreview />
        <ContactSection />
      </main>
    </>
  );
}
