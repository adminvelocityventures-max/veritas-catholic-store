"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/types";
import { CartButton } from "./cart/CartButton";

export function Header({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const primary = categories.slice(0, 6);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      {/* Announcement bar */}
      <div className="bg-oxblood text-cream text-center text-[11px] tracking-[0.18em] uppercase py-2 px-4">
        Complimentary shipping on devotional orders over $75 · Handcrafted in the USA
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-ink"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>

          {/* Wordmark */}
          <Link href="/" className="flex flex-col items-center md:items-start leading-none">
            <span className="font-display text-2xl sm:text-[28px] tracking-tight text-ink">
              Veritas
            </span>
            <span className="eyebrow mt-1 !text-[10px] !tracking-[0.35em] text-gold">
              Catholic
            </span>
          </Link>

          {/* Desktop search */}
          <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="flex w-full items-center border border-line bg-cream focus-within:border-gold transition-colors">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medals, rosaries, crucifixes…"
                className="w-full bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none"
              />
              <button type="submit" aria-label="Search" className="px-3 text-ink-soft hover:text-oxblood">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </form>

          <CartButton />
        </div>

        {/* Desktop category nav */}
        <nav className="hidden md:flex items-center justify-center gap-8 h-12 text-[13px] tracking-[0.08em] uppercase text-ink-soft">
          <Link href="/products" className="link-underline hover:text-oxblood transition-colors">
            All
          </Link>
          {primary.map((c) => (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className="link-underline hover:text-oxblood transition-colors whitespace-nowrap"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-line bg-paper px-4 py-4 space-y-4">
          <form onSubmit={submitSearch} className="flex items-center border border-line bg-cream">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-transparent px-4 py-2.5 text-sm outline-none"
            />
            <button type="submit" aria-label="Search" className="px-3 text-ink-soft">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
            </button>
          </form>
          <nav className="flex flex-col text-sm uppercase tracking-[0.08em] text-ink-soft">
            <Link href="/products" onClick={() => setMenuOpen(false)} className="py-2 border-b border-line">
              All Products
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="py-2 border-b border-line flex justify-between"
              >
                <span>{c.name}</span>
                <span className="text-ink-faint">{c.count}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
