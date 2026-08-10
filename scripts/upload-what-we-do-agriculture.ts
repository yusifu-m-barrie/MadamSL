/**
 * Upload MADAM & Agriculture page image into Website Images (Sanity).
 * Usage: npx tsx scripts/upload-what-we-do-agriculture.ts
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

const SOURCE =
  "https://www.madam-sl.org/wp-content/uploads/2024/10/Capture.png";

async function main() {
  const local = path.join(
    __dirname,
    "../public/images/what-we-do-agriculture.png",
  );

  let buffer: Buffer;
  let contentType = "image/png";
  if (fs.existsSync(local)) {
    buffer = fs.readFileSync(local);
  } else {
    const res = await fetch(SOURCE, {
      headers: { "User-Agent": "MADAM-site-migration/1.0" },
    });
    if (!res.ok) throw new Error(`Download failed ${res.status}`);
    buffer = Buffer.from(await res.arrayBuffer());
    contentType = res.headers.get("content-type") || contentType;
  }

  console.log("Uploading agriculture page image…");
  const asset = await client.assets.upload("image", buffer, {
    filename: "what-we-do-agriculture.png",
    contentType,
  });

  await client
    .patch("siteImages")
    .setIfMissing({ _type: "siteImages" })
    .set({
      whatWeDoAgriculture: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: "Women farmers with harvested vegetables in a MADAM agriculture field",
      },
    })
    .commit();

  console.log("Done. whatWeDoAgriculture attached to Website Images.");
}

main().catch(async (e) => {
  // If siteImages doc missing, create it
  if (String(e).includes("not found") || String(e).includes("Document not found")) {
    console.log("siteImages missing — creating…");
    const local = path.join(
      __dirname,
      "../public/images/what-we-do-agriculture.png",
    );
    const buffer = fs.existsSync(local)
      ? fs.readFileSync(local)
      : Buffer.from(await (await fetch(SOURCE)).arrayBuffer());
    const asset = await client.assets.upload("image", buffer, {
      filename: "what-we-do-agriculture.png",
      contentType: "image/png",
    });
    await client.createOrReplace({
      _id: "siteImages",
      _type: "siteImages",
      whatWeDoAgriculture: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: "Women farmers with harvested vegetables in a MADAM agriculture field",
      },
    });
    console.log("Created siteImages with whatWeDoAgriculture.");
    return;
  }
  console.error(e);
  process.exit(1);
});
