import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

export const VILLA_IMAGES_BUCKET = "villa-images";

// villa-images is a public bucket (gallery photos have no guest PII) — see
// supabase/migrations/0003_villa_images.sql. Admin uploads use the normal
// RLS-respecting client; is_admin() gates the storage insert policy.
export async function uploadVillaImage(
  client: SupabaseClient<Database>,
  villaId: string,
  file: File,
): Promise<string> {
  const path = `${villaId}/${Date.now()}-${file.name}`;
  const { error } = await client.storage.from(VILLA_IMAGES_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw error;
  return path;
}

export function getVillaImagePublicUrl(
  client: SupabaseClient<Database>,
  path: string,
): string {
  return client.storage.from(VILLA_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function deleteVillaImageFile(
  client: SupabaseClient<Database>,
  path: string,
): Promise<void> {
  const { error } = await client.storage.from(VILLA_IMAGES_BUCKET).remove([path]);
  if (error) throw error;
}

export const PAYMENT_SLIPS_BUCKET = "payment-slips";

// Guest uploads always pass the service-role client (see
// services/payment.service.ts) since `payment-slips` has no anon/authenticated
// insert policy — see supabase/migrations/0002_storage_payment_slips.sql.
export async function uploadPaymentSlip(
  client: SupabaseClient<Database>,
  bookingId: string,
  file: File,
): Promise<string> {
  const path = `${bookingId}/${Date.now()}-${file.name}`;
  const { error } = await client.storage.from(PAYMENT_SLIPS_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw error;
  return path;
}

// payment-slips is a private bucket — admins view slips via short-lived
// signed URLs, never public URLs.
export async function getPaymentSlipSignedUrl(
  client: SupabaseClient<Database>,
  path: string,
  expiresInSeconds = 300,
): Promise<string> {
  const { data, error } = await client.storage
    .from(PAYMENT_SLIPS_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error) throw error;
  return data.signedUrl;
}

// Batch variant for admin list views (e.g. payment verification) — one
// Storage API call for all slips instead of one per row.
export async function getPaymentSlipSignedUrls(
  client: SupabaseClient<Database>,
  paths: string[],
  expiresInSeconds = 300,
): Promise<Map<string, string>> {
  if (paths.length === 0) return new Map();

  const { data, error } = await client.storage
    .from(PAYMENT_SLIPS_BUCKET)
    .createSignedUrls(paths, expiresInSeconds);

  if (error) throw error;

  const urlsByPath = new Map<string, string>();
  for (const entry of data ?? []) {
    if (entry.signedUrl && entry.path) {
      urlsByPath.set(entry.path, entry.signedUrl);
    }
  }
  return urlsByPath;
}
