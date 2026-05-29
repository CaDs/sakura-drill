// Renders the three SFX as WAV files, re-implementing the EXACT Web Audio math from
// sakura_drill_app.html (playSoundCorrect / playSoundWrong / playSoundHard) so the native
// app sounds identical to the original web app. Run: `node scripts/generate-sounds.mjs`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SR = 44100; // sample rate
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'assets', 'sounds');

const TWO_PI = Math.PI * 2;

// Band-limited-ish naive oscillator shapes matching Web Audio's `type`. Naive waveforms are
// sonically indistinguishable here at these low volumes / a kids' SFX, and avoid native deps.
function wave(type, phase /* in cycles */) {
  const p = phase - Math.floor(phase); // 0..1
  switch (type) {
    case 'sine':
      return Math.sin(TWO_PI * p);
    case 'triangle':
      // proper triangle in [-1, 1]
      return (2 / Math.PI) * Math.asin(Math.sin(TWO_PI * p));
    case 'sawtooth':
      return 2 * (p - Math.floor(p + 0.5));
    case 'square':
      return p < 0.5 ? 1 : -1;
    default:
      return Math.sin(TWO_PI * p);
  }
}

// Mix one oscillator note into `buf` (Float32 mono).
// startSec/durationSec position the note; freqFn(localT)->Hz; gainFn(localT)->amplitude.
function renderNote(buf, { startSec, durationSec, type, freqFn, gainFn }) {
  const startSample = Math.floor(startSec * SR);
  const n = Math.floor(durationSec * SR);
  let phase = 0; // cycles
  for (let i = 0; i < n; i++) {
    const localT = i / SR;
    const f = freqFn(localT);
    phase += f / SR; // accumulate so frequency sweeps stay phase-continuous
    const idx = startSample + i;
    if (idx >= 0 && idx < buf.length) buf[idx] += wave(type, phase) * gainFn(localT);
  }
}

// Mirrors playTone(freq, type, startTimeOffset, duration, vol): constant freq, gain ramps
// exponentially from `vol` to 0.01 over `duration` (Web Audio exponentialRampToValueAtTime).
function tone(buf, freq, type, startSec, durationSec, vol = 0.1) {
  const ratio = 0.01 / vol;
  renderNote(buf, {
    startSec,
    durationSec,
    type,
    freqFn: () => freq,
    gainFn: (t) => vol * Math.pow(ratio, Math.min(t / durationSec, 1)),
  });
}

function makeBuffer(seconds) {
  return new Float32Array(Math.ceil(seconds * SR));
}

// ---- playSoundCorrect: triangle arpeggio C5-E5-G5-C6 ----
function buildCorrect() {
  const buf = makeBuffer(0.8);
  tone(buf, 523.25, 'triangle', 0.0, 0.15, 0.1);
  tone(buf, 659.25, 'triangle', 0.12, 0.15, 0.1);
  tone(buf, 783.99, 'triangle', 0.24, 0.15, 0.1);
  tone(buf, 1046.5, 'triangle', 0.36, 0.3, 0.15);
  return buf;
}

// ---- playSoundWrong: sawtooth sweep 440->520->300->140 with linear gain 0.1->0.01 over 0.6s ----
function buildWrong() {
  const dur = 0.6;
  const buf = makeBuffer(dur + 0.02);
  // piecewise-linear frequency: anchors at (t, Hz)
  const pts = [
    [0.0, 440],
    [0.08, 520],
    [0.22, 300],
    [0.6, 140],
  ];
  const freqAt = (t) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [t0, f0] = pts[i];
      const [t1, f1] = pts[i + 1];
      if (t <= t1) return f0 + ((f1 - f0) * (t - t0)) / (t1 - t0);
    }
    return pts[pts.length - 1][1];
  };
  renderNote(buf, {
    startSec: 0,
    durationSec: dur,
    type: 'sawtooth',
    freqFn: freqAt,
    gainFn: (t) => 0.1 + (0.01 - 0.1) * (t / dur), // linearRampToValueAtTime
  });
  return buf;
}

// ---- playSoundHard: rising triangle run + sine bells + final triangle chord ----
function buildHard() {
  const buf = makeBuffer(1.4);
  const notes = [392.0, 493.88, 587.33, 739.99, 987.77, 1174.66];
  notes.forEach((freq, i) => tone(buf, freq, 'triangle', i * 0.09, 0.15, 0.1));
  const bells = [1567.98, 1975.53, 2349.32];
  bells.forEach((freq, i) => tone(buf, freq, 'sine', 0.56 + i * 0.08, 0.2, 0.05));
  tone(buf, 523.25, 'triangle', 0.88, 0.4, 0.1);
  tone(buf, 659.25, 'triangle', 0.88, 0.4, 0.1);
  tone(buf, 783.99, 'triangle', 0.88, 0.4, 0.1);
  return buf;
}

// Float32 mono -> 16-bit PCM WAV
function encodeWav(samples) {
  const numSamples = samples.length;
  const dataBytes = numSamples * 2;
  const buf = Buffer.alloc(44 + dataBytes);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataBytes, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); // fmt chunk size
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28); // byte rate
  buf.writeUInt16LE(2, 32); // block align
  buf.writeUInt16LE(16, 34); // bits per sample
  buf.write('data', 36);
  buf.writeUInt32LE(dataBytes, 40);
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  return buf;
}

mkdirSync(OUT_DIR, { recursive: true });
const files = {
  'correct.wav': buildCorrect(),
  'wrong.wav': buildWrong(),
  'hard.wav': buildHard(),
};
for (const [name, samples] of Object.entries(files)) {
  const wav = encodeWav(samples);
  writeFileSync(join(OUT_DIR, name), wav);
  console.log(`wrote ${name}  (${(samples.length / SR).toFixed(2)}s, ${wav.length} bytes)`);
}
console.log('done →', OUT_DIR);
