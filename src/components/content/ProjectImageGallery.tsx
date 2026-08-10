"use client";

import Image from "next/image";
import { useState } from "react";
import type { SanityImage } from "@/sanity/types";
import { resolveImageSrc } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

type GalleryImage = SanityImage & { alt?: string; caption?: string };

export function ProjectImageGallery({
  featured,
  gallery = [],
  title,
}: {
  featured?: SanityImage | null;
  gallery?: GalleryImage[];
  title: string;
}) {
  const images: GalleryImage[] = [];
  if (featured?.asset) images.push(featured);
  for (const g of gallery) {
    if (!g?.asset) continue;
    // Skip duplicate of featured if same asset
    const featuredRef = featured?.asset?._ref || featured?.asset?._id || featured?.asset?.url;
    const gRef = g.asset?._ref || g.asset?._id || g.asset?.url;
    if (featuredRef && gRef && featuredRef === gRef) continue;
    images.push(g);
  }

  const [active, setActive] = useState(0);

  if (!images.length) return null;

  const current = images[Math.min(active, images.length - 1)];
  const mainSrc = resolveImageSrc(current, 1200, 800);

  return (
    <div className="mb-10">
      {mainSrc ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--madam-surface)]">
          <Image
            src={mainSrc}
            alt={current.alt || title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
            priority
          />
        </div>
      ) : null}

      {current.caption ? (
        <p className="mt-2 text-center text-sm text-[var(--madam-muted)]">{current.caption}</p>
      ) : null}

      {images.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {images.map((img, i) => {
            const thumb = resolveImageSrc(img, 240, 160);
            if (!thumb) return null;
            return (
              <button
                key={img.asset?._ref || img.asset?._id || img.asset?.url || i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === active}
                className={cn(
                  "relative h-16 w-24 overflow-hidden border-2 transition md:h-20 md:w-28",
                  i === active
                    ? "border-[var(--madam-green)]"
                    : "border-transparent opacity-80 hover:opacity-100",
                )}
              >
                <Image
                  src={thumb}
                  alt={img.alt || `${title} photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
