import { Link } from '@/router';
import { Target, Eye, TrendingUp, Heart } from 'lucide-react';
import { heroImages, imgSrc } from '@/data/products';

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="absolute inset-0">
          <img src={imgSrc(heroImages.huddle, 2000, 1000)} alt="American football team huddling on the field" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-nearblack via-nearblack/80 to-nearblack/30" />
        </div>
        <div className="container-x relative">
          <p className="eyebrow mb-3 reveal">About</p>
          <h1 className="reveal display-xl text-6xl sm:text-7xl lg:text-8xl text-offwhite">Built by a quarterback.</h1>
          <p className="reveal mt-5 max-w-xl text-base leading-relaxed text-silver">
            QB Blueprint was started by a college quarterback who wanted structured, affordable development resources — and could not find any that met the standard. So he built them.
          </p>
        </div>
      </section>

      {/* Why I built this */}
      <section className="bg-nearblack py-24">
        <div className="container-x">
          <div className="reveal mx-auto max-w-3xl">
            <p className="eyebrow mb-2">My Story</p>
            <h2 className="font-display text-4xl sm:text-5xl uppercase leading-[0.95] text-offwhite">The year I was shut out.</h2>
            <div className="mt-6 space-y-4 border-l-2 border-electric pl-6 text-base leading-relaxed text-silver">
              <p>My whole childhood I dreamed of starting at quarterback for my high school. That summer I was running with the first team, ready for it. Then, at the last second, I was pushed aside with no explanation, and I was alone in it. We won one game that season, and I never got a chance.</p>
              <p>A new quarterbacks coach gave me a fresh start. I worked as hard as I ever had, then got hurt: a concussion and a partially torn labrum in my right hip. I kept working anyway. I won the starting job for my senior year and took my team to the playoffs. I finished first-team all-league, even though I was never named a captain and could feel my head coach's doubt the whole way.</p>
              <p>Today I am a collegiate quarterback. I do not hate that coach anymore. I am grateful for the adversity, because it taught me that I am the only person in charge of my journey. That is what I want QB Blueprint to give you: not just better mechanics, but a way to keep going when it does not go your way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-charcoal py-24">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="reveal">
              <p className="eyebrow mb-2">Our Story</p>
              <h2 className="font-display text-4xl uppercase leading-[0.95] text-offwhite">Built by a quarterback.<br />For quarterbacks.</h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-silver">
                <p>I started QB Blueprint because I lived the problem. As a college quarterback, I spent every offseason searching for a real development plan — something structured, something I could follow day by day without a $200/hour private coach. I found plenty of highlight tapes and motivational quotes. I never found a system.</p>
                <p>So I built one. I took everything I learned from early morning weight room sessions, countless hours of film study, and the trial-and-error of trying to get better on my own, and I turned it into resources I wish I had when I was a 15-year-old trying to figure out how to be a quarterback.</p>
                <p>The Quarterback Playbook is the guide I wish I had. The Film Room Guide is the system I used to finally understand what I was watching on film. The Quarterback Journal is the mental side: confidence, pressure, and anxiety, the part nobody coached me on.</p>
                <p>I am not here to tell you these resources will make you a starter overnight. They will not. But if you put in the work — every day, the way the program lays out — you will get better. That is the only promise I can make, and it is the only one that matters.</p>
                <h3 className="pt-3 font-headline text-lg font-semibold uppercase tracking-tight text-offwhite">Our Mission</h3>
                <p>To make high-quality quarterback development resources accessible, affordable, and easy to understand for athletes who are serious about improving.</p>
                <p className="font-headline font-semibold text-offwhite">QB Blueprint — Prepare Smarter. Train Harder. Play Better.</p>
              </div>
            </div>
            <div className="reveal">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10">
                <img src={imgSrc(heroImages.prepass, 1000, 1250)} alt="Quarterback preparing to throw" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-nearblack/70 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-nearblack py-24">
        <div className="container-x">
          <div className="reveal mb-10 text-center">
            <p className="eyebrow mb-2">What We Stand For</p>
            <h2 className="font-display text-5xl uppercase leading-none text-offwhite">Discipline over hype.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Target, t: 'Structured Work', d: 'Every day has an objective and a checkpoint. No guesswork, no wasted reps.' },
              { icon: Eye, t: 'Film-First', d: 'Great QBs see the game. We build resources that develop your eyes, not just your arm.' },
              { icon: TrendingUp, t: 'Measurable Growth', d: 'Track what you do so your offseason compounds instead of circling.' },
              { icon: Heart, t: 'No Exaggeration', d: 'No fabricated testimonials or miracle promises. Just real, usable training material.' },
            ].map((v) => (
              <div key={v.t} className="reveal card-surface p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-nearblack text-electric">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-headline text-sm font-semibold uppercase tracking-tight text-offwhite">{v.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal py-24">
        <div className="container-x">
          <div className="reveal flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-5xl uppercase leading-none text-offwhite">Train with us.</h2>
            <p className="max-w-md text-base leading-relaxed text-silver">Browse the resources and start your development today.</p>
            <Link to="/resources" className="btn-primary">Browse Resources</Link>
          </div>
        </div>
      </section>
    </>
  );
}
