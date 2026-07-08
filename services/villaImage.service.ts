import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { deleteVillaImageFile, uploadVillaImage as uploadToStorage } from "@/lib/supabase/storage";
import {
  createVillaImage,
  deleteVillaImage as deleteVillaImageRow,
  getNextSortOrder,
  getVillaImageStoragePath,
  updateVillaImageSortOrder,
} from "@/repositories/villaImage.repository";
import type { VillaImage } from "@/types/villaImage";

export class VillaImageNotFoundError extends Error {
  constructor() {
    super("Photo could not be found.");
    this.name = "VillaImageNotFoundError";
  }
}

// Admin Dashboard > Manage Villas > Gallery — uploads append to the end of
// the gallery (see repositories/villaImage.repository.ts > getNextSortOrder).
export async function addVillaImage(villaId: string, file: File): Promise<VillaImage> {
  await requireAdmin();
  const supabase = await createClient();

  const storagePath = await uploadToStorage(supabase, villaId, file);
  const sortOrder = await getNextSortOrder(villaId);

  return createVillaImage(
    { villa_id: villaId, storage_path: storagePath, sort_order: sortOrder },
    supabase,
  );
}

export async function removeVillaImage(imageId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const storagePath = await getVillaImageStoragePath(imageId, supabase);
  if (!storagePath) {
    throw new VillaImageNotFoundError();
  }

  await deleteVillaImageRow(imageId, supabase);
  // Storage cleanup happens after the row is gone — an orphaned object is
  // harmless, but a row pointing at a missing file would render as a
  // broken image in the gallery.
  await deleteVillaImageFile(supabase, storagePath);
}

// Swaps the sort_order of two adjacent images — the simplest reorder
// primitive that still lets an admin move a photo up/down one step at a
// time without a full drag-and-drop implementation.
export async function swapVillaImageOrder(
  imageId: string,
  imageSortOrder: number,
  otherImageId: string,
  otherImageSortOrder: number,
): Promise<void> {
  await requireAdmin();
  await Promise.all([
    updateVillaImageSortOrder(imageId, otherImageSortOrder),
    updateVillaImageSortOrder(otherImageId, imageSortOrder),
  ]);
}
