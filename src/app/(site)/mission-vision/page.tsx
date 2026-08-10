import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/content/CmsPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = cmsPageMetadata("Mission & Vision");

export default function MissionVisionPage() {
  return <CmsPage slug="mission-vision" fallbackTitle="Mission & Vision" />;
}
