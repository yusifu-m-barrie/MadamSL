# URL Map — WordPress → Next.js

**Goal:** Preserve SEO. Prefer clean public URLs; keep permanent redirects from every old WordPress URL.

Convention:

- **NEW** = public Next.js route (no `/index.php/`)
- **OLD** → **NEW** via `301` in `next.config` redirects

---

## Core pages

| OLD | NEW |
|-----|-----|
| `https://www.madam-sl.org/` | `/` |
| `/index.php/about/` | `/about` |
| `/index.php/mission-vision/` | `/mission-vision` |
| `/index.php/core-values/` | `/core-values` |
| `/index.php/diversity-equity-inclusion/` | `/diversity-equity-inclusion` |
| `/index.php/our-staff/` | `/our-staff` |
| `/index.php/our-projects-staff/` | `/our-projects-staff` |
| `/index.php/youth-training-center-staff/` | `/youth-training-center-staff` |
| `/index.php/where-we-work/` | `/where-we-work` |
| `/index.php/contact/` | `/contact` |
| `/index.php/support-us/` | `/support-us` |
| `/index.php/news/` | `/news` |
| `/index.php/news-letter/` | `/news-letter` |
| `/index.php/causes/` | `/projects` |
| `/index.php/causes-2/` | `/projects/ongoing` |
| `/index.php/past/` | `/projects/past` |
| `/index.php/cause-category/ongoing/` | `/projects/ongoing` |
| `/index.php/cause-category/past/` | `/projects/past` |

---

## What We Do (clean slugs; redirect broken localhost imports)

| OLD | NEW |
|-----|-----|
| `/index.php/http-localhost-madam-madam-agriculture-2/` | `/what-we-do/agriculture` |
| `/index.php/http-localhost-madam-madam-agriculture/` | `/what-we-do/agriculture` |
| `/index.php/http-localhost-madam-madam-skills-development/` | `/what-we-do/skills-development` |
| `/index.php/http-localhost-madam-madam-generating-income/` | `/what-we-do/generating-income` |
| `/index.php/http-localhost-madam-madam-as-part-of-an-inter-national-network/` | `/what-we-do/network` |

---

## News posts

Pattern:

| OLD | NEW |
|-----|-----|
| `/index.php/YYYY/MM/DD/{slug}/` | `/news/{slug}` |

Also redirect date-based paths → slug-only for bookmarks.

Example:

| OLD | NEW |
|-----|-----|
| `/index.php/2026/07/13/invitation-to-tender/` | `/news/invitation-to-tender` |

Numeric/empty-title posts (e.g. `/index.php/2026/01/14/1792/`) — migrate only if content exists; otherwise 410 or redirect to `/news`.

---

## Projects (individual)

Once project slugs are finalized in Sanity:

| OLD (Avas cause URLs when discovered) | NEW |
|---------------------------------------|-----|
| `/index.php/causes/{slug}/` | `/projects/{slug}` |

Document each discovered cause URL during migration and add an explicit redirect row.

Known ongoing titles (slugs TBD during seed):

- classroom-to-commerce
- psave (may have multiple cards on WP — consolidate carefully)
- psufons
- skills-up
- ytsc
- addiction-and-kush
- agro-tech
- profons

---

## Donation / system pages

| OLD | NEW |
|-----|-----|
| `/index.php/donation/` | `/support-us` |
| `/index.php/donation-history/` | `/support-us` |
| `/index.php/donation-confirmation/` | `/support-us` |
| `/index.php/donation-failed/` | `/support-us` |
| `/index.php/donor-dashboard/` | `/support-us` |
| `*-2` GiveWP duplicates | `/support-us` |

---

## Optional / low-priority

| OLD | NEW |
|-----|-----|
| `/index.php/volunteers/` | `/volunteers` or redirect `/contact` (confirm nav usage) |
| `/index.php/become-volunteer/` | `/become-volunteer` or redirect |
| `/index.php/sample-page/` | `/` (301) |

---

## Catch-all WordPress prefix

Also redirect:

- `/index.php/:path*` → `/:path*` when a matching Next route exists
- Preserve query strings where safe

Implementation lives in `next.config.ts` `redirects()`.

---

## Canonical policy

- Canonical URLs **omit** `/index.php/`
- Prefer https://www.madam-sl.org/{path}
- Trailing slash: Next.js default (configure consistently; match redirects both with and without trailing slash)
