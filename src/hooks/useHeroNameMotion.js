import { useEffect } from "react";

/*
  Magnetic character hover for the hero name.

  Every letter nudges away from the pointer, lifts, tilts and warms toward the
  accent colour. The motion is spring-decayed so it settles instead of snapping.
  Only enabled for fine pointers and when reduced motion is not requested.
*/
export default function useHeroNameMotion(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return undefined;

    const chars = [...root.querySelectorAll(".hero__char")].map((element) => ({
      element,
      mask: element.closest(".hero__char-mask") ?? element,
      cx: 0,
      cy: 0,
      x: 0,
      y: 0,
      rot: 0,
      scale: 1,
      accent: 0,
      tx: 0,
      ty: 0,
      trot: 0,
      tscale: 1,
      taccent: 0,
    }));

    let active = false;
    let raf = 0;
    let velocity = 0;
    let lastX = 0;

    const measure = () => {
      for (const char of chars) {
        const rect = char.mask.getBoundingClientRect();
        char.cx = rect.left + rect.width / 2;
        char.cy = rect.top + rect.height / 2;
      }
    };

    const settle = () => {
      let moving = false;
      const ease = active ? 0.2 : 0.12;

      velocity *= 0.86;
      if (Math.abs(velocity) < 0.05) velocity = 0;

      for (const char of chars) {
        char.x += (char.tx - char.x) * ease;
        char.y += (char.ty - char.y) * ease;
        char.rot += (char.trot - char.rot) * ease;
        char.scale += (char.tscale - char.scale) * ease;
        char.accent += (char.taccent - char.accent) * ease;

        const settled =
          Math.abs(char.tx - char.x) < 0.04 &&
          Math.abs(char.ty - char.y) < 0.04 &&
          Math.abs(char.trot - char.rot) < 0.02 &&
          Math.abs(char.tscale - char.scale) < 0.001 &&
          Math.abs(char.taccent - char.accent) < 0.003;

        if (settled) {
          char.x = char.tx;
          char.y = char.ty;
          char.rot = char.trot;
          char.scale = char.tscale;
          char.accent = char.taccent;
        } else {
          moving = true;
        }

        char.element.style.setProperty("--char-x", `${char.x.toFixed(2)}px`);
        char.element.style.setProperty("--char-y", `${char.y.toFixed(2)}px`);
        char.element.style.setProperty("--char-rot", `${char.rot.toFixed(2)}deg`);
        char.element.style.setProperty("--char-scale", char.scale.toFixed(3));
        char.element.style.setProperty("--char-accent", char.accent.toFixed(3));
      }

      raf = moving ? requestAnimationFrame(settle) : 0;
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(settle);
    };

    const resetTargets = () => {
      for (const char of chars) {
        char.tx = 0;
        char.ty = 0;
        char.trot = 0;
        char.tscale = 1;
        char.taccent = 0;
      }
    };

    const onMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      const delta = x - lastX;
      lastX = x;
      velocity = Math.max(-28, Math.min(28, velocity * 0.6 + delta * 0.4));

      const radiusX = Math.min(280, window.innerWidth * 0.24);
      const radiusY = 190;

      for (const char of chars) {
        const dx = x - char.cx;
        const dy = y - char.cy;
        const distance = Math.hypot(dx / radiusX, dy / radiusY);

        if (distance < 1) {
          const strength = 0.5 * (1 + Math.cos(Math.PI * distance));
          char.tx = -(dx / radiusX) * 5.5 * strength;
          char.ty = -22 * strength;
          char.trot = -(dx / radiusX) * 5.5 * strength + velocity * 0.12 * strength;
          char.tscale = 1 + 0.08 * strength;
          char.taccent = Math.pow(strength, 1.25);
        } else {
          char.tx = 0;
          char.ty = 0;
          char.trot = 0;
          char.tscale = 1;
          char.taccent = 0;
        }
      }

      wake();
    };

    const onEnter = (event) => {
      active = true;
      lastX = event.clientX;
      measure();
      onMove(event);
    };

    const onLeave = () => {
      active = false;
      resetTargets();
      wake();
    };

    const onScroll = () => {
      if (active) measure();
    };

    root.addEventListener("pointerenter", onEnter, { passive: true });
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave, { passive: true });
    root.addEventListener("pointercancel", onLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    document.fonts?.ready.then(measure);

    return () => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
      for (const char of chars) {
        char.element.style.removeProperty("--char-x");
        char.element.style.removeProperty("--char-y");
        char.element.style.removeProperty("--char-rot");
        char.element.style.removeProperty("--char-scale");
        char.element.style.removeProperty("--char-accent");
      }
    };
  }, [ref]);
}