import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <p className="eyebrow mb-3">404</p>
      <h1 className="font-display text-4xl text-ink mb-4">This page was not found</h1>
      <p className="text-ink-soft mb-8">
        The page you seek may have been moved. Let us guide you back to the collection.
      </p>
      <Link
        href="/products"
        className="inline-block bg-oxblood text-cream px-10 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-oxblood-deep transition-colors"
      >
        Browse Products
      </Link>
    </div>
  );
}
