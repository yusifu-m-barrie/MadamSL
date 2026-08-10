import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getPageBySlug } from "@/lib/content";

type Props = {
  slug: string;
  fallbackTitle: string;
};

export async function CmsPage({ slug, fallbackTitle }: Props) {
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const showHero = page.showHero !== false;

  return (
    <>
      {showHero ? (
        <PageHero title={page.title || fallbackTitle} subtitle={page.heroSubtitle} />
      ) : null}
      <SectionRenderer sections={page.sections} />
    </>
  );
}

export function cmsPageMetadata(
  title: string,
  description?: string,
): Metadata {
  return {
    title,
    ...(description ? { description } : {}),
  };
}
