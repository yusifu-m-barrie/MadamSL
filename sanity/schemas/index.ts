import { seo, cta, navItem } from "./objects";
import {
  siteSettings,
  navigation,
  category,
  author,
  post,
  staffMember,
  project,
  partner,
  newsletterIssue,
  location,
} from "./documents";
import { page } from "./page";
import { siteImages } from "./siteImages";
import { homepageVideos, videoItem } from "./videos";
import { whatWeDoPage } from "./whatWeDoPage";

export const schemaTypes = [
  seo,
  cta,
  navItem,
  videoItem,
  siteSettings,
  navigation,
  siteImages,
  homepageVideos,
  page,
  whatWeDoPage,
  post,
  category,
  author,
  staffMember,
  project,
  partner,
  newsletterIssue,
  location,
];
