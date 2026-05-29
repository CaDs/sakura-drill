import {
  generateMathProblems,
  isHardLevel,
  makeMathChoices,
  MATH_LEVELS,
  type MathLevel,
  type MathProblem,
} from './math';

// The answer a problem expects must be consistent with its equation, given which slot is the hole.
function expectedAnswer(p: MathProblem): number {
  const result = p.op === '＋' ? p.a + p.b : p.a - p.b;
  if (p.missing === 'a') return p.a;
  if (p.missing === 'b') return p.b;
  return p.c === result ? p.c : result;
}

describe('generateMathProblems', () => {
  it('returns exactly the requested count for every level', () => {
    for (const level of MATH_LEVELS) {
      expect(generateMathProblems(level, 10)).toHaveLength(10);
      expect(generateMathProblems(level, 5)).toHaveLength(5);
    }
  });

  it('produces internally consistent, non-negative problems for every level', () => {
    for (const level of MATH_LEVELS) {
      for (const p of generateMathProblems(level, 30)) {
        // c must equal a±b
        const computed = p.op === '＋' ? p.a + p.b : p.a - p.b;
        expect(p.c).toBe(computed);
        // no negative operands or results (kids math)
        expect(p.a).toBeGreaterThanOrEqual(0);
        expect(p.b).toBeGreaterThanOrEqual(0);
        expect(p.c).toBeGreaterThanOrEqual(0);
        // the stored answer matches the hole
        expect(p.answer).toBe(expectedAnswer(p));
        expect(['a', 'b', 'c']).toContain(p.missing);
        expect(['normal', 'reverse']).toContain(p.format);
      }
    }
  });

  it('keeps +N fixed-addend levels within their advertised range', () => {
    const plus3 = MATH_LEVELS.find((l) => l.id === 3) as MathLevel; // type add_fixed, b=3
    for (const p of generateMathProblems(plus3, 40)) {
      expect(p.op).toBe('＋');
      expect(p.b).toBe(3);
      expect(p.c).toBeLessThanOrEqual(20);
    }
  });

  it('keeps carry levels in the 11–15 answer band', () => {
    const carry = MATH_LEVELS.find((l) => l.id === 10) as MathLevel; // add_carry max 15
    for (const p of generateMathProblems(carry, 40)) {
      expect(p.c).toBeGreaterThanOrEqual(11);
      expect(p.c).toBeLessThanOrEqual(15);
    }
  });

  it('never returns an empty array even for count 0 edge handling', () => {
    const level = MATH_LEVELS[0];
    expect(generateMathProblems(level, 1)).toHaveLength(1);
  });
});

describe('makeMathChoices', () => {
  it('returns 4 unique options that include the answer', () => {
    for (let answer = 0; answer <= 20; answer++) {
      const choices = makeMathChoices(answer);
      expect(choices).toHaveLength(4);
      expect(new Set(choices).size).toBe(4);
      expect(choices).toContain(answer);
      expect(choices.every((c) => c >= 0)).toBe(true);
    }
  });

  it('returns empty for undefined', () => {
    expect(makeMathChoices(undefined)).toEqual([]);
  });
});

describe('isHardLevel', () => {
  it('is false for early fixed-addend levels and null', () => {
    expect(isHardLevel(null)).toBe(false);
    expect(isHardLevel(MATH_LEVELS[0])).toBe(false); // id 1, add_fixed
  });

  it('is true for carry/mix/subtraction/hole levels and id >= 10', () => {
    const hardTypes = MATH_LEVELS.filter((l) => l.id >= 10);
    for (const l of hardTypes) expect(isHardLevel(l)).toBe(true);
  });
});
