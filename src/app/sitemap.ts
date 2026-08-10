import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.madam-sl.org";

const staticRoutes = [
  "/",
  "/about",
  "/mission-vision",
  "/core-values",
  "/diversity-equity-inclusion",
  "/our-staff",
  "/our-projects-staff",
  "/youth-training-center-staff",
  "/what-we-do/agriculture",
  "/what-we-do/skills-development",
  "/what-we-do/generating-income",
  "/what-we-do/network",
  "/projects",
  "/projects/ongoing",
  "/projects/past",
  "/where-we-work",
  "/news",
  "/news-letter",
  "/contact",
  "/support-us",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects("all")]);

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${base}/news/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
