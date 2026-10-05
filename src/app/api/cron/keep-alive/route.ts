import { NextResponse } from "next/server";
import { hasSupabase, supabase } from "@/lib/supabase";

/**
 * Daily keep-alive, run by Vercel Cron (see vercel.json).
 * Supabase pauses free projects after a week without activity; one tiny read a day prevents that.
 * When CRON_SECRET is set, Vercel sends it as a Bearer token and anything else is refused.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!hasSupabase) {
    return NextResponse.json({ ok: false, error: "Supabase is not configured" }, { status: 500 });
  }

  const at = new Date().toISOString();
  const { count, error } = await supabase().from("memories").select("id", { count: "exact", head: true });
  if (error) {
    console.error("[cron:keep-alive]", error.message);
    return NextResponse.json({ ok: false, at, error: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true, at, publicMemories: count ?? 0 }, { headers: { "Cache-Control": "no-store" } });
}
