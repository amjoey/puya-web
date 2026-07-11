import {
  ChefHat,
  Droplets,
  type LucideIcon,
  Mic,
  Sunset,
  Umbrella,
  Waves,
} from "lucide-react";

import { SectionHeader } from "@/components/common/SectionHeader";
import { CONTAINER_PADDING, SECTION_SPACING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// Amenities grid — reskinned to the Sea Minimal mockup (icon tile + title +
// description). Content is villa-specific per the mockup. See PRD.md > Home
// Page > Facilities Section and REDESIGN_PLAN.md > Phase 3.
interface Amenity {
  icon: LucideIcon;
  title: string;
  description: string;
}

const AMENITIES: Amenity[] = [
  {
    icon: Waves,
    title: "สระว่ายน้ำส่วนตัว",
    description: "สระส่วนตัวทุกหลัง เล่นน้ำเต็มที่แบบเป็นส่วนตัว",
  },
  {
    icon: Droplets,
    title: "Water Slide",
    description: "สไลเดอร์ลงสระ สนุกทั้งเด็กและผู้ใหญ่",
  },
  {
    icon: Sunset,
    title: "ระเบียงชั้น 2 วิวทะเล",
    description: "Rooftop ชมวิวทะเลและพระอาทิตย์ตก",
  },
  {
    icon: Mic,
    title: "คาราโอเกะ",
    description: "ห้องร้องเพลงในตัว ปาร์ตี้ได้ทั้งกลุ่ม",
  },
  {
    icon: ChefHat,
    title: "ครัวเต็มรูปแบบ",
    description: "ทำอาหารเองได้ พร้อมอุปกรณ์ครบ",
  },
  {
    icon: Umbrella,
    title: "ติดชายหาด",
    description: "เดินถึงทะเลได้ ที่พักส่วนตัวริมหาด",
  },
];

export function FacilitiesSection() {
  return (
    <section id="amenities" className={cn("bg-white", SECTION_SPACING)}>
      <div className={cn("mx-auto max-w-[1180px]", CONTAINER_PADDING)}>
        <SectionHeader
          eyebrow="ครบทุกหลัง"
          title="สิ่งอำนวยความสะดวก"
          subtitle="ทุกอย่างที่ครอบครัวและกลุ่มเพื่อนต้องการ ในที่พักเดียว"
        />
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {AMENITIES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:border-transparent hover:shadow-soft"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-aqua-soft">
                <Icon className="size-5 text-aqua-deep" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
