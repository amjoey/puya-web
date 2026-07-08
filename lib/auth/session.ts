import { createClient } from "@/lib/supabase/server";
import type { Admin } from "@/types/admin";
import type { Database } from "@/types/database.types";

type AdminRow = Database["public"]["Tables"]["admins"]["Row"];

export class UnauthorizedError extends Error {
  constructor() {
    super("You must be signed in as an admin to perform this action.");
    this.name = "UnauthorizedError";
  }
}

// Resolves the currently authenticated admin from the Supabase Auth session
// + the `admins` table (RLS policy `admins_select_self` lets a logged-in
// user read their own row — see supabase/migrations/0001_enable_rls.sql).
// Returns null if there is no session or the user isn't an admin.
export async function getCurrentAdmin(): Promise<Admin | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .returns<AdminRow>()
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    role: data.role as Admin["role"],
    createdAt: data.created_at,
  };
}

// Use at the start of any admin-only service function (verify/reject
// payment, review moderation, promotion CRUD, etc.) to enforce the boundary
// in application code as well as via RLS.
export async function requireAdmin(): Promise<Admin> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new UnauthorizedError();
  }
  return admin;
}
