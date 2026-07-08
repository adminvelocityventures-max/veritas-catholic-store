"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";

const FREE_SHIP_THRESHOLD = 75;

export default function CartPage() {
  const { items, hydrated, subtotal, setQuantity, remove } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (!hydrated) {
    return <div className="mx-auto max-w-5xl px-6 py-24 text-center text-ink-faint">Loading your cart…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="eyebrow mb-3">Your Cart</p>
        <h1 className="font-display text-4xl text-ink mb-4">Your cart is empty</h1>
        <p className="text-ink-soft mb-8">
          May we help you find a medal, rosary, or crucifix to accompany your prayer?
        </p>
        <Link
          href="/products"
          className="inline-block bg-oxblood text-cream px-10 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-oxblood-deep transition-colors"
        >
          Explore the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center mb-10">
        <p className="eyebrow mb-3">Veritas Catholic</p>
        <h1 className="font-display text-4xl text-ink">Your Cart</h1>
        <div className="rule-diamond mt-5" />
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        {/* Line items */}
        <div className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-6">
              <Link
                href={`/products/${item.handle}`}
                className="relative h-24 w-24 shrink-0 bg-cream border border-line"
              >
                <Image src={item.image} alt={item.title} fill sizes="96px" className="object-contain p-2" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.handle}`}
                  className="font-display text-lg text-ink leading-snug hover:text-oxblood line-clamp-2"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-ink-soft mt-1">{formatPrice(item.price)}</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center border border-line bg-cream">
                    <button
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-ink-soft hover:text-oxblood"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-ink-soft hover:text-oxblood"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-xs uppercase tracking-wide text-ink-faint hover:text-oxblood"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right text-sm text-ink font-medium">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-40 h-fit border border-line bg-paper-2 p-6">
          <h2 className="font-display text-xl text-ink mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Shipping</span>
              <span className="text-ink">{remaining > 0 ? "Calculated at checkout" : "Complimentary"}</span>
            </div>
          </div>

          {remaining > 0 && (
            <div className="mt-4 text-xs text-ink-soft bg-cream border border-line p-3">
              Add <span className="text-oxblood font-medium">{formatPrice(remaining)}</span> more for
              complimentary shipping.
            </div>
          )}

          <div className="rule-diamond my-5" />

          <div className="flex justify-between items-baseline mb-6">
            <span className="text-sm uppercase tracking-[0.15em] text-ink-soft">Total</span>
            <span className="font-display text-2xl text-oxblood">{formatPrice(subtotal)}</span>
          </div>

          {error && <p className="text-sm text-oxblood mb-4">{error}</p>}

          <button
            onClick={checkout}
            disabled={loading}
            className="w-full bg-oxblood hover:bg-oxblood-deep disabled:opacity-60 text-cream py-4 text-sm uppercase tracking-[0.2em] transition-colors"
          >
            {loading ? "Preparing checkout…" : "Proceed to Checkout"}
          </button>
          <Link
            href="/products"
            className="block text-center mt-4 text-xs uppercase tracking-[0.15em] text-ink-soft hover:text-oxblood"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
