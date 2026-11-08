/*
  Port of the portfolio's original inline motion scripts.

  The CSS drives most of the animation with scroll-driven timelines. This module
  supplies the measurements those timelines depend on, plus the progressive
  enhancements the original page had: smooth wheel scrolling, reveal classes,
  word splitting, and pausing offscreen animations.

  Call initSiteMotion() once after the app has mounted. It returns a cleanup
  function.
*/

export function initSiteMotion() {
  const cleanups = [];
  const sheet = (css) => {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(css);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
    return styleSheet;
  };
  const add = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };

  const live = document.documentElement.hasAttribute("data-8b-live");
  const measures = new Set();
  let queued = false;

  const run = (fn) => {
    try {
      fn();
    } catch (error) {
      console.error("[motion-kit] measure failed", error);
    }
  };

  const realign = () =>
    document.getAnimations().forEach((animation) => {
      if (
        animation.timeline &&
        animation.timeline !== document.timeline &&
        animation.playState === "running"
      ) {
        animation.pause();
        animation.play();
      }
    });

  const remeasure = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      measures.forEach(run);
      realign();
    });
  };

  window.motionKit = {
    live,
    box(element) {
      if (!(element instanceof HTMLElement)) {
        const rect = element.getBoundingClientRect();
        return {
          x: rect.left + scrollX,
          y: rect.top + scrollY,
          w: rect.width,
          h: rect.height,
        };
      }
      let x = 0;
      let y = 0;
      let node = element;
      while (node) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent;
      }
      return { x, y, w: element.offsetWidth, h: element.offsetHeight };
    },
    set(element, vars) {
      for (const [name, value] of Object.entries(vars)) {
        element.style.setProperty(name, String(value));
      }
    },
    measure(fn) {
      if (!live) return;
      measures.add(fn);
      run(fn);
    },
    scene(id, fn) {
      if (!live) return;
      try {
        fn();
      } catch (error) {
        console.error(
          `[motion-kit] scene ${id} failed; its section stays static`,
          error,
        );
        document
          .querySelector(`style[data-8b-part="scene:${id}"]`)
          ?.setAttribute("media", "not all");
      }
    },
  };

  cleanups.push(() => {
    delete window.motionKit;
  });

  if (!live) {
    window.motionReady = Promise.resolve();
    return () => cleanups.forEach((fn) => fn());
  }

  /* ---------- numbering ---------- */
  const number = () =>
    document.querySelectorAll("[data-8b-items]").forEach((group) => {
      let items;
      try {
        items = [...group.querySelectorAll(group.getAttribute("data-8b-items"))];
      } catch {
        return;
      }
      items.forEach((item, index) => {
        item.style.setProperty("--i", index);
        item.style.setProperty("--n", items.length);
      });
    });

  number();
  measures.add(number);
  requestAnimationFrame(realign);

  const resizeObserver = new ResizeObserver(remeasure);
  resizeObserver.observe(document.body);
  cleanups.push(() => resizeObserver.disconnect());

  document.fonts?.ready.then(remeasure);
  add(window, "load", remeasure);

  window.motionReady = (document.fonts?.ready ?? Promise.resolve()).then(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );

  /* ---------- smooth wheel scrolling ---------- */
  if (matchMedia("(pointer: fine)").matches) {
    let target = scrollY;
    let current = scrollY;
    let last = 0;
    let running = false;
    let paused = false;

    const inner = (node, dy) => {
      for (
        ;
        node && node !== document.body && node !== document.documentElement;
        node = node.parentElement
      ) {
        if (
          !/(auto|scroll)/.test(getComputedStyle(node).overflowY) ||
          node.scrollHeight <= node.clientHeight
        ) {
          continue;
        }
        if (
          dy > 0
            ? node.scrollTop + node.clientHeight < node.scrollHeight - 1
            : node.scrollTop > 0
        ) {
          return true;
        }
      }
      return false;
    };

    const step = (now) => {
      current +=
        (target - current) *
        (1 - Math.exp(-5.3 * Math.min(0.05, (now - last) / 1000)));
      last = now;
      if (Math.abs(target - current) < 0.5) current = target;
      scrollTo({ top: current, behavior: "instant" });
      if (current !== target) requestAnimationFrame(step);
      else running = false;
    };

    add(
      window,
      "wheel",
      (event) => {
        if (
          paused ||
          event.ctrlKey ||
          Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
          inner(event.target, event.deltaY)
        ) {
          return;
        }
        event.preventDefault();
        if (!running) target = current = scrollY;
        const unit =
          event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? innerHeight : 1;
        target = Math.max(
          0,
          Math.min(
            document.documentElement.scrollHeight - innerHeight,
            target + event.deltaY * unit * 0.95,
          ),
        );
        if (!running) {
          running = true;
          last = performance.now();
          requestAnimationFrame(step);
        }
      },
      { passive: false },
    );

    window.motionKit.wheel = {
      stop() {
        paused = true;
      },
      start() {
        paused = false;
      },
    };
  }

  /* ---------- reveal on scroll ---------- */
  const enterAt = (element) => {
    const own = /^(\d{1,3}(?:\.\d+)?)%$/.exec(
      (element.getAttribute("data-8b-enter") || "").trim(),
    );
    return own && +own[1] <= 100 ? own[1] / 100 : 0.88;
  };

  let pendingReveal = [...document.querySelectorAll("[data-8b-motion]")].map(
    (element) => ({ element, y: 0, at: enterAt(element) }),
  );
  let revealQueued = false;

  const checkReveal = () => {
    revealQueued = false;
    pendingReveal = pendingReveal.filter((item) => {
      if (item.y > scrollY + innerHeight * item.at) return true;
      item.element.classList.add("is-in");
      return false;
    });
  };

  const queueReveal = () => {
    if (!revealQueued) {
      revealQueued = true;
      requestAnimationFrame(checkReveal);
    }
  };

  window.motionKit.measure(() => {
    pendingReveal.forEach((item) => {
      item.y = window.motionKit.box(item.element).y;
    });
    queueReveal();
  });
  add(window, "scroll", queueReveal, { passive: true });

  /* ---------- word splitting ---------- */
  const splitSheet = sheet(
    '.line{display:block;overflow:clip;padding-block:.12em;margin-block:-.12em}.line:not(:last-child){margin-bottom:0}.line+.line{margin-top:-.24em}.line+.line>.line__in{text-indent:0}:where(h1,h2,h3,h4,h5,h6,p,div,blockquote,figcaption,dd,dt):where([data-8b-split="lines"]:has(>.line)){display:flow-root}.line__in{display:block}.kit-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}',
  );
  cleanups.push(() => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (item) => item !== splitSheet,
    );
  });

  const sources = new WeakMap();
  const widths = new WeakMap();
  const graphemes =
    typeof Intl.Segmenter === "function"
      ? (text) =>
          [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].map(
            (part) => part.segment,
          )
      : (text) => [...text];

  const makeSpan = (className, text) => {
    const element = document.createElement("span");
    element.className = className;
    if (text != null) element.textContent = text;
    return element;
  };

  const split = (element) => {
    const mode = element.getAttribute("data-8b-split");
    if (sources.has(element)) element.innerHTML = sources.get(element);
    else sources.set(element, element.innerHTML);

    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);

    let index = 0;
    for (const node of texts) {
      const fragment = document.createDocumentFragment();
      for (const piece of node.data.split(/(\s+)/)) {
        if (!piece) continue;
        if (/^\s+$/.test(piece)) {
          fragment.append(piece);
          continue;
        }
        const word = makeSpan("w");
        if (mode === "chars") {
          word.setAttribute("aria-hidden", "true");
          for (const character of graphemes(piece)) {
            const char = makeSpan("c", character);
            char.style.setProperty("--i", index++);
            word.append(char);
          }
        } else {
          word.textContent = piece;
          if (mode === "words") word.style.setProperty("--i", index++);
        }
        fragment.append(word);
      }
      node.replaceWith(fragment);
    }

    if (mode === "chars") {
      element.append(
        makeSpan("kit-sr", element.textContent.replace(/\s+/g, " ").trim()),
      );
    }

    if (mode === "lines") {
      const lines = [];
      let top = null;
      for (const child of [...element.childNodes]) {
        const probe = child.nodeType === 1 ? child : null;
        const at = probe ? probe.getBoundingClientRect().top : top;
        if (probe && (top === null || Math.abs(at - top) > 2)) {
          lines.push([]);
          top = at;
        }
        if (!lines.length) lines.push([]);
        lines.at(-1).push(child);
      }
      lines.forEach((nodes, i) => {
        const line = makeSpan("line");
        const innerSpan = makeSpan("line__in");
        line.style.setProperty("--i", i);
        nodes[0].before(line);
        innerSpan.append(...nodes);
        line.append(innerSpan);
      });
      index = lines.length;
      widths.set(element, element.clientWidth);
    }

    element.style.setProperty("--n", index);
  };

  const pendingSplit = [];
  let splitBusy = false;
  const drain = () => {
    if (splitBusy) return;
    const element = pendingSplit.shift();
    if (!element) return;
    splitBusy = true;
    setTimeout(() => {
      try {
        split(element);
      } catch (error) {
        console.error("[motion-kit] split failed", error);
      }
      splitBusy = false;
      drain();
    }, 0);
  };

  const near = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        near.unobserve(entry.target);
        pendingSplit.push(entry.target);
        drain();
      }),
    { rootMargin: "100% 0px 100% 0px" },
  );
  cleanups.push(() => near.disconnect());

  (document.fonts?.ready ?? Promise.resolve()).then(() =>
    document
      .querySelectorAll("[data-8b-split]")
      .forEach((element) => near.observe(element)),
  );

  window.motionKit.measure(() =>
    document.querySelectorAll('[data-8b-split="lines"]').forEach((element) => {
      if (
        sources.has(element) &&
        widths.get(element) !== element.clientWidth
      ) {
        pendingSplit.push(element);
        drain();
      }
    }),
  );

  /* ---------- pause offscreen animations ---------- */
  const offSheet = sheet(
    "[data-8b-off],[data-8b-off]::before,[data-8b-off]::after{animation-play-state:paused!important}",
  );
  cleanups.push(() => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (item) => item !== offSheet,
    );
  });

  const watch = new IntersectionObserver((entries) =>
    entries.forEach((entry) =>
      entry.target.toggleAttribute("data-8b-off", !entry.isIntersecting),
    ),
  );
  cleanups.push(() => watch.disconnect());

  const watched = new WeakSet();
  const scan = () =>
    document.getAnimations().forEach((animation) => {
      const element = animation.effect?.target;
      if (
        !element ||
        watched.has(element) ||
        animation.effect.getTiming().iterations !== Infinity ||
        animation.timeline !== document.timeline
      ) {
        return;
      }
      watched.add(element);
      watch.observe(element);
    });

  scan();
  add(window, "load", scan);
  add(document, "animationstart", scan, true);

  /* ---------- footer visibility ---------- */
  if ("IntersectionObserver" in window) {
    const footer = document.getElementById("footer");
    if (footer) {
      const io = new IntersectionObserver(([entry]) =>
        footer.classList.toggle("is-offscreen", !entry.isIntersecting),
      );
      io.observe(footer);
      cleanups.push(() => io.disconnect());
    }
  }

  /* ---------- scenes ---------- */
  window.motionKit.scene("work", () => {
    const work = document.getElementById("work");
    const stage = work.querySelector(".work__stage");
    const frame = work.querySelector(".work__window");
    const track = work.querySelector(".work__track");
    const left = (element) => {
      let x = 0;
      for (let node = element; node; node = node.offsetParent) x += node.offsetLeft;
      return x;
    };

    window.motionKit.measure(() => {
      const run = Math.max(
        0,
        track.offsetWidth -
          (work.clientWidth - 2 * parseFloat(getComputedStyle(stage).paddingLeft)),
      );
      window.motionKit.set(work, {
        "--run": `${Math.round(run)}px`,
        "--work-run": `${run.toFixed(2)}px`,
      });
      const radius = innerWidth < 700 ? innerWidth * 2.1 : innerWidth * 0.95;
      const origin = left(frame);
      track.querySelectorAll(".case").forEach((card) => {
        const offset =
          origin +
          card.offsetLeft +
          card.offsetWidth / 2 -
          run -
          innerWidth / 2;
        const angle = offset / radius;
        window.motionKit.set(card, {
          "--work-x": `${(radius * Math.sin(angle) - offset).toFixed(2)}px`,
          "--work-y": `${(radius * (1 - Math.cos(angle))).toFixed(2)}px`,
          "--work-r": `${((angle * 180) / Math.PI).toFixed(3)}deg`,
        });
      });
    });
  });

  window.motionKit.scene("again", () => {
    const again = document.getElementById("again");
    const stage = again.querySelector(".again__stage");
    const head = again.querySelector(".again__head");
    const wheel = again.querySelector(".again__wheel");

    window.motionKit.measure(() => {
      const count = wheel.querySelectorAll(".partner").length;
      const width = innerWidth;
      const height = stage.offsetHeight;
      const headBottom = head.offsetTop + head.offsetHeight;
      const room = height - headBottom - innerHeight * 0.04;
      const card = Math.max(
        180,
        Math.min(width * (width < 700 ? 0.7 : 0.28), (room - 32) / 1.25),
      );
      const arcTop = headBottom + Math.max(28, (room - card * 1.25) * 0.4);
      const radius = Math.max(width * 0.95, card * 3.3);
      const step =
        ((2 * Math.asin((card + Math.max(18, width * 0.024)) / (2 * radius))) *
          180) /
        Math.PI;

      window.motionKit.set(again, {
        "--card": `${card.toFixed(1)}px`,
        "--radius": `${radius.toFixed(1)}px`,
        "--step": `${step.toFixed(3)}deg`,
        "--arc-top": `${arcTop.toFixed(1)}px`,
        "--spin": `${Math.round(count * innerHeight * 0.42)}px`,
        "--again-from": `${(step * 0.55).toFixed(3)}deg`,
        "--again-to": `${(-(count - 0.45) * step).toFixed(3)}deg`,
        "--again-swing-r": `${Math.max(
          4,
          (Math.asin(Math.min(1, (width * 0.3) / radius)) * 180) / Math.PI -
            step * 0.55,
        ).toFixed(3)}deg`,
        "--again-swing-y": `${(-(arcTop - 40)).toFixed(2)}px`,
      });
    });
  });

  return () => {
    measures.clear();
    cleanups.forEach((fn) => {
      try {
        fn();
      } catch (error) {
        console.error("[motion-kit] cleanup failed", error);
      }
    });
  };
}