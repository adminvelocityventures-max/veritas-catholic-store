import "server-only";
import Stripe from "stripe";

// Lazily construct the Stripe client so the app builds and browses without
// keys. Checkout returns a clear error until STRIPE_SECRET_KEY is configured.
let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  cached = key ? new Stripe(key) : null;
  return cached;
}

export const isStripeConfigured = (): boolean => Boolean(process.env.STRIPE_SECRET_KEY);
