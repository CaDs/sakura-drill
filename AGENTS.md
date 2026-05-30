# さくらドリル — Expo notes

This project is pinned to **Expo SDK 54** (React Native 0.81.5, React 19.1.0). Use the versioned
docs at https://docs.expo.dev/versions/v54.0.0/ — NOT latest.

Gotchas already hit:
- `create-expo-app` defaults to the newest SDK (was 56); we downgraded with `expo@~54` + `expo install --fix`.
- **Transitive SDK-56 stragglers:** the downgrade left hoisted `expo-asset@56` + `expo-constants@56` at the top of `node_modules` (leftovers the original SDK-56 scaffold installed). `expo install --fix` / `--check` only inspect *direct* deps, so they never flagged these. `expo-audio` declares `expo-asset: "*"` (peer), so Metro resolved the bad hoisted 56 copy → `expo-asset@56`'s JS calls `requireNativeModule('ExpoAsset')`, but SDK-54 links no such native module → `Cannot find native module 'ExpoAsset'` at runtime (crashes on a fresh `expo run:ios` build; `expo start` may limp along on a stale binary/cache). Fix: pin them via `overrides` in package.json (`"expo-asset": "~12.0.13"`, `"expo-constants": "~18.0.13"` — match what `node -p "require('expo/package.json').dependencies"` wants), then `npm install`. Verify with `npm ls expo-asset expo-constants` showing a single SDK-54 version each.
- Reanimated 4 needs the `react-native-worklets/plugin` babel plugin (last in the list), not the old `react-native-reanimated/plugin`.
- Audio uses **expo-audio** (`useAudioPlayer`), not the deprecated expo-av.
- `babel-preset-expo` must be an explicit devDependency — it got dropped during the SDK downgrade and Metro bundling failed with "Cannot find module 'babel-preset-expo'".
- Import font weights via subpaths (`@expo-google-fonts/m-plus-rounded-1c/400Regular`) and `useFonts` from `expo-font` — importing from the package barrel bundles all 7 weights (~25 MB).
- **Splash icon:** `assets/splash-icon.png` shipped as the *Expo scaffold placeholder* (faint gray circles) long after `icon.png` got real artwork, so the loading screen looked blank. The splash now uses the **`expo-splash-screen` config plugin** (not the legacy top-level `splash` key) pointing at `splash-icon.png` with `imageWidth: 220` / `backgroundColor: #FFF9C4`. `splash-icon.png` is currently a copy of `icon.png` (shows the rounded app-icon tile); replace with a transparent-background mark for a cleaner centered logo. `ios/`+`android/` are gitignored, so EAS reprebuilds the splash from `app.json` automatically — a *local* `expo run:ios` needs `npx expo prebuild --clean` to pick up splash/icon changes.
- **Simulator run blocker:** Xcode 26.5 builds against the iOS 26.5 simulator SDK; if only older runtimes (26.2/26.4) are installed, `xcodebuild -showdestinations` lists zero simulators and `expo run:ios` fails with "iOS 26.5 is not installed". Fix: `xcodebuild -downloadPlatform iOS`. JS bundling (`expo export`) and `tsc` are unaffected.

- **Jest:** use `jest-expo`'s default `transformIgnorePatterns` — do NOT set a custom one in
  `package.json`. A custom override excluded `expo-modules-core` and broke the preset's own setup
  ("Cannot use import statement outside a module"). AsyncStorage is mocked in `jest.setup.ts`.
- Backgrounded screens are frozen via `enableFreeze(true)` + `freezeOnBlur`; the gradient + sakura
  render once in `RootBackground` (not per screen). In-game "← もどる"/retry must clear the pending
  answer `setTimeout` (via `clearTimer()`) since they don't unmount the screen.

## Verify locally
- `npx tsc --noEmit` — type check
- `npm test` / `npm run test:coverage` — jest (logic + profile + stamp-id regression; ≥80% on src/data, src/storage)
- `npx expo export --platform all --output-dir build-check` — headless bundle for iOS+Android (catches module/asset/babel errors)
- `node scripts/generate-sounds.mjs` — regenerate the 3 SFX wavs from the Web Audio math
- `npx expo run:ios` / `npx expo start` — run on device/simulator (needs matching simulator runtime, see above)
