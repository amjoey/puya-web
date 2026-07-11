"use client";

import type { UseFormReturn } from "react-hook-form";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { CONTACT_INFO } from "@/lib/constants/contact";
import { cn } from "@/lib/utils/cn";
import { formatTHB } from "@/lib/utils/currency";
import type { BookingFormInput } from "@/lib/validators/booking.schema";
import type { Villa } from "@/types/villa";

interface VillaSelectStepProps {
  form: UseFormReturn<BookingFormInput>;
  villas: Villa[];
}

// Step 1 — see PRD.md > 4. Booking System > Step 1 (Select Villa).
export function VillaSelectStep({ form, villas }: VillaSelectStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-medium text-ink">เลือกวิลล่า</h2>
      <FormField
        control={form.control}
        name="villaId"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormControl>
              <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
                {villas.map((villa) => (
                  <button
                    key={villa.id}
                    type="button"
                    onClick={() => field.onChange(villa.id)}
                    aria-pressed={field.value === villa.id}
                    className={cn(
                      "rounded-2xl border-2 p-4 text-left transition-colors",
                      field.value === villa.id
                        ? "border-aqua bg-aqua-soft/40"
                        : "border-line hover:border-aqua/50",
                    )}
                  >
                    <span className="block text-body font-semibold text-ink">
                      {villa.name}
                    </span>
                    <span className="mt-1 block text-caption text-ink-soft">
                      รับได้ถึง {villa.capacity} คน · เริ่มต้น {formatTHB(villa.weekdayPrice)}/คืน
                    </span>
                  </button>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <p className="mt-3 text-caption text-ink-soft">
        มีคำถามเกี่ยวกับวิลล่า? โทร {CONTACT_INFO.phone} หรือส่งข้อความทาง LINE
      </p>
    </div>
  );
}
