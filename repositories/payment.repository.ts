import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";
import type { Payment } from "@/types/payment";

function mapPaymentRow(row: Tables<"payments">): Payment {
  return {
    id: row.id,
    bookingId: row.booking_id,
    amount: row.amount,
    slipImage: row.slip_image,
    verified: row.verified,
    verifiedAt: row.verified_at,
    verifiedBy: row.verified_by,
    remarks: row.remarks,
    createdAt: row.created_at,
  };
}

// `client` defaults to the cookie-based server client; pass a service-role
// client when reading on behalf of an anonymous guest.
export async function getPaymentByBookingId(
  bookingId: string,
  client?: SupabaseClient<Database>,
): Promise<Payment | null> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (error) throw error;
  return data ? mapPaymentRow(data) : null;
}

// "Needs review" = never actioned by an admin yet. A rejected payment also
// has verified=false but carries a verified_at timestamp, so it's excluded
// here — see PROJECT_ANALYSIS.md > Database Summary (payment_status sync).
export async function listPendingPayments(): Promise<Payment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("verified", false)
    .is("verified_at", null)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapPaymentRow);
}

// `client` defaults to the cookie-based server client; pass a service-role
// client when creating a payment record for an anonymous guest's upload.
export async function createPayment(
  input: TablesInsert<"payments">,
  client?: SupabaseClient<Database>,
): Promise<Payment> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("payments")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return mapPaymentRow(data);
}

export async function updatePayment(
  id: string,
  input: TablesUpdate<"payments">,
  client?: SupabaseClient<Database>,
): Promise<Payment> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("payments")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapPaymentRow(data);
}
