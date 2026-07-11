"use client";

import { useActionState } from "react";

import { uploadPaymentSlip, type UploadPaymentSlipResult } from "@/actions/payment.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentUploadProps {
  bookingId: string;
  alreadyUploaded?: boolean;
}

// Step 5 — see PRD.md > 4. Booking System > Step 5 (Payment Upload).
export function PaymentUpload({ bookingId, alreadyUploaded }: PaymentUploadProps) {
  const [state, formAction, isPending] = useActionState<UploadPaymentSlipResult | null, FormData>(
    uploadPaymentSlip,
    null,
  );

  if (state?.success) {
    return (
      <p className="text-body text-success">
        อัปโหลดสลิปสำเร็จ! เราจะตรวจสอบการชำระเงินและยืนยันการจองโดยเร็ว
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="bookingId" value={bookingId} />
      <div>
        <Label htmlFor="slip">อัปโหลดสลิปการชำระเงิน</Label>
        <Input
          id="slip"
          name="slip"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="mt-2"
        />
        <p className="mt-1 text-caption text-ink-soft">ไฟล์ JPG, PNG หรือ WEBP ขนาดไม่เกิน 5MB</p>
      </div>

      {alreadyUploaded && (
        <p className="text-caption text-ink-soft">
          คุณอัปโหลดสลิปสำหรับการจองนี้แล้ว — การอัปโหลดใหม่จะแทนที่สลิปเดิม
        </p>
      )}

      {state && !state.success && (
        <p className="text-body text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "กำลังอัปโหลด..." : "ส่งสลิปการชำระเงิน"}
      </Button>
    </form>
  );
}
