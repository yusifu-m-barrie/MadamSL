# Fix: Sanity Studio "Failed to fetch"

This error almost always means the Studio in your browser cannot call (or keep open) some Sanity API connections.

Your project `n5hnlyba` is valid. Uploads can still work while **realtime listen** requests time out.

## 1. Add CORS (required)

1. Open: https://www.sanity.io/manage/project/n5hnlyba/api
2. Under **CORS origins**, click **Add CORS origin**
3. Origin: `http://localhost:3000`
4. Enable **Allow credentials**
5. Also add `http://127.0.0.1:3000` the same way
6. Save

## 2. Restart Next.js

```bash
# Ctrl+C then:
npm run dev
```

Hard-refresh the site: http://localhost:3000 (Ctrl+Shift+R)

## 3. Hero image not showing?

1. In Studio → **Website Images** → confirm **Publish** (not only Save draft)
2. Use field **Homepage → Hero slide 1 / 2 / 3**
3. Restart + hard refresh the homepage
4. In the terminal you should see: `[sanity] siteImages heroSlide1: ...` with a URL or ref (not `missing`)

## 4. Studio timeout noise

Messages like `Failed to resolve initial value for template ... TimeoutError` are usually **listen/realtime** calls failing (firewall, VPN, ad blocker, or CORS without credentials).

Studio can still edit/publish. Try:

- Chrome without extensions / Incognito
- Disable VPN temporarily
- Confirm CORS **Allow credentials** is on

## 5. Sign in

Use the Sanity account that owns project `n5hnlyba`.
