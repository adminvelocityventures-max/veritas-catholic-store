import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByHandle, getRelatedProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";

type Params = Promise<{ handle: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Not Found" };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const bullets = product.description
    .split("•")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink-faint mb-8 flex gap-2">
        <Link href="/" className="hover:text-oxblood">Home</Link>
        <span>/</span>
        <Link href={`/products?category=${slug(product.category)}`} className="hover:text-oxblood">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink-soft truncate max-w-[50vw]">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        <ProductGallery images={product.images} title={product.title} />

        <div className="fade-up">
          <p className="eyebrow mb-3">{product.category}</p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-ink">
            {product.title}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl text-oxblood font-display">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-ink-faint line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {product.sku && (
            <p className="mt-2 text-xs text-ink-faint tracking-wide">SKU · {product.sku}</p>
          )}

          <div className="rule-diamond my-8 !justify-start">
            <span className="!ml-0" />
          </div>

          <div className="mb-8">
            <AddToCartButton product={product} />
          </div>

          {bullets.length > 0 && (
            <div className="border-t border-line pt-6">
              <h2 className="eyebrow mb-4">Details</h2>
              <ul className="space-y-2">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink-soft leading-relaxed">
                    <span className="text-gold mt-1.5 shrink-0">✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-ink-soft">
            <div className="border border-line bg-cream p-4">
              <p className="font-display text-ink text-sm mb-1">Complimentary Shipping</p>
              <p>On devotional orders over $75.</p>
            </div>
            <div className="border border-line bg-cream p-4">
              <p className="font-display text-ink text-sm mb-1">Deluxe Presentation</p>
              <p>Arrives in a velvet gift box.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">You May Also Venerate</p>
            <h2 className="font-display text-3xl text-ink">More in {product.category}</h2>
            <div className="rule-diamond mt-5" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function slug(s: string): string {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
