"use client";

import { useState, useTransition } from "react";
import type { UseFormReturn } from "react-hook-form";

import { checkDateAvailability } from "@/actions/booking.actions";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { BookingFormInput } from "@/lib/validators/booking.schema";

interface DateSelectStepProps {
  form: UseFormReturn<BookingFormInput>;
  villaId: string;
}

type AvailabilityState =
  | { checked: false }
  | { checked: true; available: boolean; error?: string };

// Step 2 — see PRD.md > 4. Booking System > Step 1 (Check-in/Check-out) and
// CLAUDE.md > Booking Rules (Prevent Double Booking).
export function DateSelectStep({ form, villaId }: DateSelectStepProps) {
  const [isPending, startTransition] = useTransition();
  const [availability, setAvailability] = useState<AvailabilityState>({ checked: false });

  const checkIn = form.watch("checkIn");
  const checkOut = form.watch("checkOut");
  const today = new Date().toISOString().slice(0, 10);

  function handleCheckAvailability() {
    startTransition(async () => {
      const result = await checkDateAvailability({ villaId, checkIn, checkOut });
      setAvailability({ checked: true, available: result.available, error: result.error });
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-h3 font-semibold text-foreground">เลือกวันที่</h2>
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <FormField
          control={form.control}
          name="checkIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วันเช็คอิน</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  min={today}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                    setAvailability({ checked: false });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="checkOut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วันเช็คเอาท์</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  min={checkIn || today}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                    setAvailability({ checked: false });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleCheckAvailability}
        disabled={!checkIn || !checkOut || isPending}
        className="self-start"
      >
        {isPending ? "กำลังตรวจสอบ..." : "ตรวจสอบวันว่าง"}
      </Button>

      {availability.checked && (
        <p className={availability.available ? "text-body text-success" : "text-body text-destructive"}>
          {availability.available
            ? "วันที่เลือกว่างอยู่"
            : availability.error ?? "วันที่เลือกไม่ว่าง"}
        </p>
      )}
    </div>
  );
}
