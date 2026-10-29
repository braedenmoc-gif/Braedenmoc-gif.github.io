// QB Lab engine: formations, coverages, motion simulation, and read evaluation.
// Coordinates are in yards. x: field-centered (-26.67..26.67), y: downfield from the line of scrimmage.

export type Pt = { x: number; y: number };
export type RId = 'X' | 'H' | 'Y' | 'Z' | 'R';
export type Coverage = 'cover0' | 'cover1' | 'cover2' | 'tampa2' | 'cover3' | 'cover4' | 'cover6' | 'twoman';
export type Shell = 'one' | 'two' | 'zero';
export type Diff = 'beginner' | 'intermediate' | 'expert';
export type FormationKey = 'doubles' | 'trips' | 'ace' | 'bunch';

export const COVERAGE_INFO: Record<Coverage, { name: string; short: string; shell: Shell; type: 'man' | 'zone'; family: string; beat: string; tells: string }> = {
  cover0: { name: 'Cover 0', short: 'Cover 0', shell: 'zero', type: 'man', family: 'man', beat: 'Quick game and hot routes. No safety means a won release is a big play, but the ball has to come out in under two seconds.', tells: 'No safety deeper than about 7 yards, linebackers walked up, pressed corners.' },
  cover1: { name: 'Cover 1', short: 'Cover 1', shell: 'one', type: 'man', family: 'man', beat: 'Crossing routes and mesh beat man. Throw deep shots away from the single safety.', tells: 'One deep safety, corners tight or pressed, defenders glued to receivers, a linebacker on the back.' },
  cover2: { name: 'Cover 2', short: 'Cover 2', shell: 'two', type: 'zone', family: 'two-zone', beat: 'The corner route behind the squat corner, the seams, and curl-flat concepts.', tells: 'Two deep safeties near the hashes, corners tight and jamming, then sinking to the flats.' },
  tampa2: { name: 'Tampa 2', short: 'Tampa 2', shell: 'two', type: 'zone', family: 'two-zone', beat: 'Throw under the middle linebacker: mesh, crossers, and curl-flat. The seam is closed.', tells: 'Looks like Cover 2 until the middle linebacker turns and runs deep down the middle.' },
  cover3: { name: 'Cover 3', short: 'Cover 3', shell: 'one', type: 'zone', family: 'three', beat: 'Seams, the hitch to a bailing corner, flood, and stick.', tells: 'One deep safety in the middle, corners backpedaling off the line, four defenders underneath.' },
  cover4: { name: 'Cover 4 (Quarters)', short: 'Cover 4', shell: 'two', type: 'zone', family: 'quarters', beat: 'Go underneath: mesh, curl-flat, and crossers. Do not force vertical routes into four deep defenders.', tells: 'Two safeties at 8-10 yards over the inside receivers, corners off, safeties reading the inside receiver.' },
  cover6: { name: 'Cover 6', short: 'Cover 6', shell: 'two', type: 'zone', family: 'quarters', beat: 'Attack the Cover 2 side with the corner route and the quarters side underneath.', tells: 'Corners play differently on each side: one tight and sinking, one off in quarters.' },
  twoman: { name: '2-Man', short: '2-Man', shell: 'two', type: 'man', family: 'man', beat: 'Dig or crossing routes between the safeties, away from the trailing corners.', tells: 'Two deep safeties, corners pressed, and the nickel traveling with motion.' },
};

export const ALL_COVERAGES = Object.keys(COVERAGE_INFO) as Coverage[];

// ---------------- Formations ----------------
type FormDef = { name: string; rcv: Record<'X' | 'H' | 'Y' | 'Z', Pt>; rb: Pt; strength: 1 | -1; inlineTE?: boolean };
export const FORMATIONS: Record<FormationKey, FormDef> = {
  doubles: { name: 'Gun Doubles', rcv: { X: { x: -15, y: -0.3 }, H: { x: -8, y: -1.3 }, Y: { x: 8, y: -1.3 }, Z: { x: 15, y: -0.3 } }, rb: { x: -2.4, y: -5 }, strength: 1 },
  trips: { name: 'Gun Trips', rcv: { X: { x: -15, y: -0.3 }, H: { x: 11, y: -1.3 }, Y: { x: 7.4, y: -1.3 }, Z: { x: 15.5, y: -0.3 } }, rb: { x: -2.4, y: -5 }, strength: 1 },
  ace: { name: 'Ace (TE inline)', rcv: { X: { x: -15, y: -0.3 }, H: { x: -8, y: -1.3 }, Y: { x: 4.4, y: -0.4 }, Z: { x: 15, y: -0.3 } }, rb: { x: 2.4, y: -5 }, strength: 1, inlineTE: true },
  bunch: { name: 'Gun Bunch', rcv: { X: { x: -15, y: -0.3 }, H: { x: 8.6, y: -1.4 }, Y: { x: 11.6, y: -1.5 }, Z: { x: 10.1, y: -0.3 } }, rb: { x: -2.4, y: -5 }, strength: 1 },
};

// ---------------- Routes ----------------
// points are [outward dx, dy from start]; "outward" means toward the sideline on the receiver's side.
type RouteDef = { pts: [number, number][]; speed?: number };
const ROUTES: Record<string, RouteDef> = {
  go: { pts: [[0, 34]] },
  seam: { pts: [[0, 5], [-1.4, 11], [-1.4, 34]] },
  hitch: { pts: [[0, 6], [0, 4.6]] },
  curl: { pts: [[0, 12], [-0.9, 9.8]] },
  comeback: { pts: [[0, 14], [2.4, 11]] },
  out: { pts: [[0, 10], [8, 10], [12, 9.6]] },
  dig: { pts: [[0, 12], [-13, 12], [-20, 12.4]] },
  slant: { pts: [[0, 1.4], [-4.5, 6], [-16, 11.5]] },
  drag: { pts: [[0, 1], [-15, 3.2], [-24, 4.2]] },
  flat: { pts: [[5, 0.6], [10, 1.4], [13.5, 2.6], [15, 5]] },
  corner: { pts: [[0, 10], [6.5, 16], [11, 20]] },
  post: { pts: [[0, 10], [-7, 18], [-9, 30]] },
  stick: { pts: [[0, 5.4], [0, 5.9]] },
  wheel: { pts: [[5, 0.4], [9, 4], [10.5, 24]] },
  check: { pts: [[3, -0.5], [7, 2]] },
  swing: { pts: [[4, -2.5], [9, -0.5], [11, 2], [12.5, 5]] },
  block: { pts: [] },
};

type Concept = { key: string; name: string; assign: Record<RId, string>; blurb: string };
const C = (key: string, name: string, X: string, H: string, Y: string, Z: string, R: string, blurb: string): Concept => ({ key, name, assign: { X, H, Y, Z, R }, blurb });
export const CONCEPTS: Record<FormationKey, Concept[]> = {
  doubles: [
    C('smash', 'Smash', 'curl', 'flat', 'corner', 'hitch', 'check', 'Corner route over a hitch on the right, curl-flat on the left.'),
    C('verts', 'Four Verticals', 'go', 'seam', 'seam', 'go', 'swing', 'Everyone runs deep; the slots split the middle of the field.'),
    C('mesh', 'Mesh', 'go', 'drag', 'drag', 'curl', 'check', 'Two crossing routes at different depths with a clear-out and a curl.'),
    C('curlflat', 'Curl-Flat', 'curl', 'flat', 'flat', 'curl', 'check', 'High-low the flat defender on both sides.'),
    C('flood', 'Flood', 'comeback', 'hitch', 'out', 'corner', 'swing', 'Three levels to the right: corner, out, and swing.'),
    C('levels', 'Levels', 'dig', 'drag', 'seam', 'go', 'check', 'A shallow crosser and a dig at two depths on the left.'),
    C('stick', 'Stick', 'curl', 'hitch', 'stick', 'go', 'swing', 'The stick route at 5 yards, a go to clear the corner, and a swing.'),
  ],
  trips: [
    C('smash', 'Trips Smash', 'go', 'corner', 'flat', 'hitch', 'check', 'Hitch, corner, and flat from the trips side.'),
    C('verts', 'Trips Verticals', 'go', 'seam', 'seam', 'go', 'swing', 'Four deep routes with the back swinging.'),
    C('flood', 'Trips Flood', 'dig', 'out', 'flat', 'corner', 'check', 'Three levels to the trips side.'),
    C('levels', 'Trips Levels', 'curl', 'dig', 'drag', 'go', 'check', 'Two crossing levels from the trips side.'),
    C('stick', 'Trips Stick', 'curl', 'flat', 'stick', 'go', 'swing', 'Stick from the inside slot with a go over the top.'),
  ],
  ace: [
    C('smash', 'Smash', 'curl', 'flat', 'corner', 'hitch', 'check', 'TE corner over a hitch, curl-flat to the left.'),
    C('curlflat', 'Curl-Flat', 'curl', 'flat', 'flat', 'curl', 'check', 'High-low the flat defender on both sides.'),
    C('stick', 'Stick', 'curl', 'hitch', 'stick', 'go', 'swing', 'TE stick with a swing and a go.'),
    C('verts', 'Four Verticals', 'go', 'seam', 'seam', 'go', 'check', 'Deep routes with the TE up the seam.'),
    C('levels', 'Levels', 'dig', 'drag', 'out', 'go', 'check', 'Shallow and dig levels to the left.'),
  ],
  bunch: [
    C('stick', 'Bunch Stick', 'curl', 'flat', 'stick', 'corner', 'check', 'Three receivers stacked: stick, flat, and corner.'),
    C('mesh', 'Bunch Mesh', 'curl', 'drag', 'drag', 'corner', 'check', 'Two crossers out of the bunch with a corner.'),
    C('verts', 'Bunch Verticals', 'go', 'seam', 'seam', 'go', 'swing', 'Four deep routes from a tight bunch.'),
  ],
};

// ---------------- Random ----------------
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export type Rng = () => number;
const pick = <T,>(rng: Rng, arr: T[]): T => arr[Math.floor(rng() * arr.length)];
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

// ---------------- Types ----------------
export type OffPlayer = { id: string; label: string; kind: 'qb' | 'ol' | 'rcv'; pos: string; start: Pt; path: Pt[]; route: string; speed: number };
export type Task =
  | { k: 'rush'; free: boolean }
  // lev > 0 = inside leverage, lev < 0 = outside leverage. trail > 0 = underneath, trail < 0 = over the top.
  // lag = how far (seconds) the defender is behind the receiver's movement. pre = a zone drop before he matches.
  | { k: 'man'; tgt: RId; lev: number; trail: number; lag: number; pre?: { until: number; land: Pt }; label?: string }
  // pref: what an underneath defender's eyes favor when two routes enter his area (closest, or widest)
  | { k: 'zone'; land: Pt; r: number; deep: boolean; label: string; pref?: 'near' | 'wide' }
  | { k: 'drop' };
export type DefPlayer = { id: string; label: string; role: string; pre: Pt; task: Task };

export type TargetEval = {
  id: RId; label: string; pos: Pt; depth: number; sep: number; nearest: string; manCovered: boolean;
  lane: string | null; cls: 'open' | 'tight' | 'covered'; why: string;
  // when the ball arrives
  catchPos: Pt; flight: number; gap: number; closer: string; gain: number; score: number; firstDown: boolean; undercut: boolean;
};

export type Scenario = {
  id: string; seed: number; diff: Diff;
  formation: FormationKey; flipped: boolean; ballX: number; concept: Concept; conceptName: string;
  coverage: Coverage; look: Coverage; disguised: boolean; rushers: number; pressureLabel: string;
  situation: string; strengthSide: 1 | -1;
  offense: OffPlayer[]; defense: DefPlayer[]; tDec: number; tEnd: number;
  traj: Record<string, Pt[]>; dt: number;
  evals: Record<RId, TargetEval>; openIds: RId[]; bestId: RId | null; bestIds: RId[]; toGo: number;
  coverageOptionsAll: Coverage[]; lookShell: Shell;
  facts: string[];
};

const DT = 0.05;

// ---------------- Defense construction ----------------
// nums.L / nums.R list receivers on each side from the sideline in: [#1, #2, #3]
type Ctx = { bx: number; rc: Record<RId, Pt>; sorted: RId[]; strength: 1 | -1; nbT: RId; ssT: RId; formation: FormationKey; hash: number; nums: { L: RId[]; R: RId[] } };

function buildCtx(f: FormationKey, flipped: boolean, bx: number): Ctx {
  const def = FORMATIONS[f];
  const m = flipped ? -1 : 1;
  const rc = {} as Record<RId, Pt>;
  // Receivers align to the field, not just the ball: with the ball on a hash, the wideouts stay near the
  // numbers, slots stay a normal split from the line, and an inline tight end stays on the line.
  (['X', 'H', 'Y', 'Z'] as const).forEach((k) => {
    const rel = m * def.rcv[k].x;
    const fieldSide = bx !== 0 && Math.sign(rel) !== Math.sign(bx);
    let follow = Math.abs(rel) < 6 ? 1 : f === 'bunch' && k !== 'X' ? 0.6 : 0.75;
    if (Math.abs(rel) >= 13) follow = fieldSide ? 0 : 0.5; // wideouts: on the numbers to the field, off the sideline to the boundary
    rc[k] = { x: clamp(rel + follow * bx, -21.5, 21.5), y: def.rcv[k].y };
  });
  rc.R = { x: bx + m * def.rb.x, y: def.rb.y };
  const sorted = (['X', 'H', 'Y', 'Z'] as RId[]).sort((a, b) => rc[a].x - rc[b].x);
  const strength = (m * def.strength) as 1 | -1;
  const mids = [sorted[1], sorted[2]];
  const strengthMid = strength === 1 ? mids[1] : mids[0];
  const otherMid = strength === 1 ? mids[0] : mids[1];
  let nbT = strengthMid; let ssT = otherMid;
  if (def.inlineTE) {
    if (mids.includes('Y')) { ssT = 'Y'; nbT = mids.find((k) => k !== 'Y') as RId; }
  }
  const nums = {
    L: sorted.filter((k) => rc[k].x < bx).sort((p, q) => rc[p].x - rc[q].x),
    R: sorted.filter((k) => rc[k].x >= bx).sort((p, q) => rc[q].x - rc[p].x),
  };
  return { bx, rc, sorted, strength, nbT, ssT, formation: f, hash: bx, nums };
}

const side = (x: number, bx: number) => (x >= bx ? 1 : -1);
const insideOf = (p: Pt, bx: number) => (p.x > bx ? -1 : 1); // direction toward the ball

function alignFor(look: Coverage, c: Ctx, rng: Rng): Record<string, Pt> {
  const { bx, rc, sorted, nums } = c;
  const A = rc[sorted[0]]; const D = rc[sorted[3]];
  const nb = rc[c.nbT]; const ss = rc[c.ssT];
  const ins = (p: Pt) => insideOf(p, bx);
  // + amt = inside leverage (toward the ball), - amt = outside leverage
  const lev = (p: Pt, amt: number) => p.x + ins(p) * amt;
  // apex: halfway between the tackle and the slot receiver
  const apex = (p: Pt) => (p.x + bx + (p.x > bx ? 2.8 : -2.8)) / 2;
  const jit = () => (rng() - 0.5) * 0.5;
  const mof = clamp(bx * 0.25, -3, 3); // a single-high safety sits in the middle of the field
  const out: Record<string, Pt> = {
    DEL: { x: bx - 3.8, y: 0.9 }, DTL: { x: bx - 1.1, y: 0.9 }, DTR: { x: bx + 1.2, y: 0.9 }, DER: { x: bx + 3.9, y: 0.9 },
    MIKE: { x: bx + 0.4, y: 4.6 }, WILL: { x: bx - 3.4, y: 4.6 },
  };
  const twoHigh = () => { out.FS = { x: -10 + jit(), y: 12.6 + jit() }; out.SS = { x: 10 + jit(), y: 12.6 + jit() }; };
  const overTwo = (sideNums: RId[], sgn: number): Pt => {
    const n2 = sideNums[1];
    return n2 ? { x: clamp(lev(rc[n2], 1.6), -13, 13), y: 9.6 + jit() } : { x: clamp(bx + sgn * 6, -13, 13), y: 10.2 + jit() };
  };
  switch (look) {
    case 'cover0': // press, inside leverage, no help; linebackers walked up in the A gaps
      out.CBL = { x: lev(A, 0.6), y: 1.2 }; out.CBR = { x: lev(D, 0.6), y: 1.2 };
      out.NB = { x: lev(nb, 0.6), y: 1.6 }; out.SS = { x: lev(ss, 0.6), y: 2.0 };
      out.FS = { x: bx + 1.5, y: 6.2 }; out.MIKE = { x: bx - 0.7, y: 1.8 }; out.WILL = { x: bx + 0.8, y: 1.8 };
      break;
    case 'cover1': // press, outside leverage on the corners (funnel to the free safety)
      out.CBL = { x: lev(A, -0.6), y: 1.2 + jit() * 0.3 }; out.CBR = { x: lev(D, -0.6), y: 1.2 + jit() * 0.3 };
      out.NB = { x: lev(nb, 0.8), y: 2.4 }; out.SS = { x: lev(ss, 0.8), y: 4.0 };
      out.FS = { x: mof, y: 13.2 + jit() }; out.WILL = { x: bx + c.strength * 2.2, y: 6.8 };
      break;
    case 'cover2': case 'tampa2': // squat corners with outside leverage, safeties on the hashes, apex underneath
      out.CBL = { x: lev(A, -1.2), y: 4.6 + jit() * 0.4 }; out.CBR = { x: lev(D, -1.2), y: 4.6 + jit() * 0.4 };
      twoHigh();
      out.NB = { x: apex(nb), y: 5.0 }; out.WILL = { x: apex(ss), y: 5.0 }; out.MIKE = { x: bx + 0.3, y: 5.4 };
      break;
    case 'cover3': // off corners, outside leverage, one safety in the middle
      out.CBL = { x: lev(A, -0.8), y: 7.4 + jit() }; out.CBR = { x: lev(D, -0.8), y: 7.4 + jit() };
      out.FS = { x: mof, y: 13.4 + jit() }; out.NB = { x: apex(nb), y: 5.4 }; out.SS = { x: apex(ss), y: 6.2 };
      break;
    case 'cover4': // corners off with slight inside leverage; safeties shallow over #2
      out.CBL = { x: lev(A, 0.4), y: 7.0 + jit() }; out.CBR = { x: lev(D, 0.4), y: 7.0 + jit() };
      out.FS = overTwo(nums.L, -1); out.SS = overTwo(nums.R, 1);
      out.NB = { x: apex(nb), y: 4.8 }; out.WILL = { x: apex(ss), y: 4.8 };
      break;
    case 'cover6': { // quarters to the strength, Cover 2 to the weak side
      const q = c.strength;
      const qcb = q === 1 ? 'CBR' : 'CBL'; const ccb = q === 1 ? 'CBL' : 'CBR';
      const qR = q === 1 ? D : A; const cR = q === 1 ? A : D;
      out[qcb] = { x: lev(qR, 0.4), y: 7.0 }; out[ccb] = { x: lev(cR, -1.2), y: 4.6 };
      out.SS = overTwo(q === 1 ? nums.R : nums.L, q); out.FS = { x: -q * 10, y: 12.6 };
      out.NB = { x: apex(nb), y: 4.9 }; out.WILL = { x: apex(ss), y: 5.0 };
      break;
    }
    case 'twoman': // trail technique: press, inside leverage, two deep halves
      out.CBL = { x: lev(A, 0.7), y: 1.5 }; out.CBR = { x: lev(D, 0.7), y: 1.5 };
      twoHigh();
      out.NB = { x: lev(nb, 0.8), y: 2.2 }; out.WILL = { x: lev(ss, 0.8), y: 3.0 };
      break;
  }
  return out;
}

const fx = (x: number, bx: number) => clamp(x + 0.45 * bx, -22, 22);

function assignByX(ids: string[], pre: Record<string, Pt>, lands: { land: Pt; r: number; label: string }[], deep: boolean, tasks: Record<string, Task>) {
  const idsSorted = [...ids].sort((p, q) => pre[p].x - pre[q].x);
  const lsorted = [...lands].sort((p, q) => p.land.x - q.land.x);
  idsSorted.forEach((id, i) => { tasks[id] = { k: 'zone', land: lsorted[i].land, r: lsorted[i].r, deep, label: lsorted[i].label }; });
}

// which way a route breaks, used to decide whether a man defender's leverage helps or hurts him
const BREAK: Record<string, 'in' | 'out' | 'vert' | 'back'> = {
  go: 'vert', seam: 'vert', hitch: 'back', curl: 'back', comeback: 'out', out: 'out', dig: 'in', slant: 'in', drag: 'in',
  flat: 'out', corner: 'out', post: 'in', stick: 'back', wheel: 'out', check: 'out', swing: 'out', block: 'vert',
};
const VERT1 = new Set(['go', 'seam', 'corner', 'post', 'comeback', 'curl', 'dig']); // #1 routes a quarters corner carries
const VERT2 = new Set(['go', 'seam', 'corner', 'post', 'wheel']); // #2 routes a quarters safety carries

function tasksFor(cov: Coverage, c: Ctx, pre: Record<string, Pt>, rushers: number, assign: Record<RId, string>, rng: Rng): Record<string, Task> {
  const { bx, sorted, rc, nums } = c;
  const t: Record<string, Task> = {};
  const a = sorted[0]; const d = sorted[3];
  const manT = (tgt: RId, lev: number, trail: number, extra = 0): Extract<Task, { k: 'man' }> => {
    const dir = BREAK[assign[tgt]] ?? 'vert';
    const away = (lev > 0 && dir === 'out') || (lev < 0 && dir === 'in');
    const toward = (lev > 0 && dir === 'in') || (lev < 0 && dir === 'out');
    let lag = 0.17 + (away ? 0.32 : 0) - (toward ? 0.05 : 0) + (dir === 'back' ? 0.14 : 0) - (dir === 'vert' ? 0.03 : 0) + extra;
    if (rng() < 0.25) lag += 0.14; // the receiver wins his release
    return { k: 'man', tgt, lev, trail, lag: Math.max(0.1, lag) };
  };
  const dl = ['DEL', 'DTL', 'DTR', 'DER'];
  dl.forEach((id) => { t[id] = { k: 'rush', free: false }; });
  const quartersSide = (sideNums: RId[], cb: string, saf: string, sgn: number) => {
    const n1 = sideNums[0]; const n2 = sideNums[1];
    const n1Vert = !!n1 && VERT1.has(assign[n1]);
    if (n1Vert) t[cb] = { ...manT(n1, 0.3, -1.2, 0.03), pre: { until: 0.45, land: { x: pre[cb].x, y: pre[cb].y + 2.2 } }, label: `Quarters: carries ${n1} vertically` };
    else t[cb] = { k: 'zone', land: { x: thirdLand(sgn).x, y: 15 }, r: 9, deep: true, label: 'Deep quarter' };
    if (n2 && VERT2.has(assign[n2])) t[saf] = { ...manT(n2, 0.5, -1.0, 0.05), pre: { until: 0.5, land: { x: pre[saf].x, y: pre[saf].y + 1.8 } }, label: `Quarters: carries ${n2} vertically` };
    else if (n1Vert) t[saf] = { k: 'zone', land: { x: clamp(rc[n1].x * 0.7, -17, 17), y: 18 }, r: 12, deep: true, label: 'Deep quarter (helps over #1)' };
    else t[saf] = { k: 'zone', land: { x: sgn * 7, y: 15 }, r: 9, deep: true, label: 'Deep quarter' };
  };
  // zone landmarks for the corners follow the #1 receiver on their side, not a fixed spot on the field
  const n1x = (sgn: number) => { const k = sgn < 0 ? nums.L[0] : nums.R[0]; return k ? rc[k].x : bx + sgn * 12; };
  const flatLand = (sgn: number): Pt => ({ x: clamp(n1x(sgn) - sgn * 1.5, -23.5, 23.5), y: 6 });
  const thirdLand = (sgn: number): Pt => ({ x: clamp((n1x(sgn) + sgn * 16) / 2, -21, 21), y: 17 });
  const leftSaf = pre.FS.x <= pre.SS.x ? 'FS' : 'SS'; const rightSaf = leftSaf === 'FS' ? 'SS' : 'FS';
  switch (cov) {
    case 'cover0':
      t.CBL = manT(a, 0.6, 0.3); t.CBR = manT(d, 0.6, 0.3); t.NB = manT(c.nbT, 0.6, 0.3); t.SS = manT(c.ssT, 0.6, 0.3); t.FS = manT('R', 0.3, 0.6, 0.06);
      t.MIKE = { k: 'rush', free: false }; t.WILL = { k: 'rush', free: true };
      break;
    case 'cover1':
      t.CBL = manT(a, -0.6, 0.3); t.CBR = manT(d, -0.6, 0.3); t.NB = manT(c.nbT, 0.7, 0.3); t.SS = manT(c.ssT, 0.7, 0.3); t.MIKE = manT('R', 0.3, 0.6, 0.08);
      t.FS = { k: 'zone', land: { x: bx * 0.35, y: 16 }, r: 15, deep: true, label: 'Deep middle (free safety)' };
      if (rushers >= 5) t.WILL = { k: 'rush', free: false };
      else t.WILL = { k: 'zone', land: { x: fx(c.strength * 2, bx), y: 8 }, r: 6.5, deep: false, label: 'Robber (middle hook)' };
      break;
    case 'cover2':
      t[leftSaf] = { k: 'zone', land: { x: -11, y: 16 }, r: 13, deep: true, label: 'Deep half (left)' };
      t[rightSaf] = { k: 'zone', land: { x: 11, y: 16 }, r: 13, deep: true, label: 'Deep half (right)' };
      t.CBL = { k: 'zone', land: flatLand(-1), r: 8, deep: false, label: 'Flat (left)' };
      t.CBR = { k: 'zone', land: flatLand(1), r: 8, deep: false, label: 'Flat (right)' };
      assignByX(['NB', 'MIKE', 'WILL'], pre, [
        { land: { x: fx(-7, bx), y: 9 }, r: 6, label: 'Curl-hook (left)' }, { land: { x: fx(0, bx), y: 9.5 }, r: 5.8, label: 'Middle hook' }, { land: { x: fx(7, bx), y: 9 }, r: 6, label: 'Curl-hook (right)' }], false, t);
      break;
    case 'tampa2':
      t[leftSaf] = { k: 'zone', land: { x: -12, y: 16 }, r: 12, deep: true, label: 'Deep half (left)' };
      t[rightSaf] = { k: 'zone', land: { x: 12, y: 16 }, r: 12, deep: true, label: 'Deep half (right)' };
      t.CBL = { k: 'zone', land: flatLand(-1), r: 8, deep: false, label: 'Flat (left)' };
      t.CBR = { k: 'zone', land: flatLand(1), r: 8, deep: false, label: 'Flat (right)' };
      t.MIKE = { k: 'zone', land: { x: fx(0, bx), y: 18 }, r: 8, deep: true, label: 'Deep middle (Mike runs the seam)' };
      assignByX(['NB', 'WILL'], pre, [{ land: { x: fx(-7.5, bx), y: 9 }, r: 6.5, label: 'Curl-hook (left)' }, { land: { x: fx(7.5, bx), y: 9 }, r: 6.5, label: 'Curl-hook (right)' }], false, t);
      break;
    case 'cover3':
      t.CBL = { k: 'zone', land: thirdLand(-1), r: 10, deep: true, label: 'Deep third (left)' };
      t.CBR = { k: 'zone', land: thirdLand(1), r: 10, deep: true, label: 'Deep third (right)' };
      t.FS = { k: 'zone', land: { x: 0, y: 17.5 }, r: 11, deep: true, label: 'Deep middle third' };
      if (rushers >= 5) {
        // fire zone: nickel and Will blitz, the end on the nickel's side drops into the flat
        t.NB = { k: 'rush', free: false }; t.WILL = { k: 'rush', free: false };
        const nbSide = pre.NB.x < bx ? 'DEL' : 'DER';
        const dropSide = nbSide === 'DEL' ? -1 : 1;
        t[nbSide] = { k: 'zone', land: { x: fx(dropSide * 11, bx), y: 6.5 }, r: 5, deep: false, label: 'Flat (zone-blitz drop)' };
        assignByX(['SS', 'MIKE'], pre, [{ land: { x: fx(-dropSide * 11, bx), y: 7.5 }, r: 9, label: 'Curl-flat' }, { land: { x: fx(-dropSide * 1, bx), y: 8.5 }, r: 6, label: 'Hook' }], false, t);
      } else {
        assignByX(['NB', 'SS'], pre, [{ land: { x: fx(-12, bx), y: 7.5 }, r: 9, label: 'Curl-flat (left)' }, { land: { x: fx(12, bx), y: 7.5 }, r: 9, label: 'Curl-flat (right)' }], false, t);
        assignByX(['MIKE', 'WILL'], pre, [{ land: { x: fx(-4.5, bx), y: 9 }, r: 5.8, label: 'Hook (left)' }, { land: { x: fx(4.5, bx), y: 9 }, r: 5.8, label: 'Hook (right)' }], false, t);
      }
      break;
    case 'cover4':
      quartersSide(nums.L, 'CBL', leftSaf, -1); quartersSide(nums.R, 'CBR', rightSaf, 1);
      assignByX(['NB', 'MIKE', 'WILL'], pre, [
        { land: { x: fx(-11, bx), y: 7.5 }, r: 9, label: 'Curl-flat (left)' }, { land: { x: fx(0, bx), y: 9 }, r: 6, label: 'Middle hook' }, { land: { x: fx(11, bx), y: 7.5 }, r: 9, label: 'Curl-flat (right)' }], false, t);
      break;
    case 'cover6': {
      const q = c.strength;
      const qcb = q === 1 ? 'CBR' : 'CBL'; const ccb = q === 1 ? 'CBL' : 'CBR';
      const qsaf = q === 1 ? rightSaf : leftSaf; const csaf = qsaf === 'FS' ? 'SS' : 'FS';
      quartersSide(q === 1 ? nums.R : nums.L, qcb, qsaf, q);
      t[csaf] = { k: 'zone', land: { x: -q * 11, y: 16 }, r: 13, deep: true, label: 'Deep half' };
      t[ccb] = { k: 'zone', land: flatLand(-q), r: 8, deep: false, label: 'Flat' };
      assignByX(['NB', 'MIKE', 'WILL'], pre, [
        { land: { x: fx(-q * 7, bx), y: 9 }, r: 6, label: 'Curl-hook' }, { land: { x: fx(q * 1, bx), y: 9 }, r: 5.8, label: 'Middle hook' }, { land: { x: fx(q * 11, bx), y: 7.5 }, r: 9, label: 'Curl-flat' }], false, t);
      break;
    }
    case 'twoman':
      t[leftSaf] = { k: 'zone', land: { x: -11, y: 16 }, r: 13, deep: true, label: 'Deep half (left)' };
      t[rightSaf] = { k: 'zone', land: { x: 11, y: 16 }, r: 13, deep: true, label: 'Deep half (right)' };
      // trail technique: inside leverage and underneath, trusting the safety over the top
      t.CBL = manT(a, 0.7, 0.6); t.CBR = manT(d, 0.7, 0.6); t.NB = manT(c.nbT, 0.7, 0.6); t.WILL = manT(c.ssT, 0.7, 0.6, 0.06); t.MIKE = manT('R', 0.3, 0.6, 0.08);
      break;
  }
  return t;
}

// ---------------- Disguises ----------------
export const DISGUISES: Partial<Record<Coverage, Coverage[]>> = {
  // actual coverage -> looks it can be shown from
  cover3: ['cover2', 'cover4', 'cover1'],
  cover1: ['cover2', 'cover3', 'cover0', 'cover4'],
  cover4: ['cover3', 'cover2'],
  cover2: ['cover3', 'cover4', 'cover1'],
  tampa2: ['cover2'],
  cover6: ['cover4', 'cover2'],
  twoman: ['cover2'],
  cover0: ['cover1'],
};
const lookShell = (cov: Coverage): Shell => (cov === 'cover0' ? 'zero' : cov === 'cover1' || cov === 'cover3' ? 'one' : 'two');

// ---------------- Simulation ----------------
function routePoints(start: Pt, sideSign: number, route: string): Pt[] {
  const r = ROUTES[route] ?? ROUTES.hitch;
  // receivers run out of room at the sideline
  return [start, ...r.pts.map(([dx, dy]) => ({ x: clamp(start.x + sideSign * dx, -25.6, 25.6), y: start.y + dy }))];
}
function posAlong(path: Pt[], d: number): Pt {
  if (path.length === 1) return path[0];
  let rem = d;
  for (let i = 0; i < path.length - 1; i++) {
    const seg = dist(path[i], path[i + 1]);
    if (rem <= seg) { const f = seg === 0 ? 0 : rem / seg; return { x: path[i].x + (path[i + 1].x - path[i].x) * f, y: path[i].y + (path[i + 1].y - path[i].y) * f }; }
    rem -= seg;
  }
  return path[path.length - 1];
}
const RCV_SPEED = 7.4;
const rcvPosAt = (p: OffPlayer, t: number): Pt => {
  if (p.path.length <= 1) return p.start;
  const tt = Math.max(0, t - 0.12);
  const ramp = Math.min(1, tt / 0.45);
  const d = Math.max(0, RCV_SPEED * tt * (0.35 + 0.65 * ramp));
  let L = 0;
  for (let i = 0; i < p.path.length - 1; i++) L += dist(p.path[i], p.path[i + 1]);
  if (d <= L || SETTLE.has(p.route)) return posAlong(p.path, d);
  // routes that do not settle keep running: along the last leg, then up the sideline
  const a = p.path[p.path.length - 2]; const b = p.path[p.path.length - 1];
  const seg = dist(a, b) || 1; const extra = d - L;
  let x = b.x + ((b.x - a.x) / seg) * extra; let y = b.y + ((b.y - a.y) / seg) * extra;
  if (Math.abs(x) > 25.6) { const over = Math.abs(x) - 25.6; x = Math.sign(x) * 25.6; y += over; }
  return { x, y };
};
const SETTLE = new Set(['hitch', 'curl', 'comeback', 'stick', 'check']);

function step(cur: Pt, goal: Pt, speed: number, dt: number): Pt {
  const dx = goal.x - cur.x; const dy = goal.y - cur.y; const d = Math.hypot(dx, dy);
  const m = speed * dt;
  if (d <= m || d === 0) return { x: goal.x, y: goal.y };
  return { x: cur.x + (dx / d) * m, y: cur.y + (dy / d) * m };
}

export const qbPosAt = (bx: number, t: number): Pt => ({ x: bx, y: -5 - Math.min(1.6, 1.6 * (t / 0.9)) });

const DEF_SPEED: Record<string, number> = { CB: 7.0, NB: 7.0, FS: 6.9, SS: 6.8, MIKE: 6.2, WILL: 6.3, DL: 5.0 };

function simulate(offense: OffPlayer[], defense: DefPlayer[], bx: number, tEnd: number, tc: number): Record<string, Pt[]> {
  const n = Math.round(tEnd / DT) + 1;
  const traj: Record<string, Pt[]> = {};
  const rcv: Record<string, OffPlayer> = {};
  offense.forEach((p) => { rcv[p.pos] = p; });
  offense.forEach((p) => {
    const arr: Pt[] = [];
    for (let i = 0; i < n; i++) {
      const t = i * DT;
      if (p.kind === 'qb') arr.push(qbPosAt(bx, t));
      else if (p.kind === 'ol') arr.push({ x: p.start.x + (p.start.x > bx ? 0.15 : p.start.x < bx ? -0.15 : 0) * Math.min(1, t / 0.4), y: p.start.y - 0.9 * Math.min(1, t / 0.5) });
      else arr.push(rcvPosAt(p, t));
    }
    traj[p.id] = arr;
  });
  const lagged = (id: string, i: number, lag: number) => traj[id][Math.max(0, i - Math.round(lag / DT))];
  const dcur: Record<string, Pt> = {};
  defense.forEach((d) => { dcur[d.id] = d.pre; traj[d.id] = [d.pre]; });
  for (let i = 1; i < n; i++) {
    const t = i * DT;
    defense.forEach((d) => {
      const cur = dcur[d.id];
      const task = d.task;
      let goal = cur;
      let speed = DEF_SPEED[d.role] ?? DEF_SPEED[d.label] ?? 6.6;
      const react = d.role === 'DL' ? 0.05 : 0.12;
      if (t < react) { traj[d.id].push(cur); return; }
      if (task.k === 'rush') {
        const qb = qbPosAt(bx, t);
        if (task.free) { goal = qb; speed = 5.8; }
        else if (t < tc) { goal = { x: cur.x + (qb.x - cur.x) * 0.25, y: -1.0 }; speed = 4.6; if (cur.y <= -0.9) goal = cur; }
        else { goal = qb; speed = 4.2; }
      } else if (task.k === 'man') {
        if (task.pre && t < task.pre.until) {
          goal = task.pre.land; speed *= 0.75; // a quarters defender reads before he matches
        } else {
          const r = rcv[task.tgt];
          const rp = lagged(r.id, i, task.lag); // the defender reacts to where the receiver was a moment ago
          const ins = insideOf(rp, bx);
          goal = { x: rp.x + ins * task.lev, y: rp.y - task.trail * Math.min(1, t / 0.6) };
          // rub: running through traffic (another receiver) slows the defender
          for (const o of offense) {
            if (o.kind !== 'rcv' || o.pos === task.tgt) continue;
            if (dist(traj[o.id][i], cur) < 1.4 && traj[o.id][i].y > 1) { speed = 3.6; break; }
          }
        }
      } else if (task.k === 'zone') {
        let g = task.land;
        let best: Pt | null = null; let bd = 1e9;
        offense.forEach((p) => {
          if (p.kind !== 'rcv') return;
          const rp = lagged(p.id, i, task.deep ? 0.3 : 0.18); // zone defenders read the route a beat late
          const dd = dist(rp, task.land) * (task.deep ? 0.85 : 1);
          // a defender whose eyes are on the flat keeps widening with it
          if (dd >= task.r + (task.pref === 'wide' ? 9 : 0) || rp.y <= (task.deep ? 1.5 : -0.5)) return;
          // deep defenders take the deepest threat in their area; underneath defenders the closest route,
          // or the widest one when their eyes are on the flat
          const key = task.deep ? -rp.y : task.pref === 'wide' ? -Math.abs(rp.x - bx) : dd;
          if (key < bd) { bd = key; best = rp; }
        });
        if (best) {
          const b = best as Pt;
          // deep defenders play inside-out with a cushion: they cannot mirror every break
          if (task.deep) g = { x: task.land.x + (b.x - task.land.x) * (task.r >= 12 ? 0.45 : 0.45), y: Math.max(task.land.y, b.y + 4) };
          // an underneath defender who jumps the widest route commits to it; otherwise he splits the difference
          else { const k = task.pref === 'wide' ? 0.85 : 0.65; g = { x: task.land.x + (b.x - task.land.x) * k, y: clamp(task.land.y + (b.y - task.land.y) * (task.pref === 'wide' ? 0.5 : 0.3), 2.5, task.land.y + 4) }; }
        }
        // a flat defender with nothing in the flat sinks under the outside vertical (cloud / squat-and-sink)
        if (!best && !task.deep && /^Flat/.test(task.label)) g = { x: task.land.x, y: task.land.y + 5 };
        goal = g; speed *= 0.92;
      }
      const nxt = step(cur, goal, speed, DT);
      dcur[d.id] = nxt; traj[d.id].push(nxt);
    });
  }
  return traj;
}

export const sampleAt = (arr: Pt[], t: number): Pt => {
  const f = clamp(t / DT, 0, arr.length - 1);
  const i = Math.floor(f); const j = Math.min(arr.length - 1, i + 1); const u = f - i;
  return { x: arr[i].x + (arr[j].x - arr[i].x) * u, y: arr[i].y + (arr[j].y - arr[i].y) * u };
};

// ---------------- Evaluation ----------------
function segDist(p: Pt, a: Pt, b: Pt): { d: number; u: number } {
  const vx = b.x - a.x; const vy = b.y - a.y; const L2 = vx * vx + vy * vy;
  const u = L2 === 0 ? 0 : clamp(((p.x - a.x) * vx + (p.y - a.y) * vy) / L2, 0, 1);
  return { d: Math.hypot(p.x - (a.x + vx * u), p.y - (a.y + vy * u)), u };
}

// Ball flight: about 26 yards per second (roughly 53 mph) once it leaves the hand, plus release time.
export const flightTime = (d: number) => clamp(0.1 + d / 26, 0.3, 1.5);
const CLOSE_SPEED = 6.6; // a defender planting and breaking on the ball (average, including the plant)
const OPEN_GAP = 1.5; // yards of cushion when the ball arrives that make a throw "open"
const TIGHT_GAP = 0.5;

function evaluate(sc: { offense: OffPlayer[]; defense: DefPlayer[]; traj: Record<string, Pt[]>; tDec: number; bx: number; toGo: number }): { evals: Record<RId, TargetEval>; open: RId[]; best: RId | null; bestIds: RId[] } {
  const { offense, defense, traj, tDec, bx, toGo } = sc;
  const qb = qbPosAt(bx, tDec);
  const evals = {} as Record<RId, TargetEval>;
  const cover = defense.filter((d) => d.task.k !== 'rush');
  const nameOf = (d: DefPlayer) => (d as DefPlayer & { name?: string }).name ?? d.role;
  (['X', 'H', 'Y', 'Z', 'R'] as RId[]).forEach((id) => {
    const p = offense.find((o) => o.pos === id)!;
    const pos = sampleAt(traj[p.id], tDec);
    const label = id === 'R' ? 'RB' : id;
    if (p.route === 'block') {
      evals[id] = { id, label, pos, depth: pos.y, sep: 0, nearest: '-', manCovered: false, lane: null, cls: 'covered', why: 'Staying in to block.', catchPos: pos, flight: 0, gap: 0, closer: '-', gain: 0, score: -99, firstDown: false, undercut: false };
      return;
    }
    // the ball is thrown at the decision point and caught where the receiver will be when it arrives
    let ft = flightTime(dist(qb, pos));
    let cp = sampleAt(traj[p.id], tDec + ft);
    ft = flightTime(dist(qb, cp)); cp = sampleAt(traj[p.id], tDec + ft);

    // separation the QB sees at the moment of the throw
    let sep = 99; let nearestDef: DefPlayer | null = null;
    // cushion when the ball arrives: every defender breaks on the ball after he reacts to it
    let gap = 99; let closerDef: DefPlayer | null = null;
    cover.forEach((d) => {
      const dp0 = sampleAt(traj[d.id], tDec);
      const s0 = dist(dp0, pos);
      if (s0 < sep) { sep = s0; nearestDef = d; }
      const onHim = d.task.k === 'man' && d.task.tgt === id && !(d.task.pre && tDec < d.task.pre.until);
      const sim = dist(sampleAt(traj[d.id], tDec + ft), cp);
      let g: number;
      if (onHim) {
        // a man defender has his back to the QB: he plays the receiver, not the ball, and can only play the hands
        g = Math.max(0, sim - (cp.y > 15 ? 1.2 : 0.5)); // on a deep ball he has time to look back and play it
      } else {
        // zone defenders face the QB, see the throw, and break on the catch point
        const react = 0.3;
        const pr = sampleAt(traj[d.id], tDec + Math.min(react, ft));
        // breaking downhill is fast; turning to run back to a ball thrown over his head is slower
        const close = cp.y > pr.y + 1.5 ? 5.4 : CLOSE_SPEED;
        const reach = Math.max(0, dist(pr, cp) - close * Math.max(0, ft - react));
        g = Math.min(reach, sim);
      }
      if (g < gap) { gap = g; closerDef = d; }
    });
    const nd = nearestDef as DefPlayer | null; const cd = closerDef as DefPlayer | null;
    const manCovered = !!nd && nd.task.k === 'man' && nd.task.tgt === id;
    const nearest = nd ? nameOf(nd) : 'a defender';
    const closer = cd ? nameOf(cd) : 'a defender';

    // throwing lane: a defender standing on the ball's path while it is low enough to be caught
    const len = dist(qb, cp);
    let lane: string | null = null;
    for (const d of cover) {
      if (d.task.k === 'man' && d.task.tgt === id) continue;
      for (let u = 0.15; u <= 0.9; u += 0.05) {
        if (len > 16 && u < 0.7) continue; // a deeper throw is over the underneath defenders until it comes down
        const bp = { x: qb.x + (cp.x - qb.x) * u, y: qb.y + (cp.y - qb.y) * u };
        if (dist(sampleAt(traj[d.id], tDec + ft * u), bp) < 1.0) { lane = nameOf(d); break; }
      }
      if (lane) break;
    }
    // undercut: the closest defender arrives from between the QB and the catch point
    let undercut = false;
    if (cd) {
      const dpc = sampleAt(traj[cd.id], tDec + ft);
      const { d: sd, u } = segDist(dpc, qb, cp);
      // truly undercut only when he is on the ball's path and clearly closer to the QB than the receiver is
      undercut = sd < 1.4 && u < 0.88 && dist(qb, dpc) < dist(qb, cp) - 1.2;
    }
    // a deep ball hangs in the air, so a defender needs less of a head start to make a play on it
    const deepX = Math.max(0, cp.y - 15);
    const openGap = OPEN_GAP + deepX * 0.12; const tightGap = TIGHT_GAP + deepX * 0.08;
    let cls: TargetEval['cls'] = 'covered';
    if (!lane && gap >= openGap) cls = 'open';
    else if (!lane && gap >= tightGap) cls = 'tight';

    // room to run after the catch, less when he catches it running toward the sideline
    const atSideline = Math.abs(cp.x) > 22;
    const yac = cls === 'open' ? clamp((gap - 1) * 0.6, 0, atSideline ? 2 : 4) : 0;
    const gain = Math.round(Math.max(cp.y, -2) + yac);
    const firstDown = gain >= toGo;
    // deep balls are harder to complete, and a sure first down is worth more than its raw yards
    const depthPenalty = clamp(1 - Math.max(0, cp.y - 12) * 0.02, 0.6, 1);
    const pComp = (cls === 'open' ? clamp(0.72 + gap * 0.05, 0.72, 0.95) : cls === 'tight' ? 0.45 : 0.12) * depthPenalty;
    const value = Math.min(gain, 15) + Math.max(0, gain - 15) * 0.35 + (firstDown ? 5 : 0);
    const score = pComp * value - (lane || (cls === 'covered' && undercut) ? 8 : 0);

    const f1 = (v: number) => v.toFixed(1);
    const throwPart = `When you throw, ${nearest} is ${f1(sep)} yds from him.`;
    let why = '';
    if (cls === 'open') {
      why = manCovered
        ? `He beat ${nearest} in man coverage. ${throwPart} When the ball arrives, the closest defender (${closer}) is still ${f1(gap)} yds away.`
        : `${throwPart} When the ball arrives, the closest defender (${closer}) is still ${f1(gap)} yds away.`;
      why += ` About ${gain} yds${firstDown ? ', enough for the first down' : ''}.`;
    } else if (lane) {
      why = `${lane} is sitting in the throwing lane, so the ball gets undercut.`;
    } else if (cls === 'tight') {
      why = `${throwPart} ${closer} closes to ${f1(gap)} yds by the time the ball arrives. Contested.`;
    } else {
      why = `${throwPart} ${closer} gets to the catch point with the ball${undercut ? ', in front of the receiver' : ''}.`;
    }
    evals[id] = { id, label, pos, depth: pos.y, sep, nearest, manCovered, lane, cls, why, catchPos: cp, flight: ft, gap, closer, gain, score, firstDown, undercut };
  });
  const open = (['X', 'H', 'Y', 'Z', 'R'] as RId[]).filter((k) => evals[k].cls === 'open');
  let best: RId | null = null; let bs = -1e9;
  open.forEach((k) => { if (evals[k].score > bs) { bs = evals[k].score; best = k; } });
  // throws that are worth about the same are all marked as the best read
  const bestIds = open.filter((k) => evals[k].score >= bs - 1.5);
  return { evals, open, best, bestIds };
}

// ---------------- Scenario generation ----------------
const POOLS: Record<Diff, { forms: FormationKey[]; covs: Coverage[]; disguise: number; five: number }> = {
  beginner: { forms: ['doubles', 'ace'], covs: ['cover1', 'cover2', 'cover3', 'cover4'], disguise: 0, five: 0 },
  intermediate: { forms: ['doubles', 'ace', 'trips'], covs: ALL_COVERAGES, disguise: 0.35, five: 0.25 },
  expert: { forms: ['doubles', 'ace', 'trips', 'bunch'], covs: ALL_COVERAGES, disguise: 0.65, five: 0.4 },
};
const DOWNS = [
  ['1st & 10', 'Own 25'], ['1st & 10', 'Own 42'], ['2nd & 6', 'Own 38'], ['2nd & 8', 'Opp 44'], ['3rd & 4', 'Own 49'], ['3rd & 7', 'Opp 36'], ['1st & 10', 'Opp 30'], ['2nd & 4', 'Opp 22'], ['3rd & 9', 'Own 31'], ['2nd & 10', 'Own 20'],
];

export function makeScenario(diff: Diff, rng: Rng, avoid: Coverage[] = [], force?: Partial<{ coverage: Coverage; formation: FormationKey }>): Scenario {
  const pool = POOLS[diff];
  for (let attempt = 0; attempt < 60; attempt++) {
    const seed = Math.floor(rng() * 1e9);
    const r = mulberry32(seed);
    const formation = force?.formation ?? pick(r, pool.forms);
    let coverage = force?.coverage ?? pick(r, pool.covs);
    if (!force?.coverage && avoid.includes(coverage) && attempt < 40) coverage = pick(r, pool.covs.filter((c) => !avoid.includes(c)).length ? pool.covs.filter((c) => !avoid.includes(c)) : pool.covs);
    const flipped = r() < 0.5;
    const ballX = pick(r, [-8.9, 0, 8.9]);
    let look: Coverage = coverage;
    let disguised = false;
    const opts = DISGUISES[coverage];
    if (opts && r() < pool.disguise) { look = pick(r, opts); disguised = look !== coverage; }
    let rushers = 4;
    if (coverage === 'cover0') rushers = 6;
    else if ((coverage === 'cover1' || coverage === 'cover3') && r() < pool.five) rushers = 5;
    const concepts = CONCEPTS[formation];
    const concept = pick(r, concepts);
    const ctx = buildCtx(formation, flipped, ballX);
    const preAlign = alignFor(look, ctx, r);
    // blitzers creep to the line of scrimmage so a good QB can see the pressure coming
    if (rushers >= 5) {
      preAlign.WILL = { x: ballX - 2.5, y: 1.7 };
      if (coverage === 'cover3' || coverage === 'cover0') preAlign.NB = { x: preAlign.NB.x, y: 1.9 };
      if (coverage === 'cover0') preAlign.MIKE = { x: ballX + 1.8, y: 1.7 };
    }
    const roles: Record<string, string> = { DEL: 'DE', DTL: 'DT', DTR: 'DT', DER: 'DE', MIKE: 'MIKE', WILL: 'WILL', CBL: 'CB', CBR: 'CB', NB: 'NB', SS: 'SS', FS: 'FS' };
    const defense: DefPlayer[] = Object.keys(roles).map((id) => ({ id, label: roles[id], role: id === 'DEL' || id === 'DER' ? 'DL' : id === 'DTL' || id === 'DTR' ? 'DL' : id, pre: preAlign[id], task: { k: 'drop' } as Task }));
    // keep role strings readable
    const names: Record<string, string> = { DEL: 'Defensive end (left)', DER: 'Defensive end (right)', DTL: 'Defensive tackle', DTR: 'Defensive tackle', MIKE: 'Mike linebacker', WILL: 'Will linebacker', CBL: 'Cornerback (left)', CBR: 'Cornerback (right)', NB: 'Nickel back', SS: 'Strong safety', FS: 'Free safety' };
    defense.forEach((d) => { (d as DefPlayer & { name: string }).name = names[d.id]; });
    // offense
    const m = flipped ? -1 : 1;
    const offense: OffPlayer[] = [];
    const olx = [-2.8, -1.4, 0, 1.4, 2.8];
    olx.forEach((x, i) => offense.push({ id: `ol${i}`, label: ['LT', 'LG', 'C', 'RG', 'RT'][i], kind: 'ol', pos: `OL${i}`, start: { x: ballX + x, y: -0.3 }, path: [], route: 'block', speed: 0 }));
    offense.push({ id: 'qb', label: 'QB', kind: 'qb', pos: 'QB', start: { x: ballX, y: -5 }, path: [], route: 'qb', speed: 0 });
    const assign = { ...concept.assign };
    if (rushers >= 6) assign.R = 'check';
    const tasks = tasksFor(coverage, ctx, preAlign, rushers, assign, r);
    Object.values(tasks).forEach((tk) => { if (tk.k === 'zone' && !tk.deep) tk.pref = /flat/i.test(tk.label) && r() < 0.5 ? 'wide' : 'near'; });
    defense.forEach((d) => { d.task = tasks[d.id]; });
    (['X', 'H', 'Y', 'Z', 'R'] as RId[]).forEach((k) => {
      const start = ctx.rc[k];
      const sideSign = k === 'R' ? (start.x >= ballX ? 1 : -1) : side(start.x, ballX);
      const route = assign[k];
      offense.push({ id: k.toLowerCase(), label: k === 'R' ? 'RB' : k, kind: 'rcv', pos: k, start, path: routePoints(start, sideSign, route), route, speed: RCV_SPEED });
    });
    const tDec = rushers >= 6 ? 1.75 : rushers === 5 ? 2.1 : 2.45;
    const tEnd = tDec + 2.0;
    const traj = simulate(offense, defense, ballX, tEnd, tDec + 1.1);
    const dn = pick(r, DOWNS);
    const toGo = parseInt(dn[0].split('&')[1], 10) || 10;
    const ev = evaluate({ offense, defense, traj, tDec, bx: ballX, toGo });
    if (ev.open.length < 1 || ev.open.length > 3) continue;
    const sc: Scenario = {
      id: `${seed}`, seed, diff, formation, flipped, ballX, concept, conceptName: concept.name, coverage, look, disguised, rushers,
      pressureLabel: rushers === 4 ? 'Four rushers' : rushers === 5 ? 'Five rushers' : 'Six rushers', situation: `${dn[0]} · ${dn[1]} · ${FORMATIONS[formation].name}`,
      strengthSide: ctx.strength, offense, defense, tDec, tEnd, traj, dt: DT, evals: ev.evals, openIds: ev.open, bestId: ev.best, bestIds: ev.bestIds, toGo,
      coverageOptionsAll: ALL_COVERAGES, lookShell: lookShell(look), facts: [],
    };
    return sc;
  }
  // Fallback: very unlikely; return a plain scenario
  return makeScenario(diff, mulberry32(Math.floor(rng() * 1e9)), [], force);
}

// ---------------- Presentation helpers ----------------
export function describeDefender(sc: Scenario, d: DefPlayer): string {
  const p = d.pre; const parts: string[] = [];
  const depth = p.y;
  if (d.role === 'DL') {
    const inside = Math.abs(p.x - sc.ballX);
    parts.push(inside > 3 ? 'Aligned outside the tackle on the edge.' : inside > 1.8 ? 'Aligned over a guard, an interior gap.' : 'Aligned inside, near the center.');
    parts.push(`${depth.toFixed(0)} yard off the ball, hand down.`.replace('1 yard off', '1 yard off'));
    return parts.join(' ');
  }
  parts.push(`${depth < 1.8 ? 'On the line, within a yard or two of the receiver (press)' : `${depth.toFixed(0)} yards off the line`}.`);
  const rcvs = sc.offense.filter((o) => o.kind === 'rcv' && o.pos !== 'R');
  let near: OffPlayer | null = null; let nd = 99;
  rcvs.forEach((o) => { const dd = Math.abs(o.start.x - p.x); if (dd < nd) { nd = dd; near = o; } });
  if (near && nd < 3.2 && depth < 10) {
    const o = near as OffPlayer; const toBall = o.start.x > sc.ballX ? -1 : 1;
    const off = p.x - o.start.x;
    const lev = Math.abs(off) < 0.35 ? 'head-up' : off * toBall > 0 ? 'inside shade' : 'outside shade';
    parts.push(`Lined up ${lev} on ${o.label}.`);
  } else if (depth >= 9) {
    const fromMid = Math.abs(p.x);
    parts.push(fromMid < 3.5 ? 'Positioned in the middle of the field.' : fromMid < 11 ? `Positioned near the ${p.x < 0 ? 'left' : 'right'} hash.` : 'Positioned wide toward the sideline.');
  } else if (depth < 9) {
    parts.push(Math.abs(p.x - sc.ballX) < 4 ? 'Stacked in the box near the center.' : 'Walked out over the second level of the formation.');
  }
  return parts.join(' ');
}

export function taskLabel(sc: Scenario, d: DefPlayer): string {
  const t = d.task;
  if (t.k === 'rush') return t.free ? 'Pass rush (blitz, unblocked)' : 'Pass rush';
  if (t.k === 'man') { const o = sc.offense.find((x) => x.pos === t.tgt)!; return t.label ?? `Man coverage on ${o.label}`; }
  if (t.k === 'zone') return t.label;
  return 'Drop';
}

export function pressureTells(sc: Scenario): string[] {
  const out: string[] = [];
  const box = sc.defense.filter((d) => d.pre.y < 5.5 && Math.abs(d.pre.x - sc.ballX) < 5.5).length;
  out.push(`${box} defenders in the box before the snap.`);
  return out;
}

export function coverageExplanation(sc: Scenario): string[] {
  const info = COVERAGE_INFO[sc.coverage];
  const lines: string[] = [];
  if (sc.disguised) lines.push(`The pre-snap look was ${COVERAGE_INFO[sc.look].name}, but the defense played ${info.name}. The safeties and corners rotated after the snap.`);
  lines.push(info.tells);
  lines.push(info.beat);
  if (sc.rushers === 5 && sc.coverage === 'cover3') lines.push('This was a fire zone: the nickel and Will blitzed and a defensive end dropped into the flat.');
  if (sc.rushers === 5 && sc.coverage === 'cover1') lines.push('The Will blitzed instead of playing the middle, so there was no robber and the middle hook was open.');
  if (sc.rushers === 6) lines.push('Six rushers against man means one rusher is free. The ball has to come out fast.');
  if (sc.coverage === 'cover4' || sc.coverage === 'cover6') lines.push('Quarters is pattern-matching: the corner carries #1 if he goes vertical, and the safety carries #2 if he goes vertical. Short routes are passed to the underneath defenders.');
  if (COVERAGE_INFO[sc.coverage].type === 'man') lines.push('In man, leverage decides the matchup: a route that breaks away from the defender\'s leverage (an out against inside leverage, a slant against outside leverage) wins.');
  return lines;
}
