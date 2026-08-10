import { defineType, defineField } from "sanity";

export const videoItem = defineType({
  name: "videoItem",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Shown for accessibility / Studio preview",
    }),
    defineField({
      name: "sourceType",
      title: "Video source",
      type: "string",
      options: {
        list: [
          { title: "YouTube link", value: "youtube" },
          { title: "Upload video file", value: "upload" },
          { title: "External video URL (mp4/webm)", value: "url" },
        ],
        layout: "radio",
      },
      initialValue: "youtube",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      description: "Paste any YouTube watch / share / youtu.be link",
      hidden: ({ parent }) => parent?.sourceType !== "youtube",
      validation: (r) =>
        r.custom((value, ctx) => {
          const parent = ctx.parent as { sourceType?: string };
          if (parent?.sourceType === "youtube" && !value) {
            return "YouTube URL is required";
          }
          return true;
        }),
    }),
    defineField({
      name: "file",
      title: "Video file",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.sourceType !== "upload",
      validation: (r) =>
        r.custom((value, ctx) => {
          const parent = ctx.parent as { sourceType?: string };
          if (parent?.sourceType === "upload" && !value) {
            return "Upload a video file";
          }
          return true;
        }),
    }),
    defineField({
      name: "externalUrl",
      title: "External video URL",
      type: "url",
      description: "Direct link to an .mp4 / .webm file",
      hidden: ({ parent }) => parent?.sourceType !== "url",
      validation: (r) =>
        r.custom((value, ctx) => {
          const parent = ctx.parent as { sourceType?: string };
          if (parent?.sourceType === "url" && !value) {
            return "Video URL is required";
          }
          return true;
        }),
    }),
    defineField({
      name: "poster",
      title: "Poster image (optional)",
      type: "image",
      options: { hotspot: true },
      description: "Thumbnail before play — mainly for uploaded / external videos",
      hidden: ({ parent }) => parent?.sourceType === "youtube",
    }),
  ],
  preview: {
    select: { title: "title", sourceType: "sourceType", youtubeUrl: "youtubeUrl" },
    prepare: ({ title, sourceType, youtubeUrl }) => ({
      title: title || youtubeUrl || "Video",
      subtitle: sourceType,
    }),
  },
});

/** Singleton: homepage video row (below Latest News) */
export const homepageVideos = defineType({
  name: "homepageVideos",
  title: "Homepage Videos",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Section heading (optional)",
      description: "Leave empty to hide a heading — matches the live site two-video row",
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      of: [{ type: "videoItem" }],
      description:
        "Add YouTube links or upload video files. Shown in a 2-column row under Latest News.",
      validation: (r) => r.max(6),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage Videos" }),
  },
});
