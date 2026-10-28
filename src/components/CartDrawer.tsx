import { Link } from '@/router';
import { X, Minus, Plus, Trash2, Lock, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useEffect } from 'react';

export function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, setQty, remove, count } = useCart();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div className={`fixed inset-0 z-[60] bg-nearblack/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={closeCart} aria-hidden />
      <aside className={`fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-charcoal shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-label="Shopping cart">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="font-headline text-base font-semibold uppercase tracking-wider2 text-offwhite">
            Your Cart <span className="text-silver">({count})</span>
          </h2>
          <button onClick={closeCart} className="flex h-8 w-8 items-center justify-center rounded-md text-silver hover:bg-white/5 hover:text-offwhite" aria-label="Close cart">
            <X className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-headline text-lg uppercase tracking-tight text-offwhite">Your cart is empty</p>
            <p className="mt-2 text-sm text-silver">Browse the training resources and add a product to get started.</p>
            <Link to="/resources" onClick={closeCart} className="btn-primary mt-6">Browse Resources</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="flex gap-3 border-b border-white/[0.04] pb-4">
                    <div className={`flex h-20 w-16 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${product.cover.hue} border border-white/10`}>
                      <span className="font-display text-xs uppercase leading-none text-white/90 drop-shadow">{product.cover.label}</span>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <Link to={`/products/${product.slug}`} onClick={closeCart} className="font-headline text-sm font-semibold uppercase tracking-tight text-offwhite leading-snug hover:text-electric">{product.name}</Link>
                      <span className="mt-0.5 text-xs text-silver">{product.format}</span>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 border border-white/10 rounded-md">
                          <button onClick={() => setQty(product.id, qty - 1)} className="flex h-7 w-7 items-center justify-center text-silver hover:text-offwhite" aria-label="Decrease quantity"><Minus className="h-3 w-3" /></button>
                          <span className="w-6 text-center text-sm text-offwhite">{qty}</span>
                          <button onClick={() => setQty(product.id, qty + 1)} className="flex h-7 w-7 items-center justify-center text-silver hover:text-offwhite" aria-label="Increase quantity"><Plus className="h-3 w-3" /></button>
                        </div>
                        <span className="font-headline text-sm font-bold text-offwhite">${product.price * qty}</span>
                      </div>
                      <button onClick={() => remove(product.id)} className="mt-1.5 flex items-center gap-1 text-[11px] uppercase tracking-wider2 text-silver/60 hover:text-red-400"><Trash2 className="h-3 w-3" /> Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-white/[0.06] px-5 py-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-headline text-sm uppercase tracking-wider2 text-silver">Subtotal</span>
                <span className="font-headline text-2xl font-bold text-offwhite">${subtotal}</span>
              </div>
              <p className="mb-4 text-xs text-silver">Digital download · secure checkout via Stripe</p>
              <Link to="/checkout" onClick={closeCart} className="btn-primary w-full">Checkout <ArrowRight className="h-4 w-4" /></Link>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider2 text-silver/50"><Lock className="h-3 w-3" /> Secure encrypted payment</div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
