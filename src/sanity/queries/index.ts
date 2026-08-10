import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  siteName,
  tagline,
  logo,
  address,
  phone,
  email,
  mapEmbedUrl,
  socialLinks,
  copyright,
  supportCtaLabel,
  supportCtaHref,
  defaultSeo
}`;

export const siteImagesQuery = groq`*[_type == "siteImages"][0]{
  logo{ ..., asset->{ _id, url } },
  favicon{ ..., asset->{ _id, url } },
  heroSlide1{ ..., asset->{ _id, url } },
  heroSlide2{ ..., asset->{ _id, url } },
  heroSlide3{ ..., asset->{ _id, url } },
  heroSlides[]{ heading, alt, image{ ..., asset->{ _id, url } } },
  aboutImage{ ..., asset->{ _id, url } },
  programsSectionBackground{ ..., asset->{ _id, url } },
  programAgriculture{ ..., asset->{ _id, url } },
  programSkills{ ..., asset->{ _id, url } },
  programIncome{ ..., asset->{ _id, url } },
  impactClimateSmart{ ..., asset->{ _id, url } },
  impactAgrotech{ ..., asset->{ _id, url } },
  impactFoodNutrition{ ..., asset->{ _id, url } },
  impactYtsc{ ..., asset->{ _id, url } },
  impactGeneratingIncome{ ..., asset->{ _id, url } },
  impactKush{ ..., asset->{ _id, url } },
  partnerLogos[]{ name, url, logo{ ..., asset->{ _id, url } } },
  testimonialsBackground{ ..., asset->{ _id, url } },
  whereWeWorkMap{ ..., asset->{ _id, url } },
  whatWeDoAgriculture{ ..., asset->{ _id, url } },
  whatWeDoSkills{ ..., asset->{ _id, url } },
  whatWeDoIncomeIntro{ ..., asset->{ _id, url } },
  whatWeDoIncomeGuestroom{ ..., asset->{ _id, url } },
  whatWeDoIncomeRestaurant{ ..., asset->{ _id, url } },
  whatWeDoIncomeHall1{ ..., asset->{ _id, url } },
  whatWeDoIncomeHall2{ ..., asset->{ _id, url } },
  whatWeDoIncomeGarage{ ..., asset->{ _id, url } },
  whatWeDoNetworkLogos[]{ name, logo{ ..., asset->{ _id, url } } },
  defaultPageHero{ ..., asset->{ _id, url } }
}`;

export const navigationQuery = groq`*[_type == "navigation"][0]{
  items[]{ label, href, children[]{ label, href, children[]{ label, href } } }
}`;

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  heroSubtitle,
  showHero,
  sections[]{
    ...,
    _type == "imageText" => { ..., image },
    _type == "heroSlider" => { ..., slides[]{ ..., image } },
    _type == "programCards" => { ..., cards[]{ ..., image } },
    _type == "testimonials" => { ..., backgroundImage, items[]{ ..., image } },
    _type == "gallery" => { ..., images }
  },
  seo
}`;

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  mainImage{ ..., asset->{ _id, url } },
  publishedAt,
  categories[]->{ title, "slug": slug.current }
}`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  mainImage{ ..., asset->{ _id, url } },
  body[]{
    ...,
    _type == "image" => { ..., asset->{ _id, url } }
  },
  publishedAt,
  author->{ name, image },
  categories[]->{ title, "slug": slug.current },
  seo
}`;

export const latestPostsQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  mainImage{ ..., asset->{ _id, url } },
  publishedAt
}`;

export const projectsQuery = groq`*[_type == "project" && ($status == "all" || status == $status)] | order(sortOrder asc, title asc){
  _id,
  title,
  "slug": slug.current,
  status,
  summary,
  featuredImage{ ..., asset->{ _id, url } },
  locations
}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  status,
  summary,
  body,
  featuredImage{ ..., asset->{ _id, url } },
  gallery[]{ ..., asset->{ _id, url }, alt, caption },
  startDate,
  endDate,
  locations,
  partners,
  donors,
  seo
}`;

export const staffByTeamQuery = groq`*[_type == "staffMember" && active != false && team == $team] | order(sortOrder asc, name asc){
  _id,
  name,
  position,
  team,
  projectTeam,
  photo{ ..., asset->{ _id, url } },
  bio,
  email
}`;

export const partnersQuery = groq`*[_type == "partner"] | order(sortOrder asc){
  _id,
  name,
  logo,
  url
}`;

export const newslettersQuery = groq`*[_type == "newsletterIssue"] | order(date desc, sortOrder asc){
  _id,
  title,
  date,
  "fileUrl": file.asset->url,
  coverImage{ ..., asset->{ _id, url } }
}`;

export const locationsQuery = groq`*[_type == "location"] | order(sortOrder asc){
  _id,
  name,
  description
}`;

export const allPageSlugsQuery = groq`*[_type == "page" && defined(slug.current)]{ "slug": slug.current }`;
export const allPostSlugsQuery = groq`*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`;
export const allProjectSlugsQuery = groq`*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`;

export const whatWeDoPageBySlugQuery = groq`*[_type == "whatWeDoPage" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  heading,
  intro,
  sideImage{ ..., asset->{ _id, url } },
  body,
  ctaLabel,
  ctaHref,
  sections[]{
    _key,
    heading,
    body,
    contactHeading,
    highlight,
    gallery[]{
      _key,
      caption,
      alt,
      image{ ..., asset->{ _id, url } }
    }
  },
  showPartnerLogos,
  partnerLogos[]{ name, logo{ ..., asset->{ _id, url } } }
}`;

export const homepageVideosQuery = groq`*[_type == "homepageVideos"][0]{
  heading,
  videos[]{
    _key,
    title,
    sourceType,
    youtubeUrl,
    externalUrl,
    "fileUrl": file.asset->url,
    "posterUrl": poster.asset->url
  }
}`;
