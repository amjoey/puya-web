import { z } from "zod";

const ACCEPTED_SLIP_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SLIP_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const paymentSlipFileSchema = z
  .instanceof(File)
  .refine((file) => ACCEPTED_SLIP_TYPES.includes(file.type), {
    message: "กรุณาอัปโหลดไฟล์รูปภาพ (JPG, PNG หรือ WEBP)",
  })
  .refine((file) => file.size <= MAX_SLIP_SIZE_BYTES, {
    message: "ขนาดไฟล์ต้องไม่เกิน 5MB",
  });

export const paymentUploadSchema = z.object({
  bookingId: z.string().uuid(),
  slip: paymentSlipFileSchema,
});

export const paymentVerificationSchema = z.object({
  paymentId: z.string().uuid(),
  remarks: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type PaymentUploadInput = z.infer<typeof paymentUploadSchema>;
export type PaymentVerificationInput = z.infer<
  typeof paymentVerificationSchema
>;
