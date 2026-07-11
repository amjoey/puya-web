import Image from "next/image";

import { Eyebrow } from "@/components/common/Eyebrow";
import { CONTAINER_PADDING, SECTION_SPACING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// "รวม 2 วิลล่า เป็นหลังเดียว" — the signature differentiator section.
// See REDESIGN_PLAN.md > Phase 3 and the approved mockup. Presentational
// only; uses the extracted two-villas photo.
const STATS = [
  { value: "6", label: "ห้องนอน" },
  { value: "2", label: "สระว่ายน้ำ" },
  { value: "6", label: "ห้องน้ำ" },
  { value: "18+", label: "ผู้เข้าพัก" },
] as const;

export function CombinedVillaSection() {
  return (
    <section id="combine" className={cn("bg-paper", SECTION_SPACING)}>
      <div className={cn("mx-auto max-w-[1180px]", CONTAINER_PADDING)}>
        <div className="grid items-center gap-8 tablet:grid-cols-[1.05fr_0.95fr] tablet:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
            <Image
              src="/images/home/two-villas.jpg"
              alt="สองวิลล่า PUYA ริมทะเล จองรวมกันเป็นหลังเดียวได้"
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
            />
          </div>

          <div>
            <Eyebrow className="text-aqua-deep">จุดต่างที่คู่แข่งไม่มี</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-medium text-ink tablet:text-4xl">
              รวม 2 วิลล่า เป็นหลังเดียว
            </h2>
            <p className="mt-4 text-pretty text-ink-soft tablet:text-lg">
              มางานเลี้ยง รวมญาติ หรือทริปกลุ่มใหญ่? จองทั้งสองหลังติดกันได้ใน
              ครั้งเดียว — สองสระ สองสไลเดอร์ พื้นที่ส่วนตัวทั้งหมด
            </p>

            <dl className="mt-7 flex flex-wrap gap-3">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-[88px] flex-1 rounded-2xl border border-line bg-white px-5 py-4 text-center"
                >
                  <dd className="font-display text-3xl font-semibold leading-none text-aqua">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-sm text-ink-soft">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
