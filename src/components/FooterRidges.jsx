import { useEffect, useRef } from "react";
import {
  RIDGE_BAYER,
  ridgeDither,
  ridgeEase,
  ridgeFbm,
  ridgeHash,
  ridgeHex,
  ridgeLine,
  ridgeNoise,
  ridgePack,
  ridgeSmooth,
} from "../lib/ridge";

/*
  Decorative footer range: six ridges of ordered-dither mountains rising out of
  drifting mist. The canvas reveals itself the first time the footer is seen,
  then the mist keeps moving and the pointer parts the fog and tilts the range
  in parallax. The palette follows the indigo/blue night of the hero.
*/
const TONES = [
  "#0d0c11",
  "#101627",
  "#172441",
  "#223760",
  "#325383",
  "#5279a8",
  "#8aaed6",
];

export default function FooterRidges({
  seed = 7,
  ridges = 6,
  pixel = 2,
  mist = 0.78,
  drift = 0.8,
  radius = 130,
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const revealAt = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const layers = Math.max(2, Math.min(9, Math.round(ridges)));
    const palette = new Uint32Array(
      TONES.map((tone) => {
        const rgb = ridgeHex(tone);
        return ridgePack(rgb || [128, 128, 128]);
      }),
    );
    const toneCount = palette.length;

    let step = 2;
    let cols = 1;
    let rows = 1;
    let margin = 2;
    let image = null;
    let buffer = new Uint32Array(0);
    let tops = [];
    let pools = [];
    let colTop = new Float32Array(0);
    let colSlope = new Float32Array(0);
    let colPool = new Float32Array(0);
    let fog = new Float32Array(0);
    let fogWidth = 1;
    let fogHeight = 1;
    let ceiling = 0;
    let fadeTo = 1;

    let raf = 0;
    let visible = true;
    let awake = true;
    let lastDraw = 0;
    let lastTick = performance.now();
    let targetX = 0;
    let targetY = 0;
    let easedX = 0;
    let easedY = 0;
    let inside = false;
    let clear = 0;
    let parallaxTarget = 0;
    let parallax = 0;

    const layout = () => {
      const rect = root.getBoundingClientRect();
      step = Math.max(1, Math.round(pixel));
      cols = Math.max(8, Math.ceil(rect.width / step));
      rows = Math.max(8, Math.ceil(rect.height / step));
      canvas.width = cols;
      canvas.height = rows;
      canvas.style.width = `${cols * step}px`;
      canvas.style.height = `${rows * step}px`;
      image = ctx.createImageData(cols, rows);
      buffer = new Uint32Array(image.data.buffer);
      margin = Math.ceil(cols * 0.045) + 3;
      ceiling = Math.max(rows * 0.03, 10 / step);
      fadeTo = Math.max(rows * 0.1, 38 / step);
      tops = [];
      pools = [];

      // Stretch the range upward from the bottom so the crests climb close to
      // the legal line, then keep the tips from breaking through the top edge.
      const stretch = 1.35;

      for (let layer = 0; layer < layers; layer++) {
        const line = ridgeLine(cols, rows, layer, layers, seed, margin);
        for (let x = 0; x < line.length; x++) {
          line[x] = rows - (rows - line[x]) * stretch;
          if (line[x] < ceiling) {
            line[x] = ceiling - (ceiling - line[x]) * 0.2;
          }
        }
        const pool = new Float32Array(line.length);
        for (let x = 0; x < line.length; x++) {
          pool[x] =
            0.45 +
            1.1 *
              ridgeFbm(((x - margin) / cols) * 4, layer * 5.3, seed + 9, 2);
        }
        tops.push(line);
        pools.push(pool);
      }

      colTop = new Float32Array(layers * cols);
      colSlope = new Float32Array(layers * cols);
      colPool = new Float32Array(layers * cols);
      fogWidth = (cols >> 1) + 2;
      fogHeight = (rows >> 1) + 2;
      fog = new Float32Array(fogWidth * fogHeight);
      awake = true;
    };

    const draw = (now) => {
      if (!image) return;

      const dt = Math.min(64, now - lastTick);
      lastTick = now;
      const age = revealAt.current === null ? -1 : now - revealAt.current;

      const ease = 1 - Math.pow(0.82, dt / 16.7);
      const slow = 1 - Math.pow(0.93, dt / 16.7);
      easedX += (targetX - easedX) * ease;
      easedY += (targetY - easedY) * ease;
      clear += ((inside && !reduced ? 1 : 0) - clear) * slow;
      parallax += ((reduced ? 0 : parallaxTarget) - parallax) * slow;

      const fogTime =
        (reduced ? 0 : (now / 1000) * 0.045 * Math.max(0, drift)) + 0;
      const sx = 9 / cols;
      const sy = 4.4 / rows;

      for (let gy = 0; gy < fogHeight; gy++) {
        const ny = gy * sy;
        for (let gx = 0; gx < fogWidth; gx++) {
          const nx = gx * sx + fogTime;
          const warp =
            ridgeNoise(nx * 0.45 - fogTime * 0.6, ny * 0.8, 77) * 0.6;
          const value = ridgeFbm(nx + warp, ny + warp * 0.4, 31, 3);
          fog[gy * fogWidth + gx] = ridgeSmooth(0.3, 0.74, value);
        }
      }

      const reveal = new Float32Array(layers);
      const depth = new Float32Array(layers);
      const toneBase = new Float32Array(layers);
      const fogDepth = new Float32Array(layers);

      for (let layer = 0; layer < layers; layer++) {
        depth[layer] = layer / (layers - 1);
        reveal[layer] =
          age < 0 ? 0 : ridgeEase((age - 380 - layer * 170) / 1300);
        toneBase[layer] = 0.16 + 0.76 * Math.pow(depth[layer], 1.6);
        fogDepth[layer] = rows * (0.08 + 0.42 * depth[layer]);

        const rise = (1 - reveal[layer]) * rows * 0.09;
        const shift = Math.round(
          parallax * (0.25 + depth[layer]) * 0.75 * (margin - 3),
        );
        const line = tops[layer];
        const last = line.length - 1;

        for (let x = 0; x < cols; x++) {
          const at = x + margin + shift;
          colTop[layer * cols + x] = line[at] + rise;
          colSlope[layer * cols + x] =
            line[Math.min(last, at + 2)] - line[Math.max(0, at - 2)];
          colPool[layer * cols + x] = fogDepth[layer] * pools[layer][at];
        }
      }

      const lift = age < 0 ? 1 : 1 - ridgeEase((age - 900) / 1800);
      const mistAmount = Math.max(0, Math.min(1, mist));
      const brush = Math.max(1, radius / step);
      const brush2 = brush * brush;

      for (let y = 0; y < rows; y++) {
        const fade = ridgeSmooth(0, fadeTo, y);
        const fogRow = (y >> 1) * fogWidth;
        const bayerRow = (y & 7) * 8;
        const dy = (y - easedY) * 1.5;

        for (let x = 0; x < cols; x++) {
          let layer = -1;
          for (let i = layers - 1; i >= 0; i--) {
            if (y >= colTop[i * cols + x]) {
              layer = i;
              break;
            }
          }

          let tone = 0;
          let mask = 0.3;

          if (layer >= 0) {
            const k = depth[layer];
            const d = y - colTop[layer * cols + x];
            const pool = colPool[layer * cols + x];
            const crest = 1 - ridgeSmooth(0, pool, d) * (0.88 - 0.45 * k);
            tone = toneBase[layer] * crest;

            const slope = colSlope[layer * cols + x] * 0.06;
            tone +=
              (slope < -0.2 ? -0.2 : slope > 0.2 ? 0.2 : slope) *
              (1 - ridgeSmooth(0, pool * 0.5, d));
            tone +=
              (ridgeHash(
                x + Math.round(colTop[layer * cols + x] * 7),
                d | 0,
                layer,
              ) -
                0.5) *
              0.07 *
              k;
            tone *= reveal[layer];
            mask = 0.95 - 0.5 * k;
          } else {
            tone = 0.05 * ridgeSmooth(rows * 0.15, rows * 0.6, y);
          }

          let fogAmount = fog[fogRow + (x >> 1)] * mistAmount * mask;

          if (clear > 0.01) {
            const dx = x - easedX;
            const q = (dx * dx + dy * dy) / brush2;
            if (q < 4) {
              const clearing = clear * Math.exp(-q);
              fogAmount *= 1 - clearing * 0.92;
              if (layer >= 0) tone += clearing * 0.16 * reveal[layer];
            }
          }

          if (tone > 0.93) tone = 0.93;
          fogAmount += lift * 0.55;
          if (fogAmount > 1) fogAmount = 1;
          tone = (tone * (1 - fogAmount) + 0.09 * fogAmount * (1 - lift)) * fade;

          buffer[y * cols + x] =
            palette[
              ridgeDither(tone, toneCount, RIDGE_BAYER[bayerRow + (x & 7)])
            ];
        }
      }

      ctx.putImageData(image, 0, 0);

      const settling =
        Math.abs(targetX - easedX) + Math.abs(targetY - easedY) > 0.05 ||
        Math.abs((inside && !reduced ? 1 : 0) - clear) > 0.005 ||
        Math.abs((reduced ? 0 : parallaxTarget) - parallax) > 0.001;

      awake =
        (age >= 0 && age < 3400) ||
        age < 0 ||
        settling ||
        (!reduced && drift > 0);
    };

    const busy = () => {
      const age =
        revealAt.current === null ? -1 : performance.now() - revealAt.current;
      return (
        (age >= 0 && age < 3400) ||
        inside ||
        Math.abs(parallaxTarget - parallax) > 0.001
      );
    };

    const loop = (now) => {
      raf = 0;
      if (!visible) return;
      if (revealAt.current === null) {
        raf = requestAnimationFrame(loop);
        return;
      }
      if (busy() || now - lastDraw > 32) {
        draw(now);
        lastDraw = now;
      }
      if (awake) raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      awake = true;
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const onMove = (event) => {
      const rect = root.getBoundingClientRect();
      parallaxTarget =
        rect.width > 0 ? ((event.clientX - rect.left) / rect.width) * 2 - 1 : 0;
      const x = (event.clientX - rect.left) / step;
      const y = (event.clientY - rect.top) / step;
      const wasInside = inside;
      inside = x >= 0 && y >= 0 && x < cols && y < rows;
      targetX = x;
      targetY = y;
      if (inside && !wasInside) {
        easedX = targetX;
        easedY = targetY;
      }
      wake();
    };

    const onLeave = () => {
      parallaxTarget = 0;
      inside = false;
      wake();
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        if (revealAt.current === null) {
          revealAt.current = reduced ? -Infinity : performance.now();
        }
        wake();
        revealObserver.disconnect();
      },
      { threshold: 0.2 },
    );
    revealObserver.observe(root);

    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) {
        lastTick = performance.now();
        wake();
      }
    });
    visibilityObserver.observe(root);

    const resizeObserver = new ResizeObserver(() => {
      layout();
      draw(performance.now());
      wake();
    });
    resizeObserver.observe(root);

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    layout();
    draw(performance.now());
    wake();

    return () => {
      cancelAnimationFrame(raf);
      revealObserver.disconnect();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [seed, ridges, pixel, mist, drift, radius]);

  return (
    <div ref={rootRef} className="footer-ridges" aria-hidden="true">
      <canvas ref={canvasRef} className="footer-ridges__canvas" />
    </div>
  );
}