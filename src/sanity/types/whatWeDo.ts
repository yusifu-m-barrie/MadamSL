import type { SanityImage } from "@/sanity/types";

export type WhatWeDoGalleryItem = {
  _key?: string;
  image?: SanityImage;
  caption?: string;
  alt?: string;
};

export type WhatWeDoSection = {
  _key?: string;
  heading?: string;
  body?: unknown;
  contactHeading?: string;
  highlight?: string;
  gallery?: WhatWeDoGalleryItem[];
};

export type WhatWeDoPageDoc = {
  _id: string;
  title: string;
  slug: string;
  heading: string;
  intro?: unknown;
  sideImage?: SanityImage & { alt?: string };
  body?: unknown;
  ctaLabel?: string;
  ctaHref?: string;
  sections?: WhatWeDoSection[];
  showPartnerLogos?: boolean;
  partnerLogos?: { name?: string; logo?: SanityImage }[];
};
