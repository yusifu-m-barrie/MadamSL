# Deployment

## Prerequisites

- Node.js 20+
- Sanity project (create at https://www.sanity.io/manage)
- Hosting: Vercel recommended for Next.js

## Environment variables

Copy `.env.example` → `.env.local` (never commit secrets).

| Variable | Public? | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | yes | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | yes | e.g. `2025-01-01` |
| `NEXT_PUBLIC_SANITY_ADMIN_EMAILS` | yes | Full Studio dashboard (comma-separated) |
| `NEXT_PUBLIC_SANITY_NEWS_EMAILS` | yes | News + News Letters only |
| `NEXT_PUBLIC_SANITY_PROJECTS_EMAILS` | yes | Projects only |
| `NEXT_PUBLIC_SANITY_STAFF_EMAILS` | yes | Staff only |
| `NEXT_PUBLIC_SANITY_PAGES_EMAILS` | yes | Pages + What We Do (not Home or Contact) |
| `NEXT_PUBLIC_SANITY_COMMS_EMAILS` | yes | News + News Letters + Projects |
| `NEXT_PUBLIC_SANITY_NEWS_EDITOR_EMAILS` | yes | Legacy alias for communications emails |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin |
| `SANITY_API_READ_TOKEN` | **no** | Draft/preview reads |
| `SANITY_REVALIDATE_SECRET` | **no** | Webhook auth |
| `SANITY_API_WRITE_TOKEN` | **no** | Migration scripts only |
| `CONTACT_FORM_TO` | **no** | Inbox for contact form |
| `RESEND_API_KEY` | **no** | Optional email delivery |

## Sanity setup

```bash
npx sanity login
npx sanity init # if creating standalone; this repo embeds Studio
```

Deploy schema:

```bash
npm run sanity:deploy   # optional, for hosted Studio features
```

Add CORS origin for local (`http://localhost:3000`) and production domain in Sanity manage → API → CORS.

## Inviting Studio users (handover)

1. In [Sanity Manage → Members](https://www.sanity.io/manage/project/n5hnlyba), invite the person:
   - **Free plan:** use **Administrator** for anyone who must publish (Editor is a Growth-plan role). The Studio allowlist still limits their sidebar.
   - Do not use **Viewer** (cannot edit) or **Blueprint**.
2. Add the same email to the matching `NEXT_PUBLIC_SANITY_*_EMAILS` variable on Vercel (and `.env.local` for local).
3. Redeploy so Studio picks up the list.
4. They open `https://www.madam-sl.org/studio` and sign in.

Unlisted Editor accounts see **Access denied**. See [content-editor-guide.md](./content-editor-guide.md) for the role table.

## Webhook (revalidation)

In Sanity → API → Webhooks:

- URL: `https://<domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`
- Trigger: Create / Update / Delete
- Dataset: production

## Vercel

1. Import Git repo  
2. Set env vars  
3. Build command: `npm run build`  
4. Output: Next.js default  

## DNS cutover checklist

1. Production build green  
2. Redirects tested for top WP URLs  
3. Sanity content seeded  
4. Forms deliver mail  
5. Lower TTL → point apex/www to Vercel  
6. Keep WP read-only briefly for rollback  

## Security checklist

- [ ] No tokens in client bundle (verify build)  
- [ ] Studio only for invited Sanity users on the email allowlist (role lists in env)  
- [ ] Webhook secret required  
- [ ] Contact form rate-limited  
- [ ] HTTPS only  
