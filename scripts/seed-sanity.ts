/**
 * Seed Sanity with the same content the public site already shows.
 *
 * 1. Create an API token (Editor): https://www.sanity.io/manage/project/n5hnlyba/api#tokens
 * 2. Put it in .env.local:  SANITY_API_WRITE_TOKEN=sk...
 * 3. Run:  npm run seed:sanity
 *
 * Safe to re-run (createOrReplace + stable IDs). Image fields stay empty
 * until you upload in Studio (Projects → gallery / featured; Staff → photo).
 */
import { config } from "dotenv";
import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  seedSettings,
  seedNavigation,
  seedPosts,
  seedProjects,
  seedStaffAdmin,
  seedStaffProjects,
  seedStaffYtsc,
  seedPartners,
  homeSeedPage,
} from "../src/lib/seed";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../.env.local");
config({ path: envPath, override: true });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n5hnlyba";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

function readCliToken(): string | undefined {
  try {
    const cfgPath = path.join(
      process.env.USERPROFILE || process.env.HOME || "",
      ".config",
      "sanity",
      "config.json",
    );
    if (!fs.existsSync(cfgPath)) return undefined;
    const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
    return typeof cfg.authToken === "string" ? cfg.authToken : undefined;
  } catch {
    return undefined;
  }
}

const token =
  process.env.SANITY_API_WRITE_TOKEN?.trim() ||
  process.env.SANITY_AUTH_TOKEN?.trim() ||
  readCliToken();

if (!token) {
  console.error(`
Missing SANITY_API_WRITE_TOKEN.

Create an Editor token:
  https://www.sanity.io/manage/project/${projectId}/api#tokens

Add to .env.local:
  SANITY_API_WRITE_TOKEN=sk...

Then run: npm run seed:sanity
`);
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

function key() {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

/** Convert plain bodyText into Portable Text blocks for Studio editing */
function textToBlocks(text?: string) {
  if (!text?.trim()) return undefined;
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: Record<string, unknown>[] = [];
  let listItems: { style: "bullet" | "number"; text: string }[] = [];

  const flushList = () => {
    for (const item of listItems) {
      blocks.push({
        _type: "block",
        _key: key(),
        style: "normal",
        listItem: item.style === "bullet" ? "bullet" : "number",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: key(), text: item.text, marks: [] }],
      });
    }
    listItems = [];
  };

  const pushParagraph = (t: string, style: string = "normal") => {
    const trimmed = t.trim();
    if (!trimmed) return;
    blocks.push({
      _type: "block",
      _key: key(),
      style,
      markDefs: [],
      children: [{ _type: "span", _key: key(), text: trimmed, marks: [] }],
    });
  };

  let para: string[] = [];
  const flushPara = () => {
    if (para.length) {
      pushParagraph(para.join(" "));
      para = [];
    }
  };

  const isHeading = (line: string) =>
    line.length < 56 &&
    /:$/.test(line) &&
    /^[A-Za-z]/.test(line) &&
    line.split(" ").length <= 6;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    const bullet = line.match(/^[-•]\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (bullet) {
      flushPara();
      listItems.push({ style: "bullet", text: bullet[1] });
      continue;
    }
    if (numbered) {
      flushPara();
      listItems.push({ style: "number", text: numbered[1] });
      continue;
    }
    flushList();
    if (isHeading(line)) {
      flushPara();
      pushParagraph(line.replace(/:$/, ""), "h3");
      continue;
    }
    para.push(line);
  }
  flushPara();
  flushList();
  return blocks;
}

function withKeys(obj: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...obj };
  if (Array.isArray(out.sections)) {
    out.sections = (out.sections as Record<string, unknown>[]).map((section) => {
      const s: Record<string, unknown> = {
        ...section,
        _key: section._key || key(),
      };
      for (const field of ["slides", "cards", "items"] as const) {
        const list = s[field];
        if (Array.isArray(list)) {
          s[field] = (list as Record<string, unknown>[]).map((item) => ({
            ...item,
            _key: item._key || key(),
          }));
        }
      }
      if (Array.isArray(s.body)) {
        s.body = (s.body as Record<string, unknown>[]).map((block) => ({
          ...block,
          _key: block._key || key(),
          children: Array.isArray(block.children)
            ? (block.children as Record<string, unknown>[]).map((c) => ({
                ...c,
                _key: c._key || key(),
              }))
            : block.children,
        }));
      }
      return s;
    });
  }
  return out;
}

function mapNav(items: typeof seedNavigation): unknown[] {
  return items.map((item) => ({
    _type: "navItem",
    _key: key(),
    label: item.label,
    href: item.href,
    children: item.children?.map((child) => ({
      _type: "navItem",
      _key: key(),
      label: child.label,
      href: child.href,
      children: child.children?.map((gc) => ({
        _type: "navItem",
        _key: key(),
        label: gc.label,
        href: gc.href,
      })),
    })),
  }));
}

const locations = [
  {
    _id: "loc-hq",
    name: "Makeni (Bombali) — Headquarters",
    description:
      "MADAM established its headquarters in Makeni city, Bombali District, Northern Sierra Leone, from where we coordinate actions in other project regions.",
  },
  {
    _id: "loc-north",
    name: "Bombali & Tonkolili",
    description: "Northern region project offices and field operations.",
  },
  {
    _id: "loc-east",
    name: "Kenema",
    description: "Eastern region operations.",
  },
  {
    _id: "loc-south",
    name: "Bo",
    description: "Southern region operations.",
  },
  {
    _id: "loc-nw",
    name: "Karene & Port Loko",
    description: "North Western region operations.",
  },
  {
    _id: "loc-west",
    name: "Western Rural & Western Urban",
    description: "Western Area project locations including Skills Up!",
  },
];

function buildDocuments(): Record<string, unknown>[] {
  const docs: Record<string, unknown>[] = [];

  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    ...seedSettings,
  });
  docs.push({
    _id: "navigation",
    _type: "navigation",
    items: mapNav(seedNavigation),
  });
  docs.push({
    _id: "siteImages",
    _type: "siteImages",
    note: "Upload images for each labeled location. Changes appear on the public site after publish.",
  });
  docs.push({
    _id: "homepageVideos",
    _type: "homepageVideos",
    heading: "",
    videos: [],
  });

  docs.push(
    withKeys({
      _id: "page-home",
      _type: "page",
      title: homeSeedPage.title,
      slug: { _type: "slug", current: homeSeedPage.slug },
      sections: homeSeedPage.sections,
    }),
  );

  for (const post of seedPosts) {
    docs.push({
      _id: post._id,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      body: textToBlocks(post.excerpt),
    });
  }

  let sort = 10;
  for (const p of seedProjects) {
    docs.push({
      _id: p._id,
      _type: "project",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      status: p.status,
      summary: p.summary,
      body: textToBlocks(p.bodyText),
      locations: p.locations || [],
      partners: p.partners || [],
      donors: p.donors || [],
      startDate: p.startDate || undefined,
      endDate: p.endDate || undefined,
      gallery: [],
      sortOrder: sort,
    });
    sort += 10;
  }

  let staffSort = 10;
  for (const s of [...seedStaffAdmin, ...seedStaffProjects, ...seedStaffYtsc]) {
    docs.push({
      _id: s._id,
      _type: "staffMember",
      name: s.name,
      position: s.position,
      team: s.team,
      projectTeam: s.projectTeam || undefined,
      active: true,
      sortOrder: staffSort,
    });
    staffSort += 10;
  }

  let pSort = 10;
  for (const p of seedPartners) {
    docs.push({
      _id: p._id,
      _type: "partner",
      name: p.name,
      sortOrder: pSort,
    });
    pSort += 10;
  }

  for (const loc of locations) {
    docs.push({
      _id: loc._id,
      _type: "location",
      name: loc.name,
      description: loc.description,
    });
  }

  return docs;
}

async function upsertPreservingMedia(doc: Record<string, unknown>) {
  const id = doc._id as string;
  const existing = await client.getDocument(id).catch(() => null);

  if (!existing) {
    await client.createOrReplace(doc as { _id: string; _type: string });
    console.log(`  ✓ created  ${doc._type}  ${id}`);
    return;
  }

  // Keep editor-uploaded media when re-seeding
  const preserved: Record<string, unknown> = { ...doc };
  for (const field of [
    "photo",
    "featuredImage",
    "gallery",
    "mainImage",
    "logo",
    "coverImage",
    "file",
    "heroSlide1",
    "heroSlide2",
    "heroSlide3",
    "aboutImage",
    "programsSectionBackground",
    "testimonialsBackground",
    "defaultPageHero",
    "partnerLogos",
    "videos",
  ]) {
    if (existing[field] != null) {
      preserved[field] = existing[field];
    }
  }

  await client.createOrReplace(preserved as { _id: string; _type: string });
  console.log(`  ✓ updated  ${doc._type}  ${id}`);
}

async function main() {
  const docs = buildDocuments();
  const dry = process.argv.includes("--ndjson-only");

  if (dry) {
    const out = path.join(__dirname, "seed-content.ndjson");
    fs.writeFileSync(out, docs.map((d) => JSON.stringify(d)).join("\n"));
    console.log(`Wrote ${docs.length} documents → ${out}`);
    return;
  }

  console.log(`Seeding Sanity project ${projectId} / ${dataset} (${docs.length} docs)…\n`);

  for (const doc of docs) {
    await upsertPreservingMedia(doc);
  }

  console.log(`
Done. Refresh Studio (/studio).

Edit existing content:
  • Projects — Featured image + Project images (add one or more)
  • Staff — Staff photo on each person
  • News, Partners, Pages, Navigation, Website Images — all editable
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message || err);
  if (/unauthorized|401|session/i.test(String(err.message || err))) {
    console.error(`
Your token is missing or expired. Create a new Editor token:
  https://www.sanity.io/manage/project/${projectId}/api#tokens

Add to .env.local (replace any empty line):
  SANITY_API_WRITE_TOKEN=sk...your-token...

Then run again: npm run seed:sanity
`);
  }
  process.exit(1);
});
