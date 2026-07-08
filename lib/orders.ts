import "server-only";
import { getSupabase } from "./supabase";
import type { CartItem } from "./types";

export interface OrderRecord {
  customer_email: string | null;
  status: string;
  total_amount: number;
  items: CartItem[];
  stripe_session_id: string;
  shipping_address: Record<string, unknown> | null;
}

// Persists an order to Supabase when configured; otherwise logs and no-ops so
// the checkout flow never hard-fails on a missing database.
export async function saveOrder(order: OrderRecord): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[orders] Supabase not configured — order not persisted:", order.stripe_session_id);
    return;
  }
  const { error } = await supabase.from("orders").insert({
    ...order,
    created_at: new Date().toISOString(),
  });
  if (error) console.error("[orders] Failed to persist order:", error.message);
}

export async function markOrderStatus(sessionId: string, status: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("stripe_session_id", sessionId);
  if (error) console.error("[orders] Failed to update order status:", error.message);
}
