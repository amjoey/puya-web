import type { Metadata } from "next";

import { VillaCard } from "@/components/villa/VillaCard";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { DEMO_VILLA_GALLERIES } from "@/lib/demo/villaGalleries";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { getActiveVillas } from "@/repositories/villa.repository";
import { listVillaImagesByVilla } from "@/repositories/villaImage.repository";

export const metadata: Metadata = {
  title: "พูลวิลล่าเทพา สะกอม สงขลา 2 หลัง รับ 15 คน | PUYA Beach Villa",
  description:
    "พูลวิลล่าริมทะเลส่วนตัว 2 หลัง โซนเทพา-สะกอม สงขลา เหมาะสำหรับครอบครัวและหมู่คณะ รับได้ถึง 15 คนต่อหลัง สระว่ายน้ำส่วนตัว ดาดฟ้าบาร์บีคิว Muslim-friendly จองตรงเริ่ม 6,900 บาท",
  alternates: { canonical: "/villas" },
  openGraph: {
    title: "พูลวิลล่าเทพา สะกอม สงขลา 2 หลัง รับ 15 คน | PUYA Beach Villa",
    description:
      "พูลวิลล่าริมทะเลส่วนตัว 2 หลัง โซนเทพา-สะกอม สงขลา เหมาะสำหรับครอบครัวและหมู่คณะ รับได้ถึง 15 คนต่อหลัง Muslim-friendly",
    images: ["/demo/hero.svg"],
    type: "website",
  },
};

// See PRD.md > Functional Requirements > Villa Listing.
export default async function VillasPage() {
  const { data: villas, error: loadError } = await safeFetch(() => getActiveVillas(), []);

  const villaCards = await Promise.all(
    villas.map(async (villa) => {
      const { data: images } = await safeFetch(() => listVillaImagesByVilla(villa.id), []);
      const imageUrl = images[0]?.url ?? DEMO_VILLA_GALLERIES[villa.slug]?.[0] ?? villa.coverImage;
      return { villa, imageUrl };
    }),
  );

  return (
    <main className={cn(CONTAINER_PADDING, "py-8 tablet:py-12")}>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-h2 font-bold text-foreground">
          พูลวิลล่าริมทะเล เทพา–สะกอม สงขลา
        </h1>
        <p className="mt-2 text-body text-muted-foreground">
          พูลวิลล่าส่วนตัว 2 หลัง เหมาะสำหรับครอบครัวและหมู่คณะ รับได้ถึง 15 คนต่อหลัง
          พร้อมสระว่ายน้ำส่วนตัว ดาดฟ้าบาร์บีคิว ติดทะเล รองรับนักท่องเที่ยวมุสลิม
        </p>

        {loadError ? (
          <p className="mt-8 text-body text-destructive">
            ไม่สามารถโหลดข้อมูลวิลล่าได้ กรุณาลองใหม่ภายหลัง
          </p>
        ) : villaCards.length === 0 ? (
          <p className="mt-8 text-body text-muted-foreground">ไม่มีวิลล่าในขณะนี้</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 tablet:grid-cols-2 tablet:gap-8">
            {villaCards.map(({ villa, imageUrl }) => (
              <VillaCard key={villa.id} villa={villa} imageUrl={imageUrl} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
