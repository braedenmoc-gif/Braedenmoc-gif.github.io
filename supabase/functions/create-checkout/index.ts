// Creates a Stripe Checkout Session from a cart of product ids. Prices come from the server catalog.
import { CATALOG } from '../_shared/catalog.ts';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const site = (Deno.env.get('SITE_URL') ?? '').replace(/\/$/, '');
    if (!stripeKey || !site) return json({ error: 'Checkout is not configured.' }, 500);

    const { ids } = await req.json() as { ids?: string[] };
    const unique = [...new Set(ids ?? [])].filter((id) => CATALOG[id]);
    if (unique.length === 0) return json({ error: 'Cart is empty.' }, 400);
    // If the bundle is present, drop the individual items it already contains.
    const hasBundle = unique.includes('sku_bundle_004');
    const items = unique.filter((id) => !(hasBundle && id !== 'sku_bundle_004'));

    const form = new URLSearchParams();
    form.set('mode', 'payment');
    form.set('success_url', `${site}/order-complete?session_id={CHECKOUT_SESSION_ID}`);
    form.set('cancel_url', `${site}/checkout`);
    form.set('allow_promotion_codes', 'true');
    items.forEach((id, i) => {
      const it = CATALOG[id];
      form.set(`line_items[${i}][quantity]`, '1');
      form.set(`line_items[${i}][price_data][currency]`, 'usd');
      form.set(`line_items[${i}][price_data][unit_amount]`, String(it.cents));
      form.set(`line_items[${i}][price_data][product_data][name]`, it.name);
      form.set(`line_items[${i}][price_data][product_data][metadata][sku]`, it.id);
    });
    form.set('metadata[skus]', items.join(','));

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) { console.error('stripe error', data?.error?.message); return json({ error: 'Could not start checkout.' }, 502); }
    return json({ url: data.url });
  } catch (e) {
    console.error(e);
    return json({ error: 'Unexpected error.' }, 500);
  }
});
