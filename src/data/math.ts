// CANON math content, ported verbatim from sakura_drill_app.html (MATH_LEVELS, MATH_GROUPS,
// generateMathProblems, isHardLevel). Logic is unchanged — only typed.

export type MathOp = '＋' | '－';
export type MathMissing = 'a' | 'b' | 'c';
export type MathFormat = 'normal' | 'reverse';

export type MathLevelType =
  | 'add_fixed'
  | 'add_carry'
  | 'add_mix'
  | 'sub_fixed'
  | 'sub_mix'
  | 'add_hole'
  | 'sub_hole'
  | 'add_reverse_hole';

export interface MathLevel {
  id: number;
  label: string;
  sub: string;
  type: MathLevelType;
  b?: number;
  max?: number;
  color: string;
  emoji: string;
}

export interface MathProblem {
  a: number;
  b: number;
  c: number;
  op: MathOp;
  missing: MathMissing;
  format: MathFormat;
  answer: number;
  /** tag used by the mistakes-review screen */
  type?: 'math';
}

export const MATH_LEVELS: MathLevel[] = [
  { id: 1, label: '＋１', sub: '0+1 〜 9+1', type: 'add_fixed', b: 1, color: '#66BB6A', emoji: '🌿' },
  { id: 2, label: '＋２', sub: '0+2 〜 8+2', type: 'add_fixed', b: 2, color: '#FFA726', emoji: '🍊' },
  { id: 3, label: '＋３', sub: '0+3 〜 7+3', type: 'add_fixed', b: 3, color: '#FFD54F', emoji: '⭐' },
  { id: 4, label: '＋４', sub: '0+4 〜 6+4', type: 'add_fixed', b: 4, color: '#26C6DA', emoji: '💧' },
  { id: 5, label: '＋５', sub: '0+5 〜 5+5', type: 'add_fixed', b: 5, color: '#AB47BC', emoji: '🔮' },
  { id: 6, label: '＋６', sub: '0+6 〜 4+6', type: 'add_fixed', b: 6, color: '#26A69A', emoji: '🟢' },
  { id: 7, label: '＋７', sub: '0+7 〜 3+7', type: 'add_fixed', b: 7, color: '#42A5F5', emoji: '🔵' },
  { id: 8, label: '＋８', sub: '0+8 〜 2+8', type: 'add_fixed', b: 8, color: '#7E57C2', emoji: '🟣' },
  { id: 9, label: '＋９', sub: '0+9 〜 1+9', type: 'add_fixed', b: 9, color: '#EC407A', emoji: '🌸' },
  { id: 10, label: 'くりあがり①', sub: '答えが11〜15', type: 'add_carry', max: 15, color: '#FF7043', emoji: '🔥' },
  { id: 11, label: 'くりあがり②', sub: '答えが16〜20', type: 'add_carry', max: 20, color: '#EF5350', emoji: '🚀' },
  { id: 12, label: 'たしざん ミックス', sub: '+1〜+9 まぜこぜ', type: 'add_mix', color: '#AB47BC', emoji: '🎲' },
  { id: 13, label: 'ひきざん①', sub: '10以下 (10-□)', type: 'sub_fixed', max: 10, color: '#26C6DA', emoji: '➖' },
  { id: 14, label: 'ひきざん②', sub: '20以下 (20-□)', type: 'sub_fixed', max: 20, color: '#FF8A65', emoji: '🧮' },
  { id: 15, label: 'たし＆ひき ミックス', sub: 'たしざん＋ひきざん', type: 'sub_mix', color: '#8D6E63', emoji: '⚡' },
  { id: 16, label: 'あなうめ たしざん', sub: '1＋□＝5 など', type: 'add_hole', color: '#8BC34A', emoji: '🧩' },
  { id: 17, label: 'あなうめ ひきざん', sub: '5－□＝3 など', type: 'sub_hole', color: '#29B6F6', emoji: '🕳️' },
  { id: 18, label: 'ぎゃくの かたち', sub: '6＝1＋□ など', type: 'add_reverse_hole', color: '#D81B60', emoji: '🔄' },
];

export interface MathGroup {
  groupLabel: string;
  groupEmoji: string;
  groupColor: string;
  levels: MathLevel[];
}

export const MATH_GROUPS: MathGroup[] = [
  { groupLabel: 'たしざん ＋1〜＋5', groupEmoji: '🌱', groupColor: '#4CAF50', levels: MATH_LEVELS.slice(0, 5) },
  { groupLabel: 'たしざん ＋6〜＋9', groupEmoji: '🌿', groupColor: '#2196F3', levels: MATH_LEVELS.slice(5, 9) },
  { groupLabel: 'くりあがり・ミックス', groupEmoji: '🔥', groupColor: '#FF5722', levels: MATH_LEVELS.slice(9, 12) },
  { groupLabel: 'ひきざん', groupEmoji: '➖', groupColor: '#00BCD4', levels: MATH_LEVELS.slice(12, 15) },
  { groupLabel: 'あなうめ・ぎゃくさん', groupEmoji: '💡', groupColor: '#9C27B0', levels: MATH_LEVELS.slice(15, 18) },
];

export function isHardLevel(levelDef: MathLevel | null | undefined): boolean {
  if (!levelDef) return false;
  return (
    ['add_carry', 'add_mix', 'sub_fixed', 'sub_mix', 'add_hole', 'sub_hole', 'add_reverse_hole'].indexOf(
      levelDef.type
    ) !== -1 || levelDef.id >= 10
  );
}

export function generateMathProblems(levelDef: MathLevel, count = 10): MathProblem[] {
  const base: MathProblem[] = [];
  const { type, b, max } = levelDef;

  if (type === 'add_fixed') {
    const bv = b ?? 0;
    for (let a = 0; a + bv <= 20; a++)
      base.push({ a, b: bv, c: a + bv, op: '＋', missing: 'c', format: 'normal', answer: a + bv });
  } else if (type === 'add_carry') {
    const lo = max === 15 ? 11 : 16;
    const hi = max ?? 20;
    for (let ans = lo; ans <= hi; ans++) {
      for (let a = 2; a <= 9; a++) {
        const bv = ans - a;
        if (bv >= 2 && bv <= 9 && a !== bv)
          base.push({ a, b: bv, c: ans, op: '＋', missing: 'c', format: 'normal', answer: ans });
      }
    }
  } else if (type === 'add_mix') {
    for (let bv = 1; bv <= 9; bv++) {
      for (let a = 0; a + bv <= 18; a++)
        base.push({ a, b: bv, c: a + bv, op: '＋', missing: 'c', format: 'normal', answer: a + bv });
    }
  } else if (type === 'sub_fixed') {
    const hi = max ?? 10;
    for (let ans = 0; ans <= hi - 1; ans++) {
      for (let bv = 1; bv <= hi - ans; bv++) {
        const a = ans + bv;
        if (a <= hi) base.push({ a, b: bv, c: ans, op: '－', missing: 'c', format: 'normal', answer: ans });
      }
    }
  } else if (type === 'sub_mix') {
    for (let bv = 1; bv <= 9; bv++)
      for (let a = 0; a + bv <= 20; a++)
        base.push({ a, b: bv, c: a + bv, op: '＋', missing: 'c', format: 'normal', answer: a + bv });
    for (let a = 2; a <= 18; a++)
      for (let bv = 1; bv < a; bv++)
        base.push({ a, b: bv, c: a - bv, op: '－', missing: 'c', format: 'normal', answer: a - bv });
  } else if (type === 'add_hole') {
    for (let c = 2; c <= 10; c++) {
      for (let a = 1; a < c; a++) {
        const bv = c - a;
        const missing: MathMissing = Math.random() < 0.5 ? 'a' : 'b';
        base.push({ a, b: bv, c, op: '＋', missing, format: 'normal', answer: missing === 'a' ? a : bv });
      }
    }
  } else if (type === 'sub_hole') {
    for (let a = 2; a <= 10; a++) {
      for (let bv = 1; bv < a; bv++) {
        const c = a - bv;
        const missing: MathMissing = Math.random() < 0.5 ? 'a' : 'b';
        base.push({ a, b: bv, c, op: '－', missing, format: 'normal', answer: missing === 'a' ? a : bv });
      }
    }
  } else if (type === 'add_reverse_hole') {
    for (let c = 2; c <= 10; c++) {
      for (let a = 1; a < c; a++) {
        const bv = c - a;
        const missing: MathMissing = Math.random() < 0.5 ? 'a' : 'b';
        base.push({ a, b: bv, c, op: '＋', missing, format: 'reverse', answer: missing === 'a' ? a : bv });
      }
    }
  }

  if (base.length === 0) base.push({ a: 1, b: 1, c: 2, op: '＋', missing: 'c', format: 'normal', answer: 2 });

  const problems: MathProblem[] = [];
  while (problems.length < count) {
    const shuffled = [...base].sort(() => Math.random() - 0.5);
    problems.push(...shuffled.map((obj) => ({ ...obj })));
  }
  return problems.slice(0, count);
}

// Builds the 4 multiple-choice options for a math problem (verbatim from the web app).
export function makeMathChoices(answer: number | undefined): number[] {
  if (answer === undefined) return [];
  const opts = new Set<number>([answer]);
  let tries = 0;
  while (opts.size < 4 && tries < 50) {
    tries++;
    const d: number = answer + Math.floor(Math.random() * 7) - 3;
    if (d >= 0 && d !== answer) opts.add(d);
  }
  let fallback = 0;
  while (opts.size < 4) {
    opts.add(fallback);
    fallback++;
  }
  return [...opts].sort(() => Math.random() - 0.5);
}
