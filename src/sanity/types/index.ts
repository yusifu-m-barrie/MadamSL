export type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  noIndex?: boolean;
};

export type SanityImage = {
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string;
  };
  alt?: string;
  hotspot?: { x: number; y: number };
};

export type Cta = {
  label: string;
  href: string;
  style?: "primary" | "secondary" | "outline";
};

export type NavChild = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};
export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export type SiteSettings = {
  siteName?: string;
  tagline?: string;
  logo?: SanityImage;
  address?: string;
  phone?: string;
  email?: string;
  mapEmbedUrl?: string;
  socialLinks?: { network?: string; url?: string }[];
  copyright?: string;
  supportCtaLabel?: string;
  supportCtaHref?: string;
  defaultSeo?: SeoFields;
};

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: SanityImage;
  publishedAt?: string;
  categories?: { title?: string; slug?: string }[];
};

export type ProjectListItem = {
  _id: string;
  title: string;
  slug: string;
  status: "ongoing" | "past";
  summary?: string;
  /** Full plain-text body used by seed / fallback when Portable Text body is absent */
  bodyText?: string;
  featuredImage?: SanityImage;
  gallery?: (SanityImage & { alt?: string; caption?: string })[];
  locations?: string[];
  partners?: string[];
  donors?: string[];
  startDate?: string;
  endDate?: string;
  body?: unknown;
};

export type StaffMember = {
  _id: string;
  name: string;
  position: string;
  team: "administrative" | "projects" | "youthTraining";
  projectTeam?: string;
  photo?: SanityImage;
  bio?: string;
  email?: string;
};

export type Partner = {
  _id: string;
  name: string;
  logo?: SanityImage;
  url?: string;
};

export type NewsletterIssue = {
  _id: string;
  title: string;
  date?: string;
  fileUrl?: string;
  coverImage?: SanityImage;
};

export type PageSection = {
  _type: string;
  _key?: string;
  [key: string]: unknown;
};

export type PageDocument = {
  _id: string;
  title: string;
  slug: string;
  heroSubtitle?: string;
  showHero?: boolean;
  sections?: PageSection[];
  seo?: SeoFields;
};
