import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert } from "@/types/database.types";
import type { BlockedDate } from "@/types/blockedDate";

function mapBlockedDateRow(row: Tables<"blocked_dates">): BlockedDate {
  return {
    id: row.id,
    villaId: row.villa_id,
    blockedDate: row.blocked_date,
    reason: row.reason,
    createdAt: row.created_at,
  };
}

// Includes global blocks (villa_id is null) alongside villa-specific ones.
export async function listBlockedDatesByVilla(
  villaId: string,
): Promise<BlockedDate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("*")
    .or(`villa_id.eq.${villaId},villa_id.is.null`)
    .order("blocked_date", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapBlockedDateRow);
}

export async function listAllBlockedDates(): Promise<BlockedDate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("*")
    .order("blocked_date", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapBlockedDateRow);
}

export async function createBlockedDate(
  input: TablesInsert<"blocked_dates">,
): Promise<BlockedDate> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blocked_dates")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return mapBlockedDateRow(data);
}

export async function deleteBlockedDate(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("blocked_dates").delete().eq("id", id);
  if (error) throw error;
}
