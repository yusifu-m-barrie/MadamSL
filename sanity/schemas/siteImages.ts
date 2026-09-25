import { defineType, defineField } from "sanity";

/**
 * Singleton: upload images by where they appear on the live MADAM site.
 * Editors do not need to hunt through page builders — each field is labeled by location.
 */
export const siteImages = defineType({
  name: "siteImages",
  title: "Website Images",
  type: "document",
  liveEdit: true,
  fields: [
    defineField({
      name: "note",
      type: "string",
      title: "Instructions",
      readOnly: true,
      initialValue:
        "Upload images for each labeled location. Changes appear on the public site after publish.",
    }),

    // —— Global ——
    defineField({
      name: "logo",
      title: "Header / Footer logo",
      type: "image",
      options: { hotspot: true },
      description: "Main MADAM logo shown in the header (and footer if set).",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "favicon",
      title: "Browser favicon",
      type: "image",
    }),

    // —— Homepage hero (exactly 3 slides, matching live site copy) ——
    defineField({
      name: "heroSlide1",
      title: "Homepage → Hero slide 1 image",
      type: "image",
      options: { hotspot: true },
      description: 'Background for: "Helping People to help themselves"',
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "heroSlide2",
      title: "Homepage → Hero slide 2 image",
      type: "image",
      options: { hotspot: true },
      description: 'Background for: "PROMOTING CLIMATE SMART AGRICULTURE"',
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "heroSlide3",
      title: "Homepage → Hero slide 3 image",
      type: "image",
      options: { hotspot: true },
      description: 'Background for: "Helping People to help themselves" (third slide)',
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "heroSlides",
      title: "Homepage → Hero slides (legacy list)",
      type: "array",
      hidden: true,
      description: "Deprecated — use Hero slide 1 / 2 / 3 fields above.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({ name: "alt", type: "string", title: "Alt text" }),
            defineField({ name: "heading", type: "string" }),
          ],
        },
      ],
    }),

    // —— Homepage about ——
    defineField({
      name: "aboutImage",
      title: "Homepage → About MADAM image",
      type: "image",
      options: { hotspot: true },
      description: "Photo beside the ABOUT MADAM intro text.",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),

    // —— Homepage programs band (one full-width background) ——
    defineField({
      name: "programsSectionBackground",
      title: "Homepage → Programs section — full background image",
      type: "image",
      options: { hotspot: true },
      description:
        "ONE background photo behind Agriculture / Skills / Income columns (matches the live MADAM homepage). Publish after upload.",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    // Legacy per-card images (no longer used for layout; kept so existing uploads are not lost)
    defineField({
      name: "programAgriculture",
      title: "Homepage → MADAM & Agriculture — (unused legacy)",
      type: "image",
      hidden: true,
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "programSkills",
      title: "Homepage → Youth Skills Development — (unused legacy)",
      type: "image",
      hidden: true,
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "programIncome",
      title: "Homepage → Generating Income — (unused legacy)",
      type: "image",
      hidden: true,
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),

    // —— Homepage OUR IMPACT (6) ——
    defineField({
      name: "impactClimateSmart",
      title: "Homepage → Our Impact → Climate Smart Agriculture",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "impactAgrotech",
      title: "Homepage → Our Impact → Agro-tech Project",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "impactFoodNutrition",
      title: "Homepage → Our Impact → Promoting Sustainable Food and Nutrition",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "impactYtsc",
      title: "Homepage → Our Impact → Youth Training and Service Centre",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "impactGeneratingIncome",
      title: "Homepage → Our Impact → Generating income",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "impactKush",
      title: "Homepage → Our Impact → Kush Victims",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),

    // —— Partners ——
    defineField({
      name: "partnerLogos",
      title: "Homepage → Donors & Partners logos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", title: "Partner name" }),
            defineField({
              name: "logo",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
            defineField({ name: "url", type: "url", title: "Optional link" }),
          ],
          preview: {
            select: { title: "name", media: "logo" },
          },
        },
      ],
    }),

    // —— About page ——
    defineField({
      name: "testimonialsBackground",
      title: "About → Testimonials section — background image",
      type: "image",
      options: { hotspot: true },
      description:
        "Full-width photo behind the Testimonials slider on the About page (dark overlay is applied automatically).",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),

    // —— Where we work ——
    defineField({
      name: "whereWeWorkMap",
      title: "Where we work → Sierra Leone locations map",
      type: "image",
      options: { hotspot: true },
      description:
        "District map with MADAM location pins shown on the Where we work page.",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),

    // —— What we do ——
    defineField({
      name: "whatWeDoAgriculture",
      title: "What we do → MADAM & Agriculture image",
      type: "image",
      options: { hotspot: true },
      description:
        "Photo beside the intro text on the MADAM & Agriculture page.",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "whatWeDoSkills",
      title: "What we do → MADAM & Skills Development image",
      type: "image",
      options: { hotspot: true },
      description: "Photo beside the intro text on the Skills Development page.",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "whatWeDoIncomeIntro",
      title: "What we do → Generating Income — intro / restaurant",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "whatWeDoIncomeGuestroom",
      title: "What we do → Generating Income — Guestroom",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "whatWeDoIncomeRestaurant",
      title: "What we do → Generating Income — Restaurant",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "whatWeDoIncomeHall1",
      title: "What we do → Generating Income — Conference hall (empty)",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "whatWeDoIncomeHall2",
      title: "What we do → Generating Income — Conference hall (in use)",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "whatWeDoIncomeGarage",
      title: "What we do → Generating Income — Garage",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "whatWeDoNetworkLogos",
      title: "What we do → Network partner / donor logos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", title: "Name" }),
            defineField({
              name: "logo",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "name", media: "logo" },
          },
        },
      ],
    }),

    // —— Inner page heroes (optional shared) ——
    defineField({
      name: "defaultPageHero",
      title: "Inner pages → default banner background",
      type: "image",
      options: { hotspot: true },
      description: "Fallback background for About, Contact, and other inner page heroes.",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Website Images (by location)" }),
  },
});
