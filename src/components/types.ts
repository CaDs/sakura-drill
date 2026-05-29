import { MathProblem } from '../data/math';

// A missed question, replayable in "retry mistakes". Each carries the full original item plus a tag.
export type MathMistake = MathProblem & { type: 'math' };
export type QuizMistake = {
  type: 'quiz';
  question: string;
  choices: string[];
  answer: string;
  hint?: string;
};
export type FlashMistake = { type: 'flash'; char: string; word: string; emoji: string };

export type Mistake = MathMistake | QuizMistake | FlashMistake;
