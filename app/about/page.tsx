import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The story and mission of Veritas Catholic.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-oxblood-deep text-cream">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center fade-up">
          <p className="eyebrow !text-gold-soft mb-5">Our Story</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight">
            Beauty in the service of faith
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 space-y-8 text-ink-soft leading-relaxed text-[17px]">
        <p>
          <span className="font-display text-2xl text-ink">V</span>eritas Catholic exists for a
          single purpose — to place into faithful hands objects of genuine beauty that draw the
          soul toward prayer. Every medal, rosary, and crucifix in our collection is chosen for
          its craftsmanship, its fidelity to sacred tradition, and its capacity to become a
          treasured companion in the spiritual life.
        </p>
        <p>
          Our pieces are handcrafted in the United States from sterling silver, fine crystal by
          Swarovski®, and gold over sterling — materials worthy of the devotions they honor. Each
          arrives in a deluxe velvet box, ready to be given, blessed, and cherished for
          generations.
        </p>
        <div className="rule-diamond !justify-start" />
        <p className="font-display italic text-2xl text-ink">
          “Veritas vos liberabit — the truth will set you free.”
        </p>
        <p>
          We take our name from that promise. In a world of the disposable, we offer the enduring:
          the quiet dignity of an object made well, in service of a love that does not pass away.
        </p>
        <div className="pt-6">
          <Link
            href="/products"
            className="inline-block bg-oxblood text-cream px-10 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-oxblood-deep transition-colors"
          >
            Explore the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
