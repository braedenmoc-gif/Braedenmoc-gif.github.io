# Checkout setup (Stripe + Supabase)

Status: the code is written but has NOT been run against a live Stripe account. Test in Stripe test mode first.

How it works
1. Cart sends product ids to the `create-checkout` Edge Function. Prices are set on the server (`supabase/functions/_shared/catalog.ts`), not by the browser.
2. The function creates a Stripe Checkout Session and the browser redirects to Stripe.
3. After payment Stripe returns to `/order-complete?session_id=...`. The `get-downloads` function asks Stripe whether that session is paid, then returns 1-hour signed links to the PDFs in a private Storage bucket.

Steps
1. Supabase dashboard: Storage > New bucket > name `products`, keep it PRIVATE. Upload the three PDFs from `private-products/` with the exact file names.
2. Install the Supabase CLI and run `supabase login`, then `supabase link --project-ref <your-ref>`.
3. Set secrets (use your Stripe TEST secret key first, sk_test_...):
   `supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx SITE_URL=https://your-site-domain`
4. Deploy: `supabase functions deploy create-checkout` and `supabase functions deploy get-downloads`.
5. Make sure `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then rebuild and deploy the site.
6. Test with Stripe test card 4242 4242 4242 4242. Confirm you land on /order-complete and the files download.
7. Switch the secret to your live key (sk_live_...) only after the test passes.

Notes
- Never put the Stripe secret key in `.env` or any VITE_ variable. It belongs only in Supabase secrets.
- Prices exist in two places: `src/data/products.ts` (display) and `catalog.ts` (charged). Change both together.
- Emailing links to the buyer is not built. Stripe sends its own receipt; the download page is the delivery.
- The site must be served at the root of SITE_URL with normal (non-hash) routing for the Stripe return URL to work.
