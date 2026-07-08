import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getProductById } from "@/lib/products";

interface CheckoutItem {
  id: string;
  quantity: number;
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Checkout is not yet configured. Add STRIPE_SECRET_KEY to enable secure payments.",
      },
      { status: 503 },
    );
  }

  let body: { items?: CheckoutItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const items = (body.items ?? []).filter((i) => i && i.id && i.quantity > 0);
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  // Re-price every line item from the trusted server-side catalog — never trust
  // prices sent by the client.
  const lineItems = [];
  for (const item of items) {
    const product = await getProductById(item.id);
    if (!product) continue;
    lineItems.push({
      quantity: Math.min(item.quantity, 99),
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.title,
          images: product.images.slice(0, 1),
          metadata: { sku: product.sku, product_id: product.id },
        },
      },
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "No valid items in cart" }, { status: 400 });
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const stripe = getStripe()!;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: false },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Stripe error:", err);
    return NextResponse.json({ error: "Unable to start checkout" }, { status: 500 });
  }
}
