import type { Metadata } from "next";

import { BookingStepsSection } from "@/components/home/BookingStepsSection";
import { CombinedVillaSection } from "@/components/home/CombinedVillaSection";
import { FacilitiesSection } from "@/components/home/FacilitiesSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { GallerySection } from "@/components/home/GallerySection";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickBookBar } from "@/components/home/QuickBookBar";
import { SeaFeatureSection } from "@/components/home/SeaFeatureSection";
import { VillasSection } from "@/components/home/VillasSection";
import { CONTACT_INFO } from "@/lib/constants/contact";

// SEO — see CLAUDE.md > SEO ("metadata for every page: title, description,
// openGraph. Use JSON-LD.").
export const metadata: Metadata = {
  title: "พูลวิลล่าเทพา สะกอม สงขลา | PUYA Beach Villa รับ 15 คน จองตรงราคาดีสุด",
  description:
    "พูลวิลล่าริมทะเลส่วนตัว 2 หลัง โซนเทพา-สะกอม สงขลา รองรับครอบครัวและหมู่คณะสูงสุด 15 คน/หลัง Muslim-friendly ใกล้ปัตตานี ยะลา นราธิวาส จองตรงเริ่ม 6,900 บาท",
  alternates: { canonical: "/" },
  openGraph: {
    title: "พูลวิลล่าเทพา สะกอม สงขลา | PUYA Beach Villa รับ 15 คน",
    description:
      "พูลวิลล่าริมทะเลส่วนตัว 2 หลัง โซนเทพา-สะกอม สงขลา รองรับครอบครัวและหมู่คณะ 15 คน Muslim-friendly ใกล้ปัตตานี ยะลา นราธิวาส จองตรงราคาดีสุด",
    images: ["/demo/hero.svg"],
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "PUYA Beach Villa",
  description:
    "พูลวิลล่าริมทะเลส่วนตัว โซนเทพา-สะกอม สงขลา รับได้ถึง 15 คน มี 2 หลัง พร้อมสระว่ายน้ำส่วนตัว ดาดฟ้าบาร์บีคิว ติดชายหาด รองรับนักท่องเที่ยวมุสลิม (Muslim-friendly)",
  image: "/demo/hero.svg",
  priceRange: "฿6,900 - ฿7,900",
  telephone: CONTACT_INFO.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT_INFO.address,
    addressLocality: CONTACT_INFO.addressLocality,
    addressRegion: CONTACT_INFO.addressRegion,
    postalCode: CONTACT_INFO.postalCode,
    addressCountry: CONTACT_INFO.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: CONTACT_INFO.geo.latitude,
    longitude: CONTACT_INFO.geo.longitude,
  },
  areaServed: ["สงขลา", "หาดใหญ่", "ปัตตานี", "ยะลา", "นราธิวาส"],
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
        <QuickBookBar />
        <VillasSection />
        <SeaFeatureSection />
        <FacilitiesSection />
        <GallerySection />
        <CombinedVillaSection />
        <BookingStepsSection />
        <FinalCtaSection />
      </main>
    </>
  );
}
