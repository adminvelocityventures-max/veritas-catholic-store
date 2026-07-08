export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  category: string;
  productType: string;
  vendor: string;
  available: boolean;
  images: string[];
  tags: string[];
  sourceUrl: string;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

export interface CartItem {
  id: string;
  handle: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ProductQuery {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "name";
  page?: number;
  perPage?: number;
}

export interface ProductQueryResult {
  products: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
