import { useState } from 'react';
import { Link } from '@/router';
import { Check, ArrowUpRight, Eye, ShieldAlert, Layers, Clock, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { heroImages, imgSrc } from '@/data/products';
import { ProductMockup } from '@/components/ProductMockup';
import { products } from '@/data/products';
import { QBSimulator } from '@/components/QBSimulator';

const coverages = [
  { name: 'Cover 0', desc: 'Man-free with no deep help. Pure pressure look. Identify by an empty deep middle and press alignment across.' },
  { name: 'Cover 1', desc: 'Single-high man with one deep safety. Corners in press, linebackers man on backs or seams.' },
  { name: 'Cover 2', desc: 'Two deep safeties splitting halves, five under. Look for flat corners and a 5-step downhill read.' },
  { name: 'Cover 3', desc: 'Single-high, thirds deep. Corner stays deep third, two LBs and nickel fill the hook-curl flats.' },
  { name: 'Cover 4', desc: 'Two-high quarters. Reads deep half vs deep quarter — eye-control traps for QBs who stare.' },
  { name: 'Cover 6', desc: 'Quarters to one side, Cover 2 to the other. A mixed shell that disguises weak-side leverage.' },
];

const steps = [
  { icon: Eye, title: 'Pre-Snap Read', desc: 'Identify the shell — single-high or two-high — and the box count for run vs pass.' },
  { icon: ShieldAlert, title: 'Pressure Indicators', desc: 'Safety rotation, edge alignment, and second-level positioning that telegraph the blitz.' },
  { icon: Layers, title: 'Coverage Confirmation', desc: 'Post-snap keys confirm or correct your pre-snap read. Not every coverage is perfectly identifiable before the snap.' },
  { icon: Clock, title: 'Progression & Timing', desc: 'Read in the right order, hit your hitch, and deliver on time within the coverage window.' },
];

const quizQuestions = [
  {
    prompt: 'You see two safeties deep, corners aligned over the flats, and linebackers inside. What shell is the best starting hypothesis?',
    options: ['Cover 0', 'Cover 2', 'Cover 3', 'Cover 1'],
    answer: 'Cover 2',
    coaching: 'Correct. Two deep safeties plus flat defenders is the classic Cover 2 starting picture. Confirm the corners’ depth and the safeties’ rotation after the snap.',
  },
  {
    prompt: 'The defense shows one deep safety and press corners. The box is crowded and pressure is possible. What should you confirm first?',
    options: ['Whether the shell is single-high man or a rotation', 'The running back’s jersey number', 'Only the boundary receiver', 'The center’s stance'],
    answer: 'Whether the shell is single-high man or a rotation',
    coaching: 'Correct. Single-high is a clue, not a final answer. Confirm leverage, safety movement, and the pressure picture after the snap.',
  },
  {
    prompt: 'A two-high shell rotates after the snap, with one safety driving down and a corner carrying the deep outside third. What coverage family may be developing?',
    options: ['Cover 3', 'Cover 0', 'Cover 2', 'Goal-line man'],
    answer: 'Cover 3',
    coaching: 'Correct. A post-snap rotation into a single-high structure can create a Cover 3 picture. Read the safety and corner movement rather than locking onto the pre-snap shell.',
  },
];

function CoverageQuiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const question = quizQuestions[questionIndex];
  const isCorrect = selected === question.answer;

  const chooseAnswer = (answer: string) => {
    if (!selected) setSelected(answer);
  };

  const nextQuestion = () => {
    setQuestionIndex((index) => (index + 1) % quizQuestions.length);
    setSelected(null);
  };

  return (
    <section className="bg-charcoal py-24">
      <div className="container-x">
        <div className="mx-auto max-w-4xl rounded-lg border border-white/10 bg-nearblack p-6 sm:p-10">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">QB Read Check</p>
              <h2 className="font-display text-5xl uppercase leading-none text-offwhite">Call the coverage.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-silver">Build the habit: form a hypothesis, identify the clue that supports it, then confirm the defense after the snap.</p>
            </div>
            <span className="font-headline text-xs uppercase tracking-wider2 text-silver/50">{questionIndex + 1} / {quizQuestions.length}</span>
          </div>
          <p className="font-headline text-lg font-medium leading-relaxed text-offwhite">{question.prompt}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {question.options.map((option) => {
              const chosen = selected === option;
              const correct = selected && option === question.answer;
              return (
                <button key={option} type="button" onClick={() => chooseAnswer(option)} className={`flex items-center justify-between gap-3 rounded-md border px-4 py-4 text-left text-sm transition-colors ${correct ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200' : chosen ? 'border-red-400/60 bg-red-400/10 text-red-200' : 'border-white/10 bg-charcoal text-silver hover:border-white/30 hover:text-offwhite'}`}>
                  <span>{option}</span>
                  {correct && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                  {chosen && !correct && <XCircle className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
          {selected && <div className={`mt-6 border-l-2 pl-4 text-sm leading-relaxed ${isCorrect ? 'border-emerald-400 text-emerald-100' : 'border-red-400 text-red-100'}`}><strong>{isCorrect ? 'Good read.' : `Not quite. The best answer is ${question.answer}.`}</strong> {question.coaching}</div>}
          <div className="mt-7 flex flex-wrap gap-3">
            {selected && <button type="button" onClick={nextQuestion} className="btn-primary">Next read <ArrowUpRight className="h-4 w-4" /></button>}
            <button type="button" onClick={() => { setQuestionIndex(0); setSelected(null); }} className="btn-outline"><RotateCcw className="h-4 w-4" /> Reset quiz</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FilmRoom() {
  const guide = products.find((p) => p.slug === 'qb-film-room-guide')!;

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="absolute inset-0">
          <img src={imgSrc(heroImages.coach, 2000, 1000)} alt="Quarterback focused and ready to throw" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-nearblack via-nearblack/80 to-nearblack/30" />
        </div>
        <div className="container-x relative">
          <p className="eyebrow mb-3 reveal">Film Room</p>
          <h1 className="reveal display-xl text-6xl sm:text-7xl lg:text-8xl text-offwhite">The Film Room</h1>
          <p className="reveal mt-4 max-w-xl text-base leading-relaxed text-silver">
            Learn to watch film the way a quarterback should. Pre-snap identification, coverage shells, pressure indicators, and a repeatable film-study workflow that turns hours of film into faster decisions on the field.
          </p>
        </div>
      </section>

      <section className="bg-nearblack py-12"><div className="container-x"><QBSimulator /></div></section>

      {/* Coverage library */}
      <section className="bg-charcoal py-20">
        <div className="container-x">
          <div className="reveal mb-10">
            <p className="eyebrow mb-2">Coverage Library</p>
            <h2 className="font-display text-5xl uppercase leading-none text-offwhite">Read every shell.</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-silver">
              The Film Room Guide breaks down each coverage with the keys a quarterback needs — alignment tells, leverage, and how each shell handles your route concepts. Honest about limits: not every coverage is perfectly identifiable pre-snap.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coverages.map((c, i) => (
              <div key={c.name} className="reveal card-surface p-6 transition-colors duration-300 hover:border-white/[0.14]">
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-display text-4xl leading-none text-white/10">0{i + 1}</span>
                  <h3 className="font-headline text-lg font-semibold uppercase tracking-tight text-offwhite">{c.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-silver">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Film study workflow */}
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="absolute inset-0 bg-grid-faint [background-size:48px_48px] opacity-40" />
        <div className="container-x relative">
          <div className="reveal mb-10">
            <p className="eyebrow mb-2">The Workflow</p>
            <h2 className="font-display text-5xl uppercase leading-none text-offwhite">A repeatable film routine.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="reveal card-surface p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-nearblack text-electric">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="font-headline text-[10px] uppercase tracking-widest2 text-silver/50">Step 0{i + 1}</p>
                <h3 className="mt-1 font-headline text-base font-semibold uppercase tracking-tight text-offwhite">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is included */}
      <section className="bg-charcoal py-24">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div className="reveal flex justify-center">
              <div className="w-64">
                <ProductMockup product={guide} />
              </div>
            </div>
            <div className="reveal">
              <p className="eyebrow mb-2">Inside the Guide</p>
              <h2 className="font-display text-5xl uppercase leading-[0.95] text-offwhite">What is included.</h2>
              <ul className="mt-6 space-y-3">
                {[
                  'Pre-snap defensive identification framework',
                  'Fronts and coverage shells decoded',
                  'Cover 0, 1, 2, 3, 4, and 6 — keys and tells',
                  'Pressure indicators and blitz recognition',
                  'Route concepts vs coverage — where the ball goes',
                  'Progression discipline and timing windows',
                  'Situational football: down, distance, field position',
                  'Sample defensive diagrams and film-grading checklists',
                  'Repeatable weekly film-study worksheets',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-silver">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" /> {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={`/products/${guide.slug}`} className="btn-primary">Get the Guide — ${guide.price}</Link>
                <Link to="/resources" className="btn-outline">View all resources</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
