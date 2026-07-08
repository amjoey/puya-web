"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createPromotion, updatePromotion } from "@/actions/promotion.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { promotionFormSchema, type PromotionFormInput } from "@/lib/validators/promotion.schema";
import type { Promotion } from "@/types/promotion";

interface PromotionFormProps {
  promotion?: Promotion;
}

// Admin Dashboard > Promotion Management (Create/Edit) — see PRD.md > 6. Promotions System.
export function PromotionForm({ promotion }: PromotionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<PromotionFormInput>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      title: promotion?.title ?? "",
      description: promotion?.description ?? "",
      discountType: promotion?.discountType ?? "percentage",
      discountValue: promotion?.discountValue ?? 0,
      startDate: promotion?.startDate ?? "",
      endDate: promotion?.endDate ?? "",
      active: promotion?.active ?? true,
    },
  });

  function onSubmit(data: PromotionFormInput) {
    setSubmitError(null);
    startTransition(async () => {
      const result = promotion
        ? await updatePromotion(promotion.id, data)
        : await createPromotion(data);
      if (result && !result.success) {
        setSubmitError(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date (optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {submitError && <p className="text-body text-destructive">{submitError}</p>}

        <Button type="submit" disabled={isPending} className="self-start">
          {isPending ? "Saving..." : promotion ? "Save Changes" : "Create Promotion"}
        </Button>
      </form>
    </Form>
  );
}
