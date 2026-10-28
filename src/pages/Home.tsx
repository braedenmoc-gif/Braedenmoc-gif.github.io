import { Link } from '@/router';
import {
  ChevronRight,
  ArrowUpRight,
  ClipboardList,
  Eye,
  NotebookPen,
  Check,
  ShieldCheck,
  Download,
  Zap,
  TrendingDown,
} from 'lucide-react';
import { ProductCard, ProductMockup } from '@/components/ProductMockup';
import { products, pillars, weeks, faqs, heroImages, imgSrc } from '@/data/products';
import { useState } from 'react';


export default function Home() {
  const individuals = products.filter((p) => !p.isBundle);
  const bundle = products.find((p) => p.isBundle)!;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] w-full overflow-hidden bg-nearblack noise-overlay">
        <div className="absolute inset-0">
          <img src={imgSrc(heroImages.primary, 2000, 1200)} alt="Quarterback poised to throw during a football game" className="h-full w-full scale-105 object-cover object-top opacity-55" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-nearblack via-nearblack/70 to-nearblack/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-nearblack via-transparent to-nearblack/40" />
        </div>
        <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 origin-right lg:block">
          <span className="font-headline text-[10px] uppercase tracking-[0.4em] text-silver/40">Est. 2026 · Quarterback Development</span>
        </div>
        <div className="container-x relative flex min-h-[92vh] flex-col justify-center py-28">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5 opacity-0 animate-fade-up [animation-delay:0.1s] [animation-fill-mode:forwards]">Quarterback Development · High School &amp; College</p>
            <h1 className="display-xl text-[14vw] sm:text-[11vw] lg:text-[9.5vw] xl:text-[8.5rem] text-offwhite opacity-0 animate-fade-up [animation-delay:0.2s] [animation-fill-mode:forwards]">
              Built for<br />the next snap.
            </h1>
            <p className="mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-silver opacity-0 animate-fade-up [animation-delay:0.35s] [animation-fill-mode:forwards]">
              Train with purpose. Study with intention. Develop the mechanics, confidence, and football IQ to elevate your quarterback game.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3 opacity-0 animate-fade-up [animation-delay:0.5s] [animation-fill-mode:forwards]">
              <Link to="/products/4-week-quarterback-development-playbook" className="btn-primary">Get the Playbook — $24</Link>
              <Link to="/products/complete-qb-development-bundle" className="btn-outline">Get the Bundle — $45</Link>
            </div>
            <p className="mt-4 font-headline text-xs uppercase tracking-wider2 text-silver/50 opacity-0 animate-fade-up [animation-delay:0.6s] [animation-fill-mode:forwards]">
              Instant download · 14-day guarantee · Save $10 with the bundle
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-x flex items-center justify-between py-6">
            <span className="font-headline text-[10px] uppercase tracking-widest2 text-silver/40">Scroll</span>
            <span className="font-headline text-[10px] uppercase tracking-widest2 text-silver/40">QB Blueprint</span>
          </div>
        </div>
      </section>

      {/* VALUE BAR / URGENCY */}
      <section className="bg-electric/10 border-y border-electric/20">
        <div className="container-x">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 text-center">
            <span className="flex items-center gap-2 font-headline text-xs font-semibold uppercase tracking-wider2 text-electric">
              <Zap className="h-4 w-4" /> Instant download
            </span>
            <span className="flex items-center gap-2 font-headline text-xs font-semibold uppercase tracking-wider2 text-electric">
              <TrendingDown className="h-4 w-4" /> Bundle saves $10
            </span>
            <span className="flex items-center gap-2 font-headline text-xs font-semibold uppercase tracking-wider2 text-electric">
              <ShieldCheck className="h-4 w-4" /> 14-day guarantee
            </span>
            <span className="flex items-center gap-2 font-headline text-xs font-semibold uppercase tracking-wider2 text-electric">
              <Download className="h-4 w-4" /> PDF — print or device
            </span>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-y border-white/[0.06] bg-charcoal">
        <div className="container-x">
          <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-5">
            {pillars.map((p, i) => (
              <div key={p.name} className="group flex flex-col items-start gap-1 px-5 py-8 transition-colors duration-300 hover:bg-white/[0.02]">
                <span className="font-headline text-[10px] uppercase tracking-widest2 text-electric">0{i + 1}</span>
                <h3 className="font-display text-2xl uppercase leading-none text-offwhite">{p.name}</h3>
                <p className="text-xs text-silver leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="container-x relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="reveal relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10">
                <img src={imgSrc(heroImages.prepass, 1000, 1250)} alt="Quarterback throwing during a football game" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-nearblack/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-headline text-xs uppercase tracking-widest2 text-offwhite/80">Philosophy</p>
                </div>
              </div>
            </div>
            <div className="reveal">
              <p className="eyebrow mb-3">Our Philosophy</p>
              <h2 className="font-display text-5xl sm:text-6xl uppercase leading-[0.95] text-offwhite">
                Repetition.<br />Preparation.<br />Execution.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-silver">
                Great quarterbacks are not born — they are built through disciplined, repeatable work. We design resources that respect the grind: structured progressions, measurable checkpoints, and film study that sharpens the way you see the field.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: ClipboardList, t: 'Structured, not random', d: 'Every day has an objective and a checkpoint — no guesswork.' },
                  { icon: Eye, t: 'Film-first development', d: 'Read defenses, grade your game, and improve your eyes.' },
                  { icon: NotebookPen, t: 'Track and compound', d: 'Measure your work weekly so your offseason actually compounds.' },
                ].map((f) => (
                  <div key={f.t} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-charcoal text-electric">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-headline text-sm font-semibold uppercase tracking-wider2 text-offwhite">{f.t}</h3>
                      <p className="text-sm text-silver leading-snug">{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="mt-8 inline-flex items-center gap-1 font-headline text-xs font-semibold uppercase tracking-wider2 text-electric hover:gap-2 transition-all">
                Read our story <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-charcoal py-24">
        <div className="container-x">
          <div className="reveal mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-2">Training Resources</p>
              <h2 className="font-display text-5xl sm:text-6xl uppercase leading-none text-offwhite">Resources built to work.</h2>
            </div>
            <Link to="/resources" className="inline-flex items-center gap-1 font-headline text-xs font-semibold uppercase tracking-wider2 text-silver hover:text-offwhite transition-colors">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
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

      {/* PROGRAM OVERVIEW */}
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="absolute inset-0 bg-grid-faint [background-size:48px_48px] opacity-40" />
        <div className="container-x relative">
          <div className="reveal mb-12 text-center">
            <p className="eyebrow mb-2">The 4-Week Program</p>
            <h2 className="font-display text-5xl sm:text-6xl uppercase leading-none text-offwhite">Four weeks. Four pillars.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-silver">
              A progressive development program that builds week over week — from foundational mechanics to game-speed execution and evaluation.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {weeks.map((w, i) => (
              <div key={w.week} className="reveal group relative card-surface p-6 transition-all duration-300 hover:border-white/[0.14]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display text-5xl uppercase leading-none text-white/10 transition-colors group-hover:text-electric/30">0{w.week}</span>
                  <span className="font-headline text-[10px] uppercase tracking-widest2 text-silver/50">Week {w.week}</span>
                </div>
                <h3 className="font-headline text-base font-semibold uppercase tracking-tight text-offwhite leading-snug">{w.title}</h3>
                <p className="mt-1 text-xs text-electric">{w.focus}</p>
                <p className="mt-3 text-sm leading-relaxed text-silver">{w.objective}</p>
                <div className="mt-4 space-y-1.5">
                  {w.activities.slice(0, 3).map((a) => (
                    <div key={a} className="flex items-start gap-2 text-xs text-silver">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-electric" /> {a}
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-white/[0.06] pt-3">
                  <p className="text-[11px] uppercase tracking-wider2 text-silver/50">Deliverable</p>
                  <p className="text-xs text-offwhite">{w.deliverable}</p>
                </div>
                {i < weeks.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-px w-8 -translate-y-1/2 translate-x-full bg-white/10 lg:block" />
                )}
              </div>
            ))}
          </div>
          <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/program" className="btn-primary">Explore the full program</Link>
            <Link to="/products/4-week-quarterback-development-playbook" className="btn-outline">Get the Playbook — $24</Link>
          </div>
        </div>
      </section>

      {/* FILM ROOM FEATURE */}
      <section className="bg-charcoal py-24">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div className="reveal">
              <p className="eyebrow mb-3">Film Room</p>
              <h2 className="font-display text-5xl sm:text-6xl uppercase leading-[0.95] text-offwhite">
                See the field<br />before the snap.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-silver">
                The Film Room Guide teaches you to read defenses frame by frame — pre-snap identification, eight coverages, pressure indicators, and six route concepts against each coverage. Built for quarterbacks who want to turn film study into faster, better decisions on the field.
              </p>
              <ul className="mt-7 space-y-2.5">
                {['Single-high vs two-high shell recognition', 'Eight coverages with keys: Cover 0, 1, 2, Tampa 2, 3, 4, 6, and 2-Man', 'Pressure indicators and blitz tells', 'Printable worksheets and twenty practice looks with answers'].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-silver">
                    <Check className="h-4 w-4 text-electric shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/film-room" className="btn-primary">Try the free QB Lab</Link>
                <Link to="/products/qb-film-room-guide" className="btn-outline">Get the Guide</Link>
              </div>
            </div>
            <div className="reveal relative">
              <div className="relative aspect-[16/11] overflow-hidden rounded-xl border border-white/10">
                <img src={imgSrc(heroImages.coach, 1100, 750)} alt="Football coach and players strategizing on the field" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-nearblack/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="font-headline text-xs uppercase tracking-widest2 text-offwhite/70">Pre-snap · Post-snap · Confirm</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 hidden w-44 sm:block">
                <ProductMockup product={products.find((p) => p.slug === 'qb-film-room-guide')!} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUNDLE */}
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="absolute inset-0 bg-grid-faint [background-size:48px_48px] opacity-40" />
        <div className="container-x relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div className="reveal relative flex h-[420px] items-center justify-center">
              <div className="absolute left-[12%] top-1/2 w-40 -translate-y-1/2 -rotate-6 transition-transform duration-500 hover:-rotate-3">
                <ProductMockup product={individuals[2]} size="sm" />
              </div>
              <div className="absolute left-[34%] top-1/2 w-44 -translate-y-1/2 rotate-2 transition-transform duration-500 hover:rotate-1">
                <ProductMockup product={individuals[1]} size="sm" />
              </div>
              <div className="absolute left-[56%] top-1/2 w-48 -translate-y-1/2 -rotate-3 transition-transform duration-500 hover:-rotate-1">
                <ProductMockup product={individuals[0]} size="sm" />
              </div>
            </div>
            <div className="reveal">
              <div className="mb-3 flex items-center gap-3">
                <p className="eyebrow mb-0">The Bundle</p>
                <span className="rounded-full bg-electric px-3 py-1 text-xs font-bold uppercase tracking-wider2 text-white">Best Value</span>
              </div>
              <h2 className="font-display text-5xl sm:text-6xl uppercase leading-[0.95] text-offwhite">Train the<br />complete game.</h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-silver">Get the Playbook, Film Room Guide, and Offseason Journal together — a structured program, a film-study system, and a 12-week journal designed to work as one. Three products. One offseason. $10 less than buying separately.</p>
              <div className="mt-7 flex items-baseline gap-3">
                <span className="font-headline text-4xl font-bold text-offwhite">${bundle.price}</span>
                <span className="text-sm text-silver line-through">$55</span>
                <span className="rounded-full bg-electric/15 px-3 py-1 text-xs font-semibold text-electric">Save $10</span>
              </div>
              <p className="mt-3 font-headline text-xs uppercase tracking-wider2 text-silver/50">Three products. One offseason.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={`/products/${bundle.slug}`} className="btn-primary">Get the Bundle — $45</Link>
                <Link to="/resources" className="btn-outline">Compare products</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY / TRUST */}
      <section className="bg-charcoal py-24">
        <div className="container-x">
          <div className="reveal mb-12 text-center">
            <p className="eyebrow mb-2">Why QB Blueprint</p>
            <h2 className="font-display text-5xl sm:text-6xl uppercase leading-none text-offwhite">Built right. Delivered clean.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: Download, t: 'Instant download', d: 'Secure links delivered immediately after verified payment. Print or use on any device.' },
              { icon: ShieldCheck, t: 'Ready for secure delivery', d: 'Files are delivered only after Stripe confirms your payment, through short-lived private links.' },
              { icon: NotebookPen, t: 'Real, usable content', d: 'A 47-drill library, 28 day cards, film worksheets, and a 12-week journal. Specific work, not generic advice.' },
            ].map((f) => (
              <div key={f.t} className="reveal card-surface p-7 transition-colors duration-300 hover:border-white/[0.14]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-nearblack text-electric">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-headline text-base font-semibold uppercase tracking-tight text-offwhite">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT IS FOR */}
      <section className="bg-nearblack py-24">
        <div className="container-x">
          <div className="reveal mb-12 text-center">
            <p className="eyebrow mb-2">Who It Is For</p>
            <h2 className="font-display text-5xl sm:text-6xl uppercase leading-none text-offwhite">Built for the work.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { role: 'High school quarterback', text: 'You want a real offseason plan instead of throwing until someone tells you to stop. The Playbook gives you the drills, the sets, and the throw count for every day.' },
              { role: 'College quarterback', text: 'You already know how to throw and need to see the game faster. The Film Room Guide and the free QB Lab train pre-snap reads, coverage calls, and decisions.' },
              { role: 'QB coach', text: 'You need something to hand a quarterback who is working alone. The Journal keeps the work measured and the player accountable, week by week.' },
            ].map((t) => (
              <div key={t.role} className="reveal card-surface p-7">
                <p className="font-headline text-sm font-semibold uppercase tracking-tight text-electric">{t.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-silver">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-nearblack py-28 noise-overlay">
        <div className="absolute inset-0">
          <img src={imgSrc(heroImages.stadium, 2000, 1000)} alt="Football field illuminated by stadium lights at dusk" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-nearblack via-nearblack/80 to-nearblack/40" />
        </div>
        <div className="container-x relative text-center">
          <div className="reveal mx-auto max-w-2xl">
            <p className="eyebrow mb-3">Start Today</p>
            <h2 className="font-display text-5xl sm:text-7xl uppercase leading-[0.95] text-offwhite">Your next snap starts here.</h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-silver">
              One download. 28 days of structured work. A real offseason. Pick a resource and start today — or get the bundle and save $10.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link to="/products/complete-qb-development-bundle" className="btn-solid">Get the Bundle — $45</Link>
              <Link to="/resources" className="btn-outline">Browse All Resources</Link>
            </div>
            <p className="mt-5 font-headline text-xs uppercase tracking-wider2 text-silver/40">Instant download · 14-day satisfaction guarantee · Print as many copies as you need</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-charcoal py-24">
        <div className="container-x">
          <div className="reveal mx-auto max-w-3xl">
            <p className="eyebrow mb-2 text-center">FAQ</p>
            <h2 className="mb-10 text-center font-display text-5xl uppercase leading-none text-offwhite">Questions, answered.</h2>
            <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {faqs.map((f, i) => (
                <div key={i}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                    <span className="font-headline text-base font-medium text-offwhite">{f.q}</span>
                    <ChevronRight className={`h-5 w-5 shrink-0 text-silver transition-transform duration-300 ${openFaq === i ? 'rotate-90' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${openFaq === i ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}>
                    <p className="overflow-hidden text-sm leading-relaxed text-silver">{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/faq" className="inline-flex items-center gap-1 font-headline text-xs font-semibold uppercase tracking-wider2 text-electric hover:gap-2 transition-all">
                See all FAQs <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
