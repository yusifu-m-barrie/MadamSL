import { defineType, defineField, defineArrayMember } from "sanity";

const portableBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
    { title: "Quote", value: "blockquote" },
  ],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Italic", value: "em" },
    ],
    annotations: [
      {
        name: "link",
        type: "object",
        title: "Link",
        fields: [defineField({ name: "href", type: "url" })],
      },
    ],
  },
});

export const pageSections = [
  defineArrayMember({
    name: "heroSlider",
    type: "object",
    title: "Hero slider",
    fields: [
      defineField({
        name: "slides",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              defineField({ name: "heading", type: "string" }),
              defineField({ name: "subheading", type: "string" }),
              defineField({ name: "image", type: "image", options: { hotspot: true } }),
              defineField({ name: "cta", type: "cta" }),
            ],
            preview: { select: { title: "heading", media: "image" } },
          },
        ],
      }),
    ],
    preview: { prepare: () => ({ title: "Hero slider" }) },
  }),
  defineArrayMember({
    name: "richTextSection",
    type: "object",
    title: "Rich text",
    fields: [
      defineField({ name: "eyebrow", type: "string" }),
      defineField({ name: "heading", type: "string" }),
      defineField({ name: "body", type: "array", of: [portableBlock] }),
      defineField({
        name: "align",
        type: "string",
        options: { list: ["left", "center"] },
        initialValue: "left",
      }),
      defineField({
        name: "ctas",
        title: "Buttons (optional)",
        type: "array",
        of: [{ type: "cta" }],
      }),
    ],
    preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Rich text" }) },
  }),
  defineArrayMember({
    name: "imageText",
    type: "object",
    title: "Image + text",
    fields: [
      defineField({ name: "heading", type: "string" }),
      defineField({ name: "body", type: "array", of: [portableBlock] }),
      defineField({ name: "image", type: "image", options: { hotspot: true } }),
      defineField({
        name: "imageSlot",
        type: "string",
        title: "Or use Website Images slot",
        options: {
          list: [{ title: "Homepage About MADAM", value: "aboutImage" }],
        },
      }),
      defineField({
        name: "imagePosition",
        type: "string",
        options: { list: ["left", "right"] },
        initialValue: "left",
      }),
      defineField({ name: "cta", type: "cta" }),
    ],
    preview: { select: { title: "heading", media: "image" } },
  }),
  defineArrayMember({
    name: "programCards",
    type: "object",
    title: "Program cards",
    fields: [
      defineField({ name: "heading", type: "string" }),
      defineField({ name: "intro", type: "text" }),
      defineField({
        name: "cards",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              defineField({ name: "title", type: "string" }),
              defineField({ name: "description", type: "text" }),
              defineField({
                name: "image",
                type: "image",
                options: { hotspot: true },
                description: "Card photo — or set via Website Images singleton",
              }),
              defineField({
                name: "imageSlot",
                type: "string",
                title: "Or use Website Images slot",
                options: {
                  list: [
                    { title: "Homepage Agriculture", value: "programAgriculture" },
                    { title: "Homepage Skills", value: "programSkills" },
                    { title: "Homepage Income", value: "programIncome" },
                  ],
                },
              }),
              defineField({ name: "href", type: "string" }),
              defineField({ name: "ctaLabel", type: "string", initialValue: "Read More" }),
            ],
            preview: { select: { title: "title", media: "image" } },
          },
        ],
      }),
    ],
    preview: { prepare: () => ({ title: "Program cards" }) },
  }),
  defineArrayMember({
    name: "impactCards",
    type: "object",
    title: "Our Impact (homepage)",
    fields: [
      defineField({ name: "heading", type: "string", initialValue: "OUR IMPACT" }),
      defineField({
        name: "ctaLabel",
        type: "string",
        initialValue: "SEE MORE ABOUT OUR PROJECTS",
      }),
      defineField({ name: "ctaHref", type: "string", initialValue: "/projects" }),
      defineField({
        name: "items",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              defineField({ name: "title", type: "string" }),
              defineField({ name: "description", type: "text" }),
              defineField({
                name: "image",
                type: "image",
                options: { hotspot: true },
              }),
              defineField({
                name: "imageSlot",
                type: "string",
                title: "Or use Website Images slot",
                options: {
                  list: [
                    { title: "Climate Smart Agriculture", value: "impactClimateSmart" },
                    { title: "Agro-tech Project", value: "impactAgrotech" },
                    { title: "Food and Nutrition", value: "impactFoodNutrition" },
                    { title: "YTSC", value: "impactYtsc" },
                    { title: "Generating income", value: "impactGeneratingIncome" },
                    { title: "Kush Victims", value: "impactKush" },
                  ],
                },
              }),
              defineField({ name: "href", type: "string" }),
            ],
            preview: { select: { title: "title", media: "image" } },
          },
        ],
      }),
    ],
    preview: { prepare: () => ({ title: "Our Impact" }) },
  }),
  defineArrayMember({
    name: "projectListing",
    type: "object",
    title: "Project listing",
    fields: [
      defineField({ name: "heading", type: "string" }),
      defineField({
        name: "status",
        type: "string",
        options: {
          list: [
            { title: "Ongoing", value: "ongoing" },
            { title: "Past", value: "past" },
            { title: "All", value: "all" },
          ],
        },
        initialValue: "ongoing",
      }),
      defineField({ name: "limit", type: "number", initialValue: 6 }),
    ],
    preview: { prepare: () => ({ title: "Project listing" }) },
  }),
  defineArrayMember({
    name: "staffListing",
    type: "object",
    title: "Staff listing",
    fields: [
      defineField({ name: "heading", type: "string" }),
      defineField({
        name: "team",
        type: "string",
        options: {
          list: [
            { title: "Administrative", value: "administrative" },
            { title: "Projects", value: "projects" },
            { title: "Youth Training", value: "youthTraining" },
          ],
        },
      }),
      defineField({ name: "groupByProjectTeam", type: "boolean", initialValue: false }),
    ],
    preview: { prepare: () => ({ title: "Staff listing" }) },
  }),
  defineArrayMember({
    name: "latestNews",
    type: "object",
    title: "Latest news",
    fields: [
      defineField({ name: "heading", type: "string", initialValue: "Latest News" }),
      defineField({ name: "limit", type: "number", initialValue: 3 }),
    ],
    preview: { prepare: () => ({ title: "Latest news" }) },
  }),
  defineArrayMember({
    name: "partnerLogos",
    type: "object",
    title: "Partner / donor logos",
    fields: [
      defineField({ name: "heading", type: "string", initialValue: "Donors & Partners" }),
    ],
    preview: { prepare: () => ({ title: "Partner logos" }) },
  }),
  defineArrayMember({
    name: "testimonials",
    type: "object",
    title: "Testimonials",
    fields: [
      defineField({ name: "heading", type: "string", initialValue: "Testimonials" }),
      defineField({
        name: "backgroundImage",
        title: "Background image (optional)",
        type: "image",
        options: { hotspot: true },
        description:
          "Overrides Website Images → About → Testimonials background when set on this section.",
      }),
      defineField({
        name: "items",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              defineField({ name: "quote", type: "text" }),
              defineField({ name: "name", type: "string" }),
              defineField({ name: "role", type: "string" }),
              defineField({ name: "image", type: "image", title: "Avatar photo" }),
            ],
            preview: { select: { title: "name", subtitle: "role", media: "image" } },
          },
        ],
      }),
    ],
    preview: { prepare: () => ({ title: "Testimonials" }) },
  }),
  defineArrayMember({
    name: "ctaBand",
    type: "object",
    title: "CTA band",
    fields: [
      defineField({ name: "heading", type: "string" }),
      defineField({ name: "text", type: "text" }),
      defineField({ name: "cta", type: "cta" }),
    ],
    preview: { select: { title: "heading" } },
  }),
  defineArrayMember({
    name: "contactInfo",
    type: "object",
    title: "Contact information",
    fields: [
      defineField({ name: "heading", type: "string" }),
      defineField({
        name: "showForm",
        type: "boolean",
        initialValue: true,
        description: "Show contact form beside info cards",
      }),
    ],
    preview: { prepare: () => ({ title: "Contact information" }) },
  }),
  defineArrayMember({
    name: "newsletterDownloads",
    type: "object",
    title: "Newsletter downloads",
    fields: [
      defineField({ name: "heading", type: "string", initialValue: "Download News Letter" }),
      defineField({ name: "intro", type: "text" }),
    ],
    preview: { prepare: () => ({ title: "Newsletter downloads" }) },
  }),
  defineArrayMember({
    name: "locationsMap",
    type: "object",
    title: "Where we work",
    fields: [
      defineField({ name: "heading", type: "string", initialValue: "Where we work" }),
      defineField({ name: "body", type: "array", of: [portableBlock] }),
      defineField({
        name: "showMap",
        type: "boolean",
        title: "Show Sierra Leone map image",
        initialValue: true,
        description: "Uses Website Images → Where we work map",
      }),
      defineField({
        name: "mapCaption",
        type: "string",
        title: "Map caption",
      }),
      defineField({
        name: "showLocationCards",
        type: "boolean",
        title: "Show location cards list",
        initialValue: false,
        description: "Lists Location documents under the map",
      }),
    ],
    preview: { prepare: () => ({ title: "Where we work" }) },
  }),
  defineArrayMember({
    name: "missionVision",
    type: "object",
    title: "Mission & Vision cards",
    fields: [
      defineField({ name: "missionHeading", type: "string", initialValue: "OUR MISSION" }),
      defineField({ name: "missionText", type: "text", rows: 5 }),
      defineField({ name: "visionHeading", type: "string", initialValue: "OUR VISION" }),
      defineField({ name: "visionText", type: "text", rows: 5 }),
    ],
    preview: { prepare: () => ({ title: "Mission & Vision cards" }) },
  }),
  defineArrayMember({
    name: "gallery",
    type: "object",
    title: "Gallery",
    fields: [
      defineField({ name: "heading", type: "string" }),
      defineField({
        name: "images",
        type: "array",
        of: [{ type: "image", options: { hotspot: true } }],
      }),
    ],
    preview: { prepare: () => ({ title: "Gallery" }) },
  }),
];

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroSubtitle",
      type: "string",
      title: "Hero subtitle (optional)",
      description: "Shown under the page hero title",
    }),
    defineField({
      name: "showHero",
      type: "boolean",
      title: "Show page hero banner",
      initialValue: true,
    }),
    defineField({
      name: "sections",
      type: "array",
      of: pageSections,
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
