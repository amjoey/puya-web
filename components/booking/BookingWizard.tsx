"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createBooking } from "@/actions/booking.actions";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { DateSelectStep } from "@/components/booking/DateSelectStep";
import { GuestInfoForm } from "@/components/booking/GuestInfoForm";
import { PriceCalculator } from "@/components/booking/PriceCalculator";
import { VillaSelectStep } from "@/components/booking/VillaSelectStep";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { bookingFormSchema, type BookingFormInput } from "@/lib/validators/booking.schema";
import type { Villa } from "@/types/villa";

const STEP_FIELDS: Record<number, (keyof BookingFormInput)[]> = {
  1: ["villaId"],
  2: ["checkIn", "checkOut"],
  3: ["customerName", "phone", "lineId", "email", "guestCount"],
  4: [],
  5: [],
};

interface BookingWizardProps {
  villas: Villa[];
  initialVillaId: string;
  // Prefilled from the Home page availability search (?checkIn&checkOut) so
  // guests don't re-enter dates they already picked. Still re-validated by
  // zod on "Next" and authoritatively re-checked server-side on submit.
  initialCheckIn?: string;
  initialCheckOut?: string;
}

// Orchestrates the 5-step booking flow — see PRD.md > 4. Booking System.
// One react-hook-form instance spans all steps so values persist while
// navigating back/forth; each step validates only its own fields before
// allowing "Next". Final submit re-validates everything server-side.
export function BookingWizard({
  villas,
  initialVillaId,
  initialCheckIn = "",
  initialCheckOut = "",
}: BookingWizardProps) {
  const router = useRouter();
  // Skip straight to the date step when both dates arrive prefilled from the
  // Home search — the villa is already chosen and the dates are already set.
  const [step, setStep] = useState(
    initialCheckIn && initialCheckOut ? 2 : 1,
  );
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const form = useForm<BookingFormInput>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      villaId: initialVillaId,
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
      customerName: "",
      phone: "",
      lineId: "",
      email: "",
      guestCount: 1,
    },
  });

  const selectedVilla = villas.find((villa) => villa.id === form.watch("villaId"));

  async function goNext() {
    const fields = STEP_FIELDS[step];
    const valid = fields.length === 0 || (await form.trigger(fields));
    if (valid) {
      setStep((current) => Math.min(current + 1, 5));
    }
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 1));
  }

  // Step 5: validate everything, then open the confirm dialog. The booking
  // is NOT created here — the guest has to make a second, deliberate press
  // inside the dialog. This prevents a single click (or an accidental Enter)
  // from creating a booking and jumping to the payment page.
  async function openConfirm() {
    const valid = await form.trigger();
    if (valid) {
      setSubmitError(null);
      setConfirmOpen(true);
    }
  }

  // Fired only by the "ยืนยันและไปชำระเงิน" button inside the dialog.
  function confirmBooking() {
    setSubmitError(null);
    startTransition(async () => {
      const result = await createBooking(form.getValues());
      if (result.success) {
        router.push(`/booking/${result.booking.id}/payment`);
      } else {
        setSubmitError(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <div className="flex flex-col gap-8">
        <BookingStepper currentStep={step} />

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (step === 5) void openConfirm();
          }}
        >
          {step === 1 && <VillaSelectStep form={form} villas={villas} />}
          {step === 2 && selectedVilla && (
            <DateSelectStep form={form} villaId={selectedVilla.id} />
          )}
          {step === 3 && (
            <GuestInfoForm form={form} maxGuests={selectedVilla?.capacity} />
          )}
          {step === 4 && selectedVilla && (
            <PriceCalculator
              checkIn={form.watch("checkIn")}
              checkOut={form.watch("checkOut")}
              weekdayPrice={selectedVilla.weekdayPrice}
              weekendPrice={selectedVilla.weekendPrice}
            />
          )}
          {step === 5 && selectedVilla && (
            <BookingSummary villa={selectedVilla} data={form.getValues()} />
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={goBack}>
                ย้อนกลับ
              </Button>
            ) : (
              <span />
            )}
            {step < 5 ? (
              <Button type="button" onClick={goNext}>
                ถัดไป
              </Button>
            ) : (
              <Button type="button" onClick={openConfirm} disabled={isPending}>
                ยืนยันการจอง
              </Button>
            )}
          </div>
        </form>

        <Dialog
          open={confirmOpen}
          onOpenChange={(open) => {
            if (isPending) return;
            setConfirmOpen(open);
            if (!open) setSubmitError(null);
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>ยืนยันการจอง</DialogTitle>
              <DialogDescription>
                กรุณาตรวจสอบข้อมูลให้ถูกต้อง เมื่อกดยืนยัน ระบบจะสร้างการจองในสถานะ
                &ldquo;รอชำระเงิน&rdquo; แล้วพาคุณไปหน้าชำระเงิน
              </DialogDescription>
            </DialogHeader>

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmOpen(false)}
                disabled={isPending}
              >
                ยกเลิก
              </Button>
              <Button type="button" onClick={confirmBooking} disabled={isPending}>
                {isPending ? "กำลังส่ง..." : "ยืนยันและไปชำระเงิน"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Form>
  );
}
