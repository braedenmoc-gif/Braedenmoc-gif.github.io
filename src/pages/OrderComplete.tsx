import { useEffect, useState } from 'react';
import { Link } from '@/router';
import { Check, Download, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { fetchDownloads } from '@/lib/checkout';

type State =
  | { s: 'loading' }
  | { s: 'error'; msg: string }
  | { s: 'ok'; email: string | null; items: string[]; downloads: { name: string; url: string }[] };

function sessionId() {
  const q = window.location.search || window.location.hash.split('?')[1] || '';
  return new URLSearchParams(q.startsWith('?') ? q : `?${q}`).get('session_id');
}

export default function OrderComplete() {
  const { clear } = useCart();
  const [st, setSt] = useState<State>({ s: 'loading' });

  useEffect(() => {
    const id = sessionId();
    if (!id) { setSt({ s: 'error', msg: 'No order found in this link.' }); return; }
    fetchDownloads(id)
      .then((r) => { setSt({ s: 'ok', ...r }); clear(); })
      .catch((e) => setSt({ s: 'error', msg: e instanceof Error ? e.message : 'Could not load your order.' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-nearblack py-32">
      <div className="container-x">
        <div className="mx-auto max-w-lg text-center">
          {st.s === 'loading' && <p className="text-silver">Confirming your payment...</p>}
          {st.s === 'error' && (
            <>
              <AlertCircle className="mx-auto h-10 w-10 text-amber-400" />
              <h1 className="mt-4 font-display text-5xl uppercase leading-none text-offwhite">We could not load that order.</h1>
              <p className="mt-4 text-silver">{st.msg} If you were charged, check your Stripe receipt email and contact us with it, and we will send your files.</p>
              <Link to="/contact" className="btn-primary mt-8">Contact us</Link>
            </>
          )}
          {st.s === 'ok' && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-electric/30 bg-electric/10 text-electric"><Check className="h-8 w-8" /></div>
              <h1 className="font-display text-5xl uppercase leading-none text-offwhite">You're in.</h1>
              <p className="mt-4 text-silver">Payment confirmed{st.email ? ` for ${st.email}` : ''}. Download your files below. The links are good for one hour; reload this page for fresh ones.</p>
              <ul className="mt-8 space-y-3 text-left">
                {st.downloads.map((d) => (
                  <li key={d.url}>
                    <a href={d.url} className="card-surface flex items-center justify-between p-4 hover:border-electric/40">
                      <span className="font-headline text-sm uppercase tracking-wider2 text-offwhite">{d.name}</span>
                      <Download className="h-4 w-4 text-electric" />
                    </a>
                  </li>
                ))}
              </ul>
              <Link to="/film-room" className="btn-outline mt-8">Try the QB Lab</Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
