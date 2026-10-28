import { Link } from '@/router';
import { products, heroImages, imgSrc } from '@/data/products';
import { ProductCard } from '@/components/ProductMockup';

export default function Resources() {
  const individuals = products.filter((p) => !p.isBundle);
  const bundle = products.find((p) => p.isBundle)!;

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="absolute inset-0">
          <img src={imgSrc(heroImages.training, 1200, 800)} alt="Football player practicing on an outdoor field" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-nearblack via-nearblack/85 to-nearblack" />
        </div>
        <div className="container-x relative">
          <p className="eyebrow mb-3 reveal">Training Resources</p>
          <h1 className="reveal display-xl text-6xl sm:text-7xl lg:text-8xl text-offwhite">Resources</h1>
          <p className="reveal mt-5 max-w-xl text-base leading-relaxed text-silver">
            Downloadable quarterback development resources — structured programs, film-study systems, and training journals. Each one is a complete, usable tool designed to help you develop.
          </p>
        </div>
      </section>

      {/* Individual products */}
      <section className="bg-charcoal py-20">
        <div className="container-x">
          <div className="reveal mb-8">
            <p className="eyebrow mb-1">Individual Products</p>
            <h2 className="font-display text-4xl uppercase leading-none text-offwhite">Pick your focus.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {individuals.map((p) => (
              <Link to={`/products/${p.slug}`} key={p.slug} className="reveal block">
                <ProductCard product={p} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle feature */}
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="absolute inset-0 bg-grid-faint [background-size:48px_48px] opacity-40" />
        <div className="container-x relative">
          <div className="reveal card-surface overflow-hidden p-8 sm:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">Best Value</p>
                <h2 className="font-display text-5xl uppercase leading-[0.95] text-offwhite">Complete QB Development Bundle</h2>
                <p className="mt-4 text-base leading-relaxed text-silver">All three products together — a structured program, a film-study system, and a 12-week journal. Designed to work as one complete offseason system.</p>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-headline text-4xl font-bold text-offwhite">${bundle.price}</span>
                  <span className="text-sm text-silver line-through">$55</span>
                  <span className="rounded-full bg-electric/15 px-3 py-1 text-xs font-semibold text-electric">Save $10</span>
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to={`/products/${bundle.slug}`} className="btn-primary">View the Bundle</Link>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                {individuals.map((p, i) => (
                  <div key={p.slug} className="w-28 sm:w-32" style={{ transform: `rotate(${(i - 1) * 4}deg) translateY(${Math.abs(i - 1) * 8}px)` }}>
                    <ProductCardMini product={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductCardMini({ product }: { product: (typeof products)[number] }) {
  return (
    <div className={`relative aspect-[3/4] rounded-md bg-gradient-to-br ${product.cover.hue} border border-white/10 overflow-hidden flex flex-col`}>
      <div className="flex flex-1 items-center justify-center">
        <span className="font-display text-xl uppercase text-white/90 drop-shadow">{product.cover.label}</span>
      </div>
      <div className="px-3 pb-3 text-center">
        <span className="font-headline text-sm font-bold text-white">${product.price}</span>
      </div>
    </div>
  );
}
