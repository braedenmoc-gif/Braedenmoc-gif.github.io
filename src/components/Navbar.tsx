import { useEffect, useState } from 'react';
import { Link, useLocation } from '@/router';
import { Menu, X, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const nav = [
  { label: 'Home', to: '/' },
  { label: 'The Program', to: '/program' },
  { label: 'Training Resources', to: '/resources' },
  { label: 'Free QB Lab', to: '/film-room' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, openCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-white/[0.06] bg-nearblack/85 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'}`}>
        <div className="container-x flex h-16 items-center justify-between sm:h-18">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-charcoal transition-colors group-hover:border-electric/50">
              <span className="font-display text-lg leading-none text-electric">Q</span>
              <span className="absolute -bottom-px left-1/2 h-px w-5 -translate-x-1/2 bg-electric/60" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-headline text-sm font-semibold uppercase tracking-wider2 text-offwhite">QB Blueprint</span>
              <span className="font-headline text-[9px] uppercase tracking-[0.3em] text-silver/60">Quarterback</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
              return (
                <Link key={item.to} to={item.to} className={`relative px-3.5 py-2 font-headline text-xs font-medium uppercase tracking-wider2 transition-colors duration-200 ${active ? 'text-offwhite' : 'text-silver hover:text-offwhite'}`}>
                  {item.label}
                  {active && <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-electric" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={openCart} className="relative flex items-center gap-2 rounded-md border border-white/10 bg-charcoal px-3.5 py-2 text-offwhite transition-colors hover:border-white/25" aria-label="Open cart">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline font-headline text-xs font-semibold uppercase tracking-wider2">Cart</span>
              {count > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-electric px-1 text-[10px] font-bold text-white">{count}</span>}
            </button>
            <button onClick={() => setOpen((v) => !v)} className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-charcoal text-offwhite transition-colors hover:border-white/25 lg:hidden" aria-label="Toggle menu">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className={`overflow-hidden border-t border-white/[0.06] bg-nearblack/95 backdrop-blur-xl transition-[max-height] duration-300 ease-out lg:hidden ${open ? 'max-h-96' : 'max-h-0'}`}>
          <nav className="container-x flex flex-col py-3">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} className="flex items-center justify-between border-b border-white/[0.04] py-3 font-headline text-sm font-medium uppercase tracking-wider2 text-silver hover:text-offwhite">
                {item.label}
                <ChevronRight className="h-4 w-4 text-silver/40" />
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="h-16 sm:h-18" />
    </>
  );
}
