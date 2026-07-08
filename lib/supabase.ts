import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Returns a Supabase client only when credentials are configured. Order
// persistence degrades gracefully when Supabase isn't set up yet, so the
// storefront and checkout still work end-to-end.
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  cached = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return cached;
}

export const isSupabaseConfigured = (): boolean => getSupabase() !== null;
