import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WhatWeDoPageView } from "@/components/content/WhatWeDoPageView";
import { getPartners, getWhatWeDoPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MADAM as part of an (inter-) national network",
};

export default async function NetworkPage() {
  const [page, partners] = await Promise.all([
    getWhatWeDoPage("network"),
    getPartners(),
  ]);
  if (!page) notFound();
  return (
    <WhatWeDoPageView
      page={page}
      fallbackPartners={partners.map((p) => ({
        _id: p._id,
        name: p.name,
        logo: p.logo,
        url: p.url,
      }))}
    />
  );
}
