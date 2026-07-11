import { Users } from "lucide-react";

import { formatTHB } from "@/lib/utils/currency";
import { calculatePrice } from "@/services/pricing.service";
import type { BookingFormInput } from "@/lib/validators/booking.schema";
import type { Villa } from "@/types/villa";

interface BookingSummaryProps {
  villa: Villa;
  data: BookingFormInput;
}

// Step 5 — see PRD.md > 4. Booking System > Step 4 (Booking Creation) and
// UI_UX_SPEC.md > Price Summary Card.
export function BookingSummary({ villa, data }: BookingSummaryProps) {
  const breakdown = calculatePrice(
    data.checkIn,
    data.checkOut,
    villa.weekdayPrice,
    villa.weekendPrice,
  );

  return (
    <div>
      <h2 className="text-2xl font-medium text-ink">สรุปการจอง</h2>
      <div className="mt-4 rounded-2xl border border-line bg-paper p-4">
        <dl className="flex flex-col gap-2 text-body">
          <div className="flex justify-between">
            <dt className="text-ink-soft">วิลล่า</dt>
            <dd className="font-medium text-ink">{villa.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">วันเช็คอิน</dt>
            <dd className="font-medium text-ink">{data.checkIn}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">วันเช็คเอาท์</dt>
            <dd className="font-medium text-ink">{data.checkOut}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">จำนวนคืน</dt>
            <dd className="font-medium text-ink">{breakdown.totalNights}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">ชื่อผู้จอง</dt>
            <dd className="font-medium text-ink">{data.customerName}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-1.5 text-ink-soft">
              <Users className="size-4" aria-hidden="true" />
              จำนวนผู้เข้าพัก
            </dt>
            <dd className="font-medium text-ink">{data.guestCount}</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-2 text-xl font-semibold">
            <dt className="text-ink">ยอดรวม</dt>
            <dd className="text-aqua-deep">{formatTHB(breakdown.totalPrice)}</dd>
          </div>
        </dl>
      </div>
      <p className="mt-3 text-caption text-ink-soft">
        การจองจะถูกสร้างในสถานะ &ldquo;รอชำระเงิน&rdquo; คุณจะอัปโหลดสลิป PromptPay ในขั้นตอนถัดไป
      </p>
    </div>
  );
}
