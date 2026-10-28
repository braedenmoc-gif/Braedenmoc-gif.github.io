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
  out: { pts: [[0, 10], [8, 10]] },
  dig: { pts: [[0, 12], [-13, 12]] },
  slant: { pts: [[0, 1.4], [-4.5, 6], [-13, 10]] },
  drag: { pts: [[0, 1], [-15, 3.2]] },
  flat: { pts: [[5, 0.6], [10, 1.2]] },
  corner: { pts: [[0, 10], [7, 17], [9, 28]] },
  post: { pts: [[0, 10], [-7, 18], [-9, 30]] },
  stick: { pts: [[0, 5.4], [0, 5.9]] },
  wheel: { pts: [[5, 0.4], [9, 4], [10.5, 24]] },
  check: { pts: [[3, -0.5], [7, 2]] },
  swing: { pts: [[4, -2.5], [9, -0.5], [11, 2]] },
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
  | { k: 'man'; tgt: RId; lev: number; trail: number }
  | { k: 'zone'; land: Pt; r: number; deep: boolean; label: string }
  | { k: 'drop' };
export type DefPlayer = { id: string; label: string; role: string; pre: Pt; task: Task };

export type TargetEval = {
  id: RId; label: string; pos: Pt; depth: number; sep: number; nearest: string; manCovered: boolean;
  lane: string | null; cls: 'open' | 'tight' | 'covered'; why: string;
};

export type Scenario = {
  id: string; seed: number; diff: Diff;
  formation: FormationKey; flipped: boolean; ballX: number; concept: Concept; conceptName: string;
  coverage: Coverage; look: Coverage; disguised: boolean; rushers: number; pressureLabel: string;
  situation: string; strengthSide: 1 | -1;
  offense: OffPlayer[]; defense: DefPlayer[]; tDec: number; tEnd: number;
  traj: Record<string, Pt[]>; dt: number;
  evals: Record<RId, TargetEval>; openIds: RId[]; bestId: RId | null;
  coverageOptionsAll: Coverage[]; lookShell: Shell;
  facts: string[];
};

const DT = 0.05;

// ---------------- Defense construction ----------------
type Ctx = { bx: number; rc: Record<RId, Pt>; sorted: RId[]; strength: 1 | -1; nbT: RId; ssT: RId; formation: FormationKey; hash: number };

function buildCtx(f: FormationKey, flipped: boolean, bx: number): Ctx {
  const def = FORMATIONS[f];
  const m = flipped ? -1 : 1;
  const rc = {} as Record<RId, Pt>;
  (['X', 'H', 'Y', 'Z'] as const).forEach((k) => {
    rc[k] = { x: clamp(bx + m * def.rcv[k].x, -24.2, 24.2), y: def.rcv[k].y };
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
  return { bx, rc, sorted, strength, nbT, ssT, formation: f, hash: bx };
}

const side = (x: number, bx: number) => (x >= bx ? 1 : -1);
const insideOf = (p: Pt, bx: number) => (p.x > bx ? -1 : 1); // direction toward the ball

function alignFor(look: Coverage, c: Ctx, rng: Rng): Record<string, Pt> {
  const { bx, rc, sorted } = c;
  const a = sorted[0]; const d = sorted[3];
  const A = rc[a]; const D = rc[d];
  const nb = rc[c.nbT]; const ss = rc[c.ssT];
  const ins = (p: Pt) => insideOf(p, bx);
  const out: Record<string, Pt> = {
    DEL: { x: bx - 3.8, y: 1 }, DTL: { x: bx - 1.1, y: 1 }, DTR: { x: bx + 1.2, y: 1 }, DER: { x: bx + 3.9, y: 1 },
    MIKE: { x: bx + 0.5, y: 4.4 }, WILL: { x: bx - 4.2, y: 4.6 },
  };
  const jit = () => (rng() - 0.5) * 0.5;
  switch (look) {
    case 'cover0':
      out.CBL = { x: A.x + ins(A) * 0.5, y: 1.2 }; out.CBR = { x: D.x + ins(D) * 0.5, y: 1.2 };
      out.NB = { x: nb.x + ins(nb) * 0.7, y: 2.0 }; out.SS = { x: ss.x + ins(ss) * 0.7, y: 2.2 };
      out.FS = { x: bx + 2.8, y: 6.4 }; out.MIKE = { x: bx - 1.3, y: 3.0 }; out.WILL = { x: bx + 1.5, y: 3.2 };
      break;
    case 'cover1':
      out.CBL = { x: A.x + ins(A) * 0.5, y: 1.1 + jit() * 0.4 }; out.CBR = { x: D.x + ins(D) * 0.5, y: 1.1 + jit() * 0.4 };
      out.NB = { x: nb.x + ins(nb) * 0.8, y: 2.2 }; out.SS = { x: ss.x + ins(ss) * 0.8, y: 4.2 };
      out.FS = { x: bx * 0.5, y: 13 + jit() }; out.WILL = { x: bx + c.strength * 2.4, y: 7.4 };
      break;
    case 'cover2': case 'tampa2':
      out.CBL = { x: A.x + ins(A) * 0.7, y: 3.9 + jit() * 0.4 }; out.CBR = { x: D.x + ins(D) * 0.7, y: 3.9 + jit() * 0.4 };
      out.FS = { x: -9.2, y: 12.6 + jit() }; out.SS = { x: 9.2, y: 12.6 + jit() };
      out.NB = { x: nb.x + ins(nb) * 1.2, y: 4.6 };
      break;
    case 'cover3':
      out.CBL = { x: A.x + ins(A) * 1.0, y: 7.2 + jit() }; out.CBR = { x: D.x + ins(D) * 1.0, y: 7.2 + jit() };
      out.FS = { x: bx * 0.35, y: 13.6 + jit() }; out.NB = { x: nb.x + ins(nb) * 1.4, y: 5.6 };
      out.SS = { x: ss.x + ins(ss) * 1.4, y: 6.4 };
      break;
    case 'cover4':
      out.CBL = { x: A.x + ins(A) * 1.0, y: 6.8 + jit() }; out.CBR = { x: D.x + ins(D) * 1.0, y: 6.8 + jit() };
      out.NB = { x: nb.x + ins(nb) * 1.5, y: 4.6 };
      out.FS = { x: clamp(rc[sorted[1]].x + 0.6, -12, 12), y: 9.4 + jit() }; out.SS = { x: clamp(rc[sorted[2]].x - 0.6, -12, 12), y: 9.4 + jit() };
      break;
    case 'cover6': {
      const q = c.strength;
      const qcb = q === 1 ? 'CBR' : 'CBL'; const ccb = q === 1 ? 'CBL' : 'CBR';
      const qR = q === 1 ? D : A; const cR = q === 1 ? A : D;
      out[qcb] = { x: qR.x + ins(qR) * 1.0, y: 6.8 }; out[ccb] = { x: cR.x + ins(cR) * 0.7, y: 3.9 };
      out.SS = { x: bx + q * 5.5, y: 9.4 }; out.FS = { x: -q * 9.2, y: 12.6 };
      out.NB = { x: nb.x + ins(nb) * 1.4, y: 4.7 };
      break;
    }
    case 'twoman':
      out.CBL = { x: A.x + ins(A) * 0.5, y: 1.3 }; out.CBR = { x: D.x + ins(D) * 0.5, y: 1.3 };
      out.FS = { x: -9.2, y: 12.6 + jit() }; out.SS = { x: 9.2, y: 12.6 + jit() };
      out.NB = { x: nb.x + ins(nb) * 0.9, y: 3.0 }; out.WILL = { x: ss.x + ins(ss) * 0.9, y: 3.2 };
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

function tasksFor(cov: Coverage, c: Ctx, pre: Record<string, Pt>, rushers: number): Record<string, Task> {
  const { bx, sorted } = c;
  const t: Record<string, Task> = {};
  const a = sorted[0]; const d = sorted[3];
  const manT = (tgt: RId, lev = 0.5, trail = 0.8): Task => ({ k: 'man', tgt, lev, trail });
  const dl = ['DEL', 'DTL', 'DTR', 'DER'];
  dl.forEach((id) => { t[id] = { k: 'rush', free: false }; });
  switch (cov) {
    case 'cover0':
      t.CBL = manT(a); t.CBR = manT(d); t.NB = manT(c.nbT); t.SS = manT(c.ssT); t.FS = manT('R', 0.3, 1.0);
      t.MIKE = { k: 'rush', free: false }; t.WILL = { k: 'rush', free: true };
      break;
    case 'cover1':
      t.CBL = manT(a); t.CBR = manT(d); t.NB = manT(c.nbT); t.SS = manT(c.ssT); t.MIKE = manT('R', 0.3, 1.0);
      t.FS = { k: 'zone', land: { x: bx * 0.45, y: 16 }, r: 15, deep: true, label: 'Deep middle (free safety)' };
      if (rushers >= 5) t.WILL = { k: 'rush', free: false };
      else t.WILL = { k: 'zone', land: { x: fx(c.strength * 2.5, bx), y: 8 }, r: 6, deep: false, label: 'Robber (middle hook)' };
      break;
    case 'cover2':
      t.FS = { k: 'zone', land: { x: -10.5, y: 15.5 }, r: 13, deep: true, label: 'Deep half (left)' };
      t.SS = { k: 'zone', land: { x: 10.5, y: 15.5 }, r: 13, deep: true, label: 'Deep half (right)' };
      t.CBL = { k: 'zone', land: { x: -17.5, y: 6 }, r: 6.5, deep: false, label: 'Flat (left)' };
      t.CBR = { k: 'zone', land: { x: 17.5, y: 6 }, r: 6.5, deep: false, label: 'Flat (right)' };
      assignByX(['NB', 'MIKE', 'WILL'], pre, [
        { land: { x: fx(-6, bx), y: 8.2 }, r: 5.8, label: 'Hook (left)' }, { land: { x: fx(0, bx), y: 8.6 }, r: 5.8, label: 'Hook (middle)' }, { land: { x: fx(6, bx), y: 8.2 }, r: 5.8, label: 'Hook (right)' }], false, t);
      break;
    case 'tampa2':
      t.FS = { k: 'zone', land: { x: -11.2, y: 15.5 }, r: 12, deep: true, label: 'Deep half (left)' };
      t.SS = { k: 'zone', land: { x: 11.2, y: 15.5 }, r: 12, deep: true, label: 'Deep half (right)' };
      t.CBL = { k: 'zone', land: { x: -17.5, y: 6 }, r: 6.5, deep: false, label: 'Flat (left)' };
      t.CBR = { k: 'zone', land: { x: 17.5, y: 6 }, r: 6.5, deep: false, label: 'Flat (right)' };
      t.MIKE = { k: 'zone', land: { x: fx(0, bx), y: 19 }, r: 8, deep: true, label: 'Deep middle (Mike)' };
      assignByX(['NB', 'WILL'], pre, [{ land: { x: fx(-6.5, bx), y: 8.2 }, r: 6, label: 'Hook (left)' }, { land: { x: fx(6.5, bx), y: 8.2 }, r: 6, label: 'Hook (right)' }], false, t);
      break;
    case 'cover3':
      t.CBL = { k: 'zone', land: { x: -17.8, y: 16.5 }, r: 10, deep: true, label: 'Deep third (left)' };
      t.CBR = { k: 'zone', land: { x: 17.8, y: 16.5 }, r: 10, deep: true, label: 'Deep third (right)' };
      t.FS = { k: 'zone', land: { x: 0, y: 17 }, r: 11, deep: true, label: 'Deep third (middle)' };
      if (rushers >= 5) {
        // fire zone: NB and WILL blitz, the defensive end on the NB side drops to the flat
        t.NB = { k: 'rush', free: false }; t.WILL = { k: 'rush', free: false };
        const nbSide = pre.NB.x < bx ? 'DEL' : 'DER';
        const dropSide = nbSide === 'DEL' ? -1 : 1;
        t[nbSide] = { k: 'zone', land: { x: fx(dropSide * 11, bx), y: 6.6 }, r: 5, deep: false, label: 'Flat (zone-blitz drop)' };
        assignByX(['SS', 'MIKE'], pre, [{ land: { x: fx(-dropSide * 10, bx), y: 7.4 }, r: 6, label: 'Curl-flat' }, { land: { x: fx(-dropSide * 1, bx), y: 8.2 }, r: 6, label: 'Hook' }], false, t);
      } else {
        assignByX(['NB', 'SS'], pre, [{ land: { x: fx(-11.5, bx), y: 7.4 }, r: 6, label: 'Curl-flat (left)' }, { land: { x: fx(11.5, bx), y: 7.4 }, r: 6, label: 'Curl-flat (right)' }], false, t);
        assignByX(['MIKE', 'WILL'], pre, [{ land: { x: fx(-4.2, bx), y: 8.2 }, r: 5.6, label: 'Hook (left)' }, { land: { x: fx(4.2, bx), y: 8.2 }, r: 5.6, label: 'Hook (right)' }], false, t);
      }
      break;
    case 'cover4':
      assignByX(['CBL', 'FS', 'SS', 'CBR'], pre, [
        { land: { x: -20, y: 15.5 }, r: 9, label: 'Deep quarter' }, { land: { x: -6.7, y: 15.5 }, r: 9, label: 'Deep quarter' },
        { land: { x: 6.7, y: 15.5 }, r: 9, label: 'Deep quarter' }, { land: { x: 20, y: 15.5 }, r: 9, label: 'Deep quarter' }], true, t);
      assignByX(['NB', 'MIKE', 'WILL'], pre, [
        { land: { x: fx(-10, bx), y: 7.2 }, r: 6, label: 'Curl-flat (left)' }, { land: { x: fx(0, bx), y: 8.4 }, r: 5.6, label: 'Hook' }, { land: { x: fx(10, bx), y: 7.2 }, r: 6, label: 'Curl-flat (right)' }], false, t);
      break;
    case 'cover6': {
      const q = c.strength;
      const qcb = q === 1 ? 'CBR' : 'CBL'; const ccb = q === 1 ? 'CBL' : 'CBR';
      t[qcb] = { k: 'zone', land: { x: q * 20, y: 15.5 }, r: 9, deep: true, label: 'Deep quarter' };
      t.SS = { k: 'zone', land: { x: q * 6.7, y: 15.5 }, r: 9, deep: true, label: 'Deep quarter' };
      t.FS = { k: 'zone', land: { x: -q * 11, y: 15.5 }, r: 13, deep: true, label: 'Deep half' };
      t[ccb] = { k: 'zone', land: { x: -q * 17.5, y: 6 }, r: 6.5, deep: false, label: 'Flat' };
      assignByX(['NB', 'MIKE', 'WILL'], pre, [
        { land: { x: fx(-q * 6, bx), y: 8.2 }, r: 5.8, label: 'Hook' }, { land: { x: fx(q * 1, bx), y: 8.4 }, r: 5.6, label: 'Hook' }, { land: { x: fx(q * 10.5, bx), y: 7.2 }, r: 6, label: 'Curl-flat' }].sort((p, r) => (q === 1 ? p.land.x - r.land.x : p.land.x - r.land.x)), false, t);
      break;
    }
    case 'twoman':
      t.FS = { k: 'zone', land: { x: -10.5, y: 15.5 }, r: 13, deep: true, label: 'Deep half (left)' };
      t.SS = { k: 'zone', land: { x: 10.5, y: 15.5 }, r: 13, deep: true, label: 'Deep half (right)' };
      t.CBL = manT(a, 0.6, 0.9); t.CBR = manT(d, 0.6, 0.9); t.NB = manT(c.nbT, 0.6, 0.9); t.WILL = manT(c.ssT, 0.6, 0.9); t.MIKE = manT('R', 0.3, 1.0);
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
  return [start, ...r.pts.map(([dx, dy]) => ({ x: start.x + sideSign * dx, y: start.y + dy }))];
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
  const d = RCV_SPEED * (tt - 0.45 * ramp * 0.5 * (1 - ramp) * 0 ) * (0.35 + 0.65 * ramp) ;
  return posAlong(p.path, Math.max(0, d));
};

function step(cur: Pt, goal: Pt, speed: number, dt: number): Pt {
  const dx = goal.x - cur.x; const dy = goal.y - cur.y; const d = Math.hypot(dx, dy);
  const m = speed * dt;
  if (d <= m || d === 0) return { x: goal.x, y: goal.y };
  return { x: cur.x + (dx / d) * m, y: cur.y + (dy / d) * m };
}

export const qbPosAt = (bx: number, t: number): Pt => ({ x: bx, y: -5 - Math.min(1.6, 1.6 * (t / 0.9)) });

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
  const dcur: Record<string, Pt> = {};
  defense.forEach((d) => { dcur[d.id] = d.pre; traj[d.id] = [d.pre]; });
  for (let i = 1; i < n; i++) {
    const t = i * DT;
    defense.forEach((d) => {
      const cur = dcur[d.id];
      const task = d.task;
      let goal = cur; let speed = 6.4;
      const react = d.role === 'DL' ? 0.05 : 0.12;
      if (t < react) { traj[d.id].push(cur); return; }
      if (task.k === 'rush') {
        const qb = qbPosAt(bx, t);
        if (task.free) { goal = qb; speed = 5.6; }
        else if (t < tc) { goal = { x: cur.x + (qb.x - cur.x) * 0.25, y: -1.0 }; speed = 4.6; if (cur.y <= -0.9) goal = cur; }
        else { goal = qb; speed = 4.2; }
      } else if (task.k === 'man') {
        const r = rcv[task.tgt];
        const rp = traj[r.id][i];
        const ins = insideOf(rp, bx);
        goal = { x: rp.x + ins * task.lev, y: rp.y - task.trail * Math.min(1, t / 0.6) };
        speed = 6.9;
        // rub: running through traffic (another receiver) slows the defender
        for (const o of offense) {
          if (o.kind !== 'rcv' || o.pos === task.tgt) continue;
          if (dist(traj[o.id][i], cur) < 1.4 && traj[o.id][i].y > 1) { speed = 3.6; break; }
        }
      } else if (task.k === 'zone') {
        let g = task.land;
        let best: Pt | null = null; let bd = 1e9;
        offense.forEach((p) => {
          if (p.kind !== 'rcv') return;
          const rp = traj[p.id][i];
          const dd = dist(rp, task.land) * (task.deep ? 0.85 : 1);
          if (dd < task.r && dd < bd && rp.y > 1.5) { bd = dd; best = rp; }
        });
        if (best) {
          const b = best as Pt;
          if (task.deep) g = { x: task.land.x + (b.x - task.land.x) * 0.5, y: Math.max(task.land.y, b.y + 3.2) };
          else g = { x: task.land.x + (b.x - task.land.x) * 0.62, y: clamp(task.land.y + (b.y - task.land.y) * 0.3, 3, task.land.y + 4) };
        }
        goal = g; speed = 6.2;
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

function evaluate(sc: { offense: OffPlayer[]; defense: DefPlayer[]; traj: Record<string, Pt[]>; tDec: number; bx: number }): { evals: Record<RId, TargetEval>; open: RId[]; best: RId | null } {
  const { offense, defense, traj, tDec, bx } = sc;
  const qb = qbPosAt(bx, tDec);
  const evals = {} as Record<RId, TargetEval>;
  const cover = defense.filter((d) => d.task.k !== 'rush');
  (['X', 'H', 'Y', 'Z', 'R'] as RId[]).forEach((id) => {
    const p = offense.find((o) => o.pos === id)!;
    const pos = sampleAt(traj[p.id], tDec);
    if (p.route === 'block') {
      evals[id] = { id, label: id === 'R' ? 'RB' : id, pos, depth: pos.y, sep: 0, nearest: '-', manCovered: false, lane: null, cls: 'covered', why: 'Staying in to block.' };
      return;
    }
    let sep = 99; let nearest = ''; let nearestDef: DefPlayer | null = null;
    cover.forEach((d) => {
      const dp = sampleAt(traj[d.id], tDec);
      let dd = dist(dp, pos);
      // a defender well beneath a deep route cannot affect it
      if (pos.y > 14 && dp.y < pos.y - 6) dd += 3;
      if (dd < sep) { sep = dd; nearest = d.role; nearestDef = d; }
    });
    const manCovered = !!nearestDef && (nearestDef as DefPlayer).task.k === 'man' && ((nearestDef as DefPlayer).task as { tgt: RId }).tgt === id;
    const len = dist(qb, pos);
    let lane: string | null = null;
    cover.forEach((d) => {
      const dp = sampleAt(traj[d.id], tDec);
      const { d: sd, u } = segDist(dp, qb, pos);
      const lo = len <= 16 ? 0.15 : 0.55; const hi = len <= 16 ? 0.9 : 0.95;
      if (sd < 1.35 && u > lo && u < hi && !(manCovered && d === nearestDef)) { if (!lane || sd < 1.0) lane = d.role; }
    });
    const thr = manCovered ? 2.0 : 3.7;
    let cls: TargetEval['cls'] = 'covered';
    if (!lane && sep >= thr) cls = 'open';
    else if (!lane && sep >= thr * 0.72) cls = 'tight';
    let why = '';
    const nm = nearest || 'a defender';
    if (cls === 'open') why = manCovered ? `${nm} is trailing by ${sep.toFixed(1)} yards, so the throw is there if it is on time.` : `The nearest defender (${nm}) is ${sep.toFixed(1)} yards away, so a window is open.`;
    else if (lane) why = `The throwing lane runs through ${lane}, so the ball would be undercut.`;
    else if (cls === 'tight') why = `${nm} is ${sep.toFixed(1)} yards away. A tight window with little margin for error.`;
    else why = manCovered ? `${nm} is on him in man coverage, only ${sep.toFixed(1)} yards away.` : `${nm} is ${sep.toFixed(1)} yards away and in position to break on the ball.`;
    evals[id] = { id, label: id === 'R' ? 'RB' : id, pos, depth: pos.y, sep, nearest: nm, manCovered, lane, cls, why };
  });
  const open = (['X', 'H', 'Y', 'Z', 'R'] as RId[]).filter((k) => evals[k].cls === 'open');
  let best: RId | null = null; let bs = -1;
  open.forEach((k) => { const e = evals[k]; const s = Math.min(e.sep, 7) + clamp(e.depth, 0, 20) * 0.35 - (e.depth < 2 ? 3 : 0); if (s > bs) { bs = s; best = k; } });
  return { evals, open, best };
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
    const tasks = tasksFor(coverage, ctx, preAlign, rushers);
    const roles: Record<string, string> = { DEL: 'DE', DTL: 'DT', DTR: 'DT', DER: 'DE', MIKE: 'MIKE', WILL: 'WILL', CBL: 'CB', CBR: 'CB', NB: 'NB', SS: 'SS', FS: 'FS' };
    const defense: DefPlayer[] = Object.keys(roles).map((id) => ({ id, label: roles[id], role: id === 'DEL' || id === 'DER' ? 'DL' : id === 'DTL' || id === 'DTR' ? 'DL' : id, pre: preAlign[id], task: tasks[id] }));
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
    (['X', 'H', 'Y', 'Z', 'R'] as RId[]).forEach((k) => {
      const start = ctx.rc[k];
      const sideSign = k === 'R' ? (start.x >= ballX ? 1 : -1) : side(start.x, ballX);
      const route = assign[k];
      offense.push({ id: k.toLowerCase(), label: k === 'R' ? 'RB' : k, kind: 'rcv', pos: k, start, path: routePoints(start, sideSign, route), route, speed: RCV_SPEED });
    });
    const tDec = rushers >= 6 ? 1.75 : rushers === 5 ? 2.1 : 2.45;
    const tEnd = tDec + 1.7;
    const traj = simulate(offense, defense, ballX, tEnd, tDec + 1.1);
    const ev = evaluate({ offense, defense, traj, tDec, bx: ballX });
    if (ev.open.length < 1 || ev.open.length > 3) continue;
    const dn = pick(r, DOWNS);
    const sc: Scenario = {
      id: `${seed}`, seed, diff, formation, flipped, ballX, concept, conceptName: concept.name, coverage, look, disguised, rushers,
      pressureLabel: rushers === 4 ? 'Four rushers' : rushers === 5 ? 'Five rushers' : 'Six rushers', situation: `${dn[0]} · ${dn[1]} · ${FORMATIONS[formation].name}`,
      strengthSide: ctx.strength, offense, defense, tDec, tEnd, traj, dt: DT, evals: ev.evals, openIds: ev.open, bestId: ev.best,
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
  if (t.k === 'man') { const o = sc.offense.find((x) => x.pos === t.tgt)!; return `Man coverage on ${o.label}`; }
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
  return lines;
}
