import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/content/CmsPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = cmsPageMetadata(
  "Where We Work",
  "MADAM headquarters in Makeni, Bombali District, with project offices and programmes across Sierra Leone.",
);

export default function WhereWeWorkPage() {
  return <CmsPage slug="where-we-work" fallbackTitle="Where We Work" />;
}
