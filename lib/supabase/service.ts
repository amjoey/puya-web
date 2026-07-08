import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Server-only client using the service role key — bypasses Row Level
// Security entirely. Use ONLY inside Server Actions, after Zod validation
// and business-rule checks, for writes on behalf of anonymous guests
// (create booking, create payment record, upload-linked rows) where RLS
// intentionally has no anon policy (see supabase/migrations/0001_enable_rls.sql).
// Never import this file from a Client Component or expose the key to the browser.
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
