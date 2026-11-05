import { defineType, defineField, defineArrayMember } from "sanity";

const portableBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
    { title: "H4", value: "h4" },
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
        fields: [
          defineField({
            name: "href",
            type: "url",
            validation: (r) =>
              r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
          }),
        ],
      },
    ],
  },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  liveEdit: true,
  fields: [
    defineField({ name: "siteName", type: "string", initialValue: "MADAM" }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "favicon", type: "image" }),
    defineField({ name: "address", type: "text", rows: 3 }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({
      name: "mapEmbedUrl",
      type: "url",
      title: "Google Maps embed URL",
      description:
        "Optional. Paste a Google Maps embed link. If empty, the map uses the address field.",
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "network",
              type: "string",
              options: {
                list: ["facebook", "x", "linkedin", "youtube", "instagram"],
              },
            }),
            defineField({ name: "url", type: "url" }),
          ],
        },
      ],
    }),
    defineField({ name: "copyright", type: "string" }),
    defineField({ name: "supportCtaLabel", type: "string", initialValue: "Support Us" }),
    defineField({ name: "supportCtaHref", type: "string", initialValue: "/support-us" }),
    defineField({ name: "defaultSeo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  liveEdit: true,
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [{ type: "navItem" }],
    }),
  ],
  preview: { prepare: () => ({ title: "Main Navigation" }) },
});

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
  ],
});

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "bio", type: "text" }),
  ],
});

export const post = defineType({
  name: "post",
  title: "News Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Click Generate. This becomes the web address /news/your-title — no spaces.",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/['’]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
            .slice(0, 96),
      },
      validation: (r) =>
        r.required().custom((value) => {
          const current =
            value && typeof value === "object" && "current" in value
              ? String((value as { current?: string }).current || "")
              : "";
          if (!current) return "Click Generate to create the URL";
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
            return "Click Generate so the URL has no spaces (for example: madam-opens-new-centre)";
          }
          return true;
        }),
    }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "mainImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "body",
      type: "array",
      of: [portableBlock, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [
    {
      title: "Published date",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "mainImage", subtitle: "publishedAt" },
  },
});

export const staffMember = defineType({
  name: "staffMember",
  title: "Staff Member",
  type: "document",
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "media", title: "Photo" },
  ],
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
      group: "profile",
    }),
    defineField({
      name: "position",
      type: "string",
      validation: (r) => r.required(),
      group: "profile",
    }),
    defineField({
      name: "team",
      title: "Staff team",
      type: "string",
      group: "profile",
      description:
        "Controls which Studio folder and website page this person appears on.",
      options: {
        list: [
          { title: "Administrative Staff", value: "administrative" },
          { title: "Our Projects Staff", value: "projects" },
          { title: "Youth Training Center Staff", value: "youthTraining" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "projectTeam",
      type: "string",
      title: "Project team label",
      description: "e.g. PSAVE Project Staff — groups people on Projects Staff page",
      group: "profile",
      hidden: ({ parent }) => parent?.team !== "projects",
    }),
    defineField({
      name: "photo",
      title: "Staff photo",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description:
        "Upload a portrait for this person. Shown on staff listing pages.",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({ name: "bio", type: "text", group: "profile" }),
    defineField({ name: "email", type: "string", group: "profile" }),
    defineField({
      name: "sortOrder",
      type: "number",
      initialValue: 100,
      group: "profile",
    }),
    defineField({
      name: "active",
      type: "boolean",
      initialValue: true,
      group: "profile",
    }),
  ],
  orderings: [
    {
      title: "Team, then name",
      name: "teamName",
      by: [
        { field: "team", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "position", media: "photo", team: "team" },
    prepare: ({ title, subtitle, media, team }) => ({
      title,
      subtitle: [team, subtitle].filter(Boolean).join(" · "),
      media,
    }),
  },
});

export const project = defineType({
  name: "project",
  title: "Project",
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
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "Ongoing", value: "ongoing" },
          { title: "Past", value: "past" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "summary", type: "text", rows: 4 }),
    defineField({
      name: "body",
      type: "array",
      of: [portableBlock, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "featuredImage",
      title: "Featured image (card / hero)",
      type: "image",
      options: { hotspot: true },
      description:
        "Main image shown on project listing cards and at the top of the project page.",
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "gallery",
      title: "Project images (add one or more)",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt text" }),
            defineField({ name: "caption", type: "string", title: "Caption (optional)" }),
          ],
        },
      ],
      description:
        "Upload as many photos as you need for this project (ongoing or past). Shown as a gallery on the project page.",
    }),
    defineField({ name: "startDate", type: "date" }),
    defineField({ name: "endDate", type: "date" }),
    defineField({ name: "locations", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "partners", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "donors",
      title: "Donors / funders",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "relatedPosts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    }),
    defineField({ name: "sortOrder", type: "number", initialValue: 100 }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "status", media: "featuredImage" },
  },
});

export const partner = defineType({
  name: "partner",
  title: "Partner / Donor",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "logo", type: "image" }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "sortOrder", type: "number", initialValue: 100 }),
  ],
});

export const newsletterIssue = defineType({
  name: "newsletterIssue",
  title: "Newsletter Issue",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      type: "date",
      title: "Issue date",
      description: "Shown on the News Letter page (e.g. August 15th, 2024)",
    }),
    defineField({
      name: "coverImage",
      type: "image",
      title: "Cover / header graphic",
      description:
        "Graphic with partner logos, date line, and title (as on the live MADAM site)",
      options: { hotspot: true },
    }),
    defineField({
      name: "file",
      type: "file",
      title: "PDF file",
      description: "Downloadable newsletter PDF",
      options: { accept: "application/pdf" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sortOrder",
      type: "number",
      title: "Sort order",
      description: "Lower numbers appear first when dates match",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Date (newest)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "date", media: "coverImage" },
    prepare({ title, date, media }) {
      return {
        title: title || "Untitled newsletter",
        subtitle: date || "No date",
        media,
      };
    },
  },
});

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "sortOrder", type: "number", initialValue: 100 }),
  ],
});
