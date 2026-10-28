import { useState } from 'react';
import { Link } from '@/router';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { faqs } from '@/data/products';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="container-x relative">
          <p className="eyebrow mb-3 reveal">FAQ</p>
          <h1 className="reveal display-xl text-6xl sm:text-7xl lg:text-8xl text-offwhite">Frequently asked.</h1>
          <p className="reveal mt-5 max-w-xl text-base leading-relaxed text-silver">Everything you need to know about the resources, the format, and how to use them.</p>
        </div>
      </section>

      <section className="bg-charcoal py-20">
        <div className="container-x">
          <div className="reveal mx-auto max-w-3xl">
            <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {faqs.map((f, i) => (
                <div key={i}>
                  <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                    <span className="font-headline text-base font-medium text-offwhite">{f.q}</span>
                    <ChevronRight className={`h-5 w-5 shrink-0 text-silver transition-transform duration-300 ${open === i ? 'rotate-90' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}>
                    <p className="overflow-hidden text-sm leading-relaxed text-silver">{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-center gap-4 text-center">
              <p className="text-sm text-silver">Still have a question?</p>
              <Link to="/contact" className="inline-flex items-center gap-1 font-headline text-xs font-semibold uppercase tracking-wider2 text-electric hover:gap-2 transition-all">
                Contact us <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
