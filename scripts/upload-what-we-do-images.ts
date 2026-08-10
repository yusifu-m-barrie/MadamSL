/**
 * Download + upload What We Do page images into Sanity Website Images.
 * Usage: npx tsx scripts/upload-what-we-do-images.ts
 */
import { config } from "dotenv";
import { createClient } from "next-sanity";
import fs from "node:fs";
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

const OUT = path.join(__dirname, "../public/images/what-we-do");

type AssetSpec = {
  field: string;
  url: string;
  filename: string;
  alt: string;
};

const SINGLE: AssetSpec[] = [
  {
    field: "whatWeDoSkills",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/Welding-1.jpg",
    filename: "skills-welding.jpg",
    alt: "TVET students welding at MADAM Youth Training and Service Centre",
  },
  {
    field: "whatWeDoIncomeIntro",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/restaurant.jpg",
    filename: "income-restaurant-intro.jpg",
    alt: "MADAM Nelis guesthouse restaurant",
  },
  {
    field: "whatWeDoIncomeGuestroom",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/guestroom.png",
    filename: "income-guestroom.png",
    alt: "Guestroom at MADAM Nelis",
  },
  {
    field: "whatWeDoIncomeRestaurant",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/resturant.png",
    filename: "income-restaurant.png",
    alt: "Restaurant at MADAM Nelis",
  },
  {
    field: "whatWeDoIncomeHall1",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/hall.png",
    filename: "income-hall-1.png",
    alt: "MADAM conference hall set for a meeting",
  },
  {
    field: "whatWeDoIncomeHall2",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/hall2.png",
    filename: "income-hall-2.png",
    alt: "Conference in session at MADAM hall",
  },
  {
    field: "whatWeDoIncomeGarage",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/garacge.png",
    filename: "income-garage.png",
    alt: "Mechanics and TVET students working in the MADAM garage",
  },
];

const NETWORK_LOGOS = [
  {
    name: "Partner 1",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/Partner-1.png",
    filename: "network-partner-1.png",
  },
  {
    name: "Donor 4",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/Donor-4.png",
    filename: "network-donor-4.png",
  },
  {
    name: "Donor 2",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/Donor-2.png",
    filename: "network-donor-2.png",
  },
  {
    name: "Donor 1",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/Donor-1.png",
    filename: "network-donor-1.png",
  },
  {
    name: "Donor 3",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/Donor-3.png",
    filename: "network-donor-3.png",
  },
  {
    name: "Partner 4",
    url: "https://www.madam-sl.org/wp-content/uploads/2024/10/partner-4.png",
    filename: "network-partner-4.png",
  },
];

async function download(url: string, dest: string) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    return fs.readFileSync(dest);
  }
  const res = await fetch(url, {
    headers: { "User-Agent": "MADAM-site-migration/1.0" },
  });
  if (!res.ok) throw new Error(`Download ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf;
}

function contentType(filename: string) {
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

function key() {
  return Math.random().toString(36).slice(2, 10);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const patch: Record<string, unknown> = {};

  for (const item of SINGLE) {
    process.stdout.write(`→ ${item.field} … `);
    const dest = path.join(OUT, item.filename);
    const buf = await download(item.url, dest);
    const asset = await client.assets.upload("image", buf, {
      filename: item.filename,
      contentType: contentType(item.filename),
    });
    patch[item.field] = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: item.alt,
    };
    console.log("ok");
  }

  const networkLogos = [];
  for (const logo of NETWORK_LOGOS) {
    process.stdout.write(`→ network ${logo.name} … `);
    const dest = path.join(OUT, logo.filename);
    const buf = await download(logo.url, dest);
    const asset = await client.assets.upload("image", buf, {
      filename: logo.filename,
      contentType: contentType(logo.filename),
    });
    networkLogos.push({
      _type: "object",
      _key: key(),
      name: logo.name,
      logo: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    });
    console.log("ok");
  }
  patch.whatWeDoNetworkLogos = networkLogos;

  await client
    .patch("siteImages")
    .setIfMissing({ _type: "siteImages" })
    .set(patch)
    .commit();

  console.log("\nDone. Website Images updated for Skills / Income / Network.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
