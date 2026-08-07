# Architecture — MADAM Next.js + Sanity

## Decision summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js App Router + TypeScript | Required; RSC by default |
| Styling | Tailwind CSS + CSS variables matching MADAM greens/coral | Utility speed + brand tokens |
| CMS | Sanity v3 + embedded Studio at `/studio` | One deployable app; editors use Sanity auth |
| Content API | `next-sanity` + GROQ | Official integration |
| Images | Sanity CDN + `@sanity/image-url` + `next/image` | Stop depending on WP media |
| Preview | Draft Mode + Presentation Tool | Official visual editing path |
| Revalidation | Tag-based `revalidateTag` + Sanity webhook | No aggressive polling |
| Forms | Next.js Route Handlers + server validation | No WP plugins |
| Studio hosting | **Embedded** `/studio` | Simpler ops for this org size |

---

## Repository layout

```text
madamsl/
├── docs/                      # Project documentation
├── public/                    # Static assets (favicon, fonts if self-hosted)
├── scripts/                   # WP → Sanity migration helpers
├── sanity/                    # Sanity config shared with Studio
│   ├── schemas/
│   ├── lib/
│   └── sanity.config.ts
├── src/
│   ├── app/
│   │   ├── (site)/            # Public website layouts
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       # Home
│   │   │   ├── about/
│   │   │   ├── news/
│   │   │   ├── projects/
│   │   │   ├── what-we-do/
│   │   │   └── ...
│   │   ├── studio/[[...tool]]/page.tsx
│   │   ├── api/
│   │   │   ├── draft-mode/
│   │   │   ├── revalidate/
│   │   │   └── contact/
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── layout/            # Header, Footer, SiteShell
│   │   ├── navigation/
│   │   ├── sections/          # Sanity section renderers
│   │   ├── cards/
│   │   ├── content/           # PortableText, SanityImage
│   │   └── ui/                # Button, Container, etc.
│   ├── sanity/
│   │   ├── lib/               # client, image, live, token
│   │   ├── queries/
│   │   └── types/
│   └── lib/                   # redirects helpers, utils
├── .env.example
└── package.json
```

---

## Rendering strategy

- **Server Components** fetch Sanity data for pages.
- **Client Components** only for: mobile menu, carousels/sliders, form widgets, draft overlays.
- Homepage and inner pages compose from `sections[]` → React map (`SectionRenderer`).

---

## Data flow

```text
Editor → Sanity Studio (/studio)
              ↓ publish
         Sanity Content Lake
              ↓ webhook
     POST /api/revalidate (secret)
              ↓
     revalidateTag('pages'|'posts'|…)
              ↓
         Next.js visitors
```

Draft:

```text
Studio Presentation → /api/draft-mode/enable → Draft Mode cookie → perspective: previewDrafts
```

---

## Security

- `SANITY_API_READ_TOKEN` / write tokens **server-only**
- `NEXT_PUBLIC_SANITY_*` project id + dataset only in browser
- No privileged tokens in client bundles
- Contact form: honeypot + rate limit + server Zod validation; email via provider env (Resend/SMTP)
- Security headers in `next.config.ts`
- Never commit `.env`

---

## URL & SEO

- Clean routes (see `url-map.md`)
- `generateMetadata` per page/post/project
- `sitemap.ts` + `robots.ts`
- 301 redirects for all WP `/index.php/` URLs

---

## Visual fidelity approach

1. Encode MADAM tokens (`--madam-green`, `--madam-coral`, Helvetica/system-sans stack matching live CSS)
2. Rebuild Header/Footer against live site screenshots
3. Section components mirror Elementor/Avas blocks without Elementor
4. Visual QA checklist per page (docs/migration-notes.md)

---

## What we deliberately do not migrate

- WordPress PHP, themes, plugins, Elementor JSON as runtime
- GiveWP donor dashboard (redirect to Support Us; document payment gap)
- Unused sample pages

---

## Environments

| Env | Dataset | Notes |
|-----|---------|-------|
| Local | `production` or `development` | `.env.local` |
| Preview | `production` + draft mode | Vercel preview |
| Production | `production` | CDN + ISR/tags |
