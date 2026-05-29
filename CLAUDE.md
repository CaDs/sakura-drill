# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Build/lint/test commands and Expo SDK-54 gotchas live in **@AGENTS.md** — read it first.
The notes below are the big-picture architecture that AGENTS.md doesn't cover.

## What this is

さくらドリル — an offline, single-profile iOS/Android drill app for a young child (all UI text is
Japanese hiragana/kanji). Three game types (math さんすう, language こくご, riddles なぞなぞ), a stamp-card
reward grid, and a settings screen. No backend, no auth, no network — everything is bundled content
plus local AsyncStorage. The entire app was ported from a single-file `sakura_drill_app.html`
prototype; the data modules say "ported verbatim" and that lineage matters (see below).

## Provider stack (App.tsx)

`SafeAreaProvider → RootBackground → ErrorBoundary → ProfileProvider → SoundProvider →
NavigationContainer → Stack.Navigator`. Order is deliberate:

- **RootBackground** renders the gradient + falling-sakura animation **once** at the root. The nav
  theme and every screen use `background: transparent` so that one render shows through all screens —
  do not add per-screen gradients/backgrounds.
- `enableFreeze(true)` + per-screen `freezeOnBlur: true` suspend backgrounded screens so their
  looping animations stop burning CPU/battery. Consequence: a screen is **not unmounted** when you
  navigate away, so any pending `setTimeout` keeps living (see gameplay loop).
- Fonts load via `useFonts` before the navigator mounts; until then a 🌸 `Loading` splash shows.

## Navigation

Six screens, flat native stack, `headerShown: false`. Routes + typed props are centralized in
`src/navigation.ts` (`RootStackParamList`, `ScreenProps<T>`). All routes currently take no params —
game state is local to each screen, not passed through navigation.

## Content / data layer (`src/data/`)

Pure TypeScript, no React. This is the heart of the app and the only code with real test coverage
(jest `collectCoverageFrom` is `src/data` + `src/storage` only).

- `math.ts` — `MATH_LEVELS`/`MATH_GROUPS` definitions plus the **generators** `generateMathProblems`,
  `makeMathChoices`, `isHardLevel`. Logic ported verbatim from the HTML prototype — when changing it,
  preserve the existing behavior and update `math.test.ts`.
- `kokugo.ts` / `nazo.ts` — static card/riddle content (`kokugoGroups`, `nazozoGroups`). こくご topics
  are one of two types: `flash` (flip cards) or `quiz4` (4-choice). Riddles are always 4-choice.
- `stamps.ts` — **the single source of truth for stamp IDs.** Export helpers `mathStampId`,
  `kokugoStampId`, `nazoStampId` and `STAMP_TARGETS` are *derived* from the math/kokugo/nazo modules.
  Both the play screens (which award stamps) and the StampScreen grid (which displays them) must use
  these helpers so the IDs always agree. This fixed a latent prototype bug where award-side and
  display-side IDs diverged and some stamps never appeared. **Never hand-build a stamp-id string.**

## Persistence (`src/storage/profile.tsx`)

`ProfileProvider` is the only persisted state: player `name` and `stamps` (`Record<id, boolean>`) in
AsyncStorage under `@sakura/name` / `@sakura/stamps`. Hydrated once on launch (`ready` gates the UI).
API: `setName`, `addStamp` (idempotent — re-awarding a stamp is a no-op), `wipeAll`. Consume via the
`useProfile()` hook; it throws outside the provider.

## Gameplay loop pattern (the screens)

`MathScreen`, `KokugoScreen`, `NazoScreen` share one structure: a single screen component with three
internal phases gated by local state — **level/topic select → play → result** (`ResultScreen`).
A round is fixed at `TOTAL = 10` questions; a perfect score awards the relevant stamp via `addStamp`.

The critical pattern is the **answer timeout** (`timer` ref): on each answer a `setTimeout(…, 1000)`
shows feedback, then advances `idx` or sets `completed`. Because freezeOnBlur means the screen isn't
unmounted, **every path that leaves play without unmounting** (in-game back button, retry, start new
level/topic, mistakes-retry) MUST call `clearTimer()` first — otherwise the stale timeout fires
`setCompleted`/`setIdx` on the select view and wrongly jumps to a result. The component-unmount
cleanup (`useEffect(() => () => clearTimer())`) is a backstop, not a substitute.

Wrong answers are accumulated into a `mistakes: Mistake[]` list; `ResultScreen` offers a
"retry mistakes" run built from exactly those items.

## Shared components (`src/components/`)

Reusable building blocks the screens compose: `ChunkyButton` (the 3D pressable button used
everywhere — `depth`/`edgeColor`/`faceStyle`), `ResultScreen`, `ProgressBar`, `FlipCard`,
`Stars`, `FloatingSakura`, `GradientText`/`MaskedView`, and `anim.tsx` (`Pop` entrance,
`FeedbackView` correct/wrong shake — Reanimated 4). `ScreenBackground` is the transparent
per-screen wrapper (centers content, max-width); `RootBackground` is the root-level visual layer.

## Theme (`src/theme/theme.ts`)

`fonts` maps weight → explicit family name (`MPLUSRounded1c_400Regular/700Bold/900Black`) because
**custom RN fonts ignore `fontWeight`** — always set `fontFamily`, never rely on `fontWeight` for the
rounded font. `colors` includes the home `bgGradient`. Styling is inline `StyleSheet`-less objects
mirroring the prototype's inline styles; follow that convention rather than introducing StyleSheet.

## Audio (`src/audio/SoundProvider.tsx`)

Three SFX (`correct`/`wrong`/`hard`) are pre-rendered WAVs in `assets/sounds/`, generated by
`scripts/generate-sounds.mjs` (Web Audio math ported from the prototype — regenerate with
`node scripts/generate-sounds.mjs` if you change the synthesis). Players are created once at the root
via `useAudioPlayer` (expo-audio, not expo-av) and shared through context; `trigger` does
`seekTo(0)` then `play()` so rapid answers replay cleanly. Plays in silent mode (kids app). Audio is
best-effort — errors are swallowed and never break gameplay. Consume via `useSound()`.

## Tests

`*.test.ts(x)` colocated with source. Coverage floor (≥80%) applies to `src/data` and `src/storage`
only — the generators, profile persistence, and the stamp-id alignment regression. UI screens are
not unit-tested. AsyncStorage is mocked in `jest.setup.ts`. Run a single test with
`npm test -- math.test` (or `-t "<test name>"`).
