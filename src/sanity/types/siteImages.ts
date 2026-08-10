import type { SanityImage } from "@/sanity/types";

/** Labeled image slots matching placements on madam-sl.org */
export type SiteImages = {
  logo?: SanityImage & { alt?: string };
  favicon?: SanityImage;
  /** Preferred: three fixed hero slots */
  heroSlide1?: SanityImage & { alt?: string };
  heroSlide2?: SanityImage & { alt?: string };
  heroSlide3?: SanityImage & { alt?: string };
  /** Legacy array (optional) */
  heroSlides?: { image?: SanityImage; alt?: string; heading?: string }[];
  aboutImage?: SanityImage & { alt?: string };
  /** Full-bleed background behind Agriculture / Skills / Income columns */
  programsSectionBackground?: SanityImage & { alt?: string };
  programAgriculture?: SanityImage & { alt?: string };
  programSkills?: SanityImage & { alt?: string };
  programIncome?: SanityImage & { alt?: string };
  impactClimateSmart?: SanityImage & { alt?: string };
  impactAgrotech?: SanityImage & { alt?: string };
  impactFoodNutrition?: SanityImage & { alt?: string };
  impactYtsc?: SanityImage & { alt?: string };
  impactGeneratingIncome?: SanityImage & { alt?: string };
  impactKush?: SanityImage & { alt?: string };
  partnerLogos?: { name?: string; logo?: SanityImage; url?: string }[];
  /** Full-bleed background behind About page Testimonials slider */
  testimonialsBackground?: SanityImage & { alt?: string };
  /** Sierra Leone district map with MADAM pins */
  whereWeWorkMap?: SanityImage & { alt?: string };
  /** MADAM & Agriculture page side photo */
  whatWeDoAgriculture?: SanityImage & { alt?: string };
  whatWeDoSkills?: SanityImage & { alt?: string };
  whatWeDoIncomeIntro?: SanityImage & { alt?: string };
  whatWeDoIncomeGuestroom?: SanityImage & { alt?: string };
  whatWeDoIncomeRestaurant?: SanityImage & { alt?: string };
  whatWeDoIncomeHall1?: SanityImage & { alt?: string };
  whatWeDoIncomeHall2?: SanityImage & { alt?: string };
  whatWeDoIncomeGarage?: SanityImage & { alt?: string };
  whatWeDoNetworkLogos?: { name?: string; logo?: SanityImage }[];
  defaultPageHero?: SanityImage & { alt?: string };
};

export type SiteImageSlot = keyof Omit<
  SiteImages,
  | "heroSlides"
  | "partnerLogos"
  | "whatWeDoNetworkLogos"
  | "heroSlide1"
  | "heroSlide2"
  | "heroSlide3"
>;

/** Exact three hero captions from the live MADAM homepage */
export const HERO_SLIDE_COPY = [
  {
    heading: "Helping People to help themselves",
    slot: "heroSlide1" as const,
    label: "Hero slide 1",
  },
  {
    heading: "PROMOTING CLIMATE SMART AGRICULTURE",
    slot: "heroSlide2" as const,
    label: "Hero slide 2",
  },
  {
    heading: "Helping People to help themselves",
    slot: "heroSlide3" as const,
    label: "Hero slide 3",
  },
] as const;
