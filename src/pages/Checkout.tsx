import { Link } from '@/router';
import { useState } from 'react';
import { Lock, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { checkoutConfigured, startCheckout } from '@/lib/checkout';

export default function Checkout() {
  const { items, subtotal, setQty, remove } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setError(null);
    setBusy(true);
    try {
      const { url } = await startCheckout(items.map((i) => i.product.id));
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start checkout.');
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="bg-nearblack py-32">
        <div className="container-x">
          <div className="mx-auto max-w-md text-center">
            <h1 className="font-display text-5xl uppercase leading-none text-offwhite">Your cart is empty.</h1>
            <p className="mt-4 text-base text-silver">Add a resource to your cart to check out.</p>
            <Link to="/resources" className="btn-primary mt-8">Browse Resources</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="border-b border-white/[0.06] bg-charcoal">
        <div className="container-x flex items-center gap-2 py-4 text-xs">
          <Link to="/resources" className="flex items-center gap-1 font-headline uppercase tracking-wider2 text-silver hover:text-offwhite transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
          </Link>
        </div>
      </div>

      <section className="bg-nearblack py-16">
        <div className="container-x">
          <h1 className="mb-10 font-display text-5xl uppercase leading-none text-offwhite">Checkout.</h1>

          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            {/* Form */}
            <div className="reveal">
              {!checkoutConfigured && (
                <div className="mb-6 flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <p className="font-headline text-sm font-semibold uppercase tracking-tight text-amber-200">Payments are not connected yet</p>
                    <p className="mt-1 text-sm text-silver">
                      This preview is not connected to a payment account, so no orders can be placed here. The checkout button is disabled until Stripe is set up.
                    </p>
                  </div>
                </div>
              )}

              <div className="card-surface p-6">
                <h2 className="mb-2 font-headline text-sm font-semibold uppercase tracking-wider2 text-offwhite">Secure payment</h2>
                <p className="text-sm text-silver">
                  You will be taken to Stripe to pay by card, Apple Pay, or Google Pay. Your card details go directly to Stripe and never touch this site. After payment you return here to download your files right away.
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-silver">
                  <li>Digital PDFs. Nothing is shipped.</li>
                  <li>Download links stay available on the confirmation page. Save the files once you have them.</li>
                  <li>14-day satisfaction guarantee.</li>
                </ul>
                {error && <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
                <button type="button" onClick={handleCheckout} disabled={!checkoutConfigured || busy} className="btn-primary mt-6 w-full">
                  {busy ? 'Opening Stripe...' : `Pay $${subtotal} with Stripe`}
                </button>
                <div className="mt-4 flex items-center gap-2 text-xs text-silver/60">
                  <Lock className="h-3.5 w-3.5" /> Payments processed by Stripe
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="reveal">
              <div className="card-surface p-6 lg:sticky lg:top-24">
                <h2 className="mb-4 font-headline text-sm font-semibold uppercase tracking-wider2 text-offwhite">Order Summary</h2>
                <ul className="space-y-4">
                  {items.map(({ product, qty }) => (
                    <li key={product.id} className="flex gap-3 border-b border-white/[0.06] pb-4 last:border-0">
                      <div className={`flex h-14 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${product.cover.hue} border border-white/10`}>
                        <span className="font-display text-[10px] uppercase text-white/90">{product.cover.label}</span>
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-headline text-sm font-medium text-offwhite leading-snug">{product.name}</span>
                          <span className="font-headline text-sm font-bold text-offwhite">${product.price * qty}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 border border-white/10 rounded">
                            <button type="button" onClick={() => setQty(product.id, qty - 1)} className="flex h-6 w-6 items-center justify-center text-silver hover:text-offwhite">–</button>
                            <span className="w-6 text-center text-xs text-offwhite">{qty}</span>
                            <button type="button" onClick={() => setQty(product.id, qty + 1)} className="flex h-6 w-6 items-center justify-center text-silver hover:text-offwhite">+</button>
                          </div>
                          <button type="button" onClick={() => remove(product.id)} className="text-xs uppercase tracking-wider2 text-silver/50 hover:text-red-400">Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 space-y-2 border-t border-white/[0.06] pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-silver">Subtotal</span>
                    <span className="text-offwhite">${subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-silver">Tax</span>
                    <span className="text-offwhite">$0.00</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                    <span className="font-headline text-base font-semibold uppercase tracking-wider2 text-offwhite">Total</span>
                    <span className="font-headline text-2xl font-bold text-offwhite">${subtotal}</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs text-silver/60">
                  <ShieldCheck className="h-4 w-4" /> 14-day satisfaction guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
