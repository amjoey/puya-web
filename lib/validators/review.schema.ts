import { z } from "zod";

export const reviewFormSchema = z.object({
  villaId: z.string().uuid(),
  customerName: z.string().trim().min(1).max(255),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type ReviewFormInput = z.infer<typeof reviewFormSchema>;
