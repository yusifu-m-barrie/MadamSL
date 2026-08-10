import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/content/CmsPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = cmsPageMetadata(
  "About",
  "MADAM is a National Non-Governmental Organization, initially established as a community-based organization in Magburaka in 1991.",
);

export default function AboutPage() {
  return <CmsPage slug="about" fallbackTitle="About Us" />;
}
