import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WhatWeDoPageView } from "@/components/content/WhatWeDoPageView";
import { getWhatWeDoPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "MADAM & Skills Development" };

export default async function SkillsPage() {
  const page = await getWhatWeDoPage("skills-development");
  if (!page) notFound();
  return <WhatWeDoPageView page={page} />;
}
