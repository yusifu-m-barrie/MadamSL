import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { deskStructure } from "./sanity/structure";
import { isNewsOnlyEditor } from "./sanity/access";

/**
 * Project ID is public (NEXT_PUBLIC). Hardcoded fallback avoids
 * "Failed to fetch" when the Studio client bundle misses env on first load.
 */
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n5hnlyba";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId || projectId === "placeholder") {
  console.warn(
    "[sanity.config] Missing NEXT_PUBLIC_SANITY_PROJECT_ID — Studio API calls will fail.",
  );
}

export default defineConfig({
  name: "madam-sl",
  title: "MADAM Sierra Leone",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  tools: (prev, { currentUser }) => {
    // Hide Vision (raw query console) from the communications officer
    if (isNewsOnlyEditor(currentUser)) {
      return prev.filter((tool) => tool.name !== "vision");
    }
    return prev;
  },
  document: {
    // "+" new-document menu: news editors can only create News posts
    newDocumentOptions: (prev, { currentUser }) => {
      if (isNewsOnlyEditor(currentUser)) {
        return prev.filter(
          (item) =>
            item.templateId === "post" ||
            (item as { schemaType?: string }).schemaType === "post",
        );
      }
      return prev;
    },
  },
});
