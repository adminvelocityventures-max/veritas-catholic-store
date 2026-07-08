"use client";

import { useState } from "react";
import { useCart } from "./cart/CartProvider";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(
      {
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: product.price,
        image: product.images[0],
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-line bg-cream">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3.5 py-3 text-ink-soft hover:text-oxblood text-lg leading-none"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-3.5 py-3 text-ink-soft hover:text-oxblood text-lg leading-none"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span className="text-xs text-ink-faint">
          {product.available ? "Ready to ship" : "Made to order"}
        </span>
      </div>

      <button
        onClick={handleAdd}
        className="w-full bg-oxblood hover:bg-oxblood-deep text-cream py-4 text-sm uppercase tracking-[0.2em] transition-colors"
      >
        {added ? "Added to Cart ✓" : "Add to Cart"}
      </button>
    </div>
  );
}
