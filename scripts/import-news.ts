/**
 * Import all MADAM news posts (pages 1–6) into Sanity with full body + images.
 * Preserves bold, links, headings, and nested lists as Portable Text.
 *
 * Usage: npx tsx scripts/import-news.ts
 */
import { config } from "dotenv";
import { createClient } from "next-sanity";
import { createHash, randomUUID } from "node:crypto";
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

const LISTING_PAGES = [
  "https://www.madam-sl.org/index.php/news/",
  "https://www.madam-sl.org/index.php/news/page/2/",
  "https://www.madam-sl.org/index.php/news/page/3/",
  "https://www.madam-sl.org/index.php/news/page/4/",
  "https://www.madam-sl.org/index.php/news/page/5/",
  "https://www.madam-sl.org/index.php/news/page/6/",
];

function key() {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function decodeEntities(s: string) {
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
    .replace(/Ã¼/g, "ü")
    .replace(/Ã¶/g, "ö")
    .replace(/Ã¤/g, "ä")
    .replace(/Â/g, "");
}

function stripTags(s: string) {
  return decodeEntities(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
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

function slugFromUrl(url: string) {
  const parts = url.replace(/\/$/, "").split("/");
  return parts[parts.length - 1] || createHash("md5").update(url).digest("hex").slice(0, 12);
}

function postId(slug: string) {
  const safe = slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase().slice(0, 80);
  return `post-${safe}`;
}

async function fetchText(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "MADAM-site-migration/1.0" },
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);
  return res.text();
}

async function collectArticleUrls(): Promise<string[]> {
  const set = new Set<string>();
  for (const page of LISTING_PAGES) {
    const html = await fetchText(page);
    const re =
      /href="(https:\/\/www\.madam-sl\.org\/index\.php\/\d{4}\/\d{2}\/\d{2}\/[^"]+\/)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) set.add(m[1]);
  }
  return [...set];
}

function titleFromExcerpt(excerpt?: string, slug?: string) {
  const raw = (excerpt || "").trim();
  if (!raw) return slug || "News update";
  const sentence = raw.split(/(?<=[.?])\s+(?=[A-Z"])/)[0] || raw;
  if (sentence.length <= 110) return sentence.replace(/[.?]$/, "");
  return `${sentence.slice(0, 107).trim()}…`;
}

function cleanTitle(raw: string, excerpt?: string, slug?: string) {
  let title = stripTags(raw)
    .replace(/\s*[-–|]\s*MADAM\s*$/i, "")
    .trim();
  if (!title || title === "-" || title.length < 8) {
    title = titleFromExcerpt(excerpt, slug);
  }
  return title;
}

function extractMeta(html: string, url: string) {
  const ogTitle = html.match(
    /<meta\s+property="og:title"\s+content="([^"]+)"/i,
  )?.[1];
  const h1 = html.match(/<h1 class="entry-title">([\s\S]*?)<\/h1>/i)?.[1];
  const slug = slugFromUrl(url);

  const published =
    html.match(
      /<meta\s+property="article:published_time"\s+content="([^"]+)"/i,
    )?.[1] || undefined;

  const ogImage = html.match(
    /<meta\s+property="og:image"\s+content="([^"]+)"/i,
  )?.[1];

  const desc = html.match(
    /<meta\s+property="og:description"\s+content="([^"]+)"/i,
  )?.[1];
  const excerpt = desc ? stripTags(desc) : undefined;

  // Prefer full-size featured image from entry content when available
  const featured =
    html.match(
      /<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src="([^"]+)"/i,
    )?.[1] ||
    html.match(
      /src="([^"]+)"[^>]+class="[^"]*wp-post-image[^"]*"/i,
    )?.[1];

  return {
    title: cleanTitle(ogTitle || h1 || "", excerpt, slug),
    publishedAt: published ? new Date(published).toISOString() : undefined,
    mainImageUrl: cleanImageUrl(featured || ogImage || ""),
    excerpt,
  };
}

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = { _type: "link"; _key: string; href: string };

function parseInline(html: string): { children: Span[]; markDefs: MarkDef[] } {
  const children: Span[] = [];
  const markDefs: MarkDef[] = [];
  const active: string[] = [];

  const pushText = (raw: string) => {
    const text = decodeEntities(raw);
    if (!text) return;
    // Collapse whitespace but keep intentional spaces
    const normalized = text.replace(/\s+/g, " ");
    if (!normalized) return;
    children.push({
      _type: "span",
      _key: key(),
      text: normalized,
      marks: [...active],
    });
  };

  const tokenRe =
    /<\/?(strong|b|em|i|a)(?:\s[^>]*)?>|[^<]+/gi;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(html))) {
    const tok = m[0];
    if (tok.startsWith("</")) {
      const tag = tok.slice(2, -1).toLowerCase().replace(/\s.*/, "");
      if (tag === "strong" || tag === "b") {
        const i = active.lastIndexOf("strong");
        if (i >= 0) active.splice(i, 1);
      } else if (tag === "em" || tag === "i") {
        const i = active.lastIndexOf("em");
        if (i >= 0) active.splice(i, 1);
      } else if (tag === "a") {
        for (let i = active.length - 1; i >= 0; i--) {
          if (active[i].startsWith("link")) {
            active.splice(i, 1);
            break;
          }
        }
      }
      continue;
    }
    if (tok.startsWith("<")) {
      const tag = tok.match(/^<([a-z]+)/i)?.[1]?.toLowerCase();
      if (tag === "strong" || tag === "b") active.push("strong");
      else if (tag === "em" || tag === "i") active.push("em");
      else if (tag === "a") {
        const hrefAttr = tok.match(/href="([^"]*)"/i)?.[1];
        const linkKey = `link${key()}`;
        markDefs.push({
          _type: "link",
          _key: linkKey,
          href: hrefAttr ? decodeEntities(hrefAttr) : "",
        });
        active.push(linkKey);
      }
      continue;
    }
    pushText(tok);
  }

  // Fix empty href links: if span text looks like email, set mailto
  for (const def of markDefs) {
    if (!def.href) {
      const span = children.find((c) => c.marks.includes(def._key));
      if (span && /@/.test(span.text)) {
        def.href = `mailto:${span.text.trim()}`;
      } else if (span) {
        def.href = span.text.trim();
      }
    }
  }

  if (!children.length) {
    children.push({ _type: "span", _key: key(), text: "", marks: [] });
  }
  return { children, markDefs };
}

function makeBlock(
  htmlInner: string,
  style: "normal" | "h2" | "h3" | "h4" = "normal",
  listItem?: "bullet" | "number",
  level?: number,
) {
  const { children, markDefs } = parseInline(htmlInner);
  const text = children.map((c) => c.text).join("").trim();
  if (!text) return null;
  return {
    _type: "block" as const,
    _key: key(),
    style,
    markDefs,
    children,
    ...(listItem ? { listItem, level: level || 1 } : {}),
  };
}

function extractListItems(
  listHtml: string,
  listType: "bullet" | "number",
  level: number,
): Record<string, unknown>[] {
  const blocks: Record<string, unknown>[] = [];
  // Inner only
  const open = listHtml.match(/^<(ul|ol)\b[^>]*>/i);
  if (!open) return blocks;
  const inner = listHtml.slice(open[0].length, listHtml.lastIndexOf("</"));

  let i = 0;
  while (i < inner.length) {
    const slice = inner.slice(i);
    const liOpen = slice.match(/^<li\b[^>]*>/i);
    if (!liOpen) {
      i += 1;
      continue;
    }
    const matched = matchBalanced(inner, i, "li");
    if (!matched) {
      i += 1;
      continue;
    }
    let item = matched.inner;
    const nestedUl = item.search(/<(ul|ol)\b/i);
    let nestedBlocks: Record<string, unknown>[] = [];
    if (nestedUl >= 0) {
      const nestedTag = item.slice(nestedUl).match(/^<(ul|ol)\b/i)?.[1]?.toLowerCase();
      if (nestedTag) {
        const nested = matchBalanced(item, nestedUl, nestedTag);
        if (nested) {
          nestedBlocks = extractListItems(
            nested.full,
            nestedTag === "ol" ? "number" : "bullet",
            level + 1,
          );
          item = (item.slice(0, nestedUl) + item.slice(nested.end)).trim();
        }
      }
    }
    item = item.replace(/^<(p|div)[^>]*>/i, "").replace(/<\/(p|div)>\s*$/i, "");
    const block = makeBlock(item, "normal", listType, level);
    if (block) blocks.push(block);
    blocks.push(...nestedBlocks);
    i = matched.end;
  }
  return blocks;
}

function matchBalanced(
  html: string,
  start: number,
  openTag: string,
): { end: number; inner: string; full: string } | null {
  const openRe = new RegExp(`<${openTag}\\b[^>]*>`, "i");
  const openAtStart = html.slice(start).match(openRe);
  if (!openAtStart || openAtStart.index !== 0) return null;
  const openLen = openAtStart[0].length;
  let depth = 1;
  let i = start + openLen;
  const openFind = new RegExp(`<${openTag}\\b`, "gi");
  const closeFind = new RegExp(`</${openTag}>`, "gi");
  while (i < html.length && depth > 0) {
    openFind.lastIndex = i;
    closeFind.lastIndex = i;
    const nextOpen = openFind.exec(html);
    const nextClose = closeFind.exec(html);
    if (!nextClose) return null;
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      i = nextOpen.index + 1;
    } else {
      depth -= 1;
      if (depth === 0) {
        const end = nextClose.index + nextClose[0].length;
        return {
          end,
          inner: html.slice(start + openLen, nextClose.index),
          full: html.slice(start, end),
        };
      }
      i = nextClose.index + 1;
    }
  }
  return null;
}

function htmlToPortableText(contentHtml: string): Record<string, unknown>[] {
  const blocks: Record<string, unknown>[] = [];
  const seenImg = new Set<string>();
  let i = 0;
  const html = contentHtml;

  while (i < html.length) {
    const slice = html.slice(i);
    const img = slice.match(/^<img\b[^>]*src="([^"]+)"[^>]*>/i);
    if (img) {
      const url = cleanImageUrl(img[1]);
      if (
        url.includes("/uploads/") &&
        !seenImg.has(url) &&
        !/resize=270/i.test(img[0])
      ) {
        seenImg.add(url);
        blocks.push({ type: "img", url });
      }
      i += img[0].length;
      continue;
    }

    const tagMatch = slice.match(/^<(p|h[2-4]|ul|ol|blockquote)\b/i);
    if (tagMatch) {
      const tag = tagMatch[1].toLowerCase();
      const matched = matchBalanced(html, i, tag);
      if (!matched) {
        i += 1;
        continue;
      }
      const inner = matched.inner;
      if (/social-share|share-on|ss-fb|nickname|post-views|related-posts/i.test(inner)) {
        i = matched.end;
        continue;
      }
      if (tag === "ul" || tag === "ol") {
        blocks.push(
          ...extractListItems(matched.full, tag === "ol" ? "number" : "bullet", 1),
        );
      } else if (tag === "h2" || tag === "h3" || tag === "h4") {
        const block = makeBlock(inner, tag);
        if (block) blocks.push(block);
      } else if (tag === "blockquote") {
        const block = makeBlock(inner, "normal");
        if (block) {
          block.style = "blockquote";
          blocks.push(block);
        }
      } else {
        const block = makeBlock(inner, "normal");
        if (block) {
          const text = (block.children as Span[]).map((c) => c.text).join("");
          if (!/^Share on/i.test(text)) blocks.push(block);
        }
      }
      i = matched.end;
      continue;
    }

    i += 1;
  }

  return blocks;
}

function extractBody(html: string): Record<string, unknown>[] {
  const m = html.match(
    /<div class="entry-content">([\s\S]*?)<\/div><!-- \.entry-content -->/,
  );
  if (!m) return [];
  let content = m[1];
  content = content.replace(/<header[\s\S]*?<\/header>/gi, "");
  content = content.replace(/<h1 class="entry-title"[\s\S]*?<\/h1>/gi, "");
  // Remove featured/post image from body — it becomes mainImage
  content = content.replace(
    /<img\b[^>]*class="[^"]*wp-post-image[^"]*"[^>]*>/gi,
    "",
  );
  content = content.replace(
    /<img\b[^>]*src="[^"]+"[^>]*class="[^"]*wp-post-image[^"]*"[^>]*>/gi,
    "",
  );
  return htmlToPortableText(content);
}

async function uploadImage(url: string, filenameHint: string) {
  if (!url) throw new Error("empty image url");
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

function sameImage(a: string, b: string) {
  const norm = (u: string) =>
    u
      .replace(/-scaled/i, "")
      .replace(/\.(jpe?g|png|webp)$/i, "")
      .toLowerCase();
  return norm(a) === norm(b);
}

async function importPost(url: string) {
  const slug = slugFromUrl(url);
  const id = postId(slug);
  process.stdout.write(`→ ${slug} … `);

  const html = await fetchText(url);
  const meta = extractMeta(html, url);
  const bodyParts = extractBody(html);

  let mainImageUrl = meta.mainImageUrl;
  if (!mainImageUrl) {
    const firstImg = bodyParts.find(
      (p) => p.type === "img" && typeof p.url === "string",
    ) as { url: string } | undefined;
    if (firstImg) mainImageUrl = firstImg.url;
  }

  let mainImage: Record<string, unknown> | undefined;
  if (mainImageUrl) {
    try {
      const asset = await uploadImage(mainImageUrl, slug);
      mainImage = {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: meta.title,
      };
    } catch (e) {
      console.log(`(main image skip: ${e instanceof Error ? e.message : e})`);
    }
  }

  const body: Record<string, unknown>[] = [];
  for (const part of bodyParts) {
    if (part.type === "img") {
      const imgUrl = part.url as string;
      if (mainImageUrl && sameImage(imgUrl, mainImageUrl)) continue;
      try {
        const asset = await uploadImage(imgUrl, `${slug}-body`);
        body.push({
          _type: "image",
          _key: key(),
          asset: { _type: "reference", _ref: asset._id },
          alt: meta.title,
        });
      } catch {
        /* skip */
      }
      continue;
    }
    body.push(part);
  }

  if (!body.length && meta.excerpt) {
    body.push({
      _type: "block",
      _key: key(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key(), text: meta.excerpt, marks: [] }],
    });
  }

  const doc = {
    _id: id,
    _type: "post",
    title: meta.title,
    slug: { _type: "slug", current: slug },
    excerpt: meta.excerpt,
    publishedAt: meta.publishedAt,
    mainImage,
    body,
  };

  await client.createOrReplace(doc as { _id: string; _type: string });
  console.log(
    `ok (${body.length} blocks${mainImage ? ", img" : ", NO IMG"})`,
  );
}

async function main() {
  console.log("Collecting article URLs from news pages 1–6…");
  const urls = await collectArticleUrls();
  console.log(`Found ${urls.length} articles.\n`);

  urls.sort((a, b) => {
    const da = a.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
    const db = b.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
    if (!da || !db) return 0;
    return `${db[1]}${db[2]}${db[3]}`.localeCompare(
      `${da[1]}${da[2]}${da[3]}`,
    );
  });

  let failed = 0;
  for (const url of urls) {
    try {
      await importPost(url);
    } catch (e) {
      failed += 1;
      console.log("FAILED");
      console.error(`  ${e instanceof Error ? e.message : e}`);
    }
  }

  for (const id of ["post-tender", "post-recognition", "post-matriculation"]) {
    try {
      await client.delete(id);
    } catch {
      /* ok */
    }
  }

  console.log(`
Done. Imported ${urls.length - failed}/${urls.length} posts into Sanity.
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
