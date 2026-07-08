-- Veritas Catholic — Supabase schema
-- Run this in the Supabase SQL editor to enable order persistence.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_email text,
  status text not null default 'pending',
  total_amount numeric(10, 2) not null default 0,
  items jsonb not null default '[]'::jsonb,
  stripe_session_id text unique,
  shipping_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists orders_stripe_session_idx on public.orders (stripe_session_id);
create index if not exists orders_email_idx on public.orders (customer_email);

-- Optional: mirror the product catalog into Supabase for live inventory.
-- The storefront reads from the committed JSON snapshot by default; populate
-- this table and update lib/products.ts to query it when you want live stock.
create table if not exists public.products (
  id text primary key,
  handle text unique not null,
  title text not null,
  description text,
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  sku text,
  category text,
  product_type text,
  available boolean not null default true,
  images jsonb not null default '[]'::jsonb,
  stock_quantity integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Row Level Security: orders are written only by the service role (webhook).
alter table public.orders enable row level security;
