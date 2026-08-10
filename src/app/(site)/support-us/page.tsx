import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/content/CmsPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = cmsPageMetadata("Support Us");

export default function SupportUsPage() {
  return <CmsPage slug="support-us" fallbackTitle="Support Us" />;
}
