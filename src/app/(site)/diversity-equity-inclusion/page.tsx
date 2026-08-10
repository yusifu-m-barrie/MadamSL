import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/content/CmsPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = cmsPageMetadata("Diversity, Equity & Inclusion");

export default function DeiPage() {
  return (
    <CmsPage
      slug="diversity-equity-inclusion"
      fallbackTitle="Diversity, Equity & Inclusion"
    />
  );
}
