import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/content/CmsPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = cmsPageMetadata("Core Values");

export default function CoreValuesPage() {
  return <CmsPage slug="core-values" fallbackTitle="Core Values" />;
}
