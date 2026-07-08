"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";

import { submitReview } from "@/actions/review.actions";
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
import { cn } from "@/lib/utils/cn";
import { reviewFormSchema, type ReviewFormInput } from "@/lib/validators/review.schema";
import type { Villa } from "@/types/villa";

interface ReviewFormProps {
  villas: Villa[];
}

// Guest-facing review submission — see PRD.md > 5. Reviews System
// (Rating Component, Comment, submitted reviews are admin-moderated before
// they appear publicly). Photo upload is not wired yet — no review-photos
// storage bucket exists; see PROJECT_AUDIT.md.
export function ReviewForm({ villas }: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ReviewFormInput>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      villaId: villas[0]?.id ?? "",
      customerName: "",
      rating: 5,
      comment: "",
      imageUrl: "",
    },
  });

  function onSubmit(data: ReviewFormInput) {
    setSubmitError(null);
    startTransition(async () => {
      const result = await submitReview(data);
      if (result.success) {
        setSubmitted(true);
        form.reset();
      } else {
        setSubmitError(result.error);
      }
    });
  }

  if (submitted) {
    return (
      <p className="text-body text-success">
        ขอบคุณ! รีวิวของคุณถูกส่งแล้ว และจะแสดงเมื่อผ่านการตรวจสอบ
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="villaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วิลล่า</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {villas.map((villa) => (
                    <SelectItem key={villa.id} value={villa.id}>
                      {villa.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อของคุณ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>คะแนน</FormLabel>
              <FormControl>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={`${value} ดาว`}
                      onClick={() => field.onChange(value)}
                      className="p-0.5"
                    >
                      <Star
                        className={cn(
                          "size-6",
                          value <= field.value
                            ? "fill-warning text-warning"
                            : "fill-none text-border",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ความคิดเห็น</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="เล่าให้ฟังเกี่ยวกับการเข้าพักของคุณ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError && <p className="text-body text-destructive">{submitError}</p>}

        <Button type="submit" disabled={isPending} className="self-start">
          {isPending ? "กำลังส่ง..." : "ส่งรีวิว"}
        </Button>
      </form>
    </Form>
  );
}
