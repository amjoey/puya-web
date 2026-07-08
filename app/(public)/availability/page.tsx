import type { Metadata } from "next";
import Link from "next/link";

import { AvailabilityCalendar } from "@/components/calendar/AvailabilityCalendar";
import { Button } from "@/components/ui/button";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { SEO } from "@/lib/constants/seo";
import { parseMonthParam } from "@/lib/utils/date";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { getActiveVillas } from "@/repositories/villa.repository";

interface AvailabilityPageProps {
  searchParams: Promise<{ month?: string }>;
}

const TITLE = "ตรวจสอบวันว่าง | PUYA Beach Villa";
const DESCRIPTION =
  "ดูปฏิทินวันว่างของทั้ง 2 วิลล่าแบบเปรียบเทียบ ก่อนทำการจอง";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/availability" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [SEO.defaultOgImage],
    type: "website",
  },
};

// See PRD.md > 3. Availability Calendar — combined view across both villas
// so guests can compare open dates before starting the booking flow.
export default async function AvailabilityPage({ searchParams }: AvailabilityPageProps) {
  const { month: monthParam } = await searchParams;
  const { year, month } = parseMonthParam(monthParam);

  const { data: villas, error: loadError } = await safeFetch(() => getActiveVillas(), []);

  return (
    <main className={cn(CONTAINER_PADDING, "py-8 tablet:py-12")}>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-h2 font-bold text-foreground">ตรวจสอบวันว่าง</h1>
        <p className="mt-2 text-body text-muted-foreground">
          เปรียบเทียบวันว่างของทั้ง 2 วิลล่า แล้วเลือกจองที่เหมาะกับคุณ
        </p>

        {loadError ? (
          <p className="mt-8 text-body text-destructive">
            ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่ภายหลัง
          </p>
        ) : villas.length === 0 ? (
          <p className="mt-8 text-body text-muted-foreground">
            ไม่มีวิลล่าให้ตรวจสอบในขณะนี้
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 tablet:grid-cols-2">
            {villas.map((villa) => (
              <div key={villa.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-h3 font-semibold text-foreground">{villa.name}</h2>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/villas/${villa.slug}`}>ดูวิลล่า</Link>
                  </Button>
                </div>
                <div className="mt-4">
                  <AvailabilityCalendar
                    villaId={villa.id}
                    villaName={villa.name}
                    year={year}
                    month={month}
                    basePath="/availability"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
