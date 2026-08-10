import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "www.madam-sl.org" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
  async redirects() {
    return [
      // WordPress index.php prefix → clean paths
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php/",
        destination: "/",
        permanent: true,
      },
      // What We Do — fix localhost import slugs
      {
        source: "/index.php/http-localhost-madam-madam-agriculture-2",
        destination: "/what-we-do/agriculture",
        permanent: true,
      },
      {
        source: "/index.php/http-localhost-madam-madam-agriculture-2/",
        destination: "/what-we-do/agriculture",
        permanent: true,
      },
      {
        source: "/index.php/http-localhost-madam-madam-agriculture",
        destination: "/what-we-do/agriculture",
        permanent: true,
      },
      {
        source: "/index.php/http-localhost-madam-madam-agriculture/",
        destination: "/what-we-do/agriculture",
        permanent: true,
      },
      {
        source: "/index.php/http-localhost-madam-madam-skills-development",
        destination: "/what-we-do/skills-development",
        permanent: true,
      },
      {
        source: "/index.php/http-localhost-madam-madam-skills-development/",
        destination: "/what-we-do/skills-development",
        permanent: true,
      },
      {
        source: "/index.php/http-localhost-madam-madam-generating-income",
        destination: "/what-we-do/generating-income",
        permanent: true,
      },
      {
        source: "/index.php/http-localhost-madam-madam-generating-income/",
        destination: "/what-we-do/generating-income",
        permanent: true,
      },
      {
        source: "/index.php/http-localhost-madam-madam-as-part-of-an-inter-national-network",
        destination: "/what-we-do/network",
        permanent: true,
      },
      {
        source: "/index.php/http-localhost-madam-madam-as-part-of-an-inter-national-network/",
        destination: "/what-we-do/network",
        permanent: true,
      },
      // Projects
      {
        source: "/index.php/causes",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/index.php/causes/",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/index.php/causes-2",
        destination: "/projects/ongoing",
        permanent: true,
      },
      {
        source: "/index.php/causes-2/",
        destination: "/projects/ongoing",
        permanent: true,
      },
      {
        source: "/index.php/past",
        destination: "/projects/past",
        permanent: true,
      },
      {
        source: "/index.php/past/",
        destination: "/projects/past",
        permanent: true,
      },
      {
        source: "/index.php/cause-category/ongoing",
        destination: "/projects/ongoing",
        permanent: true,
      },
      {
        source: "/index.php/cause-category/ongoing/",
        destination: "/projects/ongoing",
        permanent: true,
      },
      {
        source: "/index.php/cause-category/past",
        destination: "/projects/past",
        permanent: true,
      },
      {
        source: "/index.php/cause-category/past/",
        destination: "/projects/past",
        permanent: true,
      },
      {
        source: "/index.php/cause-category/past-projects",
        destination: "/projects/past",
        permanent: true,
      },
      {
        source: "/index.php/cause-category/past-projects/",
        destination: "/projects/past",
        permanent: true,
      },
      // Individual project (cause) pages → clean project slugs
      {
        source:
          "/index.php/cause/classroom-to-commerce-empowering-youth-employability-and-entrepreneurship",
        destination:
          "/projects/classroom-to-commerce-empowering-youth-employability-and-entrepreneurship",
        permanent: true,
      },
      {
        source:
          "/index.php/cause/classroom-to-commerce-empowering-youth-employability-and-entrepreneurship/",
        destination:
          "/projects/classroom-to-commerce-empowering-youth-employability-and-entrepreneurship",
        permanent: true,
      },
      {
        source:
          "/index.php/cause/psave-project-promoting-sustainable-agriculture-and-vocational-education",
        destination:
          "/projects/psave-project-promoting-sustainable-agriculture-and-vocational-education",
        permanent: true,
      },
      {
        source:
          "/index.php/cause/psave-project-promoting-sustainable-agriculture-and-vocational-education/",
        destination:
          "/projects/psave-project-promoting-sustainable-agriculture-and-vocational-education",
        permanent: true,
      },
      {
        source:
          "/index.php/cause/psave-project-promoting-sustainable-agriculture-and-vocational-education-2",
        destination:
          "/projects/psave-project-promoting-sustainable-agriculture-and-vocational-education-2",
        permanent: true,
      },
      {
        source:
          "/index.php/cause/psave-project-promoting-sustainable-agriculture-and-vocational-education-2/",
        destination:
          "/projects/psave-project-promoting-sustainable-agriculture-and-vocational-education-2",
        permanent: true,
      },
      {
        source:
          "/index.php/cause/psufons-project-promoting-sustainable-food-and-nutrition-security",
        destination:
          "/projects/psufons-project-promoting-sustainable-food-and-nutrition-security",
        permanent: true,
      },
      {
        source:
          "/index.php/cause/psufons-project-promoting-sustainable-food-and-nutrition-security/",
        destination:
          "/projects/psufons-project-promoting-sustainable-food-and-nutrition-security",
        permanent: true,
      },
      {
        source: "/index.php/cause/skills-up-project-overview",
        destination: "/projects/skills-up-project-overview",
        permanent: true,
      },
      {
        source: "/index.php/cause/skills-up-project-overview/",
        destination: "/projects/skills-up-project-overview",
        permanent: true,
      },
      {
        source: "/index.php/cause/youth-training-and-service-centre-ytsc",
        destination: "/projects/youth-training-and-service-centre-ytsc",
        permanent: true,
      },
      {
        source: "/index.php/cause/youth-training-and-service-centre-ytsc/",
        destination: "/projects/youth-training-and-service-centre-ytsc",
        permanent: true,
      },
      {
        source: "/index.php/cause/addiction-and-kush",
        destination: "/projects/addiction-and-kush",
        permanent: true,
      },
      {
        source: "/index.php/cause/addiction-and-kush/",
        destination: "/projects/addiction-and-kush",
        permanent: true,
      },
      {
        source: "/index.php/cause/agro-tech-project",
        destination: "/projects/agro-tech-project",
        permanent: true,
      },
      {
        source: "/index.php/cause/agro-tech-project/",
        destination: "/projects/agro-tech-project",
        permanent: true,
      },
      {
        source: "/index.php/cause/profons-project",
        destination: "/projects/profons-project",
        permanent: true,
      },
      {
        source: "/index.php/cause/profons-project/",
        destination: "/projects/profons-project",
        permanent: true,
      },
      {
        source:
          "/index.php/cause/encompase-alternative-education-for-marginalised-youth",
        destination:
          "/projects/encompase-alternative-education-for-marginalised-youth",
        permanent: true,
      },
      {
        source:
          "/index.php/cause/encompase-alternative-education-for-marginalised-youth/",
        destination:
          "/projects/encompase-alternative-education-for-marginalised-youth",
        permanent: true,
      },
      {
        source: "/index.php/cause/returnee-migrants",
        destination: "/projects/returnee-migrants",
        permanent: true,
      },
      {
        source: "/index.php/cause/returnee-migrants/",
        destination: "/projects/returnee-migrants",
        permanent: true,
      },
      // Core pages
      {
        source: "/index.php/about",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/index.php/about/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/index.php/mission-vision",
        destination: "/mission-vision",
        permanent: true,
      },
      {
        source: "/index.php/mission-vision/",
        destination: "/mission-vision",
        permanent: true,
      },
      {
        source: "/index.php/core-values",
        destination: "/core-values",
        permanent: true,
      },
      {
        source: "/index.php/core-values/",
        destination: "/core-values",
        permanent: true,
      },
      {
        source: "/index.php/diversity-equity-inclusion",
        destination: "/diversity-equity-inclusion",
        permanent: true,
      },
      {
        source: "/index.php/diversity-equity-inclusion/",
        destination: "/diversity-equity-inclusion",
        permanent: true,
      },
      {
        source: "/index.php/our-staff",
        destination: "/our-staff",
        permanent: true,
      },
      {
        source: "/index.php/our-staff/",
        destination: "/our-staff",
        permanent: true,
      },
      {
        source: "/index.php/our-projects-staff",
        destination: "/our-projects-staff",
        permanent: true,
      },
      {
        source: "/index.php/our-projects-staff/",
        destination: "/our-projects-staff",
        permanent: true,
      },
      {
        source: "/index.php/youth-training-center-staff",
        destination: "/youth-training-center-staff",
        permanent: true,
      },
      {
        source: "/index.php/youth-training-center-staff/",
        destination: "/youth-training-center-staff",
        permanent: true,
      },
      {
        source: "/index.php/where-we-work",
        destination: "/where-we-work",
        permanent: true,
      },
      {
        source: "/index.php/where-we-work/",
        destination: "/where-we-work",
        permanent: true,
      },
      {
        source: "/index.php/contact",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/index.php/contact/",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/index.php/support-us",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/support-us/",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/news",
        destination: "/news",
        permanent: true,
      },
      {
        source: "/index.php/news/",
        destination: "/news",
        permanent: true,
      },
      {
        source: "/index.php/news-letter",
        destination: "/news-letter",
        permanent: true,
      },
      {
        source: "/index.php/news-letter/",
        destination: "/news-letter",
        permanent: true,
      },
      // Donation / GiveWP → Support Us
      {
        source: "/index.php/donation",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donation/",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donation-history",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donation-history/",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donation-confirmation",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donation-confirmation/",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donation-confirmation-2",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donation-confirmation-2/",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donation-failed",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donation-failed/",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donation-failed-2",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donation-failed-2/",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donor-dashboard",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donor-dashboard/",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donor-dashboard-2",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/donor-dashboard-2/",
        destination: "/support-us",
        permanent: true,
      },
      {
        source: "/index.php/sample-page",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php/sample-page/",
        destination: "/",
        permanent: true,
      },
      // Dated news posts → /news/[slug]
      {
        source: "/index.php/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug",
        destination: "/news/:slug",
        permanent: true,
      },
      {
        source: "/index.php/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/",
        destination: "/news/:slug",
        permanent: true,
      },
      // Generic remaining index.php pages
      {
        source: "/index.php/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
