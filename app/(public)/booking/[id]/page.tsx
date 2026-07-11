import type { Metadata } from "next";

import { BookingWizard } from "@/components/booking/BookingWizard";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { getActiveVillas } from "@/repositories/villa.repository";

interface BookingPageProps {
  // Folder is named [id] (not [villaSlug]) because Next.js requires every
  // dynamic segment at this path position to share one name — this same
  // position is also used by /booking/[id]/payment and /booking/[id]/confirmation
  // for a booking UUID. The value here is still a villa slug; only the
  // route-internal param name changed, not the URL or behavior.
  params: Promise<{ id: string }>;
}

// Transactional flow page, not evergreen content — see CLAUDE.md > SEO and
// app/robots.ts (which also disallows crawling /booking entirely).
export const metadata: Metadata = {
  title: "จองที่พัก | PUYA Beach Villa",
  robots: { index: false, follow: false },
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { id: villaSlug } = await params;

  const { data: villas, error: loadError } = await safeFetch(() => getActiveVillas(), []);

  if (loadError) {
    return (
      <main className={cn(CONTAINER_PADDING, "py-12 text-center")}>
        <p className="text-body text-destructive">
          ไม่สามารถโหลดข้อมูลวิลล่าได้ กรุณาลองใหม่ภายหลัง
        </p>
      </main>
    );
  }

  if (villas.length === 0) {
    return (
      <main className={cn(CONTAINER_PADDING, "py-12 text-center")}>
        <p className="text-body text-ink-soft">
          ไม่มีวิลล่าให้จองในขณะนี้
        </p>
      </main>
    );
  }

  const initialVilla = villas.find((villa) => villa.slug === villaSlug) ?? villas[0];

  return (
    <main className={cn(CONTAINER_PADDING, "py-8 tablet:py-12")}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-medium text-ink tablet:text-4xl">จองที่พัก</h1>
        <div className="mt-8">
          <BookingWizard villas={villas} initialVillaId={initialVilla.id} />
        </div>
      </div>
    </main>
  );
}
