import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(url && anon);

let client: SupabaseClient | null = null;

/** Lazily created so pages that never touch the database ship no Supabase code path. */
export function supabase(): SupabaseClient {
  if (!url || !anon) throw new Error("Supabase is not configured. Copy .env.example to .env.local.");
  client ??= createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } });
  return client;
}
