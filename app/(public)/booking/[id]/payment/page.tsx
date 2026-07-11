import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaymentUpload } from "@/components/booking/PaymentUpload";
import { PromptPayQr } from "@/components/booking/PromptPayQr";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { createServiceClient } from "@/lib/supabase/service";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { isUuid } from "@/lib/utils/uuid";
import { getBookingById } from "@/repositories/booking.repository";
import { getPaymentByBookingId } from "@/repositories/payment.repository";
import { getVillaById } from "@/repositories/villa.repository";

interface BookingPaymentPageProps {
  // Folder is named [id] (not [bookingId]) because Next.js requires every
  // dynamic segment at this path position to share one name with sibling
  // /booking/[id] (villa slug). Only the route-internal param name changed.
  params: Promise<{ id: string }>;
}

// Guest-specific, holds a booking UUID — never indexed. See app/robots.ts
// (disallows crawling /booking entirely) for the matching crawl-time block.
export const metadata: Metadata = {
  title: "ชำระเงิน | PUYA Beach Villa",
  robots: { index: false, follow: false },
};

// Step 5 (Payment Upload) — see PRD.md > 4. Booking System > Step 5.
// The guest is anonymous but holds the unguessable booking UUID from the
// post-creation redirect, so this reads via the service-role client rather
// than the RLS-bound one (bookings/payments have no anon select policy —
// see supabase/migrations/0001_enable_rls.sql).
export default async function BookingPaymentPage({ params }: BookingPaymentPageProps) {
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

  const [villa, existingPayment] = await Promise.all([
    getVillaById(booking.villaId),
    getPaymentByBookingId(booking.id, serviceClient),
  ]);

  return (
    <main className={cn(CONTAINER_PADDING, "py-8 tablet:py-12")}>
      <div className="mx-auto flex max-w-xl flex-col gap-8">
        <div>
          <h1 className="text-3xl font-medium text-ink tablet:text-4xl">ชำระเงิน</h1>
          <p className="mt-2 text-body text-ink-soft">
            {villa?.name ?? "วิลล่าของคุณ"} · {booking.checkIn} – {booking.checkOut}
          </p>
        </div>

        <PromptPayQr amount={booking.totalPrice} />

        {existingPayment?.verified ? (
          <p className="text-body text-success">
            การชำระเงินได้รับการยืนยันแล้ว ยินดีต้อนรับสู่ PUYA Beach Villa!
          </p>
        ) : (
          <PaymentUpload bookingId={booking.id} alreadyUploaded={Boolean(existingPayment)} />
        )}
      </div>
    </main>
  );
}
