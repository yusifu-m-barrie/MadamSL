import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { RichText } from "@/components/content/RichText";
import { PlacedImage } from "@/components/content/PlacedImage";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { PartnerCarousel } from "@/components/sections/PartnerCarousel";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { ProgramIcon, iconKindFromTitle } from "@/components/sections/ProgramIcons";
import { ContactForm } from "@/components/content/ContactForm";
import { NewsletterGrid } from "@/components/content/NewsletterGrid";
import { Reveal } from "@/components/ui/Reveal";
import { formatDate, newsPath } from "@/lib/utils";
import { Users } from "lucide-react";
import type {
  PageSection,
  PostListItem,
  ProjectListItem,
  Partner,
  StaffMember,
  Cta,
  SanityImage,
} from "@/sanity/types";
import { resolveImageSrc } from "@/sanity/lib/image";
import type { SiteImages } from "@/sanity/types/siteImages";
import { HERO_SLIDE_COPY } from "@/sanity/types/siteImages";
import {
  getLatestPosts,
  getProjects,
  getPartners,
  getStaffByTeam,
  getLocations,
  getNewsletters,
  getSiteSettings,
  getSiteImages,
  resolveSiteImage,
} from "@/lib/content";

function CtaButton({ cta }: { cta?: Cta }) {
  if (!cta?.href || !cta.label) return null;
  return (
    <Button href={cta.href} variant={cta.style || "primary"}>
      {cta.label}
    </Button>
  );
}

function pickImage(
  siteImages: SiteImages,
  direct?: SanityImage | null,
  slot?: string | null,
): SanityImage | undefined {
  if (direct?.asset) return direct;
  return resolveSiteImage(siteImages, slot) as SanityImage | undefined;
}

export async function SectionRenderer({ sections }: { sections?: PageSection[] }) {
  if (!sections?.length) return null;
  const siteImages = await getSiteImages();
  return (
    <>
      {sections.map((section, i) => (
        <SectionBlock
          key={section._key || `${section._type}-${i}`}
          section={section}
          siteImages={siteImages}
        />
      ))}
    </>
  );
}

async function SectionBlock({
  section,
  siteImages,
}: {
  section: PageSection;
  siteImages: SiteImages;
}) {
  switch (section._type) {
    case "heroSlider": {
      const pageSlides =
        (section.slides as {
          heading?: string;
          subheading?: string;
          image?: SanityImage;
        }[]) || [];
      const legacy = siteImages.heroSlides || [];
      const slides = HERO_SLIDE_COPY.map((def, i) => {
        const page = pageSlides[i];
        const named =
          i === 0
            ? siteImages.heroSlide1
            : i === 1
              ? siteImages.heroSlide2
              : siteImages.heroSlide3;
        const fromLegacy = legacy[i];
        const image = page?.image?.asset
          ? page.image
          : named?.asset
            ? named
            : fromLegacy?.image;
        return {
          heading: page?.heading || fromLegacy?.heading || def.heading,
          subheading: page?.subheading,
          image,
          imageUrl: resolveImageSrc(image, 1920, 900),
          alt: named?.alt || fromLegacy?.alt || def.heading,
          slotLabel: def.label,
        };
      });
      return <HeroSlider slides={slides} />;
    }
    case "richTextSection":
      return (
        <Section>
          <Container>
            <SectionHeading
              eyebrow={section.eyebrow as string | undefined}
              title={section.heading as string | undefined}
              align={(section.align as "left" | "center") || "left"}
            />
            <RichText value={section.body} />
            {Array.isArray(section.ctas) && section.ctas.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {(section.ctas as Cta[]).map((cta, i) => (
                  <Button
                    key={`${cta.href}-${i}`}
                    href={cta.href}
                    variant={cta.style || (i === 0 ? "primary" : "outline")}
                  >
                    {cta.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </Container>
        </Section>
      );
    case "imageText":
      return <ImageTextSection section={section} siteImages={siteImages} />;
    case "programCards":
      return <ProgramCardsSection section={section} siteImages={siteImages} />;
    case "impactCards":
      return <ImpactCardsSection section={section} siteImages={siteImages} />;
    case "projectListing": {
      const status = (section.status as "ongoing" | "past" | "all") || "ongoing";
      const limit = (section.limit as number) || 6;
      const projects = (await getProjects(status)).slice(0, limit);
      return (
        <Section className="bg-[var(--madam-surface)]">
          <Container>
            <SectionHeading title={(section.heading as string) || "Our Projects"} />
            <ProjectGrid projects={projects} />
            <div className="mt-8">
              <Button href="/projects" variant="outline">
                View all projects
              </Button>
            </div>
          </Container>
        </Section>
      );
    }
    case "staffListing": {
      const team = (section.team as StaffMember["team"]) || "administrative";
      const staff = await getStaffByTeam(team);
      return (
        <Section>
          <Container>
            <SectionHeading title={(section.heading as string) || "Our Staff"} />
            <StaffGrid staff={staff} groupByProjectTeam={Boolean(section.groupByProjectTeam)} />
          </Container>
        </Section>
      );
    }
    case "latestNews": {
      const posts = await getLatestPosts((section.limit as number) || 5);
      return (
        <Section>
          <Container>
            <SectionHeading title={(section.heading as string) || "LATEST NEWS"} />
            <NewsGrid posts={posts} />
            <div className="mt-8 text-center">
              <Button href="/news" variant="outline">
                MORE NEWS
              </Button>
            </div>
          </Container>
        </Section>
      );
    }
    case "partnerLogos": {
      const fromSite = siteImages.partnerLogos;
      const partners = fromSite?.length
        ? fromSite.map((p, i) => ({
            _id: `site-partner-${i}`,
            name: p.name || `Partner ${i + 1}`,
            logo: p.logo,
            url: p.url,
          }))
        : await getPartners();
      return (
        <Section className="bg-white">
          <Container>
            <SectionHeading
              title={(section.heading as string) || "DONORS & PARTNERS"}
              align="center"
            />
            <PartnerCarousel partners={partners} />
          </Container>
        </Section>
      );
    }
    case "testimonials":
      return <TestimonialsSection section={section} siteImages={siteImages} />;
    case "ctaBand":
      return (
        <Section className="bg-[var(--madam-green)] text-white">
          <Container className="text-center">
            {section.heading ? (
              <h2 className="text-3xl font-bold md:text-4xl">{section.heading as string}</h2>
            ) : null}
            {section.text ? (
              <p className="mx-auto mt-4 max-w-2xl text-white/90">{section.text as string}</p>
            ) : null}
            <div className="mt-8 flex justify-center">
              <CtaButton cta={section.cta as Cta | undefined} />
            </div>
          </Container>
        </Section>
      );
    case "contactInfo":
      return <ContactInfoSection section={section} />;
    case "newsletterDownloads": {
      const issues = await getNewsletters();
      return (
        <Section>
          <Container>
            <SectionHeading title={(section.heading as string) || "Download News Letter"} />
            {section.intro ? (
              <p className="mb-6 text-[var(--madam-muted)]">{section.intro as string}</p>
            ) : null}
            <NewsletterGrid issues={issues.slice(0, 6)} />
          </Container>
        </Section>
      );
    }
    case "locationsMap": {
      const locations = await getLocations();
      const showMap = section.showMap !== false;
      const showCards = Boolean(section.showLocationCards);
      const mapSrc =
        resolveImageSrc(siteImages.whereWeWorkMap, 1200, 960) ||
        "/images/sierra-leone-locations-map.jpg";
      const mapAlt =
        siteImages.whereWeWorkMap?.alt ||
        "Map of Sierra Leone showing MADAM project locations and offices";
      return (
        <Section>
          <Container className="max-w-4xl">
            {section.heading ? (
              <>
                <h2 className="text-2xl font-bold text-[var(--madam-green)] md:text-3xl">
                  {section.heading as string}
                </h2>
                <div className="mt-4 h-1.5 w-20 bg-[var(--madam-green)]" />
              </>
            ) : null}
            <div className="mt-6">
              <RichText value={section.body} />
            </div>
            {showMap ? (
              <figure className="mt-10 overflow-hidden border border-[var(--madam-border)] bg-[var(--madam-surface)] shadow-sm">
                <div className="relative mx-auto aspect-[580/460] w-full max-w-3xl">
                  <Image
                    src={mapSrc}
                    alt={mapAlt}
                    fill
                    className="object-contain p-2 md:p-4"
                    sizes="(max-width: 768px) 100vw, 768px"
                    quality={80}
                  />
                </div>
                <figcaption className="border-t border-[var(--madam-border)] px-4 py-3 text-center text-sm text-[var(--madam-muted)]">
                  {(section.mapCaption as string) ||
                    "Sierra Leone districts where MADAM operates — pins mark programme and office locations (HQ in Bombali / Makeni)."}
                </figcaption>
              </figure>
            ) : null}
            {showCards && locations.length ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {locations.map((loc) => (
                  <article
                    key={loc._id}
                    className="border-l-4 border-[var(--madam-green)] bg-[var(--madam-surface)] p-5"
                  >
                    <h3 className="text-lg font-bold text-[var(--madam-ink)]">{loc.name}</h3>
                    {loc.description ? (
                      <p className="mt-2 text-sm text-[var(--madam-muted)]">{loc.description}</p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}
          </Container>
        </Section>
      );
    }
    case "missionVision":
      return (
        <Section>
          <Container className="grid gap-10 md:grid-cols-2">
            <article className="border-t-4 border-[var(--madam-green)] bg-[var(--madam-surface)] p-8">
              <SectionHeading
                title={(section.missionHeading as string) || "OUR MISSION"}
              />
              <p className="text-base leading-relaxed text-[var(--madam-muted)] md:text-lg">
                {(section.missionText as string) || ""}
              </p>
            </article>
            <article className="border-t-4 border-[var(--madam-coral)] bg-[var(--madam-surface)] p-8">
              <SectionHeading
                title={(section.visionHeading as string) || "OUR VISION"}
              />
              <p className="text-base leading-relaxed text-[var(--madam-muted)] md:text-lg">
                {(section.visionText as string) || ""}
              </p>
            </article>
          </Container>
        </Section>
      );
    default:
      return null;
  }
}

function ImageTextSection({
  section,
  siteImages,
}: {
  section: PageSection;
  siteImages: SiteImages;
}) {
  const right = section.imagePosition === "right";
  const image = pickImage(
    siteImages,
    section.image as SanityImage | undefined,
    (section.imageSlot as string) || "aboutImage",
  );
  return (
    <Section>
      <Container>
        <div
          className={
            right
              ? "grid items-center gap-8 md:grid-cols-[1.55fr_1fr] md:gap-10"
              : "grid items-center gap-8 md:grid-cols-[1fr_1.55fr] md:gap-10"
          }
        >
          <div className={right ? "md:order-2" : ""}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <PlacedImage
                image={image}
                alt={(image as { alt?: string })?.alt || (section.heading as string) || ""}
                width={720}
                height={540}
                fill
                className="object-cover"
                slotLabel="Homepage → About MADAM image"
              />
            </div>
          </div>
          <div className={right ? "md:order-1" : ""}>
            {section.heading ? <SectionHeading title={section.heading as string} /> : null}
            <RichText value={section.body} />
            <div className="mt-6">
              <CtaButton cta={section.cta as Cta | undefined} />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ProgramCardsSection({
  section,
  siteImages,
}: {
  section: PageSection;
  siteImages: SiteImages;
}) {
  const cards =
    (section.cards as {
      title?: string;
      description?: string;
      href?: string;
      ctaLabel?: string;
    }[]) || [];

  const bg = siteImages.programsSectionBackground;
  const bgSrc = resolveImageSrc(bg, 1920, 900);

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Full-section background (one image for the whole band) */}
      {bgSrc ? (
        <Image
          src={bgSrc}
          alt={bg?.alt || "MADAM programs"}
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a3d14_0%,#14532d_50%,#052e16_100%)]" />
      )}
      <div className="absolute inset-0 bg-black/60" />

      {!bgSrc ? (
        <div className="absolute left-1/2 top-4 z-[2] -translate-x-1/2 rounded-full bg-black/40 px-4 py-2 text-center text-xs text-white/90 backdrop-blur-sm md:text-sm">
          Upload background: Studio → Website Images → Programs section — full background image
        </div>
      ) : null}

      <Container className="relative z-[1]">
        {section.heading ? (
          <h2 className="mb-14 text-center text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">
            {section.heading as string}
          </h2>
        ) : null}

        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {cards.map((card) => (
            <article key={card.title} className="flex flex-col items-center text-center">
              <ProgramIcon kind={iconKindFromTitle(card.title)} />
              <h3 className="mt-6 text-xl font-bold uppercase tracking-wide text-white md:text-2xl">
                {card.title}
              </h3>
              <p className="mt-4 max-w-md flex-1 text-base leading-relaxed text-white/90 md:text-lg">
                {card.description}
              </p>
              {card.href ? (
                <Link
                  href={card.href}
                  className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-[var(--madam-green)] transition hover:text-white"
                >
                  {card.ctaLabel || "Read More"}
                  <span aria-hidden>→</span>
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ImpactCardsSection({
  section,
  siteImages,
}: {
  section: PageSection;
  siteImages: SiteImages;
}) {
  const items =
    (section.items as {
      title?: string;
      description?: string;
      href?: string;
      image?: SanityImage;
      imageSlot?: string;
    }[]) || [];
  const slotLabels: Record<string, string> = {
    impactClimateSmart: "Our Impact → Climate Smart Agriculture",
    impactAgrotech: "Our Impact → Agro-tech Project",
    impactFoodNutrition: "Our Impact → Food and Nutrition",
    impactYtsc: "Our Impact → YTSC",
    impactGeneratingIncome: "Our Impact → Generating income",
    impactKush: "Our Impact → Kush Victims",
  };

  return (
    <Section>
      <Container>
        <SectionHeading title={(section.heading as string) || "OUR IMPACT"} align="center" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const image = pickImage(siteImages, item.image, item.imageSlot);
            return (
              <article key={item.title} className="group text-center">
                <div className="relative mx-auto mb-5 aspect-square max-w-[280px] overflow-hidden rounded-full">
                  <PlacedImage
                    image={image}
                    alt={item.title || ""}
                    width={560}
                    height={560}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    slotLabel={
                      item.imageSlot ? slotLabels[item.imageSlot] : "Impact image"
                    }
                  />
                </div>
                <h3 className="text-2xl font-bold text-[var(--madam-ink)]">{item.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-[var(--madam-muted)] md:text-lg">
                  {item.description}
                </p>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-4 inline-block text-base font-semibold text-[var(--madam-green)]"
                  >
                    Learn more
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
        {(section.ctaHref as string) ? (
          <div className="mt-12 text-center">
            <Button href={section.ctaHref as string} variant="primary">
              {(section.ctaLabel as string) || "SEE MORE ABOUT OUR PROJECTS"}
            </Button>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

function TestimonialsSection({
  section,
  siteImages,
}: {
  section: PageSection;
  siteImages: SiteImages;
}) {
  const raw =
    (section.items as {
      quote?: string;
      name?: string;
      role?: string;
      image?: SanityImage;
    }[]) || [];

  const items = raw
    .filter((item) => item.quote && item.name)
    .map((item) => ({
      quote: item.quote as string,
      name: item.name as string,
      role: item.role,
      imageUrl: resolveImageSrc(item.image, 128, 128),
    }));

  const sectionBg = section.backgroundImage as SanityImage | undefined;
  const backgroundUrl =
    resolveImageSrc(sectionBg, 1920, 900) ||
    resolveImageSrc(siteImages.testimonialsBackground, 1920, 900);

  return (
    <TestimonialsSlider
      heading={(section.heading as string) || "Testimonials"}
      items={items}
      backgroundUrl={backgroundUrl}
    />
  );
}

async function ContactInfoSection({ section }: { section: PageSection }) {
  const settings = await getSiteSettings();
  return (
    <Section>
      <Container>
        <SectionHeading title={(section.heading as string) || "Contact Us"} />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <InfoCard label="Address" value={settings.address || ""} />
            <InfoCard
              label="Phone"
              value={settings.phone || ""}
              href={settings.phone ? `tel:${settings.phone.replace(/\s/g, "")}` : undefined}
            />
            <InfoCard
              label="Email"
              value={settings.email || ""}
              href={settings.email ? `mailto:${settings.email}` : undefined}
            />
          </div>
          {section.showForm !== false ? <ContactForm /> : null}
        </div>
      </Container>
    </Section>
  );
}

function InfoCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="border-t-4 border-[var(--madam-green)] bg-[var(--madam-surface)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--madam-coral)]">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          className="mt-2 block font-medium text-[var(--madam-ink)] hover:text-[var(--madam-green)]"
        >
          {value}
        </a>
      ) : (
        <p className="mt-2 font-medium text-[var(--madam-ink)]">{value}</p>
      )}
    </div>
  );
}

export function ProjectGrid({ projects }: { projects: ProjectListItem[] }) {
  if (!projects.length) {
    return <p className="text-[var(--madam-muted)]">No projects published yet.</p>;
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => {
        const imageSrc = resolveImageSrc(project.featuredImage, 640, 400);
        return (
          <Reveal key={project._id} delayMs={Math.min(i * 40, 200)} as="article">
            <article className="card-interactive group/card flex h-full flex-col overflow-hidden bg-[var(--madam-card)] shadow-md">
              <Link
                href={`/projects/${project.slug}`}
                className="relative block aspect-[16/11] overflow-hidden bg-[var(--madam-surface)]"
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={project.title}
                    fill
                    className="img-zoom object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={72}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[var(--madam-green)]/10 text-sm text-[var(--madam-muted)]">
                    Photo coming soon
                  </div>
                )}
              </Link>
              <div className="flex flex-1 flex-col px-5 py-6 text-center">
                <h3 className="text-base font-bold leading-snug text-[var(--madam-ink)] md:text-lg">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="transition hover:text-[var(--madam-green)]"
                  >
                    {project.title}
                  </Link>
                </h3>
                {project.summary ? (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--madam-muted)] line-clamp-4 md:text-[15px]">
                    {project.summary}
                  </p>
                ) : null}
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

export function NewsGrid({ posts }: { posts: PostListItem[] }) {
  if (!posts.length) return <p className="text-[var(--madam-muted)]">No news posts yet.</p>;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => {
        const imgSrc = resolveImageSrc(post.mainImage as SanityImage | undefined, 640, 400);
        return (
          <Reveal key={post._id} delayMs={Math.min(i * 40, 160)} as="article">
            <article className="card-interactive flex h-full flex-col overflow-hidden border-b-4 border-[var(--madam-green)] bg-[var(--madam-card)] shadow-sm">
              <Link href={newsPath(post.slug)} className="relative block aspect-[16/10] bg-[var(--madam-surface)]">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={72}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[var(--madam-muted)]">
                    Photo coming soon
                  </div>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <time className="text-xs font-semibold uppercase tracking-wide text-[var(--madam-coral)]">
                  {formatDate(post.publishedAt)}
                </time>
                <h3 className="mt-2 text-xl font-bold text-[var(--madam-ink)] md:text-2xl">
                  <Link
                    href={newsPath(post.slug)}
                    className="transition hover:text-[var(--madam-green)]"
                  >
                    {post.title || "Untitled update"}
                  </Link>
                </h3>
                {post.excerpt ? (
                  <p className="mt-3 text-base text-[var(--madam-muted)] line-clamp-3 md:text-lg">
                    {post.excerpt}
                  </p>
                ) : null}
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

export function StaffGrid({
  staff,
  groupByProjectTeam = false,
}: {
  staff: StaffMember[];
  groupByProjectTeam?: boolean;
}) {
  if (!staff.length) return <p className="text-[var(--madam-muted)]">No staff listed.</p>;

  if (groupByProjectTeam) {
    const groups = staff.reduce<Record<string, StaffMember[]>>((acc, member) => {
      const key = member.projectTeam || "Team";
      acc[key] = acc[key] || [];
      acc[key].push(member);
      return acc;
    }, {});
    return (
      <div className="space-y-12">
        {Object.entries(groups).map(([group, members]) => (
          <div key={group}>
            <h3 className="mb-6 text-xl font-bold text-[var(--madam-green)]">{group}</h3>
            <StaffCards members={members} />
          </div>
        ))}
      </div>
    );
  }

  return <StaffCards members={staff} />;
}

function StaffCards({ members }: { members: StaffMember[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member, i) => (
        <Reveal key={member._id} delayMs={Math.min(i * 35, 210)} as="article">
          <article className="card-interactive group/card border border-[var(--madam-border)] bg-[var(--madam-surface)] p-5 text-center">
            <div className="relative mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full bg-[var(--madam-green)]/15 ring-2 ring-[var(--madam-green)]/20 transition group-hover/card:ring-[var(--madam-green)]/50">
              {member.photo?.asset ? (
                <PlacedImage
                  image={member.photo}
                  alt={member.name}
                  width={288}
                  height={288}
                  fill
                  className="img-zoom object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1 text-[var(--madam-green)]">
                  <Users className="h-8 w-8 opacity-70" aria-hidden />
                  <span className="text-lg font-bold">
                    {member.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-bold text-[var(--madam-ink)]">{member.name}</h3>
            <p className="mt-1 text-sm text-[var(--madam-coral)]">{member.position}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

