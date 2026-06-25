// Tiny WebAudio sound engine — no assets, all synthesized.
// Muted by default; the UI toggles `enabled`.

let ctx: AudioContext | null = null;
let enabled = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function setAudioEnabled(on: boolean) {
  enabled = on;
  if (on) {
    const c = getCtx();
    if (c && c.state === "suspended") void c.resume();
  }
}

export function isAudioEnabled() {
  return enabled;
}

type Tone = { freq: number; dur: number; type?: OscillatorType; vol?: number; delay?: number };

function play(tones: Tone[]) {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  for (const t of tones) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = t.type ?? "square";
    osc.frequency.setValueAtTime(t.freq, now + (t.delay ?? 0));
    const vol = t.vol ?? 0.05;
    gain.gain.setValueAtTime(0.0001, now + (t.delay ?? 0));
    gain.gain.exponentialRampToValueAtTime(vol, now + (t.delay ?? 0) + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (t.delay ?? 0) + t.dur);
    osc.connect(gain).connect(c.destination);
    osc.start(now + (t.delay ?? 0));
    osc.stop(now + (t.delay ?? 0) + t.dur + 0.02);
  }
}

// Throttle keystroke blips so fast typing doesn't machine-gun.
let lastKey = 0;
export function sfxKey() {
  const t = performance.now();
  if (t - lastKey < 28) return;
  lastKey = t;
  play([{ freq: 1500, dur: 0.018, type: "square", vol: 0.015 }]);
}

export function sfxOpen() {
  play([
    { freq: 523, dur: 0.06, type: "square", vol: 0.05 },
    { freq: 784, dur: 0.08, type: "square", vol: 0.05, delay: 0.05 },
  ]);
}

export function sfxClose() {
  play([
    { freq: 523, dur: 0.06, type: "triangle", vol: 0.045 },
    { freq: 330, dur: 0.08, type: "triangle", vol: 0.045, delay: 0.05 },
  ]);
}

export function sfxEnter() {
  play([{ freq: 880, dur: 0.05, type: "square", vol: 0.04 }]);
}

export function sfxError() {
  play([
    { freq: 180, dur: 0.1, type: "sawtooth", vol: 0.05 },
    { freq: 120, dur: 0.14, type: "sawtooth", vol: 0.05, delay: 0.08 },
  ]);
}

export function sfxBoot() {
  play([
    { freq: 392, dur: 0.1, type: "square", vol: 0.05 },
    { freq: 523, dur: 0.1, type: "square", vol: 0.05, delay: 0.1 },
    { freq: 659, dur: 0.1, type: "square", vol: 0.05, delay: 0.2 },
    { freq: 1046, dur: 0.18, type: "square", vol: 0.05, delay: 0.3 },
  ]);
}

export function sfxPowerup() {
  play([
    { freq: 523, dur: 0.08, type: "square", vol: 0.06 },
    { freq: 659, dur: 0.08, type: "square", vol: 0.06, delay: 0.08 },
    { freq: 784, dur: 0.08, type: "square", vol: 0.06, delay: 0.16 },
    { freq: 1046, dur: 0.22, type: "square", vol: 0.06, delay: 0.24 },
  ]);
}
