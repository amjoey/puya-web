import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// TEMPORARY: Debug endpoint — remove after Supabase connection is confirmed.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({
      ok: false,
      stage: "env",
      error: "Missing env vars",
      hasUrl: !!url,
      hasKey: !!key,
    });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("villas")
      .select("id, name, active")
      .limit(5);

    if (error) {
      return NextResponse.json({
        ok: false,
        stage: "query",
        error: error.message,
        code: error.code,
        hint: error.hint,
      });
    }

    return NextResponse.json({ ok: true, count: data?.length ?? 0, rows: data });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      stage: "connect",
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
