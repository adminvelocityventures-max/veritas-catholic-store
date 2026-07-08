import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  return (
    <Link href={`/products/${product.handle}`} className="group block card-rise">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream border border-line">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {discount && (
          <span className="absolute top-3 left-3 bg-oxblood text-cream text-[10px] tracking-[0.15em] uppercase px-2 py-1">
            Save {discount}%
          </span>
        )}
        {!product.available && (
          <span className="absolute top-3 right-3 bg-ink/80 text-cream text-[10px] tracking-[0.15em] uppercase px-2 py-1">
            Reserved
          </span>
        )}
      </div>
      <div className="pt-4 text-center">
        <p className="eyebrow !text-[9px] !tracking-[0.2em] mb-1.5">{product.category}</p>
        <h3 className="font-display text-[15px] leading-snug text-ink line-clamp-2 min-h-[2.6em] px-2">
          {product.title}
        </h3>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-sm text-ink">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-faint line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
