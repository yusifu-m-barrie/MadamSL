import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { WhatWeDoText } from "@/components/content/WhatWeDoText";
import {
  PartnerCarousel,
  type PartnerSlide,
} from "@/components/sections/PartnerCarousel";
import { resolveImageSrc } from "@/sanity/lib/image";
import type { WhatWeDoPageDoc } from "@/sanity/types/whatWeDo";

function ContactList({
  heading,
  phone,
  email,
}: {
  heading: string;
  phone: string;
  email: string;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-base font-bold text-[var(--madam-ink)] md:text-lg">
        {heading}
      </p>
      <ul className="list-disc space-y-1 pl-6 text-base text-[var(--madam-ink)] md:text-lg">
        <li>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="font-semibold hover:text-[var(--madam-green)]"
          >
            {phone}
          </a>
        </li>
        <li>
          <a
            href={`mailto:${email}`}
            className="font-semibold hover:text-[var(--madam-green)]"
          >
            {email}
          </a>
        </li>
      </ul>
    </div>
  );
}

export function WhatWeDoPageView({
  page,
  phone = "+232 76 687091",
  email = "info@madam-sl.org",
  fallbackPartners = [],
}: {
  page: WhatWeDoPageDoc;
  phone?: string;
  email?: string;
  fallbackPartners?: PartnerSlide[];
}) {
  const sideSrc = resolveImageSrc(page.sideImage, 900, 600);
  const partnerSlides: PartnerSlide[] =
    page.partnerLogos?.length
      ? page.partnerLogos.map((p, i) => ({
          _id: `wwd-logo-${i}`,
          name: p.name || `Partner ${i + 1}`,
          logo: p.logo,
        }))
      : fallbackPartners;

  return (
    <>
      <PageHero title={page.title} />
      <Section>
        <Container className="max-w-5xl">
          <h2 className="mb-6 text-2xl font-bold text-[var(--madam-green)] md:text-3xl">
            {page.heading}
          </h2>

          {(Array.isArray(page.intro) && page.intro.length > 0) ||
          sideSrc ||
          page.showPartnerLogos ? (
            <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
              <div>
                <WhatWeDoText value={page.intro} />
              </div>
              <div>
                {page.showPartnerLogos ? (
                  partnerSlides.length ? (
                    <PartnerCarousel partners={partnerSlides} />
                  ) : (
                    <div className="flex min-h-[100px] items-center justify-center border border-[var(--madam-border)] bg-[var(--madam-surface)] text-sm text-[var(--madam-muted)]">
                      Add partner logos in Studio → What We Do
                    </div>
                  )
                ) : sideSrc ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--madam-surface)] lg:min-h-[240px]">
                    <Image
                      src={sideSrc}
                      alt={page.sideImage?.alt || page.heading}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      quality={75}
                      priority
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {Array.isArray(page.body) && page.body.length > 0 ? (
            <div className="mt-6 max-w-3xl">
              <WhatWeDoText value={page.body} />
            </div>
          ) : null}

          {page.ctaLabel ? (
            <div className="mt-6">
              <Link
                href={page.ctaHref || "/projects"}
                className="inline-flex items-center gap-3 rounded-md bg-[var(--madam-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--madam-green-dark)] md:text-base"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/90">
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
                {page.ctaLabel}
              </Link>
            </div>
          ) : null}

          {page.sections?.map((section, idx) => (
            <div key={section._key || idx} className="mt-12">
              {section.heading ? (
                <h2 className="mb-4 text-2xl font-bold text-[var(--madam-green)] md:text-3xl">
                  {section.heading}
                </h2>
              ) : null}
              <div className="max-w-3xl">
                <WhatWeDoText value={section.body} />
              </div>
              {section.contactHeading ? (
                <ContactList
                  heading={section.contactHeading}
                  phone={phone}
                  email={email}
                />
              ) : null}
              {section.highlight ? (
                <p className="mt-8 text-center text-xl font-bold text-[var(--madam-green)] md:text-2xl">
                  {section.highlight}
                </p>
              ) : null}
              {section.gallery?.length ? (
                <div
                  className={`mt-6 grid gap-6 ${
                    section.gallery.length === 1
                      ? "max-w-3xl"
                      : "sm:grid-cols-2"
                  }`}
                >
                  {section.gallery.map((item, gIdx) => {
                    const src = resolveImageSrc(item.image, 900, 600);
                    if (!src) return null;
                    return (
                      <figure key={item._key || gIdx}>
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--madam-surface)]">
                          <Image
                            src={src}
                            alt={item.alt || item.caption || section.heading || ""}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={75}
                          />
                        </div>
                        {item.caption ? (
                          <figcaption className="mt-2 text-center text-base font-bold text-[var(--madam-green)] md:text-lg">
                            {item.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ))}
        </Container>
      </Section>
    </>
  );
}
