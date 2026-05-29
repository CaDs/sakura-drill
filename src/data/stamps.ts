// CANON stamp card layout, ported from sakura_drill_app.html (STAMP_TARGETS).
//
// Stamp IDs are produced by the helpers below and shared between the play screens (which award
// stamps) and the stamp grid (which displays them) so they always agree. NOTE: this fixes a latent
// bug in the original web app, where riddle stamps were saved as `nazo-かんたん` but the grid looked
// for `nazo-かんたん（★☆☆）`, so starred-group riddle stamps never appeared. Same content, ids aligned.

import { MATH_LEVELS } from './math';
import { kokugoGroups } from './kokugo';
import { nazozoGroups } from './nazo';

export const mathStampId = (levelId: number): string => `math-${levelId}`;
export const kokugoStampId = (groupLabel: string, topicKey: string): string =>
  `kokugo-${groupLabel}-${topicKey}`;
export const nazoStampId = (groupLabel: string): string => `nazo-${groupLabel}`;

export interface StampItem {
  id: string;
  label: string;
  emoji: string;
}

export interface StampSection {
  title: string;
  color: string;
  items: StampItem[];
}

export const STAMP_TARGETS: StampSection[] = [
  {
    title: '🔢 さんすう',
    color: '#FF9800',
    items: MATH_LEVELS.map((l) => ({ id: mathStampId(l.id), label: l.label, emoji: l.emoji })),
  },
  ...kokugoGroups.map((g) => ({
    title: `📖 こくご（${g.groupLabel}）`,
    color: g.groupColor,
    items: g.topics.map((t) => ({
      id: kokugoStampId(g.groupLabel, t.key),
      label: t.key,
      emoji: t.emoji,
    })),
  })),
  {
    title: '🧩 なぞなぞ',
    color: '#4CAF50',
    items: nazozoGroups.map((g) => ({
      id: nazoStampId(g.groupLabel),
      label: g.groupLabel.split('（')[0],
      emoji: g.groupEmoji,
    })),
  },
];

export const MAX_STAMPS = STAMP_TARGETS.reduce((acc, g) => acc + g.items.length, 0);
