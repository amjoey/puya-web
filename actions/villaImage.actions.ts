"use server";

import { UnauthorizedError } from "@/lib/auth/session";
import { toActionError } from "@/lib/utils/actionError";
import { villaImageUploadSchema } from "@/lib/validators/villaImage.schema";
import {
  addVillaImage,
  removeVillaImage,
  swapVillaImageOrder,
  VillaImageNotFoundError,
} from "@/services/villaImage.service";
import type { VillaImage } from "@/types/villaImage";

export type UploadVillaImageResult =
  | { success: true; image: VillaImage }
  | { success: false; error: string };

// Admin Dashboard > Manage Villas > Gallery. Signature matches React's
// useActionState (prevState, formData) so the client component can bind it
// directly to a <form action={...}>, same pattern as PaymentUpload.
export async function uploadVillaImage(
  _prevState: UploadVillaImageResult | null,
  formData: FormData,
): Promise<UploadVillaImageResult> {
  const parsed = villaImageUploadSchema.safeParse({
    villaId: formData.get("villaId"),
    photo: formData.get("photo"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Please upload a valid photo.",
    };
  }

  try {
    const image = await addVillaImage(parsed.data.villaId, parsed.data.photo);
    return { success: true, image };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Something went wrong while uploading this photo.", [
        UnauthorizedError,
      ]),
    };
  }
}

export type VillaImageActionResult = { success: true } | { success: false; error: string };

export async function deleteVillaImage(imageId: string): Promise<VillaImageActionResult> {
  try {
    await removeVillaImage(imageId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to delete this photo.", [
        UnauthorizedError,
        VillaImageNotFoundError,
      ]),
    };
  }
}

export async function reorderVillaImages(
  imageId: string,
  imageSortOrder: number,
  otherImageId: string,
  otherImageSortOrder: number,
): Promise<VillaImageActionResult> {
  try {
    await swapVillaImageOrder(imageId, imageSortOrder, otherImageId, otherImageSortOrder);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to reorder photos.", [UnauthorizedError]),
    };
  }
}
