// Front-end side of checkout. The browser only sends product ids; the server decides the price.
const base = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || '';
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || '';

export const checkoutConfigured = Boolean(base && anon);

async function call<T>(fn: string, body: unknown): Promise<T> {
  const res = await fetch(`${base}/functions/v1/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: anon, Authorization: `Bearer ${anon}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Request failed');
  return data as T;
}

export const startCheckout = (ids: string[]) => call<{ url: string }>('create-checkout', { ids });
export const fetchDownloads = (sessionId: string) =>
  call<{ email: string | null; items: string[]; downloads: { name: string; url: string }[] }>('get-downloads', { session_id: sessionId });
