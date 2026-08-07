# MADAM Sierra Leone — Documentation Index

Rebuild of https://www.madam-sl.org/ as **Next.js + TypeScript + Tailwind + Sanity**.

This is a **faithful migration**, not a redesign.

## Docs

| Document | Purpose |
|----------|---------|
| [site-audit.md](./site-audit.md) | Live site structure, UI, pages, colors |
| [content-model.md](./content-model.md) | Sanity schemas & editable vs static |
| [url-map.md](./url-map.md) | Old WP URLs → new routes + redirects |
| [architecture.md](./architecture.md) | Technical architecture decisions |
| [migration-notes.md](./migration-notes.md) | Gaps, placeholders, open decisions |
| [deployment.md](./deployment.md) | Env vars, hosting, webhooks |
| [content-editor-guide.md](./content-editor-guide.md) | Non-developer CMS how-to |

## Quick start (after install)

```bash
cp .env.example .env.local
# fill Sanity project id + dataset
npm install
npm run dev
```

- Website: http://localhost:3000  
- Studio: http://localhost:3000/studio  

## Phase status

See repository README / project board. Phase 1 (audit + docs) complete; implementation continues in phases 2–10.
