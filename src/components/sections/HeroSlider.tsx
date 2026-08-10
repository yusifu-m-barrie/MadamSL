"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import type { SanityImage } from "@/sanity/types";
import { resolveImageSrc } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  heading?: string;
  subheading?: string;
  image?: SanityImage | null;
  /** Pre-resolved CDN URL from the server */
  imageUrl?: string | null;
  alt?: string;
  slotLabel?: string;
  fallbackSrc?: string;
};

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #0a3d14 0%, #1FB53A 48%, #0d4d18 100%)",
  "linear-gradient(135deg, #064e12 0%, #0FB629 45%, #14532d 100%)",
  "linear-gradient(135deg, #14532d 0%, #22c55e 50%, #052e16 100%)",
];

export function HeroSlider({ slides = [] }: { slides?: HeroSlide[] }) {
  const padded: HeroSlide[] = [...slides];
  while (padded.length < 3) {
    padded.push({ heading: "Helping People to help themselves" });
  }
  const base = padded.slice(0, 3);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => {
      setIndex(((next % base.length) + base.length) % base.length);
    },
    [base.length],
  );

  useEffect(() => {
    if (paused || base.length < 2) return;
    const id = setInterval(() => go(index + 1), 5500);
    return () => clearInterval(id);
  }, [paused, base.length, go, index]);

  return (
    <section
      className="relative min-h-[480px] overflow-hidden md:min-h-[620px] lg:min-h-[680px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Homepage hero"
    >
      {base.map((slide, i) => {
        const active = i === index;
        const src =
          slide.imageUrl ||
          resolveImageSrc(slide.image, 1920, 900) ||
          slide.fallbackSrc ||
          null;

        return (
          <div
            key={`${slide.heading}-${i}`}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              active ? "z-[1] opacity-100" : "pointer-events-none z-0 opacity-0",
            )}
            aria-hidden={!active}
          >
            {src ? (
              <Image
                src={src}
                alt={slide.alt || slide.heading || `Hero slide ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/40 to-black/55" />
            {!src ? (
              <div className="absolute bottom-24 left-1/2 z-[2] hidden -translate-x-1/2 rounded-full bg-black/35 px-4 py-2 text-sm text-white/90 backdrop-blur-sm md:block">
                Upload slide {i + 1} image in Studio → Website Images
              </div>
            ) : null}
          </div>
        );
      })}

      <Container className="relative z-[2] flex min-h-[480px] flex-col items-center justify-center py-20 text-center md:min-h-[620px] lg:min-h-[680px]">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/85 md:text-base">
          MADAM Sierra Leone
        </p>
        <h1 className="max-w-5xl text-4xl font-bold uppercase leading-[1.15] tracking-wide text-white drop-shadow-md md:text-5xl lg:text-6xl xl:text-7xl">
          {base[index]?.heading}
        </h1>
        {base[index]?.subheading ? (
          <p className="mt-6 max-w-3xl text-xl text-white/95 md:text-2xl">
            {base[index].subheading}
          </p>
        ) : null}

        <div className="mt-12 flex items-center gap-4">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/70 bg-black/25 text-white backdrop-blur-sm transition hover:bg-white hover:text-[var(--madam-green)]"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex gap-3" role="tablist" aria-label="Hero slides">
            {base.map((slide, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${slide.heading || ""}`}
                className={cn(
                  "h-3.5 rounded-full transition-all",
                  i === index ? "w-10 bg-white" : "w-3.5 bg-white/45 hover:bg-white/70",
                )}
                onClick={() => go(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/70 bg-black/25 text-white backdrop-blur-sm transition hover:bg-white hover:text-[var(--madam-green)]"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <p className="mt-5 text-sm font-medium text-white/75 md:text-base">
          Slide {index + 1} of 3
        </p>
      </Container>
    </section>
  );
}
