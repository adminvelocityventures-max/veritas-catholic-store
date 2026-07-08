# Veritas Catholic

An elevated ecommerce storefront for Catholic devotional treasures — medals, rosaries, crucifixes, and fine jewelry. Built with Next.js 16, Tailwind CSS v4, Stripe, and Supabase. The catalog is sourced from [hmhreligious.com](https://www.hmhreligious.com) via its public Shopify JSON API.

## Stack

- **Next.js 16** (App Router, React 19, Server Components)
- **Tailwind CSS v4** — custom liturgical design system (ivory / oxblood / antique gold)
- **Stripe Checkout** — hosted, PCI-compliant payments
- **Supabase (PostgreSQL)** — optional order persistence
- **Vercel** — hosting & CI

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Stripe / Supabase keys
npm run dev
```

Visit http://localhost:3000. The store browses fully without any keys — checkout activates once `STRIPE_SECRET_KEY` is set.

## Product catalog

The catalog is generated at build time into `data/products.json` (~3,466 products) by the scraper. To refresh it manually:

```bash
npm run scrape
```

This paginates the Shopify `products.json` API, normalizes fields, derives top-level categories, and writes `data/products.json` + `data/categories.json`. The `prebuild` hook runs it automatically on every build (including on Vercel).

## Data layer

All catalog reads go through `lib/products.ts`. It reads the JSON snapshot today; swap the function bodies to query Supabase for live inventory without touching any callers.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Base URL for Stripe redirects in production |
| `STRIPE_SECRET_KEY` | Enables checkout |
| `STRIPE_WEBHOOK_SECRET` | Verifies Stripe webhook signatures |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Order persistence (optional) |

## Stripe webhook

Point a Stripe webhook at `POST /api/webhooks/stripe` for the `checkout.session.completed` event to persist orders. Locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Supabase

Run `supabase/schema.sql` in the Supabase SQL editor to create the `orders` table.

---

_Ad Majorem Dei Gloriam._
