# MADAM Sierra Leone — Site Audit

**Source of truth:** https://www.madam-sl.org/  
**Audited:** 2026-08-07  
**Stack observed:** WordPress + Avas theme + Elementor + Slider Revolution + GiveWP + Contact Form 7 + Yoast SEO + Jetpack

> This is a visual/content fidelity rebuild, not a redesign. The live site is the design reference.

---

## Global components

### Header

- Theme: **Avas** (charity template) with Elementor overlays on many pages.
- Custom logo (WordPress `wp-custom-logo`).
- Primary logo assets observed:
  - `https://www.madam-sl.org/wp-content/uploads/2024/11/logo-removebg-preview.png`
  - `https://www.madam-sl.org/wp-content/uploads/2024/10/cropped-images.jpeg` (Yoast/schema logo; 299×113)
  - Legacy: `logo-charity-s.png`, `logo-charity-red-white.png`
- Sticky/header behavior follows Avas defaults (sticky on scroll on desktop; hamburger on mobile).
- CTA: **Support Us** (linked to `/index.php/support-us/` / donation flows via GiveWP).

### Navigation (primary)

Inferred from published pages + IA (menu REST API is private). Structure to reproduce:

| Top-level | Children |
|-----------|----------|
| **Home** | — |
| **Who We Are** | About Us · Mission & Vision · Core Values · Diversity, Equity & Inclusion · Administrative Staff · Projects Staff · Youth Training Center Staff |
| **What We Do** | Agriculture · Skills Development · Generating Income · (Inter-)national Network |
| **Our Projects** | Ongoing Projects · Past Projects |
| **Where We Work** | — |
| **News** | Latest News · Newsletter |
| **Contact Us** | — |
| **Support Us** (CTA) | Donation / Support |

### Mobile navigation

- Hamburger / off-canvas menu (Avas pattern).
- Same hierarchy as desktop dropdowns.
- Must remain keyboard-accessible in the Next.js rebuild.

### Footer

Typical Avas charity footer patterns observed/expected (confirm visually during QA):

- Logo + short organisation blurb
- Quick links / secondary nav
- Contact block (address, phone, email)
- Social icons
- Copyright / site credit

### Contact information (public)

| Field | Value |
|-------|-------|
| Address | 250 Makambo Magburaka Highway, Makeni, Sierra Leone |
| Phone | +232-76 687 091 |
| Email | info@madam-sl.org |
| Org full name | Mankind’s Activities for Development Accreditation Movement (MADAM) |

### Social links

| Network | URL / handle |
|---------|----------------|
| Facebook | https://www.facebook.com/africaagrilinks/ |
| X (Twitter) | https://x.com/madamsl1 (`@madamsl1`) |

### Global typography

From Elementor homepage CSS:

- Primary UI font stack: **Helvetica**, Sans-serif
- Secondary: **Roboto**, Sans-serif (Elementor defaults)
- Google fonts also loaded by plugins (Inter for GiveWP — not brand-primary)

### Global colors (from Elementor post-416 / homepage CSS)

| Role | Hex | Notes |
|------|-----|-------|
| Brand green (primary) | `#1FB53A` | Frequent on homepage |
| Brand green (alt) | `#0FB629`, `#33C44C` | Variants / hover |
| Accent coral/red | `#e85942`, `#e5452b` | CTAs / emphasis |
| Text | `#000000`, `#121212` | Body / headings |
| Muted | `#7a7a7a` | Secondary text |
| Surface | `#F9F9F9`, `#FFFFFF` | Section backgrounds |

CSS variables for the rebuild should centre on **green `#1FB53A`** + **coral `#e85942`**.

### Global spacing / layout

- Elementor section-based layouts; content width typically ~1140–1200px.
- Homepage uses multi-section vertical stacking: hero slider → about → program cards → projects → partners → news → footer.
- Rounded image treatments and icon boxes from Avas/Elementor widgets.

### Recurring components

- Hero / Revolution Slider (`Helping People to help themselves`, `PROMOTING CLIMATE SMART AGRICULTURE`)
- Image + text / icon boxes (program areas)
- Project (“cause”) cards
- Staff photo cards (name + title)
- Partner / donor logo carousel
- Latest news list / cards
- Testimonials (About page)
- Contact info blocks + Contact Form 7
- Donation / Support Us (GiveWP — migrate carefully; see migration notes)

---

## Pages

### Public content pages (migrate)

| Title | Current URL |
|-------|-------------|
| Home Charity (front) | `/` |
| About | `/index.php/about/` |
| Mission & Vision | `/index.php/mission-vision/` |
| Core Values | `/index.php/core-values/` |
| Diversity, Equity & Inclusion | `/index.php/diversity-equity-inclusion/` |
| Administrative Staff (OUR STAFF) | `/index.php/our-staff/` |
| Projects Staff | `/index.php/our-projects-staff/` |
| Youth Training Center Staff | `/index.php/youth-training-center-staff/` |
| MADAM & Agriculture | `/index.php/http-localhost-madam-madam-agriculture-2/` (+ duplicate agriculture slug) |
| MADAM & Skills Development | `/index.php/http-localhost-madam-madam-skills-development/` |
| MADAM & Generating Income | `/index.php/http-localhost-madam-madam-generating-income/` |
| MADAM as part of an (inter-) national network | `/index.php/http-localhost-madam-madam-as-part-of-an-inter-national-network/` |
| Causes (projects hub) | `/index.php/causes/` |
| Ongoing | `/index.php/causes-2/` + `/index.php/cause-category/ongoing/` |
| Past | `/index.php/past/` + `/index.php/cause-category/past/` |
| Where We Work | `/index.php/where-we-work/` |
| News | `/index.php/news/` |
| News Letter | `/index.php/news-letter/` |
| Contact | `/index.php/contact/` |
| Support Us | `/index.php/support-us/` |

### Donation / GiveWP system pages (special handling)

| Title | URL | Migration approach |
|-------|-----|--------------------|
| Donation | `/index.php/donation/` | Rebuild as Support Us CTA + external/manual donate guidance unless payment gateway is required |
| Donation History / Confirmation / Failed / Donor Dashboard (+ `-2` duplicates) | various | Do not rebuild GiveWP admin flows; redirect Support Us |

### Theme leftovers (do not feature in nav)

- `/index.php/sample-page/`
- `/index.php/volunteers/`, `/index.php/become-volunteer/` (present; confirm if linked in live nav during visual QA)
- Duplicate agriculture page: `/index.php/http-localhost-madam-madam-agriculture/`

### News posts

- ~31 published posts under `/index.php/YYYY/MM/DD/{slug}/`
- Categories include: News, Sustainability, Sustainable agriculture, Training, Uncategorized
- Some posts have empty titles (numeric slugs like `1792`) — migrate only quality content; document empties

### Forms

1. **Contact form** (Contact Form 7) on Contact page — fields to reproduce after visual inspection (name, email, message at minimum).
2. **Newsletter** — newsletter page focuses on downloadable newsletters; confirm subscription form during visual QA.
3. **Donation forms** — GiveWP (test mode observed on homepage body classes).

### Search

- Yoast schema advertises `/?s={search_term_string}` WordPress search.
- Reproduce a simple site search only if it is visibly present in the header UI; otherwise skip adding a new search product.

---

## Homepage sections (content inventory)

From OG description + search snippets + Elementor CSS:

1. **Hero slider** — taglines: “Helping People to help themselves”, “PROMOTING CLIMATE SMART AGRICULTURE”
2. **About MADAM** — org intro (est. 1991; northern focus; women/youth/children)
3. **Campus / HQ note** — office along Makeni–Magburaka highway; TVET; Nelis guesthouse & conference
4. **Program / “What we do” cards** — Agriculture, Skills/TVET, Income generation, network/partners themes
5. **Featured projects / causes** — PSAVE, Skills Up!, agriculture value-add, YTSC, etc.
6. **Donors & Partners** — logo carousel
7. **Latest News** — recent posts
8. **Footer**

> Note: Direct HTML fetch of `/` returned an empty `<body>` (head ~145KB of assets). Content is confirmed via WP REST API excerpts, Yoast OG text, and search index snippets. Visual QA against a browser is required for pixel spacing.

---

## Staff (public only)

### Administrative Staff

| Name | Position |
|------|----------|
| Mohamed Sorie ConteH | Director |
| Edward Conteh | Head of Programmes |
| David Kanu | Finance Manager |
| Kadiatu Kamara | Assistant Administration |
| Sorie Bakarr Kamara | Communications Officer |
| John Fornah | IT Officer |

### Projects Staff (teams observed)

- **PSAVE:** Mohamed Kamara (PM), Ibrahim Alpha Turay, Suleiman Conteh, Momodu Sahr Thoronka, Mohamed Thullah, Mariama Tarawalie, Salamatu Conteh, Ramatu Salim Kamara, …
- **PSuFONs:** Momoh Lawrence Turay (PM), Haja Sorie Conteh, Joseph S. Bangura, Esther Rosa Mansaray, …
- **Classroom to Commerce:** Abass S. John Trye (PM), …
- **EncompasE:** Hassan Sorie Koroma, Sampha Kamara, …

### Youth Training Center Staff

Rev. John Sembeka Bangura, Edward E. Sessay, Elizabeth Hawa Munu, and instructors across hotel/FB, welding, auto mechanic, electrical, bead work, etc.

---

## Technical observations

- Permalinks use **`/index.php/`** prefix (ugly permalinks / server rewrite quirk).
- Several “What We Do” slugs contain mistaken `http-localhost-madam-…` from a local import — clean on new site with 301s from old URLs.
- Homepage Elementor document ID: **416**; kit ID: **7**.
- Causes appear to use an Avas “cause” CPT / category (`cause-category/ongoing`) but Mod_Security blocked some archive fetches during audit.
- Security motivation for migration is validated: large plugin surface (Wordfence, Elementor, Give, Jetpack, RevSlider, etc.).
