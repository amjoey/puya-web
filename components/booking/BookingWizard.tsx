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
}

// Orchestrates the 5-step booking flow — see PRD.md > 4. Booking System.
// One react-hook-form instance spans all steps so values persist while
// navigating back/forth; each step validates only its own fields before
// allowing "Next". Final submit re-validates everything server-side.
export function BookingWizard({ villas, initialVillaId }: BookingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<BookingFormInput>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      villaId: initialVillaId,
      checkIn: "",
      checkOut: "",
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

  function onSubmit(data: BookingFormInput) {
    setSubmitError(null);
    startTransition(async () => {
      const result = await createBooking(data);
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

        <form onSubmit={form.handleSubmit(onSubmit)}>
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

          {submitError && (
            <p className="mt-4 text-body text-destructive">{submitError}</p>
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
              <Button type="submit" disabled={isPending}>
                {isPending ? "กำลังส่ง..." : "ยืนยันการจอง"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Form>
  );
}
