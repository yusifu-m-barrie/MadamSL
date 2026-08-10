import Image from "next/image";
import type { SanityImage } from "@/sanity/types";
import { resolveImageSrc } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

/**
 * Renders a Sanity image, or a labeled empty slot so editors know what to upload.
 */
export function PlacedImage({
  image,
  alt = "",
  width = 800,
  height = 600,
  className,
  slotLabel,
  fill,
  sizes,
  priority,
}: {
  image?: SanityImage | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  slotLabel?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}) {
  const src = resolveImageSrc(image, width, height);

  if (src) {
    if (fill) {
      return (
        <Image
          src={src}
          alt={alt || ""}
          fill
          className={cn("object-cover", className)}
          sizes={sizes || "100vw"}
          priority={priority}
          quality={72}
        />
      );
    }
    return (
      <Image
        src={src}
        alt={alt || ""}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        priority={priority}
        quality={72}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-[var(--madam-surface)] px-4 text-center text-xs text-[var(--madam-muted)]",
        fill && "absolute inset-0",
        className,
      )}
      style={fill ? undefined : { aspectRatio: `${width}/${height}` }}
      role="img"
      aria-label={slotLabel || "Image pending upload"}
    >
      <span className="max-w-[14rem] leading-snug">
        {slotLabel
          ? `Upload in Studio → Website Images → ${slotLabel}`
          : "Image pending upload in Sanity Studio"}
      </span>
    </div>
  );
}
