import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";
import type { Review } from "@/types/review";

function mapReviewRow(row: Tables<"reviews">): Review {
  return {
    id: row.id,
    villaId: row.villa_id,
    customerName: row.customer_name,
    rating: row.rating,
    comment: row.comment,
    imageUrl: row.image_url,
    approved: row.approved,
    createdAt: row.created_at,
  };
}

export async function listApprovedReviewsByVilla(
  villaId: string,
): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("villa_id", villaId)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapReviewRow);
}

// Public reviews listing (/reviews) — approved reviews across all villas.
export async function listApprovedReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapReviewRow);
}

export async function listAllReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapReviewRow);
}

// Anon role is allowed to insert directly (with approved=false enforced by
// RLS) since reviews are low-risk and gated by admin moderation either way —
// see supabase/migrations/0001_enable_rls.sql.
export async function createReview(
  input: TablesInsert<"reviews">,
  client?: SupabaseClient<Database>,
): Promise<Review> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("reviews")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return mapReviewRow(data);
}

export async function updateReview(
  id: string,
  input: TablesUpdate<"reviews">,
): Promise<Review> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapReviewRow(data);
}

export async function deleteReview(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
}
