import Image from "next/image";

import { SectionHeader } from "@/components/common/SectionHeader";
import { CONTAINER_PADDING, SECTION_SPACING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// Real-photo bento gallery — see REDESIGN_PLAN.md > Phase 3 / mockup.
// Presentational; the first item spans two rows on tablet+ (the "big" cell).
interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  big?: boolean;
}

const GALLERY: GalleryItem[] = [
  {
    src: "/images/home/gallery-bedroom-pool.jpg",
    alt: "ห้องนอนเปิดวิวสระและสไลเดอร์",
    caption: "ห้องนอนเปิดวิวสระ + สไลเดอร์",
    big: true,
  },
  {
    src: "/images/home/gallery-living.jpg",
    alt: "ห้องนั่งเล่น",
    caption: "ห้องนั่งเล่น",
  },
  {
    src: "/images/home/gallery-slide.jpg",
    alt: "สไลเดอร์ลงสระ",
    caption: "Water slide",
  },
  {
    src: "/images/home/gallery-bedroom.jpg",
    alt: "ห้องนอน",
    caption: "ห้องนอน",
  },
  {
    src: "/images/home/gallery-bathroom.jpg",
    alt: "ห้องน้ำ",
    caption: "ห้องน้ำ",
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className={cn("bg-paper", SECTION_SPACING)}>
      <div className={cn("mx-auto max-w-[1180px]", CONTAINER_PADDING)}>
        <SectionHeader
          eyebrow="บรรยากาศจริง"
          title="แกลเลอรี่"
          subtitle="ห้องพัก · สระ · ระเบียงชั้น 2 · พื้นที่ส่วนกลาง"
        />
        <div className="grid grid-cols-2 gap-3 tablet:grid-cols-[2fr_1fr_1fr] tablet:grid-rows-[230px_230px] tablet:gap-3.5">
          {GALLERY.map((item) => (
            <figure
              key={item.src}
              className={cn(
                "group relative h-40 overflow-hidden rounded-2xl tablet:h-auto",
                item.big &&
                  "col-span-2 h-48 tablet:col-span-1 tablet:row-span-2",
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-3.5 text-sm font-medium text-white">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
