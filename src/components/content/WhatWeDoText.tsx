"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-[var(--madam-ink)] md:text-lg">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-6 text-2xl font-bold text-[var(--madam-green)]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-5 text-xl font-bold text-[var(--madam-ink)]">
        {children}
      </h3>
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
        className="font-semibold text-[var(--madam-green)] underline underline-offset-2"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-1 pl-6 text-base text-[var(--madam-ink)] md:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-1 pl-6 text-base text-[var(--madam-ink)] md:text-lg">
        {children}
      </ol>
    ),
  },
};

/** Compact body text for What We Do pages (smaller than default RichText). */
export function WhatWeDoText({ value }: { value?: unknown }) {
  if (!value || !Array.isArray(value) || value.length === 0) return null;
  return <PortableText value={value as never} components={components} />;
}
