# MADAM Sierra Leone Website

Faithful rebuild of [madam-sl.org](https://www.madam-sl.org/) using **Next.js + Sanity**.

> This is **not** a redesign. Visual identity, structure, and content follow the existing WordPress site.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Sanity CMS (embedded Studio at `/studio`)
- next-sanity, GROQ, Portable Text

## Documentation

See [`docs/README.md`](./docs/README.md).

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Public site |
| http://localhost:3000/studio | Sanity Studio |

Create a Sanity project at https://www.sanity.io/manage and set `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`.

Until Sanity is configured, the site renders from local seed content so UI development can continue.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js + Studio |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typegen` | Sanity typegen (when configured) |

## License

Private — MADAM Sierra Leone.
