"use client";

import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { BookingFormInput } from "@/lib/validators/booking.schema";

interface GuestInfoFormProps {
  form: UseFormReturn<BookingFormInput>;
  maxGuests?: number;
}

// Step 3 — see PRD.md > 4. Booking System > Step 2 (Guest Information).
export function GuestInfoForm({ form, maxGuests }: GuestInfoFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-medium text-ink">ข้อมูลผู้เข้าพัก</h2>
      <FormField
        control={form.control}
        name="customerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ชื่อ-นามสกุล</FormLabel>
            <FormControl>
              <Input placeholder="ชื่อ-นามสกุล" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>เบอร์โทรศัพท์</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="08x-xxx-xxxx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lineId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LINE ID (ถ้ามี)</FormLabel>
              <FormControl>
                <Input placeholder="@your-line-id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อีเมล (ถ้ามี)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="guestCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>จำนวนผู้เข้าพัก</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={maxGuests}
                  {...field}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                />
              </FormControl>
              {maxGuests && (
                <p className="text-caption text-ink-soft">
                  วิลล่านี้รับได้สูงสุด {maxGuests} คน
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
