import Image from "next/image";

import { Eyebrow } from "@/components/common/Eyebrow";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// Full-bleed sea-view feature — see REDESIGN_PLAN.md > Phase 3 / mockup.
// Presentational; uses the extracted rooftop sea-view photo.
export function SeaFeatureSection() {
  return (
    <section
      id="sea"
      className="relative flex min-h-[70vh] items-center overflow-hidden text-white"
    >
      <Image
        src="/images/home/sea-view.jpg"
        alt="ระเบียงชั้น 2 วิวทะเลที่ PUYA Beach Villa"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/35 to-transparent"
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-[1180px]",
          CONTAINER_PADDING,
        )}
      >
        <div className="max-w-[480px]">
          <Eyebrow className="text-white">ระเบียงชั้น 2 ส่วนตัว</Eyebrow>
          <h2 className="mt-4 text-balance text-3xl font-normal leading-tight tablet:text-4xl">
            วิวทะเลเต็มตา
            <br />
            จากระเบียงชั้น 2 ทุกหลัง
          </h2>
          <p className="mt-4 text-pretty text-white/90 tablet:text-lg">
            จิบกาแฟยามเช้า ชมพระอาทิตย์ตกยามเย็น ใต้แสงไฟวอร์ม —
            มุมโปรดของทุกทริป
          </p>
        </div>
      </div>
    </section>
  );
}
