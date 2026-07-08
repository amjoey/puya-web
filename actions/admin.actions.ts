"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginAdminResult = { success: false; error: string };

// Admin login — gates access to /admin/** beyond just "has a Supabase Auth
// session": the signed-in user must also have a row in `admins`
// (see middleware admin check in lib/supabase/middleware.ts).
export async function loginAdmin(
  _prevState: LoginAdminResult | null,
  formData: FormData,
): Promise<LoginAdminResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: "Please enter a valid email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { success: false, error: "Invalid email or password." };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return { success: false, error: "This account is not authorized for admin access." };
  }

  redirect("/admin/dashboard");
}

export async function logoutAdmin(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
