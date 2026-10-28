// Set SITE_URL (e.g. https://yourdomain.com) as a function secret. Only that origin may call these functions from a browser.
export function corsHeaders(req: Request) {
  const allowed = (Deno.env.get('SITE_URL') ?? '').replace(/\/$/, '');
  const origin = req.headers.get('origin') ?? '';
  const ok = allowed && origin === allowed;
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed || 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}
