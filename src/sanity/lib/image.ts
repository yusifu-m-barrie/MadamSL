import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./client";
import type { SanityImage } from "@/sanity/types";

const builder = createImageUrlBuilder({
  projectId: projectId || "n5hnlyba",
  dataset: dataset || "production",
});

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

const DEFAULT_QUALITY = 72;

/**
 * Resolve a compressed, auto-formatted image URL from Sanity.
 * Prefer the image pipeline (webp/avif via auto=format) over raw asset URLs.
 */
export function resolveImageSrc(
  image?: SanityImage | null,
  width = 1920,
  height = 900,
  quality = DEFAULT_QUALITY,
): string | null {
  if (!image) return null;

  // Reference form — use Sanity CDN transforms (best compression)
  if (image.asset?._ref || image.asset?._id) {
    try {
      return urlForImage(image as SanityImageSource)
        .width(width)
        .height(height)
        .quality(quality)
        .fit("max")
        .auto("format")
        .url();
    } catch (err) {
      console.error("[resolveImageSrc] urlForImage failed", err);
    }
  }

  // Expanded GROQ url — still compress via CDN query params when possible
  const direct = image.asset?.url;
  if (direct?.includes("cdn.sanity.io")) {
    try {
      const u = new URL(direct);
      // Sanity image API path already includes dimensions in filename; append params
      u.searchParams.set("w", String(width));
      u.searchParams.set("h", String(height));
      u.searchParams.set("q", String(quality));
      u.searchParams.set("fit", "max");
      u.searchParams.set("auto", "format");
      return u.toString();
    } catch {
      return direct;
    }
  }

  return direct ?? null;
}
