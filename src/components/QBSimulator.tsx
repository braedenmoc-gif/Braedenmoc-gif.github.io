import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, RotateCcw, ArrowRight, Eye, Clock, CheckCircle2, XCircle, Target } from 'lucide-react';
import {
  ALL_COVERAGES, COVERAGE_INFO, describeDefender, coverageExplanation, makeScenario, mulberry32, qbPosAt, sampleAt, taskLabel,
  type Coverage, type DefPlayer, type Diff, type Pt, type RId, type Scenario, type Shell,
} from '@/lab/engine';

/* ------------------------------ helpers ------------------------------ */
const STORE = 'qbblueprint-qb-lab-v2';
type Stats = { reps: number; shellOk: number; shellN: number; covOk: number; covN: number; blitzOk: number; blitzN: number; good: number; best: number; ints: number; streak: number; bestStreak: number; byCov: Record<string, { n: number; good: number }> };
const emptyStats = (): Stats => ({ reps: 0, shellOk: 0, shellN: 0, covOk: 0, covN: 0, blitzOk: 0, blitzN: 0, good: 0, best: 0, ints: 0, streak: 0, bestStreak: 0, byCov: {} });
function loadStats(): Stats {
  try { const raw = localStorage.getItem(STORE); if (raw) return { ...emptyStats(), ...JSON.parse(raw) }; } catch { /* ignore */ }
  return emptyStats();
}
function saveStats(s: Stats) { try { localStorage.setItem(STORE, JSON.stringify(s)); } catch { /* ignore */ } }

const DIFFS: { key: Diff; label: string; blurb: string; clock: number | null }[] = [
  { key: 'beginner', label: 'Beginner', blurb: 'Four coverages, standard looks, no disguise, no clock. Learn to count safeties and find the open man.', clock: null },
  { key: 'intermediate', label: 'Intermediate', blurb: 'All eight coverages, some disguise and blitzes, plus call the coverage after the snap. 17-second clock.', clock: 17 },
  { key: 'expert', label: 'Expert', blurb: 'Heavy disguise, bunch and trips, more pressure. Read it, call it, throw it. 12-second clock.', clock: 12 },
];

const shellText: Record<Shell, string> = { zero: 'No deep safety', one: 'One deep safety', two: 'Two deep safeties' };
const SHELLS: Shell[] = ['zero', 'one', 'two'];

type Phase = 'menu' | 'presnap' | 'running' | 'decide' | 'throw' | 'result';

/* ------------------------------ sprites ------------------------------ */
// Top-down player. heading 0 = facing downfield (up the screen). stance only shows before the snap.
type Stance = 'three' | 'two' | 'press' | 'gun' | 'run';
function Sprite({ p, heading, off, label, highlight, stance = 'run' }: { p: Pt; heading: number; off: boolean; label?: string; highlight?: boolean; stance?: Stance }) {
  const jersey = off ? '#2F6FE0' : '#B4474B';
  const dark = off ? '#173F86' : '#6E2326';
  const helmet = off ? '#E8ECF3' : '#2A2C31';
  const skin = '#C9A27E';
  const low = stance === 'three';
  return (
    <g transform={`translate(${p.x.toFixed(2)} ${(-p.y).toFixed(2)})`}>
      {highlight && <circle r={1.7} fill="none" stroke="#60A5FA" strokeWidth={0.18} strokeDasharray="0.5 0.35" />}
      <ellipse cx={0.05} cy={0.12} rx={0.95} ry={0.62} fill="rgba(0,0,0,0.35)" />
      <g transform={`rotate(${heading.toFixed(1)})`}>
        {/* legs: staggered in a two-point stance, wide and back in a three-point stance */}
        {stance === 'two' || stance === 'press' ? (
          <>
            <rect x={-0.46} y={-0.35} width={0.32} height={0.8} rx={0.14} fill={dark} />
            <rect x={0.14} y={0.05} width={0.32} height={0.8} rx={0.14} fill={dark} />
          </>
        ) : low ? (
          <>
            <rect x={-0.55} y={0.05} width={0.34} height={0.85} rx={0.14} fill={dark} />
            <rect x={0.21} y={0.05} width={0.34} height={0.85} rx={0.14} fill={dark} />
          </>
        ) : (
          <>
            <rect x={-0.42} y={-0.15} width={0.32} height={0.8} rx={0.14} fill={dark} />
            <rect x={0.1} y={-0.15} width={0.32} height={0.8} rx={0.14} fill={dark} />
          </>
        )}
        {/* arms */}
        {low ? (
          <>
            <line x1={0.55} y1={-0.35} x2={0.42} y2={-1.15} stroke={jersey} strokeWidth={0.3} strokeLinecap="round" />
            <circle cx={0.42} cy={-1.2} r={0.17} fill={skin} />
            <ellipse cx={-0.82} cy={0.05} rx={0.2} ry={0.4} fill={dark} />
          </>
        ) : stance === 'press' ? (
          <>
            <line x1={-0.6} y1={-0.35} x2={-0.42} y2={-1.0} stroke={jersey} strokeWidth={0.28} strokeLinecap="round" />
            <line x1={0.6} y1={-0.35} x2={0.42} y2={-1.0} stroke={jersey} strokeWidth={0.28} strokeLinecap="round" />
            <circle cx={-0.42} cy={-1.05} r={0.15} fill={skin} /><circle cx={0.42} cy={-1.05} r={0.15} fill={skin} />
          </>
        ) : stance === 'gun' ? (
          <>
            <line x1={-0.6} y1={-0.3} x2={-0.2} y2={-0.85} stroke={jersey} strokeWidth={0.26} strokeLinecap="round" />
            <line x1={0.6} y1={-0.3} x2={0.2} y2={-0.85} stroke={jersey} strokeWidth={0.26} strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx={-0.82} cy={-0.1} rx={0.2} ry={0.42} fill={dark} />
            <ellipse cx={0.82} cy={-0.1} rx={0.2} ry={0.42} fill={dark} />
          </>
        )}
        <rect x={-0.78} y={low ? -0.6 : -0.5} width={1.56} height={0.82} rx={0.4} fill={jersey} stroke={dark} strokeWidth={0.07} />
        <circle cx={0} cy={low ? -0.45 : -0.18} r={0.43} fill={helmet} stroke={dark} strokeWidth={0.07} />
        {/* facemask shows which way he is looking */}
        <path d={`M -0.3 ${low ? -0.8 : -0.53} Q 0 ${low ? -0.98 : -0.71} 0.3 ${low ? -0.8 : -0.53}`} fill="none" stroke={off ? '#9CA3AF' : '#D1D5DB'} strokeWidth={0.09} />
      </g>
      {label && (
        <text y={1.9} textAnchor="middle" fontSize={1.1} fontWeight={700} fill="#F5F5F3" stroke="rgba(0,0,0,0.65)" strokeWidth={0.2} paintOrder="stroke" style={{ fontFamily: 'Oswald, sans-serif' }}>{label}</text>
      )}
    </g>
  );
}

function Ball({ p }: { p: Pt }) {
  return (
    <g transform={`translate(${p.x.toFixed(2)} ${(-p.y).toFixed(2)})`}>
      <ellipse rx={0.55} ry={0.34} fill="#8A4B1F" stroke="#4A260D" strokeWidth={0.07} />
      <path d="M -0.2 0 H 0.2" stroke="#F5F5F3" strokeWidth={0.07} />
    </g>
  );
}

/* ------------------------------ field ------------------------------ */
function FieldBg() {
  const lines: JSX.Element[] = [];
  for (let y = 0; y <= 32; y += 5) {
    lines.push(<line key={`y${y}`} x1={-26.7} x2={26.7} y1={-y} y2={-y} stroke="rgba(245,245,243,0.14)" strokeWidth={0.12} />);
  }
  for (let y = -9; y <= 32; y += 1) {
    // high school hash marks: 53 feet 4 inches from each sideline
    [-8.89, 8.89].forEach((hx) => {
      lines.push(<line key={`h${y}${hx}`} x1={hx - 0.4} x2={hx + 0.4} y1={-y} y2={-y} stroke="rgba(245,245,243,0.16)" strokeWidth={0.08} />);
    });
    lines.push(<line key={`l${y}`} x1={-26.2} x2={-25.6} y1={-y} y2={-y} stroke="rgba(245,245,243,0.12)" strokeWidth={0.08} />);
    lines.push(<line key={`r${y}`} x1={25.6} x2={26.2} y1={-y} y2={-y} stroke="rgba(245,245,243,0.12)" strokeWidth={0.08} />);
  }
  return (
    <g>
      <rect x={-28} y={-34} width={56} height={46} fill="#102019" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={-28} y={-34 + i * 5} width={56} height={5} fill={i % 2 ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.05)'} />
      ))}
      <rect x={-26.67} y={-34} width={53.34} height={46} fill="none" stroke="rgba(245,245,243,0.35)" strokeWidth={0.2} />
      {lines}
    </g>
  );
}

// 0 = facing downfield, 180 = facing the line of scrimmage, 90 = facing the right sideline
function headingOf(a: Pt, b: Pt, fallback: number): number {
  const dx = b.x - a.x; const dy = b.y - a.y;
  if (Math.hypot(dx, dy) < 0.02) return fallback;
  return (Math.atan2(dx, dy) * 180) / Math.PI;
}

// Where a defender is looking: zone defenders keep their eyes on the QB while they drop, man defenders on
// their receiver, deep defenders turn and run once they open their hips.
function defFacing(sc: Scenario, d: DefPlayer, t: number, pos: Pt): number {
  const qb = qbPosAt(sc.ballX, Math.min(t, sc.tDec));
  const toQb = headingOf(pos, qb, 180);
  if (d.role === 'DL' && d.task.k === 'rush') return t <= 0 ? 180 : headingOf(pos, qb, 180);
  if (t <= 0.02) {
    if (d.task.k === 'man' && d.pre.y < 2.8) {
      const r = sc.offense.find((o) => o.pos === (d.task as { tgt: RId }).tgt)!;
      return headingOf(pos, r.start, 180); // squared up on his man in press
    }
    // off corners in a three-deep look sit with their hips turned to the sideline
    if ((d.id === 'CBL' || d.id === 'CBR') && d.pre.y > 6 && sc.look === 'cover3') return 180 + (pos.x > sc.ballX ? -35 : 35);
    return toQb;
  }
  const p2 = sampleAt(sc.traj[d.id], Math.min(sc.tEnd, t + 0.1));
  const v = Math.hypot(p2.x - pos.x, p2.y - pos.y) / 0.1;
  const move = headingOf(pos, p2, toQb);
  if (d.task.k === 'rush') return move;
  if (d.task.k === 'man') {
    if (v < 1.5) { const r = sc.offense.find((o) => o.pos === (d.task as { tgt: RId }).tgt)!; return headingOf(pos, sampleAt(sc.traj[r.id], t), toQb); }
    return move;
  }
  if (d.task.k === 'zone') {
    const backpedal = p2.y > pos.y && (!d.task.deep || t < 0.7);
    if (v < 1.5 || backpedal) return toQb;
  }
  return move;
}

/* ------------------------------ component ------------------------------ */
export function QBSimulator() {
  const [diff, setDiff] = useState<Diff>('beginner');
  const [phase, setPhase] = useState<Phase>('menu');
  const [sc, setSc] = useState<Scenario | null>(null);
  const [t, setT] = useState(0);
  const [stats, setStats] = useState<Stats>(loadStats);
  const [shellGuess, setShellGuess] = useState<Shell | null>(null);
  const [blitzGuess, setBlitzGuess] = useState<boolean | null>(null);
  const [covGuess, setCovGuess] = useState<Coverage | null>(null);
  const [target, setTarget] = useState<RId | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [clockLeft, setClockLeft] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [repKey, setRepKey] = useState(0);
  const rngRef = useRef(mulberry32((Date.now() % 2147483647) | 0));
  const recent = useRef<Coverage[]>([]);
  const raf = useRef<number | null>(null);

  const cfg = DIFFS.find((d) => d.key === diff)!;
  const needsBlitz = diff !== 'beginner';
  const needsCov = diff !== 'beginner';

  const newRep = useCallback((d: Diff) => {
    const s = makeScenario(d, rngRef.current, recent.current.slice(-3));
    recent.current = [...recent.current.slice(-4), s.coverage];
    setSc(s); setT(0); setShellGuess(null); setBlitzGuess(null); setCovGuess(null); setTarget(null);
    setTimedOut(false); setClockLeft(null); setHint(false); setShowReveal(false); setRepKey((k) => k + 1);
    setPhase('presnap');
  }, []);

  // animation loop
  useEffect(() => {
    if (!sc) return;
    if (phase !== 'running' && phase !== 'throw') return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      setT((cur) => cur + dt);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [phase, sc]);

  // pause at decision time
  useEffect(() => {
    if (sc && phase === 'running' && t >= sc.tDec) { setT(sc.tDec); setPhase('decide'); if (cfg.clock) setClockLeft(cfg.clock); }
  }, [t, phase, sc, cfg.clock]);

  function finish(pick: RId | null, expired = false) {
    if (!sc) return;
    setTarget(pick);
    if (expired) setTimedOut(true);
    const e = pick ? sc.evals[pick] : null;
    const good = !!e && e.cls === 'open';
    const best = !!pick && good && sc.bestIds.includes(pick);
    const intercepted = !!e && e.cls === 'covered' && (!!e.lane || e.undercut);
    const s = { ...stats, byCov: { ...stats.byCov } };
    s.reps += 1;
    s.shellN += 1; if (shellGuess === sc.lookShell) s.shellOk += 1;
    if (needsBlitz) { s.blitzN += 1; if (blitzGuess === (sc.rushers >= 5)) s.blitzOk += 1; }
    if (needsCov) { s.covN += 1; if (covGuess === sc.coverage) s.covOk += 1; }
    if (good) { s.good += 1; s.streak += 1; s.bestStreak = Math.max(s.bestStreak, s.streak); } else { s.streak = 0; }
    if (best) s.best += 1;
    if (intercepted) s.ints += 1;
    const c = s.byCov[sc.coverage] || { n: 0, good: 0 };
    s.byCov[sc.coverage] = { n: c.n + 1, good: c.good + (good ? 1 : 0) };
    setStats(s); saveStats(s);
    setPhase('throw');
  }

  // decision clock
  useEffect(() => {
    if (phase !== 'decide' || clockLeft === null) return;
    if (clockLeft <= 0) { finish(null, true); return; }
    const id = window.setTimeout(() => setClockLeft((c) => (c === null ? c : +(c - 0.1).toFixed(1))), 100);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, clockLeft]);

  // same ball flight the read was graded on
  const flight = useMemo(() => (sc && target ? sc.evals[target].flight || 0.6 : 0.6), [sc, target]);

  useEffect(() => {
    if (phase !== 'throw' || !sc) return;
    const endT = timedOut || !target ? sc.tDec + 0.9 : sc.tDec + flight + 0.35;
    if (t >= endT) setPhase('result');
  }, [t, phase, sc, flight, timedOut, target]);

  const startSnap = () => {
    if (!sc || shellGuess === null) return;
    setT(0); setPhase('running');
  };

  const resetStats = () => { const s = emptyStats(); setStats(s); saveStats(s); };

  const view = useMemo(() => {
    if (!sc) return null;
    const tt = Math.min(t, sc.tEnd);
    const pre = phase === 'presnap' || tt < 0.12;
    const off = sc.offense.map((p) => {
      const pos = sampleAt(sc.traj[p.id], tt);
      const pos2 = sampleAt(sc.traj[p.id], Math.min(sc.tEnd, tt + 0.08));
      const stance: Stance = !pre ? 'run' : p.kind === 'ol' ? 'three' : p.kind === 'qb' ? 'gun' : 'two';
      return { p, pos, stance, heading: p.kind === 'ol' || p.kind === 'qb' || pre ? 0 : headingOf(pos, pos2, 0) };
    });
    const def = sc.defense.map((d) => {
      const pos = sampleAt(sc.traj[d.id], tt);
      const pressed = (d.id === 'CBL' || d.id === 'CBR' || d.id === 'NB' || d.id === 'SS') && d.pre.y < 2.8;
      const stance: Stance = !pre ? 'run' : d.role === 'DL' ? 'three' : pressed ? 'press' : 'two';
      return { d, pos, stance, heading: defFacing(sc, d, pre ? 0 : tt, pos) };
    });
    return { off, def };
  }, [sc, t, phase]);

  const ball = useMemo<Pt | null>(() => {
    if (!sc) return null;
    if (phase === 'presnap') return { x: sc.ballX, y: -0.1 };
    if (phase === 'throw' || phase === 'result') {
      if (!target || timedOut) return null;
      const el = t - sc.tDec;
      const rid = target.toLowerCase();
      const catchT = Math.min(sc.tEnd, sc.tDec + flight);
      const dest = sampleAt(sc.traj[rid], catchT);
      const u = Math.max(0, Math.min(1, el / flight));
      if (u >= 1) return sampleAt(sc.traj[rid], Math.min(sc.tEnd, t));
      const start = qbPosAt(sc.ballX, sc.tDec);
      return { x: start.x + (dest.x - start.x) * u, y: start.y + (dest.y - start.y) * u };
    }
    const q = qbPosAt(sc.ballX, Math.min(t, sc.tDec));
    return { x: q.x + 0.5, y: q.y + 0.3 };
  }, [sc, t, phase, target, timedOut, flight]);

  const outcome = useMemo(() => {
    if (!sc) return null;
    const best = sc.bestId ? sc.evals[sc.bestId] : null;
    if (timedOut || !target) return { tone: 'bad' as const, title: 'Sack', body: 'The clock ran out in the pocket. A decision that late is a sack or a throw-away. Pick a target faster next rep.' };
    const e = sc.evals[target];
    const routeOf = (k: RId) => sc.offense.find((o) => o.pos === k)!.route;
    // say exactly why the best read was better, using the same numbers shown for every target
    const compare = (b: typeof e) => {
      const why: string[] = [];
      if (b.gain > e.gain + 1) why.push(`it gains about ${b.gain} yds to your ${Math.max(0, e.gain)}${b.firstDown && !e.firstDown ? ` and moves the chains on ${sc.situation.split(' · ')[0]}` : ''}`);
      if (b.gap > e.gap + 0.5) why.push(`it has ${b.gap.toFixed(1)} yds of cushion when the ball arrives to your ${e.gap.toFixed(1)}`);
      return why.length ? ` ${b.label} (${routeOf(b.id)}) was the better throw: ${why.join(', and ')}.` : ` ${b.label} (${routeOf(b.id)}) was the better throw.`;
    };
    if (e.cls === 'open') {
      const isBest = sc.bestIds.includes(target);
      const others = sc.bestIds.filter((k) => k !== target).map((k) => sc.evals[k].label);
      return {
        tone: 'good' as const,
        title: isBest ? 'Completion. Best read.' : 'Completion. Open, but not the best read.',
        body: `${e.why}${isBest ? (others.length ? ` ${others.join(' and ')} ${others.length > 1 ? 'were' : 'was'} just as good.` : '') : best ? compare(best) : ''}`,
      };
    }
    if (e.cls === 'tight') return { tone: 'meh' as const, title: 'Incomplete. Contested.', body: `${e.why}${best ? compare(best) : ''}` };
    return { tone: 'bad' as const, title: e.lane || e.undercut ? 'Interception' : 'Pass breakup', body: `${e.why}${best ? compare(best) : ''}` };
  }, [sc, target, timedOut]);

  const showResult = phase === 'result';
  const shellOk = sc ? shellGuess === sc.lookShell : false;
  const covOk = sc ? covGuess === sc.coverage : false;
  const blitzOk = sc ? blitzGuess === (sc.rushers >= 5) : false;
  const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : '-');

  return (
    <section className="rounded-2xl border border-white/10 bg-charcoal" id="qb-lab">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
        <div>
          <div className="font-headline text-xs uppercase tracking-widest2 text-electricsoft">QB Lab</div>
          <h3 className="font-display text-3xl tracking-wide text-offwhite sm:text-4xl">Read the defense. Make the throw.</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {DIFFS.map((d) => (
            <button
              key={d.key}
              onClick={() => { setDiff(d.key); setPhase('menu'); setSc(null); }}
              className={`rounded-full border px-4 py-1.5 font-headline text-xs uppercase tracking-wider2 transition ${diff === d.key ? 'border-electric bg-electric text-white' : 'border-white/15 text-silver hover:border-white/40'}`}
            >{d.label}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="relative mx-auto w-full" style={{ aspectRatio: '54 / 43' }}>
            <svg viewBox="-27 -33 54 43" className="absolute inset-0 h-full w-full" role="img" aria-label="Football field with offense and defense">
              <FieldBg />
              <line x1={-26.67} x2={26.67} y1={0} y2={0} stroke="#3B82F6" strokeWidth={0.2} opacity={0.9} />

              {sc && view && (
                <g key={repKey}>
                  {sc.offense.filter((p) => p.kind === 'rcv' && p.route !== 'block').map((p) => (
                    <polyline key={`r${p.id}`} points={p.path.map((q) => `${q.x},${-q.y}`).join(' ')} fill="none" stroke={target === (p.pos as RId) ? '#93C5FD' : 'rgba(96,165,250,0.4)'} strokeWidth={0.14} strokeDasharray="0.5 0.4" />
                  ))}

                  {showReveal && sc.defense.filter((d) => d.task.k === 'zone').map((d) => {
                    const z = d.task as Extract<typeof d.task, { k: 'zone' }>;
                    const dv = view.def.find((v) => v.d.id === d.id)!;
                    return (
                      <g key={`z${d.id}`}>
                        <circle cx={z.land.x} cy={-z.land.y} r={Math.min(z.r * 0.4, 4.5)} fill="rgba(180,71,75,0.12)" stroke="rgba(220,100,100,0.6)" strokeWidth={0.1} strokeDasharray="0.4 0.3" />
                        <line x1={dv.pos.x} y1={-dv.pos.y} x2={z.land.x} y2={-z.land.y} stroke="rgba(220,100,100,0.45)" strokeWidth={0.08} />
                      </g>
                    );
                  })}
                  {showReveal && sc.defense.filter((d) => d.task.k === 'man').map((d) => {
                    const m = d.task as Extract<typeof d.task, { k: 'man' }>;
                    const rv = view.off.find((v) => v.p.pos === m.tgt)!;
                    const dv = view.def.find((v) => v.d.id === d.id)!;
                    return <line key={`m${d.id}`} x1={dv.pos.x} y1={-dv.pos.y} x2={rv.pos.x} y2={-rv.pos.y} stroke="rgba(240,120,120,0.85)" strokeWidth={0.14} strokeDasharray="0.3 0.25" />;
                  })}

                  {view.def.map(({ d, pos, heading, stance }) => <Sprite key={d.id} p={pos} heading={heading} off={false} stance={stance} />)}
                  {view.off.map(({ p, pos, heading, stance }) => (
                    <Sprite
                      key={p.id} p={pos} heading={heading} off stance={stance}
                      label={p.kind === 'rcv' ? p.label : p.kind === 'qb' ? 'QB' : undefined}
                      highlight={phase === 'decide' && p.kind === 'rcv' && p.route !== 'block'}
                    />
                  ))}
                  {ball && <Ball p={ball} />}
                </g>
              )}
            </svg>

            {sc && phase === 'decide' && view && (
              <div className="pointer-events-none absolute inset-0">
                {view.off.filter((v) => v.p.kind === 'rcv').map(({ p, pos }) => (
                  <button
                    key={p.id}
                    onClick={() => finish(p.pos as RId)}
                    disabled={needsCov && covGuess === null}
                    className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-electricsoft bg-electric/25 text-[0px] transition hover:bg-electric/60 disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ left: `${((pos.x + 27) / 54) * 100}%`, top: `${((-pos.y + 33) / 43) * 100}%`, width: '8%', aspectRatio: '1' }}
                    aria-label={`Throw to ${p.label}`}
                  >{p.label}</button>
                ))}
              </div>
            )}

            {phase === 'decide' && clockLeft !== null && (
              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 font-headline text-sm text-offwhite">
                <Clock size={14} className={clockLeft < 3 ? 'text-red-400' : 'text-electricsoft'} />
                <span className={clockLeft < 3 ? 'text-red-400' : ''}>{clockLeft.toFixed(1)}s</span>
              </div>
            )}
            {sc && phase !== 'menu' && (
              <div className="absolute right-3 top-3 rounded-lg bg-black/60 px-3 py-1.5 text-right">
                <div className="font-headline text-[11px] uppercase tracking-wider2 text-silver">{sc.situation.split(' · ').slice(0, 2).join(' · ')}</div>
                <div className="font-headline text-sm text-offwhite">{sc.situation.split(' · ')[2]}</div>
              </div>
            )}

            {phase === 'menu' && (
              <div className="absolute inset-0 flex items-center justify-center bg-nearblack/70 p-6 text-center backdrop-blur-[2px]">
                <div className="max-w-md">
                  <div className="font-display text-4xl text-offwhite">{cfg.label}</div>
                  <p className="mt-2 text-sm text-silver">{cfg.blurb}</p>
                  <button onClick={() => newRep(diff)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3 font-headline text-sm uppercase tracking-wider2 text-white transition hover:bg-electricdark">
                    <Play size={16} /> Start rep
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-4 p-5 sm:p-6">
          {phase === 'menu' && (
            <>
              <p className="text-sm text-silver">Every rep has a different formation, play, and coverage. You never see the answer first: you read the pre-snap picture, then the post-snap movement, then throw.</p>
              <StatsBlock stats={stats} pct={pct} onReset={resetStats} />
            </>
          )}

          {sc && phase === 'presnap' && (
            <>
              <div>
                <div className="font-headline text-xs uppercase tracking-widest2 text-electricsoft">Step 1 · Pre-snap</div>
                <div className="mt-1 text-sm text-offwhite"><span className="font-semibold">{sc.conceptName}</span> is called. <span className="text-silver">{sc.concept.blurb}</span></div>
              </div>
              <Question title="How many safeties are deep?">
                {SHELLS.map((s) => <Choice key={s} active={shellGuess === s} onClick={() => setShellGuess(s)}>{shellText[s]}</Choice>)}
              </Question>
              {needsBlitz && (
                <Question title="Is a blitz coming?">
                  <Choice active={blitzGuess === false} onClick={() => setBlitzGuess(false)}>Four rushers</Choice>
                  <Choice active={blitzGuess === true} onClick={() => setBlitzGuess(true)}>Five or more</Choice>
                </Question>
              )}
              {diff === 'beginner' && (
                <button onClick={() => setHint((h) => !h)} className="inline-flex items-center gap-2 self-start text-xs text-silver underline-offset-2 hover:text-offwhite hover:underline">
                  <Eye size={14} /> {hint ? 'Hide hint' : 'What am I looking for?'}
                </button>
              )}
              {hint && <p className="rounded-lg bg-white/5 p-3 text-xs text-silver">Look at the red helmets farthest from the line of scrimmage. Count the ones lined up behind the linebackers. Those are your safeties.</p>}
              <button
                disabled={shellGuess === null || (needsBlitz && blitzGuess === null)}
                onClick={startSnap}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-electric px-5 py-3 font-headline text-sm uppercase tracking-wider2 text-white transition enabled:hover:bg-electricdark disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Play size={16} /> Snap the ball
              </button>
            </>
          )}

          {sc && phase === 'running' && (
            <div className="text-sm text-silver">
              <div className="font-headline text-xs uppercase tracking-widest2 text-electricsoft">Step 2 · Post-snap</div>
              <p className="mt-2">Watch the safeties and the defenders over your receivers. Did the picture change after the snap?</p>
            </div>
          )}

          {sc && phase === 'decide' && (
            <>
              <div className="font-headline text-xs uppercase tracking-widest2 text-electricsoft">Step 3 · Decide</div>
              {needsCov && (
                <Question title="Call the coverage you see">
                  <select
                    value={covGuess ?? ''}
                    onChange={(e) => setCovGuess((e.target.value || null) as Coverage | null)}
                    className="w-full rounded-lg border border-white/15 bg-nearblack px-3 py-2 text-sm text-offwhite"
                  >
                    <option value="">Choose a coverage</option>
                    {ALL_COVERAGES.map((c) => <option key={c} value={c}>{COVERAGE_INFO[c].name}</option>)}
                  </select>
                </Question>
              )}
              <p className="text-sm text-silver">
                {needsCov && covGuess === null ? 'Call the coverage first, then tap the receiver you are throwing to.' : 'Tap the receiver you are throwing to, here or on the field.'}
              </p>
              <div className="grid grid-cols-5 gap-1.5 text-center text-[11px] text-silver">
                {(['X', 'H', 'Y', 'Z', 'R'] as RId[]).map((k) => {
                  const p = sc.offense.find((o) => o.pos === k)!;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => finish(k)}
                      disabled={needsCov && covGuess === null}
                      className="rounded-md border border-white/15 bg-white/5 px-1 py-2 transition hover:border-electric hover:bg-electric/25 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <div className="font-headline text-sm text-offwhite">{p.label}</div>
                      <div className="capitalize">{p.route === 'block' ? 'block' : p.route}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {sc && phase === 'throw' && <p className="text-sm text-silver">Ball is out...</p>}

          {sc && showResult && outcome && (
            <div className="flex flex-col gap-4">
              <div className={`rounded-xl border p-4 ${outcome.tone === 'good' ? 'border-emerald-500/40 bg-emerald-500/10' : outcome.tone === 'meh' ? 'border-amber-500/40 bg-amber-500/10' : 'border-red-500/40 bg-red-500/10'}`}>
                <div className="font-display text-2xl tracking-wide text-offwhite">{outcome.title}</div>
                <p className="mt-1 text-sm text-silver">{outcome.body}</p>
              </div>

              <div className="space-y-1.5 text-sm">
                <Grade ok={shellOk} label={`Pre-snap: ${shellText[sc.lookShell]}`} detail={shellGuess ? `You said: ${shellText[shellGuess]}` : ''} />
                {needsBlitz && <Grade ok={blitzOk} label={sc.rushers >= 5 ? `Blitz: ${sc.pressureLabel}` : 'No blitz: four rushers'} detail={blitzGuess === null ? '' : `You said: ${blitzGuess ? 'five or more' : 'four'}`} />}
                {needsCov && <Grade ok={covOk} label={`Coverage: ${COVERAGE_INFO[sc.coverage].name}`} detail={covGuess ? `You said: ${COVERAGE_INFO[covGuess].name}` : 'No call made'} />}
              </div>

              <button onClick={() => setShowReveal((v) => !v)} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2 font-headline text-xs uppercase tracking-wider2 text-offwhite hover:border-white/50">
                <Eye size={14} /> {showReveal ? 'Hide assignments' : 'Show defensive assignments'}
              </button>

              <div className="space-y-1 text-xs text-silver">
                {coverageExplanation(sc).map((l, i) => <p key={i}>{l}</p>)}
              </div>

              <div>
                <div className="mb-1.5 font-headline text-xs uppercase tracking-widest2 text-electricsoft">Every target at the throw</div>
                <ul className="space-y-1.5">
                  {(['X', 'H', 'Y', 'Z', 'R'] as RId[]).map((k) => {
                    const e = sc.evals[k]; const p = sc.offense.find((o) => o.pos === k)!;
                    const tone = e.cls === 'open' ? 'text-emerald-400' : e.cls === 'tight' ? 'text-amber-400' : 'text-red-400';
                    return (
                      <li key={k} className="rounded-lg bg-white/5 px-3 py-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-headline text-sm text-offwhite">{p.label} <span className="font-body text-silver">· {p.route === 'block' ? 'blocking' : p.route}</span>{sc.bestIds.includes(k) && <span className="ml-1.5 rounded bg-electric/30 px-1.5 py-0.5 text-[10px] text-electricsoft">BEST</span>}{target === k && <span className="ml-1.5 rounded bg-white/15 px-1.5 py-0.5 text-[10px] text-offwhite">YOUR THROW</span>}</span>
                          <span className={`font-headline uppercase ${tone}`}>{e.cls}</span>
                        </div>
                        <p className="mt-0.5 text-silver">{e.why}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {showReveal && (
                <div>
                  <div className="mb-1.5 font-headline text-xs uppercase tracking-widest2 text-electricsoft">Defender assignments</div>
                  <ul className="space-y-1 text-xs text-silver">
                    {sc.defense.filter((d) => ['CBL', 'CBR', 'NB', 'SS', 'FS', 'MIKE', 'WILL'].includes(d.id)).map((d) => (
                      <li key={d.id}><span className="text-offwhite">{(d as unknown as { name: string }).name}:</span> {taskLabel(sc, d)}. <span className="text-silver/80">Pre-snap: {describeDefender(sc, d)}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={() => newRep(diff)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-electric px-4 py-3 font-headline text-sm uppercase tracking-wider2 text-white hover:bg-electricdark">
                  Next rep <ArrowRight size={16} />
                </button>
                <button onClick={() => { setT(0); setPhase('running'); setTarget(null); setTimedOut(false); }} title="Replay the rep" className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 text-offwhite hover:border-white/50">
                  <RotateCcw size={16} />
                </button>
              </div>
              <StatsBlock stats={stats} pct={pct} onReset={resetStats} compact />
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

/* ------------------------------ small UI bits ------------------------------ */
function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-semibold text-offwhite">{title}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-lg border px-3 py-2 text-left text-sm transition ${active ? 'border-electric bg-electric/20 text-offwhite' : 'border-white/15 text-silver hover:border-white/40 hover:text-offwhite'}`}>{children}</button>
  );
}
function Grade({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <div className="flex items-start gap-2">
      {ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" /> : <XCircle size={16} className="mt-0.5 shrink-0 text-red-400" />}
      <div><div className="text-offwhite">{label}</div>{detail && <div className="text-xs text-silver">{detail}</div>}</div>
    </div>
  );
}
function StatsBlock({ stats, pct, onReset, compact }: { stats: Stats; pct: (a: number, b: number) => string; onReset: () => void; compact?: boolean }) {
  const weakest = Object.entries(stats.byCov).filter(([, v]) => v.n >= 3).sort((a, b) => a[1].good / a[1].n - b[1].good / b[1].n)[0];
  return (
    <div className="rounded-xl border border-white/10 bg-nearblack/60 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 font-headline text-xs uppercase tracking-widest2 text-electricsoft"><Target size={14} /> Your progress</div>
        {stats.reps > 0 && <button onClick={onReset} className="text-[11px] text-silver underline-offset-2 hover:text-offwhite hover:underline">Reset</button>}
      </div>
      {stats.reps === 0 ? <p className="text-xs text-silver">No reps yet. Your results are saved in this browser.</p> : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-silver">
          <span>Reps</span><span className="text-right text-offwhite">{stats.reps}</span>
          <span>Throws to an open man</span><span className="text-right text-offwhite">{pct(stats.good, stats.reps)}</span>
          <span>Best-read throws</span><span className="text-right text-offwhite">{pct(stats.best, stats.reps)}</span>
          <span>Safety count correct</span><span className="text-right text-offwhite">{pct(stats.shellOk, stats.shellN)}</span>
          {stats.covN > 0 && (<><span>Coverage called correctly</span><span className="text-right text-offwhite">{pct(stats.covOk, stats.covN)}</span></>)}
          {stats.blitzN > 0 && (<><span>Blitz spotted</span><span className="text-right text-offwhite">{pct(stats.blitzOk, stats.blitzN)}</span></>)}
          <span>Interceptions thrown</span><span className="text-right text-offwhite">{stats.ints}</span>
          <span>Best streak</span><span className="text-right text-offwhite">{stats.bestStreak}</span>
          {!compact && weakest && (<><span>Toughest coverage</span><span className="text-right text-offwhite">{COVERAGE_INFO[weakest[0] as Coverage].short}</span></>)}
        </div>
      )}
    </div>
  );
}

export default QBSimulator;
