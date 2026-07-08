import Link from "next/link";
import type { Category } from "@/lib/types";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-24 border-t border-line bg-paper-2">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="font-display text-2xl text-ink">Veritas</div>
            <div className="eyebrow mt-1 !text-[10px] !tracking-[0.35em]">Catholic</div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft max-w-xs">
              Sacred medals, rosaries, and crucifixes — crafted in sterling silver and
              fine crystal for a life of devotion.
            </p>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-ink-soft">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/products?category=${c.slug}`} className="link-underline hover:text-oxblood">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Assistance</h4>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li><Link href="/products" className="link-underline hover:text-oxblood">All Products</Link></li>
              <li><Link href="/about" className="link-underline hover:text-oxblood">Our Story</Link></li>
              <li><Link href="/cart" className="link-underline hover:text-oxblood">Your Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Devotional Letter</h4>
            <p className="text-sm text-ink-soft mb-3">
              New arrivals and feast-day reflections, sent with care.
            </p>
            <form className="flex items-center border border-line bg-cream">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-ink-faint"
              />
              <button type="submit" className="px-4 py-2.5 bg-oxblood text-cream text-xs uppercase tracking-[0.15em]">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="rule-diamond my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint">
          <p>© {new Date().getFullYear()} Veritas Catholic. Ad Majorem Dei Gloriam.</p>
          <p className="italic font-display text-sm text-gold">“Veritas vos liberabit” — John 8:32</p>
        </div>
      </div>
    </footer>
  );
}
