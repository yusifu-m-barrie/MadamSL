import { defineType, defineField } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "metaTitle", type: "string", title: "Meta title" }),
    defineField({
      name: "metaDescription",
      type: "text",
      title: "Meta description",
      rows: 3,
    }),
    defineField({ name: "ogImage", type: "image", title: "Social image" }),
    defineField({
      name: "noIndex",
      type: "boolean",
      title: "Hide from search engines",
      initialValue: false,
    }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "style",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Outline", value: "outline" },
        ],
      },
      initialValue: "primary",
    }),
  ],
});

export const navItem = defineType({
  name: "navItem",
  title: "Nav item",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "children",
      type: "array",
      of: [
        {
          type: "object",
          name: "navChild",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "children",
              title: "Nested items (e.g. Staff sub-pages)",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "navGrandchild",
                  fields: [
                    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                    defineField({ name: "href", type: "string", validation: (r) => r.required() }),
                  ],
                  preview: {
                    select: { title: "label", subtitle: "href" },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
