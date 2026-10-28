import { Link } from '@/router';
import { Check, ArrowUpRight, Target, TrendingUp, Clock, Dumbbell, Eye, Brain, Trophy, ListChecks } from 'lucide-react';
import { weeks, pillars, heroImages, imgSrc } from '@/data/products';
import { useState } from 'react';

const dailySchedule = [
  { block: '0:00–0:20', title: 'Warm-Up & Arm Care', desc: 'The warm-up circuit, a band series, and thoracic and hip mobility to prepare the shoulder and hips before you throw.' },
  { block: '0:20–0:30', title: 'Progressive Throwing Ramp', desc: 'A built-in ramp from short, easy throws to full effort, with the throw count written on the card.' },
  { block: '0:30–1:05', title: 'The Day\u2019s Drill Blocks', desc: 'Two to four drills from the core drills, depending on the day: mechanics, footwork, pocket work, accuracy, or reading and decisions.' },
  { block: '1:05–1:13', title: 'Cooldown & Log', desc: 'A cooldown, then log your RPE, soreness, energy, and sleep. Each card also has a film or mental task for the day.' },
];

const programIncludes = [
  { icon: Clock, t: '28 Daily Sessions', d: 'Every day has a goal, a drill list with sets and reps, a throw total, and a note on what good looks like. Days 7, 14, 21, and 28 are off or review days.' },
  { icon: Dumbbell, t: 'Physical Development', d: 'Ten core drills covering mechanics, footwork, pocket movement, accuracy, reading, and game-speed work, layered week by week.' },
  { icon: Eye, t: 'Film & Recognition', d: 'Pre-snap identification, one-high and two-high reads, pressure recognition, and a film or mental task on every day card.' },
  { icon: Brain, t: 'Decision-Making', d: 'Situational football, down-and-distance logic, and timing windows that translate to game-speed execution.' },
  { icon: Trophy, t: 'Weekly Scorecards', d: 'Four weekly scorecards and a day-26 final assessment compared with your day-1 baseline.' },
  { icon: ListChecks, t: 'Safety & Load Management', d: 'Calculated weekly throw totals, a ramp-up, arm-care sessions, deload guidance, and a protect-the-arm chapter.' },
];

const comparison = [
  { feature: 'Structured daily plan', qb: true, typical: false },
  { feature: 'Progressive week-over-week buildup', qb: true, typical: false },
  { feature: 'Film study assignments', qb: true, typical: false },
  { feature: 'Weekly scorecards & checkpoints', qb: true, typical: false },
  { feature: 'Final assessment & evaluation', qb: true, typical: false },
  { feature: 'Arm-care & load management', qb: true, typical: 'Sometimes' },
  { feature: 'Cost', qb: '$24', typical: '$50–200/mo' },
  { feature: 'Reusable', qb: true, typical: false },
];

export default function Program() {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="absolute inset-0">
          <img src={imgSrc(heroImages.action, 2000, 1000)} alt="Quarterback in action during a football game" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-nearblack via-nearblack/80 to-nearblack/30" />
        </div>
        <div className="container-x relative">
          <p className="eyebrow mb-3 reveal">The Practice Program</p>
          <h1 className="reveal display-xl text-6xl sm:text-7xl lg:text-8xl text-offwhite">The 4-Week Practice Program</h1>
          <p className="reveal mt-5 max-w-xl text-base leading-relaxed text-silver">
            The practice section at the back of The Quarterback Playbook. Four weeks that build from foundational mechanics to game-speed execution and evaluation, with a day-by-day schedule, core drills, baseline tests, and a scorecard. It turns the guide into reps.
          </p>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            <Link to="/products/quarterback-playbook" className="btn-primary">Get the Playbook — $24</Link>
            <Link to="/products/complete-qb-development-bundle" className="btn-outline">Get the Bundle — $45</Link>
          </div>
        </div>
      </section>

      {/* Pillars recap */}
      <section className="border-y border-white/[0.06] bg-charcoal">
        <div className="container-x">
          <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-5">
            {pillars.map((p, i) => (
              <div key={p.name} className="flex flex-col items-start gap-1 px-5 py-7">
                <span className="font-headline text-[10px] uppercase tracking-widest2 text-electric">0{i + 1}</span>
                <h3 className="font-display text-xl uppercase leading-none text-offwhite">{p.name}</h3>
                <p className="text-xs text-silver leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-nearblack py-24">
        <div className="container-x">
          <div className="reveal mb-12 text-center">
            <p className="eyebrow mb-2">What You Get</p>
            <h2 className="font-display text-5xl sm:text-6xl uppercase leading-none text-offwhite">Everything in the program.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programIncludes.map((f) => (
              <div key={f.t} className="reveal card-surface p-7 transition-colors duration-300 hover:border-white/[0.14]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-charcoal text-electric">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-headline text-base font-semibold uppercase tracking-tight text-offwhite">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive roadmap */}
      <section className="bg-charcoal py-24">
        <div className="container-x">
          <div className="reveal mb-10">
            <p className="eyebrow mb-2">Interactive Roadmap</p>
            <h2 className="font-display text-5xl uppercase leading-none text-offwhite">Week by week.</h2>
          </div>

          {/* Week selector */}
          <div className="reveal mb-8 flex flex-wrap gap-2">
            {weeks.map((w, i) => (
              <button
                key={w.week}
                onClick={() => setActive(i)}
                className={`group flex items-center gap-3 rounded-md border px-4 py-3 text-left transition-all duration-300 ${active === i ? 'border-electric bg-electric/10' : 'border-white/10 bg-nearblack hover:border-white/25'}`}
              >
                <span className={`font-display text-3xl leading-none transition-colors ${active === i ? 'text-electric' : 'text-white/15'}`}>0{w.week}</span>
                <span className="flex flex-col">
                  <span className={`font-headline text-[10px] uppercase tracking-widest2 ${active === i ? 'text-electric' : 'text-silver/50'}`}>Week {w.week}</span>
                  <span className={`font-headline text-xs font-semibold uppercase tracking-tight ${active === i ? 'text-offwhite' : 'text-silver'}`}>{w.title.split('&')[0].trim()}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Active week detail */}
          <div className="reveal grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="card-surface p-8">
              <div className="mb-2 flex items-center gap-3">
                <span className="font-display text-6xl leading-none text-electric/80">0{weeks[active].week}</span>
                <div>
                  <p className="font-headline text-[10px] uppercase tracking-widest2 text-silver/50">Week {weeks[active].week}</p>
                  <h3 className="font-headline text-xl font-semibold uppercase tracking-tight text-offwhite">{weeks[active].title}</h3>
                </div>
              </div>
              <p className="mt-1 text-sm text-electric">{weeks[active].focus}</p>
              <p className="mt-4 text-base leading-relaxed text-silver">{weeks[active].objective}</p>
              <div className="mt-6">
                <p className="mb-3 font-headline text-xs font-semibold uppercase tracking-widest2 text-silver">Daily Activities</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {weeks[active].activities.map((a) => (
                    <div key={a} className="flex items-start gap-2 rounded-md border border-white/[0.06] bg-nearblack px-3 py-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                      <span className="text-sm text-silver">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="card-surface p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-nearblack text-electric">
                  <Target className="h-5 w-5" />
                </div>
                <h4 className="font-headline text-sm font-semibold uppercase tracking-wider2 text-offwhite">Week Objective</h4>
                <p className="mt-1 text-sm leading-relaxed text-silver">{weeks[active].objective}</p>
              </div>
              <div className="card-surface p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-nearblack text-electric">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h4 className="font-headline text-sm font-semibold uppercase tracking-wider2 text-offwhite">Deliverable</h4>
                <p className="mt-1 text-sm leading-relaxed text-silver">{weeks[active].deliverable}</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="reveal mt-10">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-headline text-[10px] uppercase tracking-widest2 text-silver/50">Program Progress</span>
              <span className="font-headline text-xs text-offwhite">{active + 1} / {weeks.length} weeks</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-electric transition-all duration-500" style={{ width: `${((active + 1) / weeks.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Sample daily schedule */}
      <section className="bg-nearblack py-24">
        <div className="container-x">
          <div className="reveal mb-12">
            <p className="eyebrow mb-2">A Day in the Program</p>
            <h2 className="font-display text-5xl sm:text-6xl uppercase leading-none text-offwhite">Sample daily schedule.</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-silver">This is a typical 73-minute day. Sessions run from 30 to 85 minutes: film and mobility days are shorter, and the heaviest days run longer. Every card lists its own minutes.</p>
          </div>
          <div className="space-y-3">
            {dailySchedule.map((block, i) => (
              <div key={i} className="reveal flex flex-col gap-3 rounded-md border border-white/[0.06] bg-charcoal p-5 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-3 sm:w-44 shrink-0">
                  <span className="font-display text-2xl leading-none text-white/15">0{i + 1}</span>
                  <span className="font-headline text-xs font-semibold uppercase tracking-wider2 text-electric">{block.block}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline text-sm font-semibold uppercase tracking-tight text-offwhite">{block.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-silver">{block.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-charcoal py-24">
        <div className="container-x">
          <div className="reveal mb-12 text-center">
            <p className="eyebrow mb-2">Why This Program</p>
            <h2 className="font-display text-5xl uppercase leading-none text-offwhite">QB Blueprint vs. the rest.</h2>
          </div>
          <div className="reveal mx-auto max-w-2xl overflow-hidden rounded-lg border border-white/[0.08]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-nearblack">
                  <th className="px-5 py-4 text-left font-headline text-xs font-semibold uppercase tracking-wider2 text-silver">Feature</th>
                  <th className="px-5 py-4 text-center font-headline text-xs font-semibold uppercase tracking-wider2 text-electric">QB Blueprint</th>
                  <th className="px-5 py-4 text-center font-headline text-xs font-semibold uppercase tracking-wider2 text-silver/60">Typical Training</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-nearblack/40' : ''}>
                    <td className="px-5 py-3.5 text-left text-silver">{row.feature}</td>
                    <td className="px-5 py-3.5 text-center">
                      {row.qb === true ? <Check className="mx-auto h-4 w-4 text-electric" /> : <span className="font-headline text-xs font-bold text-offwhite">{row.qb}</span>}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {row.typical === false ? <span className="text-silver/30">—</span> : row.typical === true ? <Check className="mx-auto h-4 w-4 text-silver/40" /> : <span className="text-xs text-silver">{row.typical}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="absolute inset-0 bg-grid-faint [background-size:48px_48px] opacity-40" />
        <div className="container-x relative">
          <div className="reveal flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-5xl uppercase leading-none text-offwhite">Get the full guide.</h2>
            <p className="max-w-md text-base leading-relaxed text-silver">Get The Quarterback Playbook for the whole position, with this practice program at the back. $24 for the Playbook, or $45 for the complete bundle.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/products/quarterback-playbook" className="btn-primary">Get the Playbook — $24</Link>
              <Link to="/products/complete-qb-development-bundle" className="btn-outline">Get the Bundle — $45</Link>
              <Link to="/resources" className="inline-flex items-center gap-1 font-headline text-xs font-semibold uppercase tracking-wider2 text-electric hover:gap-2 transition-all">
                Compare all resources <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
