import { createClient } from "next-sanity";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n5hnlyba";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const isSanityConfigured = Boolean(
  projectId && projectId !== "placeholder" && projectId.length > 0,
);

export function getClient(preview = false) {
  return createClient({
    projectId: projectId || "n5hnlyba",
    dataset,
    apiVersion,
    // Avoid CDN lag right after Studio publishes (hero images etc.)
    useCdn: false,
    token: preview ? process.env.SANITY_API_READ_TOKEN : undefined,
    perspective: preview ? "previewDrafts" : "published",
    stega: {
      enabled: preview,
      studioUrl: "/studio",
    },
  });
}

export const client = getClient(false);
