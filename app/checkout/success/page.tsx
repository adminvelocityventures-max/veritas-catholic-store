"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

export default function CheckoutSuccessPage() {
  const { clear, hydrated } = useCart();

  // Empty the cart once the order has been placed.
  useEffect(() => {
    if (hydrated) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-28 text-center fade-up">
      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="eyebrow mb-3">Deo Gratias</p>
      <h1 className="font-display text-4xl text-ink mb-4">Thank you for your order</h1>
      <p className="text-ink-soft leading-relaxed mb-2">
        Your devotional treasures are being prepared with care. A confirmation has been
        sent to your email.
      </p>
      <p className="text-sm text-ink-faint mb-10">
        May these sacred pieces be a blessing to you and your family.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/products"
          className="bg-oxblood text-cream px-10 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-oxblood-deep transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="border border-ink text-ink px-10 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-ink hover:text-cream transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
