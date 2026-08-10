/**
 * Fix empty/broken news titles and remove old seed stub posts.
 * Usage: npx tsx scripts/fix-news-titles.ts
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

const STUB_IDS = ["post-tender", "post-recognition", "post-matriculation"];

function decodeHtml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function titleFromExcerpt(excerpt?: string, slug?: string) {
  const raw = (excerpt || "").trim();
  if (!raw) return slug || "News update";
  // Prefer first sentence; do not split on "!" (e.g. skillup!)
  const sentence = raw.split(/(?<=[.?])\s+(?=[A-Z"])/)[0] || raw;
  if (sentence.length <= 110) return sentence.replace(/[.?]$/, "");
  return `${sentence.slice(0, 107).trim()}…`;
}

function cleanTitle(raw: string, excerpt?: string, slug?: string) {
  let title = decodeHtml(raw)
    .replace(/\s*[-–|]\s*MADAM\s*$/i, "")
    .trim();
  // Empty / placeholder titles from WordPress (e.g. og:title = "- MADAM")
  if (!title || title === "-" || title.length < 8) {
    title = titleFromExcerpt(excerpt, slug);
  }
  return title;
}

async function main() {
  for (const id of STUB_IDS) {
    try {
      await client.delete(id);
      console.log("deleted stub", id);
    } catch (e) {
      console.log("skip delete", id, e instanceof Error ? e.message : e);
    }
  }

  const posts = await client.fetch<
    { _id: string; title?: string; excerpt?: string; slug?: { current: string } }[]
  >(`*[_type=="post"]{_id,title,excerpt,slug}`);

  for (const p of posts) {
    const looksBroken =
      !p.title ||
      p.title === "-" ||
      p.title.length < 20 ||
      /^Yesterday,/i.test(p.title) ||
      /^As part of the skillup/i.test(p.title) ||
      /^Sierra Leone,/i.test(p.title) ||
      /^Our farmers are busy/i.test(p.title) ||
      /^Something BIG/i.test(p.title) ||
      /^World Environment Day is a global/i.test(p.title) ||
      /^MADAM – Sierra Leone, with support/i.test(p.title);

    const fromExcerpt = titleFromExcerpt(p.excerpt, p.slug?.current);
    const next = looksBroken
      ? fromExcerpt
      : cleanTitle(p.title || "", p.excerpt, p.slug?.current);

    if (next !== (p.title || "")) {
      await client.patch(p._id).set({ title: next }).commit();
      console.log("fixed", p._id, "→", next.slice(0, 80));
    }
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
