import { z } from "zod";

export const promotionFormSchema = z
  .object({
    title: z.string().trim().min(1, "กรุณากรอกชื่อโปรโมชัน").max(255, "ชื่อโปรโมชันยาวเกินไป"),
    description: z
      .string()
      .trim()
      .max(2000, "รายละเอียดยาวเกินไป")
      .optional()
      .or(z.literal("")),
    discountType: z.enum(["percentage", "fixed_amount"]),
    discountValue: z
      .number({ invalid_type_error: "กรุณากรอกมูลค่าส่วนลด" })
      .positive("มูลค่าส่วนลดต้องมากกว่า 0"),
    startDate: z.string().date("รูปแบบวันที่ไม่ถูกต้อง").optional().or(z.literal("")),
    endDate: z.string().date("รูปแบบวันที่ไม่ถูกต้อง").optional().or(z.literal("")),
    active: z.boolean().default(true),
  })
  .refine(
    (data) => Boolean(data.startDate) === Boolean(data.endDate),
    { message: "กรุณากรอกวันเริ่มต้นและวันสิ้นสุดพร้อมกัน หรือเว้นว่างทั้งคู่", path: ["endDate"] },
  )
  .refine(
    (data) => !data.startDate || !data.endDate || data.endDate >= data.startDate,
    { message: "วันสิ้นสุดต้องไม่ก่อนวันเริ่มต้น", path: ["endDate"] },
  )
  .refine((data) => data.discountType !== "percentage" || data.discountValue <= 100, {
    message: "ส่วนลดประเภทเปอร์เซ็นต์ต้องไม่เกิน 100",
    path: ["discountValue"],
  });

export type PromotionFormInput = z.infer<typeof promotionFormSchema>;
