import "server-only";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import type { Product, Category, ProductQuery, ProductQueryResult } from "./types";

// The committed JSON snapshot is the source of truth for the catalog. This
// module is the single data-access layer — swapping to Supabase later means
// changing only the function bodies here, not any callers.
const ALL_PRODUCTS = productsData as Product[];
const ALL_CATEGORIES = categoriesData as Category[];

const byHandle = new Map(ALL_PRODUCTS.map((p) => [p.handle, p]));
const byId = new Map(ALL_PRODUCTS.map((p) => [p.id, p]));

export async function getCategories(): Promise<Category[]> {
  return ALL_CATEGORIES;
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  return byHandle.get(handle) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  return byId.get(id) ?? null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  // Prefer discounted, in-stock, image-rich items for the storefront hero rows.
  return [...ALL_PRODUCTS]
    .filter((p) => p.available && p.images.length > 1)
    .sort((a, b) => (b.compareAtPrice ? 1 : 0) - (a.compareAtPrice ? 1 : 0) || b.price - a.price)
    .slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id && p.available,
  ).slice(0, limit);
}

export async function queryProducts(query: ProductQuery): Promise<ProductQueryResult> {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    sort = "featured",
    page = 1,
    perPage = 24,
  } = query;

  let results = ALL_PRODUCTS;

  if (category) {
    const slug = category.toLowerCase();
    results = results.filter(
      (p) => slugify(p.category) === slug,
    );
  }

  if (search) {
    const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
    results = results.filter((p) => {
      const haystack = `${p.title} ${p.description} ${p.sku} ${p.productType}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }

  if (typeof minPrice === "number") results = results.filter((p) => p.price >= minPrice);
  if (typeof maxPrice === "number") results = results.filter((p) => p.price <= maxPrice);

  results = sortProducts(results, sort);

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const paged = results.slice(start, start + perPage);

  return { products: paged, total, page: safePage, perPage, totalPages };
}

function sortProducts(products: Product[], sort: ProductQuery["sort"]): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "featured":
    default:
      // In-stock first, then discounted, then by price descending.
      return copy.sort(
        (a, b) =>
          Number(b.available) - Number(a.available) ||
          (b.compareAtPrice ? 1 : 0) - (a.compareAtPrice ? 1 : 0) ||
          b.price - a.price,
      );
  }
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
