import { z } from "zod";

export const promotionFormSchema = z
  .object({
    title: z.string().trim().min(1).max(255),
    description: z.string().trim().max(2000).optional().or(z.literal("")),
    discountType: z.enum(["percentage", "fixed_amount"]),
    discountValue: z.number().positive(),
    startDate: z.string().date().optional().or(z.literal("")),
    endDate: z.string().date().optional().or(z.literal("")),
    active: z.boolean().default(true),
  })
  .refine(
    (data) => Boolean(data.startDate) === Boolean(data.endDate),
    { message: "Set both a start and end date, or leave both empty", path: ["endDate"] },
  )
  .refine(
    (data) => !data.startDate || !data.endDate || data.endDate >= data.startDate,
    { message: "endDate must be on or after startDate", path: ["endDate"] },
  )
  .refine((data) => data.discountType !== "percentage" || data.discountValue <= 100, {
    message: "Percentage discount cannot exceed 100",
    path: ["discountValue"],
  });

export type PromotionFormInput = z.infer<typeof promotionFormSchema>;
