import { client, isSanityConfigured } from "@/sanity/lib/client";
import {
  siteSettingsQuery,
  siteImagesQuery,
  navigationQuery,
  pageBySlugQuery,
  postsQuery,
  postBySlugQuery,
  latestPostsQuery,
  projectsQuery,
  projectBySlugQuery,
  staffByTeamQuery,
  partnersQuery,
  newslettersQuery,
  locationsQuery,
  homepageVideosQuery,
  whatWeDoPageBySlugQuery,
} from "@/sanity/queries";
import type {
  SiteSettings,
  NavItem,
  PageDocument,
  PostListItem,
  ProjectListItem,
  StaffMember,
  Partner,
  NewsletterIssue,
  SanityImage,
} from "@/sanity/types";
import type { SiteImages, SiteImageSlot } from "@/sanity/types/siteImages";
import type { HomepageVideosDoc } from "@/sanity/types/videos";
import type { WhatWeDoPageDoc } from "@/sanity/types/whatWeDo";
import {
  seedSettings,
  seedNavigation,
  seedPosts,
  seedProjects,
  seedStaffAdmin,
  seedStaffProjects,
  seedStaffYtsc,
  seedPartners,
  seedNewsletters,
  homeSeedPage,
  seedWhatWeDoPages,
} from "@/lib/seed";

async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: { revalidate?: number | false; noStore?: boolean } = {},
): Promise<T | null> {
  if (!isSanityConfigured) {
    console.warn("[sanity] not configured — using seed/fallback content");
    return null;
  }
  try {
    const fetchOptions = options.noStore
      ? { cache: "no-store" as const }
      : {
          next: {
            tags: ["sanity"] as string[],
            revalidate: options.revalidate ?? 30,
          },
        };

    return await client.fetch<T>(query, params, fetchOptions);
  } catch (err) {
    console.error("[sanity] fetch failed:", err);
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await safeFetch<SiteSettings>(siteSettingsQuery, {}, { noStore: true });
  return data ?? seedSettings;
}

export async function getSiteImages(): Promise<SiteImages> {
  // Always bypass Next cache so Studio publishes show on the next page load
  const data = await safeFetch<SiteImages>(siteImagesQuery, {}, { noStore: true });
  if (process.env.NODE_ENV === "development") {
    console.info(
      "[sanity] siteImages heroSlide1:",
      data?.heroSlide1?.asset?.url ||
        data?.heroSlide1?.asset?._ref ||
        "missing",
    );
  }
  return data ?? {};
}

export function resolveSiteImage(
  images: SiteImages,
  slot?: string | null,
): SanityImage | undefined {
  if (!slot) return undefined;
  if (slot === "heroSlide1") return images.heroSlide1;
  if (slot === "heroSlide2") return images.heroSlide2;
  if (slot === "heroSlide3") return images.heroSlide3;
  return images[slot as SiteImageSlot] as SanityImage | undefined;
}

export async function getNavigation(): Promise<NavItem[]> {
  const data = await safeFetch<{ items?: NavItem[] }>(
    navigationQuery,
    {},
    { noStore: true },
  );
  return data?.items?.length ? data.items : seedNavigation;
}

export async function getPageBySlug(slug: string): Promise<PageDocument | null> {
  const data = await safeFetch<PageDocument>(pageBySlugQuery, { slug });
  if (data) return data;
  if (slug === "home" || slug === "") return homeSeedPage;
  return null;
}

/** Collapse near-identical WordPress re-posts (same title aside from hyphenation). */
function normalizePostTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[….]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupePostsByTitle(posts: PostListItem[]): PostListItem[] {
  const seen = new Set<string>();
  const unique: PostListItem[] = [];
  for (const post of posts) {
    const key = normalizePostTitle(post.title || "");
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    unique.push(post);
  }
  return unique;
}

export async function getPosts(): Promise<PostListItem[]> {
  const data = await safeFetch<PostListItem[]>(postsQuery);
  return dedupePostsByTitle(data?.length ? data : seedPosts);
}

export async function getPostBySlug(slug: string) {
  const data = await safeFetch<PostListItem & { body?: unknown; seo?: unknown; author?: { name?: string } }>(
    postBySlugQuery,
    { slug },
  );
  if (data) return data;
  return seedPosts.find((p) => p.slug === slug) ?? null;
}

export async function getLatestPosts(limit = 3): Promise<PostListItem[]> {
  // Fetch a few extras so title-dedupe still fills the requested limit
  const fetchLimit = Math.min(limit + 5, 50);
  const data = await safeFetch<PostListItem[]>(latestPostsQuery, { limit: fetchLimit });
  if (data?.length) return dedupePostsByTitle(data).slice(0, limit);
  return seedPosts.slice(0, limit);
}

const PROJECT_SLUG_ALIASES: Record<string, string> = {
  "classroom-to-commerce":
    "classroom-to-commerce-empowering-youth-employability-and-entrepreneurship",
  psave: "psave-project-promoting-sustainable-agriculture-and-vocational-education",
  psufons: "psufons-project-promoting-sustainable-food-and-nutrition-security",
  "skills-up": "skills-up-project-overview",
  ytsc: "youth-training-and-service-centre-ytsc",
};

export async function getProjects(
  status: "ongoing" | "past" | "all" = "all",
): Promise<ProjectListItem[]> {
  const seed =
    status === "all" ? seedProjects : seedProjects.filter((p) => p.status === status);
  const data = await safeFetch<ProjectListItem[]>(projectsQuery, { status });

  if (!data?.length) return seed;

  // Seed holds full live-site copy; CMS overlays matching slugs when published
  const sanityBySlug = new Map(data.map((p) => [p.slug, p]));
  const merged = seed.map((s) => {
    const cms = sanityBySlug.get(s.slug);
    if (!cms) return s;
    return {
      ...s,
      ...cms,
      summary: cms.summary || s.summary,
      bodyText: s.bodyText,
      locations: cms.locations?.length ? cms.locations : s.locations,
      partners: cms.partners?.length ? cms.partners : s.partners,
      donors: cms.donors?.length ? cms.donors : s.donors,
    };
  });

  const seedSlugs = new Set(seed.map((p) => p.slug));
  const legacySlugs = new Set(Object.keys(PROJECT_SLUG_ALIASES));
  const extras = data.filter(
    (p) => !seedSlugs.has(p.slug) && !legacySlugs.has(p.slug),
  );
  return [...merged, ...extras];
}

export async function getProjectBySlug(slug: string): Promise<ProjectListItem | null> {
  const canonical = PROJECT_SLUG_ALIASES[slug] || slug;
  const data = await safeFetch<ProjectListItem>(projectBySlugQuery, {
    slug: canonical,
  });
  const seed = seedProjects.find((p) => p.slug === canonical) ?? null;

  if (data && seed) {
    return {
      ...seed,
      ...data,
      summary: data.summary || seed.summary,
      bodyText: seed.bodyText,
      locations: data.locations?.length ? data.locations : seed.locations,
      partners: data.partners?.length ? data.partners : seed.partners,
      donors: data.donors?.length ? data.donors : seed.donors,
    };
  }
  if (data) return data;
  return seed;
}

export async function getStaffByTeam(
  team: StaffMember["team"],
): Promise<StaffMember[]> {
  const data = await safeFetch<StaffMember[]>(staffByTeamQuery, { team });
  if (data?.length) return data;
  if (team === "administrative") return seedStaffAdmin;
  if (team === "projects") return seedStaffProjects;
  return seedStaffYtsc;
}

export async function getPartners(): Promise<Partner[]> {
  const data = await safeFetch<Partner[]>(partnersQuery);
  return data?.length ? data : seedPartners;
}

export async function getNewsletters(): Promise<NewsletterIssue[]> {
  const data = await safeFetch<NewsletterIssue[]>(newslettersQuery);
  if (data?.length) return data;
  return seedNewsletters;
}

export async function getWhatWeDoPage(
  slug: string,
): Promise<WhatWeDoPageDoc | null> {
  const data = await safeFetch<WhatWeDoPageDoc>(
    whatWeDoPageBySlugQuery,
    { slug },
    { noStore: true },
  );
  if (data) return data;
  return seedWhatWeDoPages.find((p) => p.slug === slug) ?? null;
}

export async function getLocations() {
  const data = await safeFetch<{ _id: string; name: string; description?: string }[]>(
    locationsQuery,
  );
  return (
    data ?? [
      {
        _id: "loc-hq",
        name: "Makeni (Bombali) — Headquarters",
        description:
          "MADAM established its headquarters in Makeni city, Bombali District, Northern Sierra Leone, from where we coordinate actions in other project regions.",
      },
      {
        _id: "loc-north",
        name: "Bombali & Tonkolili",
        description: "Northern region project offices and field operations.",
      },
      {
        _id: "loc-east",
        name: "Kenema",
        description: "Eastern region operations.",
      },
      {
        _id: "loc-south",
        name: "Bo",
        description: "Southern region operations.",
      },
      {
        _id: "loc-nw",
        name: "Karene & Port Loko",
        description: "North Western region operations.",
      },
      {
        _id: "loc-west",
        name: "Western Rural & Western Urban",
        description: "Western Area project locations including Skills Up!",
      },
    ]
  );
}

export async function getHomepageVideos(): Promise<HomepageVideosDoc | null> {
  return safeFetch<HomepageVideosDoc>(homepageVideosQuery, {}, { noStore: true });
}
