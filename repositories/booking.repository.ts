import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";
import type { Booking, BookingStatus, PaymentStatus } from "@/types/booking";

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = ["pending", "confirmed"];

function mapBookingRow(row: Tables<"bookings">): Booking {
  return {
    id: row.id,
    villaId: row.villa_id,
    customerName: row.customer_name,
    phone: row.phone,
    lineId: row.line_id,
    email: row.email,
    guestCount: row.guest_count,
    checkIn: row.check_in,
    checkOut: row.check_out,
    totalNights: row.total_nights,
    totalPrice: row.total_price,
    paymentStatus: row.payment_status as PaymentStatus,
    bookingStatus: row.booking_status as BookingStatus,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// `client` defaults to the cookie-based server client; pass a service-role
// client when reading on behalf of an anonymous guest (e.g. the payment
// page reading back the booking it just created).
export async function getBookingById(
  id: string,
  client?: SupabaseClient<Database>,
): Promise<Booking | null> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapBookingRow(data) : null;
}

export async function listBookingsByVilla(villaId: string): Promise<Booking[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("villa_id", villaId)
    .order("check_in", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapBookingRow);
}

export async function listAllBookings(): Promise<Booking[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapBookingRow);
}

// Batch lookup for admin list views (e.g. payment verification) that need
// the booking behind several rows at once — avoids one round trip per row.
export async function listBookingsByIds(ids: string[]): Promise<Booking[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("bookings").select("*").in("id", ids);

  if (error) throw error;
  return (data ?? []).map(mapBookingRow);
}

// Active bookings (pending/confirmed) on a given check-in date. Backs the
// guest booking-lookup flow (recover a payment link by phone + check-in);
// a date has at most a couple of active bookings across the two villas, so
// the caller filters by phone in memory. Reads via the passed service-role
// client — bookings has no anon RLS select policy.
export async function findActiveBookingsByCheckIn(
  checkIn: string,
  client: SupabaseClient<Database>,
): Promise<Booking[]> {
  const { data, error } = await client
    .from("bookings")
    .select("*")
    .eq("check_in", checkIn)
    .in("booking_status", ACTIVE_BOOKING_STATUSES)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapBookingRow);
}

// Bookings that overlap [checkIn, checkOut) for a villa, excluding cancelled
// bookings. Used by availability.service.ts to enforce the no-overlap rule
// (see ARCHITECTURE.md Availability Logic). `client` defaults to the
// cookie-based anon client, but availability.service.ts always passes the
// service-role client — `bookings` has no anon RLS select policy (see
// supabase/migrations/0001_enable_rls.sql), so anonymous reads would
// otherwise see zero rows and silently treat every date as available.
export async function findOverlappingBookings(
  villaId: string,
  checkIn: string,
  checkOut: string,
  client?: SupabaseClient<Database>,
): Promise<Booking[]> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("villa_id", villaId)
    .in("booking_status", ACTIVE_BOOKING_STATUSES)
    .lt("check_in", checkOut)
    .gt("check_out", checkIn);

  if (error) throw error;
  return (data ?? []).map(mapBookingRow);
}

// `client` defaults to the cookie-based server client; pass a service-role
// client (lib/supabase/service.ts) when inserting on behalf of an
// anonymous guest, since bookings has no anon RLS insert policy.
export async function createBooking(
  input: TablesInsert<"bookings">,
  client?: SupabaseClient<Database>,
): Promise<Booking> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("bookings")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return mapBookingRow(data);
}

export async function updateBooking(
  id: string,
  input: TablesUpdate<"bookings">,
): Promise<Booking> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapBookingRow(data);
}
