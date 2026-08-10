import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WhatWeDoPageView } from "@/components/content/WhatWeDoPageView";
import { getSiteSettings, getWhatWeDoPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "MADAM & Generating Income" };

export default async function GeneratingIncomePage() {
  const [page, settings] = await Promise.all([
    getWhatWeDoPage("generating-income"),
    getSiteSettings(),
  ]);
  if (!page) notFound();
  return (
    <WhatWeDoPageView
      page={page}
      phone={settings.phone || "+232 76 687091"}
      email={settings.email || "info@madam-sl.org"}
    />
  );
}
