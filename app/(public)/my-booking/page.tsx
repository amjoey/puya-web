import type { Metadata } from "next";

import { BookingLookupForm } from "@/components/booking/BookingLookupForm";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

const TITLE = "ค้นหาการจอง / ส่งสลิปย้อนหลัง | PUYA Beach Villa";
const DESCRIPTION =
  "จองแล้วแต่ยังไม่ได้โอน หรือปิดหน้าไปก่อน? ค้นหาการจองด้วยเบอร์โทรและวันเช็คอิน เพื่อกลับมาอัปโหลดสลิปได้";

// Utility/transactional page — no SEO value and links to guest bookings, so
// keep it out of the index (matches the /booking payment/confirmation pages).
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
};

export default function MyBookingPage() {
  return (
    <main className={cn(CONTAINER_PADDING, "py-8 tablet:py-12")}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-medium text-ink tablet:text-4xl">
          ค้นหาการจองของคุณ
        </h1>
        <p className="mt-2 text-body text-ink-soft">
          จองไว้แล้วแต่ยังไม่ได้โอน หรือเผลอปิดหน้าไปก่อน? กรอกเบอร์โทรที่ใช้จอง
          และวันเช็คอิน เพื่อกลับมาอัปโหลดสลิป PromptPay ต่อได้เลย
        </p>

        <div className="mt-8">
          <BookingLookupForm />
        </div>
      </div>
    </main>
  );
}
