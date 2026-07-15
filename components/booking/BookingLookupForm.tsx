"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { lookupBooking, type LookupBookingResult } from "@/actions/booking.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatTHB } from "@/lib/utils/currency";

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "รอชำระเงิน",
  paid: "ชำระเงินแล้ว",
  rejected: "สลิปไม่ผ่าน กรุณาส่งใหม่",
};

// Guest recovery form — look a booking up by phone + check-in date and get
// back a link to the payment/slip-upload page. The lookup itself runs in the
// lookupBooking Server Action (service-role read), never in the browser.
export function BookingLookupForm() {
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [result, setResult] = useState<LookupBookingResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit = phone.trim().length > 0 && Boolean(checkIn);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    startTransition(async () => {
      setResult(await lookupBooking({ phone, checkIn }));
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-line bg-white p-5 shadow-soft"
      >
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lookup-phone">เบอร์โทรที่ใช้จอง</Label>
            <Input
              id="lookup-phone"
              type="tel"
              inputMode="tel"
              placeholder="08X-XXX-XXXX"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setResult(null);
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lookup-checkin">วันเช็คอิน</Label>
            <Input
              id="lookup-checkin"
              type="date"
              value={checkIn}
              onChange={(event) => {
                setCheckIn(event.target.value);
                setResult(null);
              }}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit || isPending}
          className="mt-4 w-full tablet:w-auto"
        >
          <Search className="size-4" aria-hidden="true" />
          {isPending ? "กำลังค้นหา..." : "ค้นหาการจอง"}
        </Button>
      </form>

      {result && (
        <div aria-live="polite">
          <LookupResults result={result} />
        </div>
      )}
    </div>
  );
}

function LookupResults({ result }: { result: LookupBookingResult }) {
  if (!result.success) {
    return <p className="text-body text-destructive">{result.error}</p>;
  }

  if (result.bookings.length === 0) {
    return (
      <p className="text-body text-ink-soft">
        ไม่พบการจองที่ตรงกับข้อมูลนี้ กรุณาตรวจสอบเบอร์โทรและวันเช็คอินอีกครั้ง
        หากยังไม่พบ ติดต่อเราทาง LINE ได้เลยครับ
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {result.bookings.map((booking) => {
        const isPaid = booking.paymentStatus === "paid";
        return (
          <div
            key={booking.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft"
          >
            <div>
              <p className="text-body font-semibold text-ink">{booking.villaName}</p>
              <p className="text-caption text-ink-soft">
                {booking.checkIn} – {booking.checkOut} · {formatTHB(booking.totalPrice)}
              </p>
              <p
                className={
                  isPaid
                    ? "mt-0.5 text-caption text-success"
                    : "mt-0.5 text-caption text-warning"
                }
              >
                {PAYMENT_STATUS_LABEL[booking.paymentStatus] ?? booking.paymentStatus}
              </p>
            </div>

            {isPaid ? (
              <Button asChild size="sm" variant="outline">
                <Link href={`/booking/${booking.id}/confirmation`}>ดูรายละเอียด</Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href={`/booking/${booking.id}/payment`}>อัปโหลดสลิป / ชำระเงิน</Link>
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
