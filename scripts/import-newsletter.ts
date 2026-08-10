/**
 * Import the MADAM newsletter PDF + cover graphic into Sanity.
 *
 * Usage: npx tsx scripts/import-newsletter.ts
 */
import { config } from "dotenv";
import { createClient } from "next-sanity";
import { createReadStream, existsSync } from "node:fs";
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

const COVER_URL =
  "https://www.madam-sl.org/wp-content/uploads/2024/10/promoting-sustainable.png";
const PDF_URL =
  "https://jzu.fxy.temporary.site/website_212ac6c3/wp-content/uploads/2024/10/MADAM-Newsletter-final.pdf";

const LOCAL_COVER = path.join(
  __dirname,
  "../public/newsletters/promoting-sustainable.png",
);
const LOCAL_PDF = path.join(
  __dirname,
  "../public/newsletters/MADAM-Newsletter-final.pdf",
);

async function downloadToBuffer(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "MADAM-site-migration/1.0" },
  });
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  console.log("Uploading newsletter cover…");
  let coverAsset;
  if (existsSync(LOCAL_COVER)) {
    coverAsset = await client.assets.upload(
      "image",
      createReadStream(LOCAL_COVER),
      { filename: "promoting-sustainable.png", contentType: "image/png" },
    );
  } else {
    const buf = await downloadToBuffer(COVER_URL);
    coverAsset = await client.assets.upload("image", buf, {
      filename: "promoting-sustainable.png",
      contentType: "image/png",
    });
  }
  console.log("  cover", coverAsset._id);

  console.log("Uploading newsletter PDF…");
  let pdfAsset;
  if (existsSync(LOCAL_PDF)) {
    pdfAsset = await client.assets.upload("file", createReadStream(LOCAL_PDF), {
      filename: "MADAM-Newsletter-final.pdf",
      contentType: "application/pdf",
    });
  } else {
    const buf = await downloadToBuffer(PDF_URL);
    pdfAsset = await client.assets.upload("file", buf, {
      filename: "MADAM-Newsletter-final.pdf",
      contentType: "application/pdf",
    });
  }
  console.log("  pdf", pdfAsset._id);

  const doc = {
    _id: "newsletter-psufons-2024-08",
    _type: "newsletterIssue",
    title:
      "Promoting Sustainable Food and Nutrition Security Through Climate Smart Livestock Farming Newsletter",
    date: "2024-08-15",
    sortOrder: 1,
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: coverAsset._id },
      alt: "Partner logos and newsletter title — August 15th, 2024",
    },
    file: {
      _type: "file",
      asset: { _type: "reference", _ref: pdfAsset._id },
    },
  };

  await client.createOrReplace(doc);
  console.log("Created/updated newsletterIssue:", doc._id);
  console.log("Done. Check Studio → Newsletters and /news-letter");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
