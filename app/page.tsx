import Image from "next/image";
import Link from "next/link";
import { getCategories, getFeaturedProducts, queryProducts, slugify } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
  ]);

  // A curated set of category tiles, each with a representative image.
  const spotlight = ["Medals", "Rosaries", "Crosses & Crucifixes", "Bracelets"];
  const tiles = await Promise.all(
    spotlight.map(async (name) => {
      const { products } = await queryProducts({ category: slugify(name), perPage: 1 });
      const cat = categories.find((c) => c.name === name);
      return {
        name,
        slug: slugify(name),
        count: cat?.count ?? 0,
        image: products[0]?.images[0] ?? null,
      };
    }),
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-oxblood-deep text-cream">
        <div className="absolute inset-0 opacity-[0.08]" aria-hidden>
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--gold-soft) 1px, transparent 0)",
              backgroundSize: "26px 26px",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 text-center fade-up">
          <p className="eyebrow !text-gold-soft mb-6">Ad Majorem Dei Gloriam</p>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] max-w-3xl mx-auto">
            Sacred artistry for a life of devotion
          </h1>
          <p className="mt-6 text-base sm:text-lg text-cream/75 max-w-xl mx-auto leading-relaxed">
            Sterling silver medals, Swarovski® crystal rosaries, and fine crucifixes —
            each piece a quiet companion to prayer, handcrafted in the USA.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="bg-cream text-oxblood-deep px-8 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-gold hover:text-cream transition-colors"
            >
              Explore the Collection
            </Link>
            <Link
              href="/products?category=rosaries"
              className="border border-gold-soft/60 text-cream px-8 py-3.5 text-sm uppercase tracking-[0.2em] hover:border-gold hover:text-gold transition-colors"
            >
              Shop Rosaries
            </Link>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="border-b border-line bg-paper-2">
        <div className="mx-auto max-w-7xl px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ["Handcrafted", "Made in the USA"],
            ["Sterling & Crystal", "Heirloom materials"],
            ["Blessed Packaging", "Deluxe velvet box"],
            ["Devoted Service", "Guidance in faith"],
          ].map(([t, s]) => (
            <div key={t}>
              <p className="font-display text-lg text-ink">{t}</p>
              <p className="text-xs text-ink-faint tracking-wide">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category spotlight */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">By Devotion</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Explore the Sanctuary</h2>
          <div className="rule-diamond mt-5" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {tiles.map((tile) => (
            <Link
              key={tile.slug}
              href={`/products?category=${tile.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-cream border border-line card-rise"
            >
              {tile.image && (
                <Image
                  src={tile.image}
                  alt={tile.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5 text-center">
                <h3 className="font-display text-xl text-cream">{tile.name}</h3>
                <p className="text-[11px] uppercase tracking-[0.2em] text-cream/70 mt-1">
                  {tile.count} pieces
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured collection */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">Newly Curated</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">The Collection</h2>
          <div className="rule-diamond mt-5" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="text-center mt-14">
          <Link
            href="/products"
            className="inline-block border border-ink text-ink px-10 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-ink hover:text-cream transition-colors"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Scripture band */}
      <section className="mt-20 bg-oxblood-deep text-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="font-display italic text-2xl sm:text-3xl leading-relaxed text-cream/90">
            “Then you will know the truth, and the truth will set you free.”
          </p>
          <p className="eyebrow !text-gold-soft mt-6">John 8:32 · Veritas vos liberabit</p>
        </div>
      </section>
    </div>
  );
}
