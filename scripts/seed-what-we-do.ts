/**
 * Seed all What We Do pages into Sanity (copy + photos).
 * Reuses images already on Website Images when available.
 *
 * Usage: npx tsx scripts/seed-what-we-do.ts
 */
import { config } from "dotenv";
import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seedWhatWeDoPages } from "../src/lib/seed";

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

function key() {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function rekeyBlocks(blocks: unknown): unknown {
  if (!Array.isArray(blocks)) return blocks;
  return blocks.map((b) => {
    if (!b || typeof b !== "object") return b;
    const block = b as Record<string, unknown>;
    const children = Array.isArray(block.children)
      ? block.children.map((c) =>
          c && typeof c === "object"
            ? { ...(c as object), _key: key() }
            : c,
        )
      : block.children;
    return { ...block, _key: key(), children };
  });
}

function imageRef(assetId: string | undefined, alt?: string) {
  if (!assetId) return undefined;
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    ...(alt ? { alt } : {}),
  };
}

async function main() {
  const siteImages = await client.fetch<{
    whatWeDoAgriculture?: { asset?: { _ref?: string } };
    whatWeDoSkills?: { asset?: { _ref?: string } };
    whatWeDoIncomeIntro?: { asset?: { _ref?: string } };
    whatWeDoIncomeGuestroom?: { asset?: { _ref?: string } };
    whatWeDoIncomeRestaurant?: { asset?: { _ref?: string } };
    whatWeDoIncomeHall1?: { asset?: { _ref?: string } };
    whatWeDoIncomeHall2?: { asset?: { _ref?: string } };
    whatWeDoIncomeGarage?: { asset?: { _ref?: string } };
    whatWeDoNetworkLogos?: {
      name?: string;
      logo?: { asset?: { _ref?: string } };
    }[];
  }>(`*[_type=="siteImages"][0]{
    whatWeDoAgriculture{ asset },
    whatWeDoSkills{ asset },
    whatWeDoIncomeIntro{ asset },
    whatWeDoIncomeGuestroom{ asset },
    whatWeDoIncomeRestaurant{ asset },
    whatWeDoIncomeHall1{ asset },
    whatWeDoIncomeHall2{ asset },
    whatWeDoIncomeGarage{ asset },
    whatWeDoNetworkLogos[]{ name, logo{ asset } }
  }`);

  const img = {
    agriculture: siteImages?.whatWeDoAgriculture?.asset?._ref,
    skills: siteImages?.whatWeDoSkills?.asset?._ref,
    incomeIntro: siteImages?.whatWeDoIncomeIntro?.asset?._ref,
    guestroom: siteImages?.whatWeDoIncomeGuestroom?.asset?._ref,
    restaurant: siteImages?.whatWeDoIncomeRestaurant?.asset?._ref,
    hall1: siteImages?.whatWeDoIncomeHall1?.asset?._ref,
    hall2: siteImages?.whatWeDoIncomeHall2?.asset?._ref,
    garage: siteImages?.whatWeDoIncomeGarage?.asset?._ref,
  };

  for (const seed of seedWhatWeDoPages) {
    const doc: Record<string, unknown> = {
      _id: seed._id,
      _type: "whatWeDoPage",
      title: seed.title,
      slug: { _type: "slug", current: seed.slug },
      heading: seed.heading,
      intro: rekeyBlocks(seed.intro),
      body: rekeyBlocks(seed.body),
      ctaLabel: seed.ctaLabel,
      ctaHref: seed.ctaHref,
      showPartnerLogos: seed.showPartnerLogos || false,
    };

    if (seed.slug === "agriculture") {
      doc.sideImage = imageRef(
        img.agriculture,
        seed.sideImage?.alt as string | undefined,
      );
    } else if (seed.slug === "skills-development") {
      doc.sideImage = imageRef(
        img.skills,
        seed.sideImage?.alt as string | undefined,
      );
    } else if (seed.slug === "generating-income") {
      doc.sideImage = imageRef(
        img.incomeIntro,
        seed.sideImage?.alt as string | undefined,
      );
      doc.sections = (seed.sections || []).map((section) => {
        const gallery = (section.gallery || []).map((g) => {
          let ref: string | undefined;
          if (g._key === "guestroom") ref = img.guestroom;
          else if (g._key === "restaurant") ref = img.restaurant;
          else if (g._key === "hall1") ref = img.hall1;
          else if (g._key === "hall2") ref = img.hall2;
          else if (g._key === "garage") ref = img.garage;
          return {
            _type: "object",
            _key: key(),
            caption: g.caption,
            alt: g.alt,
            image: imageRef(ref),
          };
        });
        return {
          _type: "contentSection",
          _key: key(),
          heading: section.heading,
          body: rekeyBlocks(section.body),
          contactHeading: section.contactHeading,
          highlight: section.highlight,
          gallery,
        };
      });
    } else if (seed.slug === "network") {
      doc.partnerLogos = (siteImages?.whatWeDoNetworkLogos || []).map((p) => ({
        _type: "object",
        _key: key(),
        name: p.name,
        logo: imageRef(p.logo?.asset?._ref),
      }));
    }

    await client.createOrReplace(doc as { _id: string; _type: string });
    console.log("✓", seed.slug);
  }

  console.log("\nDone. Open Studio → What We Do to edit pages.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
