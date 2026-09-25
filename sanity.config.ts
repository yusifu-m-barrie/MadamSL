import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { deskStructure } from "./sanity/structure";
import { canEditDocument, canEditSchemaType, studioAccess } from "./sanity/access";

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
  // Drafts/releases make published singletons look read-only in Studio.
  // These four settings docs should save in place for every writer.
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev, { currentUser }) => {
      const access = studioAccess(currentUser);
      if (access.kind === "admin") return prev;
      if (access.kind === "denied") return [];
      return prev.filter(
        (template) =>
          template.schemaType !== "siteSettings" &&
          canEditSchemaType(currentUser, template.schemaType),
      );
    },
  },
  tools: (prev, { currentUser }) => {
    const access = studioAccess(currentUser);
    if (access.kind === "admin") return prev;
    return prev.filter((tool) => tool.name !== "vision");
  },
  document: {
    newDocumentOptions: (prev, { currentUser }) => {
      const access = studioAccess(currentUser);
      if (access.kind === "admin") return prev;
      if (access.kind === "denied") return [];
      return prev.filter((item) => {
        const type =
          item.templateId ||
          (item as { schemaType?: string }).schemaType ||
          "";
        if (type === "siteSettings") return false;
        return canEditSchemaType(currentUser, type);
      });
    },
    actions: (prev, context) => {
      const { schemaType, currentUser } = context;
      const documentId =
        (context as { documentId?: string; id?: string }).documentId ??
        (context as { id?: string }).id;
      if (canEditDocument(currentUser, schemaType, documentId)) return prev;
      return [];
    },
  },
});
