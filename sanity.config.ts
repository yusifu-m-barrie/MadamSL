import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { deskStructure } from "./sanity/structure";
import { isNewsDeskType, isNewsOnlyEditor } from "./sanity/access";

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
  schema: {
    types: schemaTypes,
    // Hide non-comms templates from the global "Create" menu for officers
    templates: (prev, { currentUser }) => {
      if (!isNewsOnlyEditor(currentUser)) return prev;
      return prev.filter((template) => isNewsDeskType(template.schemaType));
    },
  },
  tools: (prev, { currentUser }) => {
    if (isNewsOnlyEditor(currentUser)) {
      return prev.filter((tool) => tool.name !== "vision");
    }
    return prev;
  },
  document: {
    newDocumentOptions: (prev, { currentUser }) => {
      if (!isNewsOnlyEditor(currentUser)) return prev;
      return prev.filter((item) => {
        const type =
          item.templateId ||
          (item as { schemaType?: string }).schemaType ||
          "";
        return isNewsDeskType(type);
      });
    },
    // Strip edit/publish/delete on anything outside News / News Letters / Projects
    actions: (prev, { schemaType, currentUser }) => {
      if (!isNewsOnlyEditor(currentUser)) return prev;
      if (isNewsDeskType(schemaType)) return prev;
      return [];
    },
  },
});
