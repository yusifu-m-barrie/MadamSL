"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
  quote: string;
  name: string;
  role?: string;
  /** Pre-resolved image URL (avatar) */
  imageUrl?: string | null;
};

export function TestimonialsSlider({
  heading = "Testimonials",
  items,
  backgroundUrl,
}: {
  heading?: string;
  items: TestimonialItem[];
  backgroundUrl?: string | null;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  const go = useCallback(
    (next: number) => {
      if (!count) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setInterval(() => go(index + 1), 7000);
    return () => window.clearInterval(id);
  }, [paused, count, go, index]);

  if (!count) return null;

  const current = items[index];

  return (
    <section
      className="relative isolate overflow-hidden py-16 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={heading}
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-20">
        {backgroundUrl ? (
          <Image
            src={backgroundUrl}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,#0a3d14_0%,#14532d_50%,#052e16_100%)]" />
        )}
      </div>

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden />

      <Container className="relative text-center text-white">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{heading}</h2>

        <div
          className="mx-auto mt-6 text-5xl font-serif leading-none text-white/90 md:text-6xl"
          aria-hidden
        >
          &ldquo;
        </div>

        <div className="mx-auto mt-4 min-h-[12rem] max-w-3xl">
          <blockquote>
            <p className="text-base italic leading-relaxed text-white/95 md:text-lg">
              {current.quote}
            </p>
            <footer className="mt-8">
              <cite className="block text-lg font-bold not-italic text-white">
                {current.name}
              </cite>
              {current.role ? (
                <p className="mt-1 text-base font-medium text-[var(--madam-green)]">
                  {current.role}
                </p>
              ) : null}
            </footer>
          </blockquote>

          <div className="mt-6 flex justify-center">
            {current.imageUrl ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white/30 shadow-md">
                <Image
                  src={current.imageUrl}
                  alt={current.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-lg font-bold text-white"
                aria-hidden
              >
                {current.name
                  .split(/\s+/)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {count > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center bg-[var(--madam-green)] text-white transition hover:brightness-110"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M10 3L5 8l5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center bg-[var(--madam-green)] text-white transition hover:brightness-110"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : null}

        {!backgroundUrl ? (
          <p
            className={cn(
              "mt-6 text-xs text-white/60",
              "mx-auto max-w-md",
            )}
          >
            Upload background: Studio → Website Images → About → Testimonials background
          </p>
        ) : null}
      </Container>
    </section>
  );
}
