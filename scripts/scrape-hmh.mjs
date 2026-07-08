// Scrapes the full HMH Religious catalog via the public Shopify products.json API,
// normalizes it, derives top-level categories, and writes committed snapshots to /data.
//
// Usage: node scripts/scrape-hmh.mjs
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");

// `--if-missing` (used by the predev hook) skips scraping when a snapshot
// already exists locally, so `next dev` starts instantly.
if (process.argv.includes("--if-missing") && existsSync(join(DATA_DIR, "products.json"))) {
  console.log("[scrape] Existing catalog found — skipping fetch.");
  process.exit(0);
}
const SOURCE = "https://www.hmhreligious.com";
const UA = "Mozilla/5.0 (compatible; VeritasCatalogSync/1.0)";

// Retail pricing: mark HMH's listed price up by a flat percentage, then round
// up to a charm price ending in .99 (e.g. base $124.37 -> ×1.5 = $186.56 -> $186.99).
const MARKUP = 1.5; // 50% markup

function retailPrice(base) {
  const marked = base * MARKUP;
  const charm = Math.ceil(marked) - 0.01; // always ends in .99
  return Math.round(charm * 100) / 100; // clean up float dust
}

// HMH's feed mixes wholesale rosary-making supplies (loose sterling/crystal
// beads sold by the box) in with finished products. Those carry bulk prices and
// look out of place in a consumer storefront, so we exclude them. A finished
// rosary is either typed with a real category (e.g. "Rosaries- Sterling Silver
// Cross and Center") or names a center/crucifix/finding; a bulk component is an
// untyped item whose title is just beads.
function isBulkComponent(title = "", productType = "") {
  const t = title.toLowerCase();
  if (!/\bbeads?\b/.test(t)) return false;
  if (productType && productType.trim()) return false; // typed = finished piece
  const finishedCue =
    /(rosary|rosaries|crucifix|\bcross\b|center|\bctr\b|\bcfx\b|our\s*father|o\.f\.|medal|pendant|bracelet|necklace|\bwith\b|\bw\/)/i;
  return !finishedCue.test(t);
}

// Map a granular Shopify product_type to a customer-facing top-level category.
function categorize(productType = "", title = "") {
  const t = `${productType} ${title}`.toLowerCase();
  if (/\brosar/.test(t)) return "Rosaries";
  if (/bracelet/.test(t)) return "Bracelets";
  if (/crucifix|\bcross\b|crosses/.test(t)) return "Crosses & Crucifixes";
  if (/medal/.test(t)) return "Medals";
  if (/\bring\b|rings/.test(t)) return "Rings";
  if (/necklace|pendant|\bchain\b/.test(t)) return "Necklaces";
  if (/earring/.test(t)) return "Earrings";
  if (/\bpin\b|lapel/.test(t)) return "Pins";
  if (/baby|child|infant/.test(t)) return "Baby & Child";
  if (/communion|confirmation|baptism/.test(t)) return "Sacraments";
  return "Devotional Gifts";
}

function stripHtml(html = "") {
  return html
    .replace(/<\/li>/gi, " • ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&reg;/g, "®")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/\s+/g, " ")
    .replace(/(\s•\s)+$/g, "")
    .trim();
}

async function fetchPage(page) {
  const url = `${SOURCE}/products.json?limit=250&page=${page}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`page ${page}: HTTP ${res.status}`);
  const json = await res.json();
  return json.products ?? [];
}

async function main() {
  const raw = [];
  for (let page = 1; page <= 100; page++) {
    const products = await fetchPage(page);
    if (products.length === 0) break;
    raw.push(...products);
    process.stdout.write(`\rFetched ${raw.length} products (page ${page})...`);
    await new Promise((r) => setTimeout(r, 150)); // be polite
  }
  process.stdout.write("\n");

  const seen = new Set();
  const products = [];
  let hiddenBulk = 0;
  for (const p of raw) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    const variant = (p.variants ?? [])[0] ?? {};
    const basePrice = parseFloat(variant.price ?? "0");
    const baseCompareAt = variant.compare_at_price ? parseFloat(variant.compare_at_price) : null;
    const images = (p.images ?? []).map((img) => img.src).filter(Boolean);
    if (basePrice <= 0 || images.length === 0) continue; // skip incomplete records
    if (isBulkComponent(p.title, p.product_type)) {
      hiddenBulk++;
      continue; // exclude wholesale bead-making supplies
    }
    // Apply the retail markup to both the price and the (proportional) "was" price.
    const price = retailPrice(basePrice);
    const compareAtPrice =
      baseCompareAt && baseCompareAt > basePrice ? retailPrice(baseCompareAt) : null;
    products.push({
      id: String(p.id),
      handle: p.handle,
      title: p.title,
      description: stripHtml(p.body_html),
      descriptionHtml: p.body_html ?? "",
      price,
      compareAtPrice,
      sku: variant.sku ?? "",
      category: categorize(p.product_type, p.title),
      productType: p.product_type ?? "",
      vendor: p.vendor ?? "",
      available: Boolean(variant.available),
      images,
      tags: p.tags ?? [],
      sourceUrl: `${SOURCE}/products/${p.handle}`,
    });
  }

  // Category index with counts.
  const counts = {};
  for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
  const categories = Object.entries(counts)
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);

  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(join(DATA_DIR, "products.json"), JSON.stringify(products));
  writeFileSync(join(DATA_DIR, "categories.json"), JSON.stringify(categories, null, 2));

  console.log(`\nWrote ${products.length} products across ${categories.length} categories (hid ${hiddenBulk} bulk supplies):`);
  for (const c of categories) console.log(`  ${c.name.padEnd(24)} ${c.count}`);
}

function slugify(s) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
