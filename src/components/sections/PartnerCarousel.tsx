"use client";

import { useCallback, useEffect, useState } from "react";
import { PlacedImage } from "@/components/content/PlacedImage";
import type { SanityImage } from "@/sanity/types";

const VISIBLE = 3;
const AUTO_MS = 4000;

export type PartnerSlide = {
  _id: string;
  name: string;
  logo?: SanityImage;
  url?: string;
};

function PartnerLogo({ partner }: { partner: PartnerSlide }) {
  const inner = partner.logo?.asset ? (
    <div className="relative mx-auto h-14 w-full max-w-[160px]">
      <PlacedImage
        image={partner.logo}
        alt={partner.name}
        width={200}
        height={80}
        fill
        className="object-contain"
      />
    </div>
  ) : (
    <span className="px-2 text-center text-sm font-semibold text-[var(--madam-ink)]">
      {partner.name}
    </span>
  );

  const shell = (
    <div className="flex min-h-[88px] w-full items-center justify-center border border-black/5 bg-[var(--madam-surface)] px-5 py-3">
      {inner}
    </div>
  );

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full transition hover:opacity-90"
        aria-label={partner.name}
      >
        {shell}
      </a>
    );
  }

  return shell;
}

export function PartnerCarousel({ partners }: { partners: PartnerSlide[] }) {
  const count = partners.length;
  const canSlide = count > VISIBLE;
  const maxIndex = canSlide ? count - VISIBLE : 0;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      if (!canSlide) return;
      const wrapped = ((next % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);
      setIndex(wrapped);
    },
    [canSlide, maxIndex],
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (!canSlide || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [canSlide, maxIndex, paused]);

  if (!count) return null;

  if (!canSlide) {
    return (
      <div className="mx-auto flex max-w-4xl flex-nowrap items-center justify-center gap-6">
        {partners.map((p) => (
          <div key={p._id} className="w-full max-w-[220px] flex-1">
            <PartnerLogo partner={p} />
          </div>
        ))}
      </div>
    );
  }

  const pageCount = maxIndex + 1;

  return (
    <div
      className="relative mx-auto max-w-5xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous partners"
          className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 bg-white text-[var(--madam-ink)] transition hover:border-[var(--madam-green)] hover:text-[var(--madam-green)]"
        >
          <span aria-hidden className="text-xl leading-none">
            ‹
          </span>
        </button>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out will-change-transform"
            style={{
              // % is relative to the track's layout width (= viewport), not content width
              transform: `translateX(-${index * (100 / VISIBLE)}%)`,
            }}
          >
            {partners.map((p) => (
              <div
                key={p._id}
                className="shrink-0 px-2 md:px-3"
                style={{ flex: `0 0 ${100 / VISIBLE}%` }}
              >
                <PartnerLogo partner={p} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next partners"
          className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 bg-white text-[var(--madam-ink)] transition hover:border-[var(--madam-green)] hover:text-[var(--madam-green)]"
        >
          <span aria-hidden className="text-xl leading-none">
            ›
          </span>
        </button>
      </div>

      <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Partner slides">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show partners group ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index
                ? "bg-[var(--madam-green)]"
                : "bg-black/15 hover:bg-[var(--madam-coral)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
