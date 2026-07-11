import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { createServiceClient } from "@/lib/supabase/service";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { formatTHB } from "@/lib/utils/currency";
import { isUuid } from "@/lib/utils/uuid";
import { getBookingById } from "@/repositories/booking.repository";
import { getVillaById } from "@/repositories/villa.repository";

// Guest-specific, holds a booking UUID — never indexed. See app/robots.ts
// (disallows crawling /booking entirely) for the matching crawl-time block.
export const metadata: Metadata = {
  title: "ยืนยันการจอง | PUYA Beach Villa",
  robots: { index: false, follow: false },
};

interface BookingConfirmationPageProps {
  // Folder is named [id] (not [bookingId]) because Next.js requires every
  // dynamic segment at this path position to share one name with sibling
  // /booking/[id] (villa slug). Only the route-internal param name changed.
  params: Promise<{ id: string }>;
}

// Step 6 (Booking Summary / Confirmation) — see PRD.md > 4. Booking System.
// Same capability-token read pattern as the payment page: the guest is
// anonymous, so the booking UUID from the redirect after createBooking()
// is treated as the access token (service-role client, since bookings has
// no anon select policy — see supabase/migrations/0001_enable_rls.sql).
export default async function BookingConfirmationPage({
  params,
}: BookingConfirmationPageProps) {
  const { id: bookingId } = await params;

  if (!isUuid(bookingId)) {
    notFound();
  }

  const serviceClient = createServiceClient();

  const { data: booking, error: loadError } = await safeFetch(
    () => getBookingById(bookingId, serviceClient),
    null,
  );

  if (loadError) {
    return (
      <main className={cn(CONTAINER_PADDING, "py-12 text-center")}>
        <p className="text-body text-destructive">
          ไม่สามารถโหลดข้อมูลการจองได้ กรุณาลองใหม่ภายหลัง
        </p>
      </main>
    );
  }

  if (!booking) {
    notFound();
  }

  const villa = await getVillaById(booking.villaId).catch(() => null);
  const isPaid = booking.paymentStatus === "paid";

  return (
    <main className={cn(CONTAINER_PADDING, "py-8 tablet:py-12")}>
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircle2 className="size-12 text-success" aria-hidden="true" />
          <h1 className="text-3xl font-medium text-ink tablet:text-4xl">ได้รับการจองแล้ว</h1>
          <p className="text-body text-ink-soft">
            {isPaid
              ? "การชำระเงินได้รับการยืนยัน และการจองของคุณได้รับการยืนยันแล้ว"
              : "เราได้สำรองวันที่ของคุณแล้ว กรุณาชำระเงินเพื่อยืนยันการจอง"}
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-2 text-body">
            <p>
              <span className="font-semibold text-ink">วิลล่า:</span>{" "}
              {villa?.name ?? "ไม่ทราบชื่อวิลล่า"}
            </p>
            <p>
              <span className="font-semibold text-ink">วันที่:</span> {booking.checkIn} –{" "}
              {booking.checkOut} ({booking.totalNights} คืน)
            </p>
            <p>
              <span className="font-semibold text-ink">จำนวนผู้เข้าพัก:</span>{" "}
              {booking.guestCount}
            </p>
            <p>
              <span className="font-semibold text-ink">ยอดรวม:</span>{" "}
              {formatTHB(booking.totalPrice)}
            </p>
            <p>
              <span className="font-semibold text-ink">สถานะ:</span>{" "}
              {{
                pending: "รอดำเนินการ",
                confirmed: "ยืนยันแล้ว",
                cancelled: "ยกเลิก",
                completed: "เสร็จสิ้น",
              }[booking.bookingStatus] ?? booking.bookingStatus}
            </p>
          </CardContent>
        </Card>

        {!isPaid && (
          <Button asChild size="lg" className="w-full">
            <Link href={`/booking/${booking.id}/payment`}>ชำระเงิน</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
