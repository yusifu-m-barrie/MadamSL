/**
 * Upload the Where we work map into Website Images (Sanity).
 * Usage: npx tsx scripts/upload-where-we-work-map.ts
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

async function main() {
  const filePath = path.join(
    __dirname,
    "../public/images/sierra-leone-locations-map.jpg",
  );
  if (!fs.existsSync(filePath)) {
    console.error("Map file missing:", filePath);
    process.exit(1);
  }

  const buffer = fs.readFileSync(filePath);
  console.log("Uploading map…");
  const asset = await client.assets.upload("image", buffer, {
    filename: "sierra-leone-locations-map.jpg",
    contentType: "image/jpeg",
  });

  await client
    .patch("siteImages")
    .set({
      whereWeWorkMap: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: "Map of Sierra Leone showing MADAM project locations and offices",
      },
    })
    .commit();

  console.log("Done. whereWeWorkMap attached to Website Images.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
