/**
 * Import staff photos from a live MADAM staff page into Sanity.
 *
 * Examples:
 *   npm run import:staff-photos -- --page=projects
 *   npm run import:staff-photos -- --page=ytsc
 *   npm run import:staff-photos -- --url=https://www.madam-sl.org/index.php/our-staff/ --team=administrative
 */
import { config } from "dotenv";
import { createClient } from "next-sanity";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, "../.env.local"), override: true });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n5hnlyba";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

const PRESETS: Record<
  string,
  { url: string; team: "administrative" | "projects" | "youthTraining"; idPrefix: string }
> = {
  projects: {
    url: "https://www.madam-sl.org/index.php/our-projects-staff/",
    team: "projects",
    idPrefix: "staff-proj",
  },
  ytsc: {
    url: "https://www.madam-sl.org/index.php/youth-training-center-staff/",
    team: "youthTraining",
    idPrefix: "staff-ytsc",
  },
  admin: {
    url: "https://www.madam-sl.org/index.php/our-staff/",
    team: "administrative",
    idPrefix: "staff-admin",
  },
};

function argValue(flag: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  return hit ? hit.slice(flag.length + 1) : undefined;
}

const pageKey = argValue("--page") || "projects";
const preset = PRESETS[pageKey];
const PAGE_URL = argValue("--url") || preset?.url;
const TEAM =
  (argValue("--team") as "administrative" | "projects" | "youthTraining" | undefined) ||
  preset?.team ||
  "projects";
const ID_PREFIX = argValue("--id-prefix") || preset?.idPrefix || "staff";

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}
if (!PAGE_URL) {
  console.error("Provide --page=projects|ytsc|admin or --url=...");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

type LiveStaff = {
  name: string;
  position: string;
  projectTeam?: string;
  imageUrl: string;
};

function decodeHtml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#038;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function cleanImageUrl(src: string) {
  const u = decodeHtml(src);
  const m = u.match(
    /(?:i\d\.wp\.com\/)?(?:www\.)?madam-sl\.org\/(wp-content\/uploads\/[^?]+)/i,
  );
  if (m) return `https://www.madam-sl.org/${m[1]}`;
  return u.split("?")[0];
}

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugId(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  const hash = createHash("md5").update(name).digest("hex").slice(0, 6);
  return `${ID_PREFIX}-${slug}-${hash}`;
}

function parseStaff(html: string): LiveStaff[] {
  const people: LiveStaff[] = [];
  let currentTeam: string | undefined;

  const tokenRe =
    /<h2[^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>(.*?)<\/h2>|tx-profile-container[\s\S]*?src="([^"]+)"[\s\S]*?tx-profile-name">([^<]+)<[\s\S]*?tx-profile-position">([^<]+)</gi;

  let match: RegExpExecArray | null;
  while ((match = tokenRe.exec(html))) {
    if (match[1] && !match[2]) {
      currentTeam = decodeHtml(match[1].replace(/<[^>]+>/g, ""));
      continue;
    }
    if (match[2] && match[3] && match[4]) {
      people.push({
        name: decodeHtml(match[3]),
        position: decodeHtml(match[4]),
        projectTeam: currentTeam,
        imageUrl: cleanImageUrl(match[2]),
      });
    }
  }
  return people;
}

async function downloadImage(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "MADAM-site-migration/1.0",
      Accept: "image/*",
    },
  });
  if (!res.ok) throw new Error(`Download failed ${res.status} ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = path.basename(new URL(url).pathname) || "staff.jpg";
  const contentType =
    res.headers.get("content-type") ||
    (filename.endsWith(".png")
      ? "image/png"
      : filename.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg");
  return { buffer, filename, contentType };
}

async function findStaffDoc(name: string) {
  const n = normalizeName(name);
  const all = await client.fetch<{ _id: string; name: string }[]>(
    `*[_type == "staffMember"]{ _id, name }`,
  );
  return (
    all.find((s) => normalizeName(s.name) === n) ||
    all.find(
      (s) =>
        normalizeName(s.name).includes(n) || n.includes(normalizeName(s.name)),
    ) ||
    null
  );
}

async function main() {
  console.log(`Fetching ${PAGE_URL}`);
  console.log(`Team: ${TEAM}\n`);

  const pageRes = await fetch(PAGE_URL, {
    headers: { "User-Agent": "MADAM-site-migration/1.0" },
  });
  if (!pageRes.ok) throw new Error(`Page fetch failed ${pageRes.status}`);
  const html = await pageRes.text();
  const people = parseStaff(html);
  console.log(`Found ${people.length} staff profiles with photos.\n`);

  if (!people.length) {
    console.error("No profiles parsed — aborting.");
    process.exit(1);
  }

  let sortOrder = 100;
  for (const person of people) {
    process.stdout.write(`→ ${person.name} … `);
    try {
      const { buffer, filename, contentType } = await downloadImage(
        person.imageUrl,
      );
      const asset = await client.assets.upload("image", buffer, {
        filename: `staff-${filename}`,
        contentType,
      });

      const existing = await findStaffDoc(person.name);
      const photo = {
        _type: "image" as const,
        asset: { _type: "reference" as const, _ref: asset._id },
        alt: person.name,
      };

      const fields: Record<string, unknown> = {
        name: person.name,
        position: person.position,
        team: TEAM,
        photo,
        active: true,
      };
      if (TEAM === "projects" && person.projectTeam) {
        fields.projectTeam = person.projectTeam;
      }

      if (existing) {
        await client.patch(existing._id).set(fields).commit();
        console.log(`updated ${existing._id}`);
      } else {
        const id = slugId(person.name);
        await client.createOrReplace({
          _id: id,
          _type: "staffMember",
          ...fields,
          sortOrder,
        });
        console.log(`created ${id}`);
        sortOrder += 10;
      }
    } catch (err) {
      console.log("FAILED");
      console.error(
        `  ${err instanceof Error ? err.message : err} (${person.imageUrl})`,
      );
    }
  }

  console.log(`
Done. Refresh Studio → Staff and the matching staff page on the site.
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
