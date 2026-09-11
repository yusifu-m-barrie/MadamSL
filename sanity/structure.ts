import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { lockedPagesGroqFilter, shouldHideLockedPages, studioAccess } from "./access";

function projectsFolder(S: StructureBuilder) {
  return S.listItem()
    .title("Projects")
    .id("projects-folder")
    .child(
      S.list()
        .title("Projects")
        .items([
          S.listItem()
            .title("Ongoing Projects")
            .id("projects-ongoing")
            .child(
              S.documentTypeList("project")
                .title("Ongoing Projects")
                .filter('_type == "project" && status == "ongoing"')
                .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
            ),
          S.listItem()
            .title("Past Projects")
            .id("projects-past")
            .child(
              S.documentTypeList("project")
                .title("Past Projects")
                .filter('_type == "project" && status == "past"')
                .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
            ),
          S.divider(),
          S.listItem()
            .title("All Projects")
            .id("projects-all")
            .child(
              S.documentTypeList("project")
                .title("All Projects")
                .defaultOrdering([{ field: "title", direction: "asc" }]),
            ),
        ]),
    );
}

function staffFolder(S: StructureBuilder) {
  return S.listItem()
    .title("Staff")
    .id("staff-folder")
    .child(
      S.list()
        .title("Staff")
        .items([
          S.listItem()
            .title("Administrative Staff")
            .id("staff-administrative")
            .child(
              S.documentTypeList("staffMember")
                .title("Administrative Staff")
                .filter('_type == "staffMember" && team == "administrative"')
                .defaultOrdering([
                  { field: "sortOrder", direction: "asc" },
                  { field: "name", direction: "asc" },
                ]),
            ),
          S.listItem()
            .title("Our Projects Staff")
            .id("staff-projects")
            .child(
              S.documentTypeList("staffMember")
                .title("Our Projects Staff")
                .filter('_type == "staffMember" && team == "projects"')
                .defaultOrdering([
                  { field: "projectTeam", direction: "asc" },
                  { field: "sortOrder", direction: "asc" },
                  { field: "name", direction: "asc" },
                ]),
            ),
          S.listItem()
            .title("Youth Training Center Staff")
            .id("staff-ytsc")
            .child(
              S.documentTypeList("staffMember")
                .title("Youth Training Center Staff")
                .filter('_type == "staffMember" && team == "youthTraining"')
                .defaultOrdering([
                  { field: "sortOrder", direction: "asc" },
                  { field: "name", direction: "asc" },
                ]),
            ),
          S.divider(),
          S.listItem()
            .title("All Staff")
            .id("staff-all")
            .child(
              S.documentTypeList("staffMember")
                .title("All Staff")
                .defaultOrdering([
                  { field: "team", direction: "asc" },
                  { field: "name", direction: "asc" },
                ]),
            ),
        ]),
    );
}

function pagesFolder(S: StructureBuilder, hideLockedPages = false) {
  const lockedFilter = hideLockedPages ? ` && ${lockedPagesGroqFilter()}` : "";
  const items = [];

  if (!hideLockedPages) {
    items.push(
      S.listItem()
        .title("Home")
        .id("page-home")
        .child(S.document().schemaType("page").documentId("page-home")),
      S.divider(),
    );
  }

  items.push(
    S.listItem()
      .title("Who we are")
      .id("pages-who")
      .child(
        S.documentTypeList("page")
          .title("Who we are")
          .filter(
            `_type == "page" && slug.current in ["about", "mission-vision", "core-values", "diversity-equity-inclusion"]${lockedFilter}`,
          ),
      ),
    S.listItem()
      .title("Other pages")
      .id("pages-other")
      .child(
        S.documentTypeList("page")
          .title("Other pages")
          .filter(
            `_type == "page" && !(slug.current in ["home", "about", "mission-vision", "core-values", "diversity-equity-inclusion"])${lockedFilter}`,
          )
          .defaultOrdering([{ field: "title", direction: "asc" }]),
      ),
    S.divider(),
    S.listItem()
      .title("All pages")
      .id("pages-all")
      .child(
        S.documentTypeList("page")
          .title(hideLockedPages ? "All pages (except Home & Contact)" : "All pages")
          .filter(`_type == "page"${lockedFilter}`)
          .defaultOrdering([{ field: "title", direction: "asc" }]),
      ),
  );

  return S.listItem()
    .title("Pages")
    .id("pages-folder")
    .child(S.list().title("Pages").items(items));
}

function itemsForTypes(
  S: StructureBuilder,
  types: string[],
  options: { hideLockedPages?: boolean } = {},
) {
  const allowed = new Set(types);
  const items = [];

  if (allowed.has("page")) items.push(pagesFolder(S, options.hideLockedPages));
  if (allowed.has("post")) items.push(S.documentTypeListItem("post").title("Latest News"));
  if (allowed.has("whatWeDoPage")) {
    items.push(
      S.listItem()
        .title("What We Do")
        .id("what-we-do-folder")
        .child(
          S.documentTypeList("whatWeDoPage")
            .title("What We Do pages")
            .defaultOrdering([{ field: "title", direction: "asc" }]),
        ),
    );
  }
  if (allowed.has("project")) items.push(projectsFolder(S));
  if (allowed.has("staffMember")) items.push(staffFolder(S));
  if (allowed.has("newsletterIssue")) {
    items.push(S.documentTypeListItem("newsletterIssue").title("News Letters"));
  }
  if (allowed.has("partner")) items.push(S.documentTypeListItem("partner").title("Partners"));
  if (allowed.has("location")) items.push(S.documentTypeListItem("location").title("Locations"));
  if (allowed.has("category")) items.push(S.documentTypeListItem("category").title("Categories"));
  if (allowed.has("author")) items.push(S.documentTypeListItem("author").title("Authors"));

  return items;
}

function deniedDesk(S: StructureBuilder) {
  return S.list()
    .title("Access denied")
    .items([
      S.listItem()
        .id("studio-access-denied")
        .title("This email is not authorized to use Studio")
        .child(
          S.list()
            .title("Ask the web team to add your email to a Studio role, then sign in again.")
            .items([]),
        ),
    ]);
}

function fullDesk(S: StructureBuilder) {
  return S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Website Images")
        .id("siteImages")
        .child(S.document().schemaType("siteImages").documentId("siteImages")),
      S.listItem()
        .title("Homepage Videos")
        .id("homepageVideos")
        .child(
          S.document().schemaType("homepageVideos").documentId("homepageVideos"),
        ),
      S.listItem()
        .title("Navigation")
        .id("navigation")
        .child(S.document().schemaType("navigation").documentId("navigation")),

      S.divider(),

      pagesFolder(S),
      S.documentTypeListItem("post").title("News"),

      S.listItem()
        .title("What We Do")
        .id("what-we-do-folder")
        .child(
          S.documentTypeList("whatWeDoPage")
            .title("What We Do pages")
            .defaultOrdering([{ field: "title", direction: "asc" }]),
        ),

      projectsFolder(S),
      staffFolder(S),

      S.documentTypeListItem("partner").title("Partners"),
      S.documentTypeListItem("newsletterIssue").title("News Letters"),
      S.documentTypeListItem("location").title("Locations"),

      S.divider(),

      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("author").title("Authors"),
    ]);
}

/**
 * Studio sidebar: full CMS for admins, role sections for listed editors,
 * and an access-denied desk for anyone else.
 */
export const deskStructure: StructureResolver = (S, context) => {
  const access = studioAccess(context.currentUser);

  if (access.kind === "denied") {
    return deniedDesk(S);
  }

  if (access.kind === "restricted") {
    return S.list()
      .title(access.deskTitle)
      .items(
        itemsForTypes(S, access.types, {
          hideLockedPages: shouldHideLockedPages(context.currentUser),
        }),
      );
  }

  return fullDesk(S);
};
