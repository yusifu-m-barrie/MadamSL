# Content Editor Guide — MADAM Website

This site is managed in **Sanity Studio** (no WordPress login).

## Open the Studio

1. Go to `https://www.madam-sl.org/studio` (or your staging URL + `/studio`)
2. Sign in with the Sanity account you were invited to
3. You will see content types: Pages, News, Projects, Staff, Partners, Settings, Navigation

---

## Edit a page

1. Open **Pages**
2. Select the page (e.g. About)
3. Edit the title, hero, or sections
4. Click **Publish** when ready (or keep as Draft)

Sections are building blocks (text, image + text, staff list, etc.). Ask a developer before requesting a brand-new section type.

## Create a news post

1. Open **News** → Create
2. Add **Title** (required)
3. Confirm the **Slug** (URL piece under `/news/…`)
4. Add **Excerpt**, **Main image**, and **Body**
5. Set **Category** and **Author** if needed
6. Set **Published at** date
7. **Publish**

Unpublish: open the post → ellipsis / Unpublish (keeps draft off the public site).

## Website Images (upload by location)

In Sanity Studio open **Website Images**. Each field is labeled by where it appears on [madam-sl.org](https://www.madam-sl.org/):

| Studio field | Appears on |
|--------------|------------|
| Header / Footer logo | Site header |
| Homepage → Hero slide 1 image | Slider 1 — “Helping People to help themselves” |
| Homepage → Hero slide 2 image | Slider 2 — “PROMOTING CLIMATE SMART AGRICULTURE” |
| Homepage → Hero slide 3 image | Slider 3 — “Helping People to help themselves” |
| Homepage → Programs section — full background image | Full-width band behind Agriculture / Skills / Income |
| Homepage → About MADAM image | About section photo |
| Homepage → Our Impact → … (6 fields) | Circular impact photos |
| Homepage → Donors & Partners logos | Partner row |
| About → Testimonials section — background image | Full-width photo behind About page Testimonials |
| Where we work → Sierra Leone locations map | District map with location pins |
| Inner pages → default banner | Page hero backgrounds |

Upload → Publish. Empty slots show a reminder on the site until an image is added.

Staff photos: edit each **Staff** document.  
News featured images: edit each **News** post.  
Project images: edit each **Project**.

## Homepage videos (below Latest News)

1. Open **Homepage Videos** in Studio
2. Click **Add item** under Videos
3. Choose source:
   - **YouTube link** — paste a YouTube URL
   - **Upload video file** — upload mp4/webm from your computer
   - **External video URL** — paste a direct `.mp4` / `.webm` link
4. Optional: add a **Title**
5. **Publish**

Videos appear in a two-column row under Latest News (like the live MADAM site).

## First-time: load website content into Studio

The public site already has projects, staff, news, etc. To edit that same data in Studio:

1. Create an **Editor** API token: [Sanity → API → Tokens](https://www.sanity.io/manage/project/n5hnlyba/api#tokens)
2. Add it to `.env.local`:
   `SANITY_API_WRITE_TOKEN=sk...`
3. From the project folder run:
   `npm run seed:sanity`
4. Refresh `/studio` — Projects, Staff, News, Partners, Pages, and Navigation will be filled

After seeding:

- **Projects** → open any project → upload **Featured image** and **Project images (add one or more)**
- **Staff** → open a person → upload **Staff photo**

Re-running the seed updates text safely and **keeps images** you already uploaded on those documents.

## Manage projects

1. Open **Projects**
2. Create or edit a project
3. Set **Status** to **Ongoing** or **Past** (controls which listing page it appears on)
4. Add **Title**, **Slug**, **Summary**, and optional **Body**
5. Images (works for ongoing and past):
   - **Featured image** — shown on listing cards and as the main photo
   - **Project images (add one or more)** — gallery on the project detail page; add as many as you need
6. Optional: locations, partners, dates
7. **Publish**

Past projects matching the live site include Agro-tech, ProFoNS, EncompasE, and Returnee migrants — create matching **Past** documents in Studio to manage their images and full text.

## Manage staff

Staff are organized in Studio like the website:

- **Staff → Administrative Staff**
- **Staff → Our Projects Staff**
- **Staff → Youth Training Center Staff**

1. Open the matching folder
2. Edit a person (name, position, **Staff photo**)
3. For project staff, set **Project team label** (e.g. PSAVE Project Staff)
4. Use **Sort order** to control display order
5. Uncheck **Active** to hide without deleting
6. **Publish**

## Site settings

Under **Site Settings**:

- Logo, contact address/phone/email
- Social links
- Default SEO title/description
- Support Us button label/link
- Copyright line

## Navigation

Under **Navigation**:

- Change labels and links
- Add/remove dropdown children
- Reorder items

Keep the structure close to the public MADAM menu visitors already know.

## Preview before publish

1. Save a **Draft**
2. Use **Presentation** / Preview (eye icon) if enabled
3. Check the page looks correct
4. Then **Publish**

## Tips

- Publish small changes often
- Do not invent statistics or staff details
- If something looks broken, unpublish and contact the web team
- Studio access is by invitation only — do not share passwords
