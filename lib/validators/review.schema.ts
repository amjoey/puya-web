import { z } from "zod";

export const reviewFormSchema = z.object({
  villaId: z.string().uuid(),
  customerName: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อ-นามสกุล")
    .max(255, "ชื่อ-นามสกุลยาวเกินไป"),
  rating: z
    .number({ invalid_type_error: "กรุณาให้คะแนน" })
    .int()
    .min(1, "กรุณาให้คะแนนอย่างน้อย 1 ดาว")
    .max(5, "คะแนนสูงสุดคือ 5 ดาว"),
  comment: z.string().trim().max(2000, "ความคิดเห็นยาวเกินไป").optional().or(z.literal("")),
  imageUrl: z.string().url("รูปแบบ URL ไม่ถูกต้อง").optional().or(z.literal("")),
});

export type ReviewFormInput = z.infer<typeof reviewFormSchema>;
