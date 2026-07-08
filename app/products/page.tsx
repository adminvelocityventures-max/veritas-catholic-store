import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, queryProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";
import type { ProductQuery } from "@/lib/types";

export const metadata: Metadata = {
  title: "The Collection",
  description: "Browse Catholic medals, rosaries, crucifixes, and devotional gifts.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const category = str(sp.category);
  const search = str(sp.search);
  const sort = (str(sp.sort) ?? "featured") as ProductQuery["sort"];
  const page = Math.max(1, parseInt(str(sp.page) ?? "1", 10) || 1);

  const [categories, result] = await Promise.all([
    getCategories(),
    queryProducts({ category, search, sort, page, perPage: 24 }),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);
  const heading = search
    ? `Results for “${search}”`
    : activeCategory?.name ?? "The Collection";

  // Build a query string preserving the current filters, overriding given keys.
  function buildQuery(overrides: Record<string, string | undefined>): string {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (sort && sort !== "featured") params.set("sort", sort);
    for (const [k, v] of Object.entries(overrides)) {
      if (v === undefined) params.delete(k);
      else params.set(k, v);
    }
    const s = params.toString();
    return s ? `?${s}` : "";
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Page header */}
      <div className="text-center mb-10">
        <p className="eyebrow mb-3">Veritas Catholic</p>
        <h1 className="font-display text-4xl text-ink">{heading}</h1>
        <div className="rule-diamond mt-5" />
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <h2 className="eyebrow mb-4">Categories</h2>
          <ul className="space-y-1.5">
            <li>
              <Link
                href="/products"
                className={`flex justify-between text-sm py-1 ${
                  !category ? "text-oxblood font-medium" : "text-ink-soft hover:text-oxblood"
                }`}
              >
                <span>All Products</span>
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className={`flex justify-between text-sm py-1 ${
                    category === c.slug
                      ? "text-oxblood font-medium"
                      : "text-ink-soft hover:text-oxblood"
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-ink-faint text-xs">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
            <p className="text-sm text-ink-soft">
              <span className="text-ink font-medium">{result.total.toLocaleString()}</span> pieces
            </p>
            <SortSelect current={sort ?? "featured"} />
          </div>

          {/* Mobile category chips */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4 -mx-6 px-6">
            <Link
              href="/products"
              className={`whitespace-nowrap px-3 py-1.5 text-xs uppercase tracking-wide border ${
                !category ? "border-oxblood text-oxblood" : "border-line text-ink-soft"
              }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className={`whitespace-nowrap px-3 py-1.5 text-xs uppercase tracking-wide border ${
                  category === c.slug ? "border-oxblood text-oxblood" : "border-line text-ink-soft"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {result.products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl text-ink mb-2">Nothing found</p>
              <p className="text-sm text-ink-soft mb-6">
                Try another devotion or clear your search.
              </p>
              <Link
                href="/products"
                className="inline-block border border-ink px-8 py-3 text-sm uppercase tracking-[0.2em] hover:bg-ink hover:text-cream transition-colors"
              >
                Browse All
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
              {result.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-16">
              {result.page > 1 ? (
                <Link
                  href={buildQuery({ page: String(result.page - 1) })}
                  className="px-4 py-2 border border-line text-sm text-ink-soft hover:border-gold hover:text-oxblood"
                >
                  ← Prev
                </Link>
              ) : (
                <span className="px-4 py-2 border border-line/50 text-sm text-ink-faint">← Prev</span>
              )}
              <span className="text-sm text-ink-soft tabular-nums">
                Page {result.page} of {result.totalPages}
              </span>
              {result.page < result.totalPages ? (
                <Link
                  href={buildQuery({ page: String(result.page + 1) })}
                  className="px-4 py-2 border border-line text-sm text-ink-soft hover:border-gold hover:text-oxblood"
                >
                  Next →
                </Link>
              ) : (
                <span className="px-4 py-2 border border-line/50 text-sm text-ink-faint">Next →</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
