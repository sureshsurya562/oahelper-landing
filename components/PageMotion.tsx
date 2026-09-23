"use client";

import { useEffect } from "react";

/**
 * One rAF for everything the design drives outside the two sticky scenes:
 * [data-rv] reveals, the counting stats, the ticker marquee, the drifting
 * close stickers, and the paper-coloured pixel band above the proof section.
 */
export default function PageMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const out = (t: number) => 1 - Math.pow(1 - t, 3);

    const rv = Array.from(document.querySelectorAll<HTMLElement>("[data-rv]"));
    const counts = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    const stickers = Array.from(document.querySelectorAll<HTMLElement>(".cl-st"));
    const tick = document.querySelector<HTMLElement>(".pf-tick-move");
    const dot = document.querySelector<HTMLElement>(".pf-tick-tag i");
    const pf = document.querySelector<HTMLElement>(".pf");
    const band = document.querySelector<HTMLCanvasElement>(".pf-band");

    // Arming is what hides the revealed blocks; until this line they render as-is.
    document.documentElement.classList.add("rv-armed");

    const started = new Map<HTMLElement, number>();
    const painted = new WeakMap<HTMLElement, number>();
    let seed: number[] = [];
    let bandSh: number | null = null;
    let bandDirty = true;
    const markDirty = () => {
      bandDirty = true;
    };
    window.addEventListener("resize", markDirty);

    /** Mirror of the See/Solve/Clear band, drawn in paper so it dissolves back to dark. */
    const drawBand = (c: HTMLCanvasElement, shift: number) => {
      const w = c.clientWidth;
      const h = 220;
      if (!w) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (c.width !== Math.round(w * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      const b = w < 640 ? 10 : 14;
      const cols = Math.ceil(w / b);
      const rows = Math.ceil(h / b);
      if (seed.length !== cols * rows) {
        let x = 7654321;
        const rnd = () => (x = (x * 16807) % 2147483647) / 2147483647;
        seed = Array.from({ length: cols * rows }, rnd);
      }
      const g = c.getContext("2d");
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      g.fillStyle = "#f3efe6";
      for (let r = 0; r < rows; r++) {
        const v = (r + 0.5) / rows;
        const amp = 0.85 * Math.sin(Math.PI * v);
        for (let k = 0; k < cols; k++) {
          if (v + (seed[r * cols + k] - 0.5) * amp + shift <= 0.55) g.fillRect(k * b, r * b, b, b);
        }
      }
    };

    let tkx = 0;
    let lastT = 0;
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (lastT || now)) / 1000);
      lastT = now;
      const vh = window.innerHeight;

      if (pf && band) {
        const pr = pf.getBoundingClientRect();
        if (pr.top < vh + 40 && pr.top > -260) {
          const sh = Math.round((cl((vh - pr.top) / (vh + 220)) * 0.4 - 0.2) * 48) / 48;
          if (sh !== bandSh || bandDirty) {
            bandSh = sh;
            bandDirty = false;
            drawBand(band, sh);
          }
        }
      }

      rv.forEach((el) => {
        let t0 = started.get(el);
        if (t0 == null) {
          const r = el.getBoundingClientRect();
          if (r.top < vh * 0.9 && r.bottom > 0) {
            t0 = now + (Number(el.dataset.rvDelay) || 0);
            started.set(el, t0);
          }
        }
        const k = t0 == null ? 0 : reduced ? 1 : out(cl((now - t0) / 850));
        if (painted.get(el) === k) return;
        painted.set(el, k);
        el.style.opacity = String(k);
        el.style.transform = k >= 1 ? "none" : `translate3d(0,${(1 - k) * 36}px,0)`;
      });

      counts.forEach((el) => {
        const holder = el.closest<HTMLElement>("[data-rv]");
        const t0 = holder ? started.get(holder) : undefined;
        const k = t0 == null ? 0 : reduced ? 1 : out(cl((now - t0 - 120) / 1500));
        const txt = Math.round(Number(el.dataset.count) * k) + (el.dataset.suffix || "");
        if (el.textContent !== txt) el.textContent = txt;
      });

      if (!reduced && tick) {
        const half = tick.scrollWidth / 2;
        tkx = (tkx + dt * 38) % (half || 1);
        tick.style.transform = `translate3d(${-tkx}px,0,0)`;
        if (dot) dot.style.opacity = String(0.45 + 0.55 * (0.5 + 0.5 * Math.sin(now / 260)));
      }

      const T = now / 1000;
      stickers.forEach((el, i) => {
        const r = Number(el.dataset.rot) || 0;
        const f = reduced ? 0 : 1;
        el.style.transform = `translate(-50%,-50%) translateY(${f * 6 * Math.sin(T * (0.6 + i * 0.07) + i * 1.9)}px) rotate(${
          r + f * 1.4 * Math.sin(T * 0.8 + i)
        }deg)`;
      });
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", markDirty);
      document.documentElement.classList.remove("rv-armed");
    };
  }, []);

  return null;
}
