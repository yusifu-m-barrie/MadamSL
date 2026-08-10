import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { VideoGallery } from "@/components/sections/VideoGallery";
import { getPageBySlug, getHomepageVideos } from "@/lib/content";

/** Always fetch fresh CMS data (images/videos appear right after Studio publish) */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home Charity",
  description:
    "ABOUT MADAM — MADAM is a national NGO established in 1991, working with the most vulnerable, disadvantaged and marginalized people in Sierra Leone.",
};

export default async function HomePage() {
  const [page, videos] = await Promise.all([
    getPageBySlug("home"),
    getHomepageVideos(),
  ]);

  return (
    <>
      <SectionRenderer sections={page?.sections} />
      {/* Video row sits directly under Latest News (last homepage section) */}
      <VideoGallery data={videos} />
    </>
  );
}
