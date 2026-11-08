/*
  Helpers for the footer ridgeline dither scene.

  Ported from the standalone "Ridgeline Dither Footer" preset: ordered-dither
  mountains generated from ridged noise. The footer only needs the range and
  its mist, so the copy/columns/altimeter parts of the original are left out.
*/

export function ridgeHex(hex) {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!match) return null;
  const value =
    match[1].length === 3
      ? match[1]
          .split("")
          .map((char) => char + char)
          .join("")
      : match[1];
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

export function ridgePack(rgb) {
  return ((255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]) >>> 0;
}

/** The classic 8x8 Bayer matrix, as thresholds in (0, 1). */
export const RIDGE_BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55,
  23, 61, 29, 53, 21,
].map((value) => (value + 0.5) / 64);

/** Palette index for a tone in [0, 1] across `n` colours at Bayer threshold `b`. */
export function ridgeDither(tone, n, b) {
  const value = tone < 0 ? 0 : tone > 1 ? 1 : tone;
  const index = Math.floor(value * (n - 1) + b);
  return index > n - 1 ? n - 1 : index;
}

/** Integer lattice hash -> [0, 1). */
export function ridgeHash(x, y, seed) {
  let h =
    Math.imul(x | 0, 374761393) +
    Math.imul(y | 0, 668265263) +
    Math.imul(seed | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Smooth value noise in [0, 1). */
export function ridgeNoise(x, y, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = ridgeHash(xi, yi, seed);
  const b = ridgeHash(xi + 1, yi, seed);
  const c = ridgeHash(xi, yi + 1, seed);
  const d = ridgeHash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Fractal value noise, normalised back into [0, 1). */
export function ridgeFbm(x, y, seed, octaves) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let octave = 0; octave < octaves; octave++) {
    sum += ridgeNoise(x, y, seed + octave * 31) * amp;
    norm += amp;
    x *= 2.03;
    y *= 2.03;
    amp *= 0.5;
  }
  return norm > 0 ? sum / norm : 0;
}

/** Hermite step from e0 to e1, clamped. */
export function ridgeSmooth(e0, e1, x) {
  const t = e1 === e0 ? (x < e0 ? 0 : 1) : Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/** Ease-out cubic over a progress that may run outside [0, 1]. */
export function ridgeEase(t) {
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Crest row of ridge `i` of `layers` (0 is the farthest) for every column of
 * a `cols` x `rows` grid, plus `margin` columns either side for parallax.
 * Farther ridges sit higher with more, smaller peaks; nearer ones are lower,
 * broader and taller.
 */
export function ridgeLine(cols, rows, i, layers, seed, margin) {
  const k = layers > 1 ? i / (layers - 1) : 1;
  const count = cols + margin * 2;
  const out = new Float32Array(count);
  const base = rows * (0.38 + 0.66 * Math.pow(k, 1.4));
  const amp = rows * (0.2 + 0.24 * k);
  const freq = 6 - 3.8 * k;
  const flankL = rows * 0.5 * k * k * k * (0.55 + 0.6 * ridgeHash(i, 11, seed));
  const flankR = rows * 0.5 * k * k * k * (0.55 + 0.6 * ridgeHash(i, 13, seed));
  const ceiling = rows * 0.17;
  const tilt = (ridgeHash(i, 7, seed) - 0.5) * rows * 0.34 * (0.4 + k);
  const s = (seed | 0) * 13 + i * 101;

  for (let x = 0; x < count; x++) {
    const u = (x - margin) / cols;
    const r1 = 1 - Math.abs(ridgeNoise(u * freq + i * 3.7, 0.5, s) * 2 - 1);
    const r2 = 1 - Math.abs(ridgeNoise(u * freq * 2.3, 3.5, s + 1) * 2 - 1);
    const f = ridgeFbm(u * freq * 4.1, 9.5, s + 2, 3);
    const h = r1 * r1 * 0.62 + r2 * 0.24 + f * 0.14;
    const edge = Math.min(1.2, Math.abs(u * 2 - 1));
    const y =
      base -
      h * amp +
      tilt * (u - 0.5) * 2 -
      (u < 0.5 ? flankL : flankR) * edge * edge * Math.sqrt(edge);
    out[x] = y < ceiling ? ceiling - (ceiling - y) * 0.25 : y;
  }

  return out;
}