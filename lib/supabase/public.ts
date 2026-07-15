import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Cookieless anon client for PUBLIC read-only data (active villas, villa
// images, approved reviews). It carries the same RLS permissions an
// anonymous visitor already has via the cookie-based server client, but
// does NOT call next/headers `cookies()`. That difference matters: any
// page that reads through the cookie client is forced to render
// dynamically, whereas reading through this client lets public pages be
// statically prerendered / ISR (see the `revalidate` exports on the
// public pages). Use ONLY for anonymous public reads — never for
// authenticated (admin) reads or any writes.
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
