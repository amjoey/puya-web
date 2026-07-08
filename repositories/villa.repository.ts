import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";
import type { Villa } from "@/types/villa";

function mapVillaRow(row: Tables<"villas">): Villa {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    capacity: row.capacity,
    weekdayPrice: row.weekday_price,
    weekendPrice: row.weekend_price,
    coverImage: row.cover_image,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getActiveVillas(): Promise<Villa[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("villas")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapVillaRow);
}

export async function getVillaBySlug(slug: string): Promise<Villa | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("villas")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapVillaRow(data) : null;
}

export async function getVillaById(id: string): Promise<Villa | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("villas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapVillaRow(data) : null;
}

// Batch lookup for admin list views that need several villas at once —
// avoids one round trip per row.
export async function listVillasByIds(ids: string[]): Promise<Villa[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("villas").select("*").in("id", ids);

  if (error) throw error;
  return (data ?? []).map(mapVillaRow);
}
