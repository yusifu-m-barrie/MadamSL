/**
 * Import featured (+ gallery) images for all MADAM projects from the live site.
 *
 * Usage: npx tsx scripts/import-project-images.ts
 */
import { config } from "dotenv";
import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, "../.env.local"), override: true });

const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n5hnlyba",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  token,
  useCdn: false,
});

const LISTING_PAGES = [
  "https://www.madam-sl.org/index.php/cause-category/ongoing/",
  "https://www.madam-sl.org/index.php/cause-category/past-projects/",
];

function key() {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#038;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .trim();
}

function cleanImageUrl(src: string) {
  const u = decodeEntities(src);
  const m = u.match(
    /(?:i\d\.wp\.com\/)?(?:www\.)?madam-sl\.org\/(wp-content\/uploads\/[^?"']+)/i,
  );
  if (m) {
    return `https://www.madam-sl.org/${decodeURIComponent(m[1]).replace(/%40/g, "@")}`;
  }
  return u.split("?")[0];
}

function slugFromCauseUrl(url: string) {
  const parts = url.replace(/\/$/, "").split("/");
  return parts[parts.length - 1] || "";
}

function isLogoOrJunk(url: string) {
  const u = url.toLowerCase();
  return (
    u.includes("logo-removebg") ||
    u.includes("favicon") ||
    u.includes("/logo") ||
    u.endsWith(".svg")
  );
}

async function fetchText(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "MADAM-site-migration/1.0",
      Accept: "text/html",
    },
  });
  if (!res.ok) throw new Error(`Fetch ${res.status}: ${url}`);
  return res.text();
}

type LiveProject = {
  slug: string;
  url: string;
  featuredUrl: string;
  galleryUrls: string[];
};

/** Parse listing cards: each tx-services-item has a cause link + wp-post-image. */
function parseListing(html: string): LiveProject[] {
  const projects: LiveProject[] = [];
  const blocks = html.split(/class="tx-services-item"/i).slice(1);

  for (const block of blocks) {
    const href =
      block.match(
        /href="(https?:\/\/www\.madam-sl\.org\/index\.php\/cause\/[^"#]+)"/i,
      )?.[1] ||
      block.match(/href="(\/index\.php\/cause\/[^"#]+)"/i)?.[1];
    if (!href) continue;

    const url = href.startsWith("http")
      ? href
      : `https://www.madam-sl.org${href}`;
    const slug = slugFromCauseUrl(url);
    if (!slug) continue;

    const imgRaw =
      block.match(/<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src="([^"]+)"/i)?.[1] ||
      block.match(/<img[^>]+src="([^"]+)"[^>]+class="[^"]*wp-post-image[^"]*"/i)?.[1] ||
      block.match(/<img[^>]+src="([^"]+uploads[^"]+)"/i)?.[1];

    if (!imgRaw) {
      console.warn(`  (no listing image for ${slug})`);
      continue;
    }

    const featuredUrl = cleanImageUrl(imgRaw);
    if (isLogoOrJunk(featuredUrl)) continue;

    projects.push({ slug, url, featuredUrl, galleryUrls: [] });
  }

  return projects;
}

/** Pull larger/extra images from the individual cause page. */
function enrichFromDetail(html: string, project: LiveProject) {
  const candidates: string[] = [];

  const og = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  )?.[1];
  if (og) candidates.push(cleanImageUrl(og));

  const featured =
    html.match(/<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src="([^"]+)"/i)?.[1] ||
    html.match(/<img[^>]+src="([^"]+)"[^>]+class="[^"]*wp-post-image[^"]*"/i)?.[1];
  if (featured) candidates.push(cleanImageUrl(featured));

  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/gi)) {
    const url = cleanImageUrl(m[1]);
    if (!/wp-content\/uploads/i.test(url)) continue;
    if (isLogoOrJunk(url)) continue;
    candidates.push(url);
  }

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const u of candidates) {
    const norm = u
      .replace(/-scaled/i, "")
      .replace(/-\d+x\d+(?=\.(jpe?g|png|webp))/i, "")
      .toLowerCase();
    if (seen.has(norm)) continue;
    seen.add(norm);
    unique.push(u);
  }

  if (unique[0]) project.featuredUrl = unique[0];
  project.galleryUrls = unique.slice(1);
}

async function uploadImage(url: string, filenameHint: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "MADAM-site-migration/1.0", Accept: "image/*" },
  });
  if (!res.ok) throw new Error(`Image download ${res.status}: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const pathname = new URL(url).pathname;
  const filename = path.basename(pathname) || `${filenameHint}.jpg`;
  const contentType =
    res.headers.get("content-type") ||
    (filename.endsWith(".png")
      ? "image/png"
      : filename.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg");
  return client.assets.upload("image", buffer, { filename, contentType });
}

async function main() {
  console.log("Scanning live project listings…");
  const bySlug = new Map<string, LiveProject>();

  for (const pageUrl of LISTING_PAGES) {
    const html = await fetchText(pageUrl);
    const found = parseListing(html);
    console.log(`  ${pageUrl} → ${found.length} projects`);
    for (const p of found) bySlug.set(p.slug, p);
  }

  console.log(`\nEnriching ${bySlug.size} detail pages…`);
  for (const project of bySlug.values()) {
    try {
      const html = await fetchText(project.url);
      enrichFromDetail(html, project);
      console.log(
        `  ✓ ${project.slug}  featured=${path.basename(project.featuredUrl)}  +${project.galleryUrls.length} gallery`,
      );
    } catch (e) {
      console.warn(
        `  ! ${project.slug} detail skip: ${e instanceof Error ? e.message : e}`,
      );
    }
  }

  const sanityProjects = await client.fetch<
    { _id: string; title?: string; slug?: string }[]
  >(`*[_type == "project"]{ _id, title, "slug": slug.current }`);

  const sanityBySlug = new Map(
    sanityProjects.filter((p) => p.slug).map((p) => [p.slug!, p]),
  );

  console.log(`\nUploading into Sanity (${sanityProjects.length} CMS projects)…`);

  for (const live of bySlug.values()) {
    const doc = sanityBySlug.get(live.slug);
    if (!doc) {
      console.warn(`  ✗ no Sanity project for slug ${live.slug}`);
      continue;
    }

    process.stdout.write(`  → ${live.slug} … `);
    try {
      const featuredAsset = await uploadImage(live.featuredUrl, live.slug);
      const featuredImage = {
        _type: "image",
        asset: { _type: "reference", _ref: featuredAsset._id },
        alt: doc.title || live.slug,
      };

      const gallery: Record<string, unknown>[] = [
        {
          ...featuredImage,
          _key: key(),
        },
      ];

      for (const gUrl of live.galleryUrls.slice(0, 8)) {
        try {
          const asset = await uploadImage(gUrl, `${live.slug}-g`);
          gallery.push({
            _type: "image",
            _key: key(),
            asset: { _type: "reference", _ref: asset._id },
            alt: doc.title || live.slug,
          });
        } catch {
          /* skip broken extras */
        }
      }

      await client
        .patch(doc._id)
        .set({ featuredImage, gallery })
        .commit();

      console.log(`ok (${gallery.length} image(s))`);
    } catch (e) {
      console.log(`FAIL: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
