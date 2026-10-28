import { type Product } from '@/data/products';
import { ArrowUpRight } from 'lucide-react';

export function ProductMockup({
  product,
  className = '',
  size = 'md',
}: {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dim =
    size === 'lg'
      ? 'aspect-[3/4] w-full'
      : size === 'sm'
      ? 'aspect-[3/4] w-28'
      : 'aspect-[3/4] w-full';

  return (
    <div className={`relative ${dim} ${className}`}>
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md bg-white/[0.04] border border-white/[0.06]" />
      <div className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-md bg-white/[0.06] border border-white/[0.08]" />
      <div className={`relative h-full w-full rounded-md bg-gradient-to-br ${product.cover.hue} border border-white/10 overflow-hidden flex flex-col`}>
        <div className="flex items-center justify-between px-4 pt-4">
          <span className="font-headline text-[10px] font-semibold uppercase tracking-widest2 text-white/70">QB Blueprint</span>
          <span className="font-headline text-[10px] font-semibold uppercase tracking-widest2 text-white/40">PDF</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="mb-3 h-px w-10 bg-white/30" />
          <span className="font-display text-2xl sm:text-3xl uppercase leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">{product.cover.label}</span>
          <div className="mt-3 h-px w-10 bg-white/30" />
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-end justify-between gap-2">
            <p className="font-headline text-[9px] uppercase tracking-widest2 text-white/50 leading-tight">{product.tagline}</p>
            <span className="font-headline text-lg font-bold text-white">${product.price}</span>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col card-surface overflow-hidden transition-all duration-500 hover:border-white/[0.14] hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
      <div className="relative overflow-hidden p-6 pb-0 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="mx-auto transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.02]">
          <ProductMockup product={product} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 pt-5">
        <h3 className="mb-1 font-headline text-lg font-semibold uppercase tracking-tight text-offwhite leading-snug">{product.name}</h3>
        <p className="eyebrow mb-3">${product.price}</p>
        <p className="mb-4 text-sm leading-relaxed text-silver line-clamp-3">{product.shortDescription}</p>
        {product.highlight && (
          <p className="mb-4 rounded-sm border border-electric/30 bg-electric/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider2 text-electric">
            Featured: full anxiety section + 14-day workbook
          </p>
        )}
        {!product.isBundle && (
          <ul className="mb-5 space-y-1.5">
            {product.benefits.slice(0, 4).map((b) => (
              <li key={b} className="flex items-start gap-2 text-xs leading-snug text-silver">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: product.accent }} /> {b}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center gap-1 font-headline text-xs font-semibold uppercase tracking-wider2" style={{ color: product.accent }}>
          View details
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
      <div className="pointer-events-none absolute left-0 top-0 h-full w-px transition-opacity duration-500" style={{ background: product.accent, opacity: 0 }} aria-hidden />
    </div>
  );
}
