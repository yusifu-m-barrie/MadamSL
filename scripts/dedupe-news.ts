/**
 * Remove known near-duplicate news posts from Sanity.
 * Usage: npx tsx scripts/dedupe-news.ts
 */
import { config } from "dotenv";
import { createClient } from "next-sanity";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, "../.env.local"), override: true });

const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n5hnlyba",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  token,
  useCdn: false,
});

function normTitle(t: string) {
  return t
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[….]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const posts = await client.fetch<
    { _id: string; title?: string; slug?: string; publishedAt?: string }[]
  >(`*[_type == "post"] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt
  }`);

  // Group by normalized title; keep newest, delete the rest
  const byTitle = new Map<string, typeof posts>();
  for (const p of posts) {
    const key = normTitle(p.title || "");
    if (!key) continue;
    if (!byTitle.has(key)) byTitle.set(key, []);
    byTitle.get(key)!.push(p);
  }

  const toDelete: typeof posts = [];
  for (const [, group] of byTitle) {
    if (group.length < 2) continue;
    // Already ordered by publishedAt desc from query, but sort again within group
    group.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
    const [, ...dups] = group;
    toDelete.push(...dups);
    console.log("Keeping:", group[0]._id, group[0].slug, group[0].title?.slice(0, 70));
    for (const d of dups) {
      console.log("Deleting:", d._id, d.slug, d.title?.slice(0, 70));
    }
  }

  if (!toDelete.length) {
    console.log("No duplicate titles found.");
    return;
  }

  const tx = client.transaction();
  for (const d of toDelete) tx.delete(d._id);
  await tx.commit();
  console.log(`Deleted ${toDelete.length} duplicate post(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
