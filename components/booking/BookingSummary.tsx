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
      <h2 className="text-h3 font-semibold text-foreground">สรุปการจอง</h2>
      <div className="mt-4 rounded-xl border border-border bg-secondary p-4">
        <dl className="flex flex-col gap-2 text-body">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">วิลล่า</dt>
            <dd className="font-medium text-foreground">{villa.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">วันเช็คอิน</dt>
            <dd className="font-medium text-foreground">{data.checkIn}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">วันเช็คเอาท์</dt>
            <dd className="font-medium text-foreground">{data.checkOut}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">จำนวนคืน</dt>
            <dd className="font-medium text-foreground">{breakdown.totalNights}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">ชื่อผู้จอง</dt>
            <dd className="font-medium text-foreground">{data.customerName}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-4" aria-hidden="true" />
              จำนวนผู้เข้าพัก
            </dt>
            <dd className="font-medium text-foreground">{data.guestCount}</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-2 text-h3 font-semibold">
            <dt className="text-foreground">ยอดรวม</dt>
            <dd className="text-foreground">{formatTHB(breakdown.totalPrice)}</dd>
          </div>
        </dl>
      </div>
      <p className="mt-3 text-caption text-muted-foreground">
        การจองจะถูกสร้างในสถานะ &ldquo;รอชำระเงิน&rdquo; คุณจะอัปโหลดสลิป PromptPay ในขั้นตอนถัดไป
      </p>
    </div>
  );
}
