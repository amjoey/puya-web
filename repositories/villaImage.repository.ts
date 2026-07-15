import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { getVillaImagePublicUrl } from "@/lib/supabase/storage";
import type { Database, Tables, TablesInsert } from "@/types/database.types";
import type { VillaImage } from "@/types/villaImage";

function mapVillaImageRow(
  row: Tables<"villa_images">,
  client: SupabaseClient<Database>,
): VillaImage {
  return {
    id: row.id,
    villaId: row.villa_id,
    url: getVillaImagePublicUrl(client, row.storage_path),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

// Public read (Home, /villas, /villas/[slug]) — cookieless anon client,
// ISR-friendly. Returns only the public storage URL, no session needed.
export async function listVillaImagesByVilla(villaId: string): Promise<VillaImage[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("villa_images")
    .select("*")
    .eq("villa_id", villaId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => mapVillaImageRow(row, supabase));
}

// `client` defaults to the cookie-based admin client; callers that already
// hold a client (e.g. the service layer, right after an upload) pass it
// through to avoid a second auth round trip.
export async function createVillaImage(
  input: TablesInsert<"villa_images">,
  client?: SupabaseClient<Database>,
): Promise<VillaImage> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("villa_images")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return mapVillaImageRow(data, supabase);
}

export async function getVillaImageById(
  id: string,
  client?: SupabaseClient<Database>,
): Promise<VillaImage | null> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("villa_images")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapVillaImageRow(data, supabase) : null;
}

// Raw storage_path (not the mapped public URL) — used right before deleting
// the row, to clean up the matching object in the villa-images bucket.
export async function getVillaImageStoragePath(
  id: string,
  client?: SupabaseClient<Database>,
): Promise<string | null> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("villa_images")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data?.storage_path ?? null;
}

export async function deleteVillaImage(
  id: string,
  client?: SupabaseClient<Database>,
): Promise<void> {
  const supabase = client ?? (await createClient());
  const { error } = await supabase.from("villa_images").delete().eq("id", id);
  if (error) throw error;
}

export async function updateVillaImageSortOrder(
  id: string,
  sortOrder: number,
  client?: SupabaseClient<Database>,
): Promise<void> {
  const supabase = client ?? (await createClient());
  const { error } = await supabase
    .from("villa_images")
    .update({ sort_order: sortOrder })
    .eq("id", id);

  if (error) throw error;
}

// Returns the next sort_order for a villa so new uploads append at the end
// of the gallery instead of all defaulting to 0.
export async function getNextSortOrder(villaId: string): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("villa_images")
    .select("sort_order")
    .eq("villa_id", villaId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? data.sort_order + 1 : 0;
}
