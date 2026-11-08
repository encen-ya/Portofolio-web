import { useEffect, useRef } from "react";

/*
  A small 3D particle "forge": a glossy sphere wrapped in dense dotted orbits.
  The range is generated from a seed, rotates slowly on its own, and can be
  dragged to spin or clicked to reforge a new set of rings.

  Canvas 2D keeps it dependency free. Geometry is normalised to roughly a unit
  sphere, so resizing only changes the projection scale.
*/

const TAU = Math.PI * 2;

const TONES = [
  { color: "rgba(64, 98, 255, 0.2)", size: 0.8 },
  { color: "rgba(90, 132, 255, 0.34)", size: 1 },
  { color: "rgba(130, 172, 255, 0.5)", size: 1.2 },
  { color: "rgba(198, 224, 255, 0.66)", size: 1.4 },
];

const DOT_TONES = [
  "rgba(214, 232, 255, 0.08)",
  "rgba(226, 240, 255, 0.16)",
  "rgba(242, 249, 255, 0.3)",
];

function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildScene(seed) {
  const rng = mulberry32(seed);
  const points = [];
  const rings = 8 + Math.floor(rng() * 2);

  for (let ring = 0; ring < rings; ring++) {
    // Build the ring's plane from a normal that leans toward the camera. The
    // in-plane circle stays round (no squash); only its projection is an
    // ellipse, so the range reads as an open 3D cage instead of a flat disc.
    const theta =
      0.45 + (ring / Math.max(1, rings - 1)) * 0.78 + (rng() - 0.5) * 0.14;
    const phi = ring * 2.399963 + (rng() - 0.5) * 0.4;
    const nx = Math.sin(theta) * Math.cos(phi);
    const ny = Math.sin(theta) * Math.sin(phi);
    const nz = Math.cos(theta) * (rng() < 0.5 ? -1 : 1);

    // In-plane basis: u = normal x up, v = normal x u.
    let ux = -nz;
    let uy = 0;
    let uz = nx;
    const ul = Math.hypot(ux, uy, uz) || 1;
    ux /= ul;
    uz /= ul;
    const vx = ny * uz - nz * uy;
    const vy = nz * ux - nx * uz;
    const vz = nx * uy - ny * ux;

    // Stagger radii across the ladder so the rings open outward in steps.
    const radius =
      0.6 + (ring / Math.max(1, rings - 1)) * 0.36 + (rng() - 0.5) * 0.1;
    const roundness = 0.97 + rng() * 0.03;
    const thickness = 0.014 + rng() * 0.038;
    const count = Math.round(290 + radius * 330 + rng() * 130);
    const phase = rng() * TAU;
    const wobble = rng() < 0.5;
    const scatter = 0.012 + rng() * 0.026;

    for (let i = 0; i < count; i++) {
      const angle = phase + (i / count) * TAU;
      const grain = 1 + (rng() - 0.5) * (wobble ? 0.07 : 0.02);
      const along = Math.cos(angle) * radius * grain;
      const across = Math.sin(angle) * radius * roundness * grain;
      const lift = (rng() - 0.5) * thickness * (rng() < 0.12 ? 3 : 1);
      const fuzz = (rng() - 0.5) * scatter;

      points.push({
        x: ux * along + vx * (across + fuzz) + nx * lift,
        y: uy * along + vy * (across + fuzz) + ny * lift,
        z: uz * along + vz * (across + fuzz) + nz * lift,
        shade: rng(),
      });
    }
  }

  // A little loose dust around the range.
  for (let i = 0; i < 110; i++) {
    const theta = rng() * TAU;
    const y = rng() * 2 - 1;
    const r = Math.sqrt(1 - y * y);
    const radius = 0.42 + rng() * 0.7;
    points.push({
      x: Math.cos(theta) * r * radius,
      y: y * radius,
      z: Math.sin(theta) * r * radius,
      shade: rng() * 0.55,
    });
  }

  const guides = Array.from({ length: 9 }, () => ({
    angle: rng() * TAU,
    inner: 0.36 + rng() * 0.12,
    outer: 0.66 + rng() * 0.32,
    alpha: 0.04 + rng() * 0.05,
  }));

  return { points, guides };
}

function buildSphereDots() {
  const rng = mulberry32(1967);
  const dots = [];
  const count = 460;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    dots.push({
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
      shade: rng(),
    });
  }
  return dots;
}

export default function AboutOrbit() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sphereDots = buildSphereDots();
    const maxDpr = 2;

    let seed = 47;
    let scene = buildScene(seed);
    let size = 1;
    let cx = 0;
    let cy = 0;
    let dpr = 1;
    let rx = -0.26;
    let ry = 0.62;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let moved = 0;
    let downAt = 0;
    let flashAt = -1000;

    const back = [[], [], [], []];
    const front = [[], [], [], []];
    const dotBuckets = [[], [], []];

    const layout = () => {
      const width = root.clientWidth || 1;
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      size = width;
      cx = size / 2;
      cy = size / 2;
      canvas.width = Math.max(1, Math.round(size * dpr));
      canvas.height = Math.max(1, Math.round(size * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawSphere = (cosX, sinX, cosY, sinY) => {
      const r = size * 0.098;
      const halo = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 2.4);
      halo.addColorStop(0, "rgba(92, 132, 255, 0.16)");
      halo.addColorStop(1, "rgba(92, 132, 255, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.4, 0, TAU);
      ctx.fill();

      const body = ctx.createRadialGradient(
        cx - r * 0.36,
        cy - r * 0.4,
        r * 0.04,
        cx,
        cy,
        r * 1.05,
      );
      body.addColorStop(0, "#e6f2ff");
      body.addColorStop(0.16, "#a8c6ee");
      body.addColorStop(0.42, "#5274a6");
      body.addColorStop(0.72, "#172640");
      body.addColorStop(1, "#070c15");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU);
      ctx.fill();

      // A cool bounce-light rim on the shadow side rounds out the silhouette.
      const rim = ctx.createRadialGradient(
        cx + r * 0.5,
        cy + r * 0.55,
        r * 0.1,
        cx + r * 0.42,
        cy + r * 0.46,
        r * 1.05,
      );
      rim.addColorStop(0, "rgba(120, 170, 255, 0)");
      rim.addColorStop(0.68, "rgba(120, 170, 255, 0)");
      rim.addColorStop(1, "rgba(120, 170, 255, 0.26)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU);
      ctx.fill();

      // Halftone dots on the lit face of the sphere.
      for (const bucket of dotBuckets) bucket.length = 0;
      for (let i = 0; i < sphereDots.length; i++) {
        const dot = sphereDots[i];
        const x1 = dot.x * cosY + dot.z * sinY;
        const z1 = -dot.x * sinY + dot.z * cosY;
        const y2 = dot.y * cosX - z1 * sinX;
        const z2 = dot.y * sinX + z1 * cosX;
        if (z2 < -0.08) continue;
        const lit = 0.55 - x1 * 0.4 - y2 * 0.48;
        const bucket = lit > 0.66 ? 2 : lit > 0.34 ? 1 : 0;
        dotBuckets[bucket].push(cx + x1 * r, cy + y2 * r);
      }
      ctx.globalCompositeOperation = "lighter";
      for (let b = 0; b < 3; b++) {
        const list = dotBuckets[b];
        if (!list.length) continue;
        const sizeDot = 0.55 + b * 0.32;
        ctx.beginPath();
        for (let i = 0; i < list.length; i += 2) {
          ctx.moveTo(list[i] + sizeDot, list[i + 1]);
          ctx.arc(list[i], list[i + 1], sizeDot, 0, TAU);
        }
        ctx.fillStyle = DOT_TONES[b];
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      const shine = ctx.createRadialGradient(
        cx - r * 0.38,
        cy - r * 0.44,
        0,
        cx - r * 0.38,
        cy - r * 0.44,
        r * 0.82,
      );
      shine.addColorStop(0, "rgba(255, 255, 255, 0.24)");
      shine.addColorStop(0.26, "rgba(205, 228, 255, 0.07)");
      shine.addColorStop(1, "rgba(214, 232, 255, 0)");
      ctx.fillStyle = shine;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = "rgba(170, 204, 255, 0.24)";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU);
      ctx.stroke();
    };

    const drawBatch = (list, tone) => {
      if (!list.length) return;
      const r = tone.size;
      ctx.beginPath();
      for (let i = 0; i < list.length; i += 2) {
        ctx.moveTo(list[i] + r, list[i + 1]);
        ctx.arc(list[i], list[i + 1], r, 0, TAU);
      }
      ctx.fillStyle = tone.color;
      ctx.fill();
    };

    const render = (now) => {
      ctx.clearRect(0, 0, size, size);

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.56);
      glow.addColorStop(0, "rgba(86, 112, 255, 0.11)");
      glow.addColorStop(0.46, "rgba(62, 82, 210, 0.05)");
      glow.addColorStop(1, "rgba(20, 26, 70, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = "rgba(146, 178, 255, 0.05)";
      ctx.lineWidth = 0.8;
      for (const guide of scene.guides) {
        const a = guide.angle;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(
          cx + Math.cos(a) * size * guide.inner,
          cy + Math.sin(a) * size * guide.inner,
        );
        ctx.lineTo(
          cx + Math.cos(a) * size * guide.outer,
          cy + Math.sin(a) * size * guide.outer,
        );
        ctx.strokeStyle = `rgba(146, 178, 255, ${guide.alpha})`;
        ctx.stroke();
      }

      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const scale = size * 0.42;
      const focal = 6.2;
      const sphereR = size * 0.098;
      const sphereR2 = sphereR * sphereR * 1.04;

      for (const bucket of back) bucket.length = 0;
      for (const bucket of front) bucket.length = 0;

      for (let i = 0; i < scene.points.length; i++) {
        const point = scene.points[i];
        const x1 = point.x * cosY + point.z * sinY;
        const z1 = -point.x * sinY + point.z * cosY;
        const y2 = point.y * cosX - z1 * sinX;
        const z2 = point.y * sinX + z1 * cosX;
        const perspective = focal / (focal - z2);
        const sx = cx + x1 * scale * perspective;
        const sy = cy + y2 * scale * perspective;

        const dx = sx - cx;
        const dy = sy - cy;
        if (z2 < 0 && dx * dx + dy * dy < sphereR2) continue;

        const depth = (z2 + 1) * 0.5;
        const brightness = point.shade * 0.72 + depth * 0.46;
        let bucket = Math.floor(brightness * 3.3);
        if (bucket < 0) bucket = 0;
        else if (bucket > 3) bucket = 3;

        const list = z2 < 0 ? back[bucket] : front[bucket];
        list.push(sx, sy);
      }

      ctx.globalCompositeOperation = "lighter";
      for (let b = 0; b < 4; b++) drawBatch(back[b], TONES[b]);

      ctx.globalCompositeOperation = "source-over";
      drawSphere(cosX, sinX, cosY, sinY);

      ctx.globalCompositeOperation = "lighter";
      for (let b = 0; b < 4; b++) drawBatch(front[b], TONES[b]);
      ctx.globalCompositeOperation = "source-over";

      const flash = now - flashAt;
      if (flash >= 0 && flash < 760) {
        const t = flash / 760;
        ctx.strokeStyle = `rgba(152, 186, 255, ${0.28 * (1 - t)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, sphereR + t * size * 0.42, 0, TAU);
        ctx.stroke();
      }
    };

    const schedule = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const frame = (now) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(64, now - last);
      last = now;
      if (!reduced && !dragging) ry += dt * 0.000075;
      render(now);
      if (!reduced) schedule();
    };

    const reforge = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      scene = buildScene(seed);
      flashAt = performance.now();
      schedule();
    };

    const onPointerDown = (event) => {
      if (event.button > 0) return;
      dragging = true;
      moved = 0;
      downAt = performance.now();
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture?.(event.pointerId);
      schedule();
    };

    const onPointerMove = (event) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      ry += dx * 0.0062;
      rx = Math.max(-1.2, Math.min(1.2, rx + dy * 0.0062));
      if (reduced) schedule();
    };

    const endDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      canvas.releasePointerCapture?.(event.pointerId);
      if (moved < 8 && performance.now() - downAt < 520) reforge();
    };

    const onPointerUp = (event) => endDrag(event);
    const onPointerCancel = (event) => {
      dragging = false;
      canvas.style.cursor = "grab";
      canvas.releasePointerCapture?.(event.pointerId);
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        visible = entries[0] ? entries[0].isIntersecting : true;
        if (visible) {
          last = performance.now();
          schedule();
        }
      },
      { threshold: 0.15 },
    );
    revealObserver.observe(root);

    const resizeObserver = new ResizeObserver(() => {
      layout();
      render(performance.now());
      schedule();
    });
    resizeObserver.observe(root);

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);

    layout();
    render(performance.now());
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      revealObserver.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
    };
  }, []);

  return (
    <div ref={rootRef} className="about-orbit" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="about-orbit__canvas"
        title="Drag to rotate · Click to reforge"
      />
    </div>
  );
}