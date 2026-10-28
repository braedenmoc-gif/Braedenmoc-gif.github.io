// After Stripe redirects back, verify the session is PAID with Stripe, then return short-lived signed URLs
// for exactly the files that were purchased. Files live in a PRIVATE Storage bucket named "products".
import { createClient } from 'npm:@supabase/supabase-js@2';
import { CATALOG } from '../_shared/catalog.ts';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) return json({ error: 'Not configured.' }, 500);
    const { session_id } = await req.json() as { session_id?: string };
    if (!session_id || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(session_id)) return json({ error: 'Invalid session.' }, 400);

    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${session_id}`, { headers: { Authorization: `Bearer ${stripeKey}` } });
    const session = await res.json();
    if (!res.ok) return json({ error: 'Order not found.' }, 404);
    if (session.payment_status !== 'paid') return json({ error: 'Payment not completed.' }, 402);

    const skus: string[] = String(session.metadata?.skus ?? '').split(',').filter((s) => CATALOG[s]);
    const files = [...new Set(skus.flatMap((s) => CATALOG[s].files))];
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const downloads: { name: string; url: string }[] = [];
    for (const f of files) {
      const { data, error } = await admin.storage.from('products').createSignedUrl(f, 60 * 60, { download: f });
      if (error || !data) { console.error('sign error', f, error?.message); continue; }
      downloads.push({ name: f.replace(/_/g, ' ').replace('.pdf', ''), url: data.signedUrl });
    }
    return json({ email: session.customer_details?.email ?? null, items: skus.map((s) => CATALOG[s].name), downloads });
  } catch (e) {
    console.error(e);
    return json({ error: 'Unexpected error.' }, 500);
  }
});
