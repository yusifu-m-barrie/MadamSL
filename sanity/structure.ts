import type { StructureResolver } from "sanity/structure";
import { isNewsOnlyEditor } from "./access";

/**
 * Studio sidebar mirrors the public site.
 * News-only editors (comms officer) only see Latest News.
 */
export const deskStructure: StructureResolver = (S, context) => {
  if (isNewsOnlyEditor(context.currentUser)) {
    return S.list()
      .title("News desk")
      .items([
        S.documentTypeListItem("post").title("Latest News"),
        S.documentTypeListItem("newsletterIssue").title("News Letters"),
      ]);
  }

  return S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Website Images")
        .id("siteImages")
        .child(S.document().schemaType("siteImages").documentId("siteImages")),
      S.listItem()
        .title("Homepage Videos")
        .id("homepageVideos")
        .child(
          S.document()
            .schemaType("homepageVideos")
            .documentId("homepageVideos"),
        ),
      S.listItem()
        .title("Navigation")
        .id("navigation")
        .child(S.document().schemaType("navigation").documentId("navigation")),

      S.divider(),

      S.listItem()
        .title("Pages")
        .id("pages-folder")
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Home")
                .id("page-home")
                .child(
                  S.document().schemaType("page").documentId("page-home"),
                ),
              S.divider(),
              S.listItem()
                .title("Who we are")
                .id("pages-who")
                .child(
                  S.documentTypeList("page")
                    .title("Who we are")
                    .filter(
                      '_type == "page" && slug.current in ["about", "mission-vision", "core-values", "diversity-equity-inclusion"]',
                    ),
                ),
              S.listItem()
                .title("Other pages")
                .id("pages-other")
                .child(
                  S.documentTypeList("page")
                    .title("Other pages")
                    .filter(
                      '_type == "page" && !(slug.current in ["home", "about", "mission-vision", "core-values", "diversity-equity-inclusion"])',
                    )
                    .defaultOrdering([{ field: "title", direction: "asc" }]),
                ),
              S.divider(),
              S.listItem()
                .title("All pages")
                .id("pages-all")
                .child(
                  S.documentTypeList("page")
                    .title("All pages")
                    .defaultOrdering([{ field: "title", direction: "asc" }]),
                ),
            ]),
        ),
      S.documentTypeListItem("post").title("News"),

      S.listItem()
        .title("What We Do")
        .id("what-we-do-folder")
        .child(
          S.documentTypeList("whatWeDoPage")
            .title("What We Do pages")
            .defaultOrdering([{ field: "title", direction: "asc" }]),
        ),

      S.listItem()
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
        ),

      S.listItem()
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
        ),

      S.documentTypeListItem("partner").title("Partners"),
      S.documentTypeListItem("newsletterIssue").title("News Letters"),
      S.documentTypeListItem("location").title("Locations"),

      S.divider(),

      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("author").title("Authors"),
    ]);
};
