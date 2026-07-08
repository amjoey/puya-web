import { createClient } from "@/lib/supabase/server";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";
import type { DiscountType, Promotion } from "@/types/promotion";

const DISCOUNT_TYPES: DiscountType[] = ["percentage", "fixed_amount"];

function toDiscountType(value: string): DiscountType {
  if ((DISCOUNT_TYPES as string[]).includes(value)) {
    return value as DiscountType;
  }
  throw new Error(`Unexpected discount_type from database: "${value}"`);
}

function mapPromotionRow(row: Tables<"promotions">): Promotion {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    discountType: toDiscountType(row.discount_type),
    discountValue: row.discount_value,
    startDate: row.start_date,
    endDate: row.end_date,
    active: row.active,
    createdAt: row.created_at,
  };
}

export async function listActivePromotions(): Promise<Promotion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapPromotionRow);
}

export async function listAllPromotions(): Promise<Promotion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapPromotionRow);
}

export async function getPromotionById(id: string): Promise<Promotion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapPromotionRow(data) : null;
}

export async function createPromotion(
  input: TablesInsert<"promotions">,
): Promise<Promotion> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promotions")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return mapPromotionRow(data);
}

export async function updatePromotion(
  id: string,
  input: TablesUpdate<"promotions">,
): Promise<Promotion> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promotions")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapPromotionRow(data);
}

export async function deletePromotion(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("promotions").delete().eq("id", id);
  if (error) throw error;
}
