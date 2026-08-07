# Migration Notes

## Gaps & blockers discovered during audit (2026-08-07)

1. **Homepage HTML body empty via curl**  
   Live `/` returns ~145KB of head assets but an empty `<body>`. Content confirmed via WP REST (`home-charity` excerpt), Yoast OG, and search snippets. **Visual QA in a real browser is mandatory** before calling homepage “done”.

2. **Cause archives blocked by Mod_Security**  
   `/index.php/cause-category/ongoing/` returned “Not Acceptable”. Project list reconstructed from public search snippets and Causes page index. Individual cause REST CPT was not exposed as `wp/v2/causes`.

3. **Broken “localhost” slugs**  
   What We Do pages were imported with slugs like `http-localhost-madam-madam-agriculture-2`. New site uses clean paths; old URLs get 301s.

4. **Empty / numeric news posts**  
   Several posts have empty titles (`1792`, `1787`, etc.). Do not invent titles; skip or mark draft until editors fix.

5. **GiveWP in test mode**  
   Body classes include `give-test-mode`. Full donation checkout is **not** recreated as GiveWP. Support Us page will present contact/bank/partner instructions until a payment provider is chosen.

6. **Menu API private**  
   `wp/v2/menu-items` requires auth. Nav structure documented from IA + page set; verify against live header during visual QA.

7. **Elementor kit CSS tiny**  
   `post-7.css` returned ~226 bytes (possibly blocked). Colors taken from homepage Elementor CSS `post-416.css`.

8. **Partner logos & hero slide images**  
   Not fully downloaded yet. Migration script should pull media referenced in page content into Sanity assets.

9. **Newsletter files**  
   Newsletter page is “Download News Letter” — PDF assets need manual or scripted upload to Sanity `newsletterIssue`.

10. **Testimonials**  
    About page includes Fatiza (YTSC) and Ramatu Salim Kamara quotes — migrate as `testimonials` section content, not fabricated extras.

11. **Typo on live site**  
    “CCRE VALUES” / “oranisation” appear on WP. Migrate **as published** unless editors request corrections (prefer fidelity first).

12. **Volunteers pages**  
    Exist in sitemap; unclear if in primary nav. Confirm before building dedicated UX.

---

## Placeholder policy

Use `[CONTENT PENDING — see migration-notes]` only in development seeds when source text cannot be retrieved. Never ship invented programme claims, staff bios, or impact statistics.

---

## Recommended migration order

1. Site settings + navigation + redirects  
2. Static-structure pages (About, Mission, Values, DEI, Contact, What We Do)  
3. Staff documents (photos from WP media)  
4. Projects (manual seed from Causes titles + page copy)  
5. News posts via WP REST → Sanity script  
6. Homepage sections + partners  
7. Forms + Support Us  
8. Visual QA pass  

---

## Automation

`scripts/migrate-wp.ts` (planned) should:

- Pull `wp/v2/posts` and `wp/v2/pages`
- Map HTML → Portable Text (basic)
- Upload featured images to Sanity
- Write documents with deterministic `_id`s for idempotent re-runs

---

## Open decisions for stakeholders

1. **Donations:** Keep informational Support Us only, or integrate Stripe/PayPal/Flutterwave?  
2. **Domain cutover:** DNS + keep WP as staging until QA sign-off?  
3. **Sanity project:** Create org project + invite editor emails.  
4. **Newsletter delivery:** Download-only vs email subscription provider?
