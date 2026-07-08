import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { saveOrder, markOrderStatus } from "@/lib/orders";

// Stripe's signature check needs the Node runtime (not Edge).
export const runtime = "nodejs";

// Stripe requires the raw request body to verify the webhook signature.
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhooks not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
      });
      await saveOrder({
        customer_email: session.customer_details?.email ?? null,
        status: "completed",
        total_amount: (session.amount_total ?? 0) / 100,
        items: lineItems.data.map((li) => ({
          id: (li.price?.product as string) ?? "",
          handle: "",
          title: li.description ?? "",
          price: (li.price?.unit_amount ?? 0) / 100,
          image: "",
          quantity: li.quantity ?? 1,
        })),
        stripe_session_id: session.id,
        shipping_address:
          (session.customer_details?.address as unknown as Record<string, unknown>) ?? null,
      });
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await markOrderStatus(session.id, "expired");
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
