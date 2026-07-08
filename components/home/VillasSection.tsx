import { SectionTitle } from "@/components/common/SectionTitle";
import { VillaCard } from "@/components/villa/VillaCard";
import { CONTAINER_PADDING, SECTION_SPACING } from "@/lib/constants/spacing";
import { demoVillas } from "@/lib/demo/homeContent";
import { DEMO_VILLA_GALLERIES } from "@/lib/demo/villaGalleries";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { getActiveVillas } from "@/repositories/villa.repository";
import { listVillaImagesByVilla } from "@/repositories/villaImage.repository";

// See PRD.md > Functional Requirements > 1. Home Page > Villa Overview.
// Falls back to demo villas/photos if the live fetch fails or returns
// nothing, so the homepage never renders an empty section.
export async function VillasSection() {
  const { data: liveVillas } = await safeFetch(() => getActiveVillas(), []);
  const villas = liveVillas.length > 0 ? liveVillas : demoVillas;

  const villaCards = await Promise.all(
    villas.map(async (villa) => {
      const { data: images } = await safeFetch(() => listVillaImagesByVilla(villa.id), []);
      const imageUrl = images[0]?.url ?? DEMO_VILLA_GALLERIES[villa.slug]?.[0] ?? villa.coverImage;
      return { villa, imageUrl };
    }),
  );

  return (
    <section id="villas" className={cn(SECTION_SPACING, CONTAINER_PADDING)}>
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="วิลล่าของเรา"
          subtitle="วิลล่าริมชายหาดส่วนตัวพร้อมสระว่ายน้ำ 2 หลัง รับได้ถึง 15 คนต่อหลัง"
        />
        <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 tablet:gap-8">
          {villaCards.map(({ villa, imageUrl }) => (
            <VillaCard key={villa.id} villa={villa} imageUrl={imageUrl} />
          ))}
        </div>
      </div>
    </section>
  );
}
