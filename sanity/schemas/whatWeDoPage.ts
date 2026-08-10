import { defineType, defineField, defineArrayMember } from "sanity";

const portableBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
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
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
});

/**
 * Editable “What we do” pages (Agriculture, Skills, Generating Income, Network).
 * Editors can change headings, body copy, CTAs, and photos in one place.
 */
export const whatWeDoPage = defineType({
  name: "whatWeDoPage",
  title: "What We Do Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Page hero title",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heading",
      type: "string",
      title: "Green section heading",
      description: "Main H2 shown in brand green under the hero",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intro",
      type: "array",
      title: "Intro text (left column)",
      of: [portableBlock],
      description: "Shown beside the side image at the top of the page",
    }),
    defineField({
      name: "sideImage",
      type: "image",
      title: "Side image",
      options: { hotspot: true },
      description: "Photo next to the intro text",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "body",
      type: "array",
      title: "Body text (below columns)",
      of: [portableBlock],
    }),
    defineField({
      name: "ctaLabel",
      type: "string",
      title: "CTA button label",
      description: 'e.g. "To our Projects" — leave empty to hide',
    }),
    defineField({
      name: "ctaHref",
      type: "string",
      title: "CTA button link",
      initialValue: "/projects",
    }),
    defineField({
      name: "sections",
      type: "array",
      title: "Extra sections",
      description:
        "Used on Generating Income (Guesthouse, Conference Hall, Garage) and similar pages",
      of: [
        defineArrayMember({
          type: "object",
          name: "contentSection",
          title: "Section",
          fields: [
            defineField({ name: "heading", type: "string", title: "Heading" }),
            defineField({
              name: "body",
              type: "array",
              of: [portableBlock],
            }),
            defineField({
              name: "contactHeading",
              type: "string",
              title: "Contact prompt",
              description:
                'e.g. "Contact us for a booking:" — shows phone/email from Site Settings',
            }),
            defineField({
              name: "highlight",
              type: "string",
              title: "Centered green highlight",
              description: 'e.g. "Your stay supports our TVET students!!"',
            }),
            defineField({
              name: "gallery",
              type: "array",
              title: "Images",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "image",
                      type: "image",
                      options: { hotspot: true },
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: "caption",
                      type: "string",
                      title: "Caption (green)",
                    }),
                    defineField({
                      name: "alt",
                      type: "string",
                      title: "Alt text",
                    }),
                  ],
                  preview: {
                    select: { title: "caption", media: "image" },
                    prepare: ({ title, media }) => ({
                      title: title || "Image",
                      media,
                    }),
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "heading" },
            prepare: ({ title }) => ({ title: title || "Section" }),
          },
        }),
      ],
    }),
    defineField({
      name: "showPartnerLogos",
      type: "boolean",
      title: "Show partner / donor logo carousel",
      description: "For the Network page — logos in the right column",
      initialValue: false,
    }),
    defineField({
      name: "partnerLogos",
      type: "array",
      title: "Partner / donor logos",
      hidden: ({ parent }) => !parent?.showPartnerLogos,
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", type: "string" }),
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
  ],
  preview: {
    select: { title: "title", subtitle: "heading", media: "sideImage" },
  },
});
