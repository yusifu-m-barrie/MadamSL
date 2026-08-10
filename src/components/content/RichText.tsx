"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-[var(--madam-ink)] md:text-lg">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-7 text-2xl font-bold text-[var(--madam-ink)] md:text-3xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-6 text-xl font-bold text-[var(--madam-ink)]">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-4 text-lg font-bold text-[var(--madam-ink)]">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-[var(--madam-green)] pl-4 italic text-[var(--madam-ink)]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-[var(--madam-ink)]">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="font-semibold text-[var(--madam-green)] underline underline-offset-2 hover:text-[var(--madam-green-dark)]"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-1.5 pl-6 text-base leading-relaxed text-[var(--madam-ink)] md:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-1.5 pl-6 text-base leading-relaxed text-[var(--madam-ink)] md:text-lg">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlForImage(value).width(1200).url();
      return (
        <figure className="my-8">
          <Image
            src={src}
            alt={value.alt || ""}
            width={1200}
            height={675}
            className="h-auto w-full object-contain"
          />
        </figure>
      );
    },
  },
};

export function RichText({ value }: { value?: unknown }) {
  if (!value || !Array.isArray(value) || value.length === 0) return null;
  return (
    <div className="prose-madam max-w-none">
      <PortableText value={value as never} components={components} />
    </div>
  );
}

/** Render plain paragraphs when body is not Portable Text (seed/fallback). */
export function PlainParagraphs({ text }: { text: string }) {
  return (
    <div>
      {text.split(/\n+/).filter(Boolean).map((p, i) => (
        <p key={i} className="mb-4 text-base leading-relaxed text-[var(--madam-muted)] md:text-lg">
          {p}
        </p>
      ))}
    </div>
  );
}

export function SanityImageView({
  image,
  alt = "",
  width = 800,
  height = 600,
  className,
}: {
  image?: SanityImage;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  if (!image?.asset) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--madam-surface)] text-sm text-[var(--madam-muted)] ${className || ""}`}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        Image pending
      </div>
    );
  }
  const src = urlForImage(image).width(width).height(height).url();
  return (
    <Image
      src={src}
      alt={alt || image.alt || ""}
      width={width}
      height={height}
      className={className}
    />
  );
}
