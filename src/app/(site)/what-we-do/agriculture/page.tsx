import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WhatWeDoPageView } from "@/components/content/WhatWeDoPageView";
import { getWhatWeDoPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "MADAM & Agriculture" };

export default async function AgriculturePage() {
  const page = await getWhatWeDoPage("agriculture");
  if (!page) notFound();
  return <WhatWeDoPageView page={page} />;
}
