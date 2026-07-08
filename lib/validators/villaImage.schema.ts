import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB — marketing photos run larger than payment slips.

export const villaImageFileSchema = z
  .instanceof(File)
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Photo must be JPG, PNG, or WEBP",
  })
  .refine((file) => file.size <= MAX_IMAGE_SIZE_BYTES, {
    message: "Photo must be 8MB or smaller",
  });

export const villaImageUploadSchema = z.object({
  villaId: z.string().uuid(),
  photo: villaImageFileSchema,
});

export type VillaImageUploadInput = z.infer<typeof villaImageUploadSchema>;
