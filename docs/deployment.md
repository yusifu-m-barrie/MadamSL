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
- [ ] Studio only for authenticated Sanity users  
- [ ] Webhook secret required  
- [ ] Contact form rate-limited  
- [ ] HTTPS only  
