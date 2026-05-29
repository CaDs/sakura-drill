import { kokugoGroups } from './kokugo';
import { MATH_LEVELS } from './math';
import { nazozoGroups } from './nazo';
import {
  kokugoStampId,
  mathStampId,
  MAX_STAMPS,
  nazoStampId,
  STAMP_TARGETS,
} from './stamps';

const allTargetIds = new Set(STAMP_TARGETS.flatMap((s) => s.items.map((i) => i.id)));

describe('stamp id alignment (regression for the nazo-stamp bug)', () => {
  // The original web app saved riddle stamps as `nazo-かんたん` but the grid looked for
  // `nazo-かんたん（★☆☆）`, so starred-group stamps never displayed. Every id a play screen can award
  // must exist as a stamp-card target id.

  it('every math stamp id earned in play exists as a target', () => {
    for (const l of MATH_LEVELS) {
      expect(allTargetIds.has(mathStampId(l.id))).toBe(true);
    }
  });

  it('every kokugo stamp id earned in play exists as a target', () => {
    for (const g of kokugoGroups) {
      for (const t of g.topics) {
        expect(allTargetIds.has(kokugoStampId(g.groupLabel, t.key))).toBe(true);
      }
    }
  });

  it('every nazo stamp id earned in play exists as a target (the bug)', () => {
    for (const g of nazozoGroups) {
      expect(allTargetIds.has(nazoStampId(g.groupLabel))).toBe(true);
    }
  });
});

describe('STAMP_TARGETS integrity', () => {
  it('has unique ids', () => {
    const ids = STAMP_TARGETS.flatMap((s) => s.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('MAX_STAMPS equals the total item count', () => {
    const total = STAMP_TARGETS.reduce((acc, s) => acc + s.items.length, 0);
    expect(MAX_STAMPS).toBe(total);
  });

  it('covers every math level, kokugo topic, and nazo group exactly', () => {
    const kokugoTopicCount = kokugoGroups.reduce((acc, g) => acc + g.topics.length, 0);
    expect(MAX_STAMPS).toBe(MATH_LEVELS.length + kokugoTopicCount + nazozoGroups.length);
  });
});
