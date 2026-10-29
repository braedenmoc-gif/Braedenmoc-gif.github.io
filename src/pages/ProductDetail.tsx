import { useParams, Link, Navigate } from '@/router';
import { useState } from 'react';
import { Check, Download, FileText, Lock, ShieldCheck, ArrowLeft, ChevronDown } from 'lucide-react';
import { products, getProduct, heroImages, imgSrc } from '@/data/products';
import { ProductMockup, ProductCard } from '@/components/ProductMockup';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProduct(slug) : undefined;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!product) return <Navigate to="/resources" replace />;

  const related = products.filter((p) => p.slug !== product.slug && !p.isBundle).slice(0, 3);
  const bundleIncludes = product.includes
    ? product.includes.map((s) => getProduct(s)).filter(Boolean)
    : [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-white/[0.06] bg-charcoal">
        <div className="container-x flex items-center gap-2 py-4 text-xs">
          <Link to="/resources" className="flex items-center gap-1 font-headline uppercase tracking-wider2 text-silver hover:text-offwhite transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Resources
          </Link>
          <span className="text-silver/30">/</span>
          <span className="font-headline uppercase tracking-wider2 text-offwhite">{product.name}</span>
        </div>
      </div>

      {/* Hero / purchase */}
      <section className="bg-nearblack py-16 noise-overlay">
        <div className="container-x relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            {/* Cover */}
            <div className="reveal flex justify-center">
              <div className="w-full max-w-sm">
                <ProductMockup product={product} size="lg" />
              </div>
            </div>

            {/* Info */}
            <div className="reveal">
              {product.badge && (
                <span className="mb-3 inline-block rounded-full bg-electric/15 px-3 py-1 text-xs font-semibold text-electric">{product.badge}</span>
              )}
              <h1 className="font-display text-5xl uppercase leading-[0.95] text-offwhite sm:text-6xl">{product.name}</h1>
              <p className="mt-2 text-base text-silver">{product.tagline}</p>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-headline text-4xl font-bold text-offwhite">${product.price}</span>
                {product.compareAt && <span className="text-base text-silver line-through">${product.compareAt}</span>}
              </div>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-silver">{product.shortDescription}</p>

              {/* Format details */}
              <div className="mt-6 flex flex-wrap gap-4 border-y border-white/[0.06] py-4">
                <Meta icon={FileText} label="Format" value={product.format} />
                <Meta icon={Download} label="Delivery" value="Instant secure download" />
                {product.pages && <Meta icon={FileText} label="Length" value={product.pages} />}
              </div>

              <div className="mt-6">
                <a href={product.payhipUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex w-full justify-center sm:w-auto">
                  Buy Now — ${product.price}
                </a>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-silver/60">
                <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> Secure checkout via Payhip</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Instant digital download</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {product.highlight && (
        <section className="border-y border-electric/20 bg-electric/[0.06] py-20">
          <div className="container-x">
            <div className="reveal grid gap-10 lg:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">{product.highlight.eyebrow}</p>
                <h2 className="mb-5 font-display text-4xl uppercase leading-none text-offwhite sm:text-5xl">{product.highlight.title}</h2>
                <p className="text-sm leading-relaxed text-silver">{product.highlight.body}</p>
                <p className="mt-4 text-xs leading-relaxed text-silver/70">Educational only. This is not therapy or medical advice, and it does not replace professional care.</p>
              </div>
              <ul className="space-y-3">
                {product.highlight.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-offwhite">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="bg-charcoal py-20">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="reveal">
              <p className="eyebrow mb-2">Key Benefits</p>
              <h2 className="mb-6 font-display text-4xl uppercase leading-none text-offwhite">What you get.</h2>
              <ul className="space-y-3">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-silver">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal">
              <p className="eyebrow mb-2">Who It Is For</p>
              <h2 className="mb-6 font-display text-4xl uppercase leading-none text-offwhite">Built for.</h2>
              <p className="text-sm leading-relaxed text-silver">{product.who}</p>
              <div className="mt-6">
                <p className="eyebrow mb-3">Inside the Preview</p>
                <ul className="space-y-2">
                  {product.preview.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-silver">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-silver/50" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section breakdown */}
      <section className="bg-nearblack py-20">
        <div className="container-x">
          <div className="reveal mb-10">
            <p className="eyebrow mb-2">What's Inside</p>
            <h2 className="font-display text-5xl uppercase leading-none text-offwhite">Section breakdown.</h2>
          </div>
          <div className="space-y-4">
            {product.sections.map((s, i) => (
              <div key={i} className="reveal card-surface p-7">
                <div className="flex items-start gap-4">
                  <span className="font-display text-3xl leading-none text-white/10">0{i + 1}</span>
                  <div className="flex-1">
                    <h3 className="font-headline text-lg font-semibold uppercase tracking-tight text-offwhite">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-silver">{s.body}</p>
                    {s.bullets && (
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-sm text-silver">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" /> {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bundle includes */}
          {product.isBundle && bundleIncludes.length > 0 && (
            <div className="reveal mt-12">
              <p className="eyebrow mb-4">Products in This Bundle</p>
              <div className="grid gap-6 sm:grid-cols-3">
                {bundleIncludes.map((p) => (
                  <Link to={`/products/${p!.slug}`} key={p!.slug} className="block">
                    <ProductCard product={p!} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-charcoal py-20">
        <div className="container-x">
          <div className="reveal mx-auto max-w-3xl">
            <p className="eyebrow mb-2 text-center">Product FAQ</p>
            <h2 className="mb-8 text-center font-display text-4xl uppercase leading-none text-offwhite">Questions about this product.</h2>
            <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {product.faqs.map((f, i) => (
                <div key={i}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                    <span className="font-headline text-base font-medium text-offwhite">{f.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-silver transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${openFaq === i ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}>
                    <p className="overflow-hidden text-sm leading-relaxed text-silver">{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-nearblack py-20">
        <div className="container-x">
          <div className="reveal mb-8">
            <p className="eyebrow mb-1">You Might Also Like</p>
            <h2 className="font-display text-4xl uppercase leading-none text-offwhite">Related resources.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link to={`/products/${p.slug}`} key={p.slug} className="reveal block">
                <ProductCard product={p} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-silver/50" />
      <div>
        <p className="font-headline text-[10px] uppercase tracking-widest2 text-silver/50">{label}</p>
        <p className="text-sm text-offwhite">{value}</p>
      </div>
    </div>
  );
}
