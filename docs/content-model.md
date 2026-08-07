# Content Model — Sanity CMS

Designed around the actual MADAM website (not a generic NGO template).

---

## Principles

1. **Editors own content; developers own layout.**
2. Prefer typed documents over an unbounded page builder.
3. Use a **limited section list** that maps 1:1 to recurring MADAM sections.
4. Only store publicly available staff data.
5. News, projects, staff, navigation, and site settings are first-class CMS entities.

---

## Document types

### `siteSettings` (singleton)

| Field | Type | Editable |
|-------|------|----------|
| siteName | string | yes |
| tagline | string | yes |
| logo | image | yes |
| favicon | image | yes |
| address | text | yes |
| phone | string | yes |
| email | string | yes |
| socialLinks[] | {network, url} | yes |
| copyright | string | yes |
| defaultSeo | seo object | yes |
| supportCtaLabel | string | yes |
| supportCtaHref | string | yes |

### `navigation` (singleton)

| Field | Type |
|-------|------|
| items[] | { label, href, children[] } |
| order | number on each item |

### `page`

Flexible pages for About, Mission, Contact layouts, etc.

| Field | Type |
|-------|------|
| title | string |
| slug | slug |
| hero | hero object (optional) |
| sections[] | array of section blocks |
| seo | seo object |
| published | boolean |

### Section blocks (page builder — MADAM-shaped)

| Block `_type` | Purpose | Maps to UI |
|---------------|---------|------------|
| `heroSlider` | Homepage / page hero slides | `HeroSlider` |
| `richTextSection` | Mission, values, DEI body | `RichTextSection` |
| `imageText` | Image left/right + copy | `ImageText` |
| `programCards` | What we do cards | `ProgramCards` |
| `statsRow` | Impact numbers if present | `StatsRow` |
| `projectListing` | Pull ongoing/past projects | `ProjectListing` |
| `staffListing` | Filter by team | `StaffListing` |
| `latestNews` | Recent posts | `LatestNews` |
| `partnerLogos` | Donors & partners | `PartnerLogos` |
| `testimonials` | About testimonials | `Testimonials` |
| `gallery` | Image grids | `Gallery` |
| `ctaBand` | Support / contact CTA | `CtaBand` |
| `contactInfo` | Address/phone/email blocks | `ContactInfo` |
| `newsletterDownloads` | Newsletter PDFs | `NewsletterDownloads` |
| `locationsMap` | Where we work | `LocationsSection` |
| `videoEmbed` | Embedded video if present | `VideoEmbed` |

Do **not** invent sections that are not on the live site.

### `post` (News)

| Field | Type |
|-------|------|
| title | string |
| slug | slug |
| excerpt | text |
| mainImage | image |
| body | portable text |
| categories[] | reference → category |
| author | reference → author |
| publishedAt | datetime |
| seo | seo object |

Draft/publish via Sanity workflow.

### `category`

- title, slug

### `author`

- name, slug, image (optional), bio (optional — only if public)

### `staffMember`

| Field | Type |
|-------|------|
| name | string |
| position | string |
| team | `administrative` \| `projects` \| `youthTraining` |
| projectTeam | string (e.g. PSAVE) — optional |
| photo | image |
| bio | text (optional; only if public) |
| email | string (optional; only if public) |
| sortOrder | number |
| active | boolean |

### `project`

Replaces Avas “causes”.

| Field | Type |
|-------|------|
| title | string |
| slug | slug |
| status | `ongoing` \| `past` |
| summary | text |
| body | portable text |
| featuredImage | image |
| gallery | images[] |
| startDate / endDate | date |
| locations[] | string or reference |
| partners[] | string |
| relatedPosts[] | reference → post |
| seo | seo object |
| sortOrder | number |

### `partner`

- name, logo, url (optional), sortOrder

### `location` (Where We Work)

- name (district/region), description, relatedProjects[]

### `newsletterIssue`

- title, date, file (PDF), coverImage optional

### Shared objects

#### `seo`

- metaTitle, metaDescription, ogImage, noIndex

#### `cta`

- label, href, style (`primary` \| `secondary` \| `outline`)

---

## What stays “static” in code vs CMS

| Concern | Owner |
|---------|-------|
| Layout shell, CSS tokens, component markup | Code |
| Logo, contact, social, copyright | Sanity `siteSettings` |
| Menu labels / links / order | Sanity `navigation` |
| Page copy & sections | Sanity `page` |
| News articles | Sanity `post` |
| Staff cards | Sanity `staffMember` |
| Projects | Sanity `project` |
| Partner logos | Sanity `partner` |
| Newsletter PDFs | Sanity `newsletterIssue` |
| Forms (validation, spam, delivery) | Next.js route handlers + env |
| Redirects / URL map | Next.js `redirects` + docs |

---

## Editorial workflow

1. Edit in Sanity Studio (`/studio`)
2. Save draft
3. Preview via Presentation / draft mode
4. Publish → webhook / `revalidateTag` updates the site

---

## Seed priority

1. `siteSettings` + `navigation`
2. Homepage `page`
3. Who We Are / What We Do pages
4. Staff members (from public listings)
5. Ongoing projects (from causes archive titles)
6. News posts (from WP REST)
7. Partners / newsletter issues as media becomes available
