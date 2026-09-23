"use client";

import { useEffect } from "react";

/**
 * The closing sequence, ported from the design's prFrame(): one loop drives the
 * panel's particle vortex, the caret blink, and the giant footer wordmark.
 *
 * Streaks flow outward from a focus point and wrap back to the middle. The focus
 * follows the cursor while it is over the panel. Scroll velocity feeds a `spin`
 * term that speeds the flow and stretches every streak, so flicking down the
 * page smears the field into motion lines.
 */

/** Weighted palette: mostly mint, then blue, lilac, a little peach. */
const PAL: [string, number][] = [
  ["140,228,168", 0.5],
  ["130,182,255", 0.32],
  ["190,170,255", 0.12],
  ["255,196,150", 0.06],
];

type Pt = { th: number; ph: number; sp: number; len: number; c: string; tw: number; u: number | null };

export default function ClosingFx() {
  useEffect(() => {
    const cv = document.querySelector<HTMLCanvasElement>(".pr-canvas");
    const panel = document.querySelector<HTMLElement>(".pr-panel");
    const caret = document.querySelector<HTMLElement>(".pr-caret");
    const wrap = document.querySelector<HTMLElement>(".fw-wrap");
    const fw = document.querySelector<HTMLElement>(".fw");
    const letters = Array.from(document.querySelectorAll<HTMLElement>(".fw i"));
    if (!cv || !panel) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let seed = 91;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    const N = fine ? 1100 : 480;
    const pts: Pt[] = [];
    for (let i = 0; i < N; i++) {
      const u = rnd();
      let c = PAL[0][0];
      let acc = 0;
      for (const [cc, w] of PAL) {
        acc += w;
        if (u < acc) {
          c = cc;
          break;
        }
      }
      pts.push({ th: rnd() * Math.PI * 2, ph: rnd() * Math.PI * 2, sp: 0.6 + rnd() * 0.8, len: 4 + rnd() * 5, c, tw: rnd() * Math.PI * 2, u: null });
    }

    /** The wordmark is set at 100px, measured, then scaled to fill its line exactly. */
    const fitFw = () => {
      if (!fw || !wrap) return;
      fw.style.fontSize = "100px";
      const w = fw.offsetWidth;
      const W = wrap.clientWidth;
      if (w && W) fw.style.fontSize = `${Math.floor(((100 * W) / w) * 0.995)}px`;
    };
    fitFw();
    if (document.fonts) document.fonts.ready.then(fitFw);
    const ro = new ResizeObserver(fitFw);
    if (wrap) ro.observe(wrap);

    let cx = 0.5;
    let cy = 0.5;
    let spin = 0;
    let lastY = window.scrollY;
    let flT: number | null = null;
    const lift = new WeakMap<HTMLElement, number>();

    let mxp = -9999;
    let myp = -9999;
    let mIn = false;
    const onMove = (e: MouseEvent) => {
      mxp = e.clientX;
      myp = e.clientY;
      mIn = true;
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) mIn = false;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);

    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const out = (t: number) => 1 - Math.pow(1 - t, 3);

    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const T = now / 1000;
      const vh = window.innerHeight;

      const sv = window.scrollY - lastY;
      lastY = window.scrollY;
      spin += (Math.min(60, Math.abs(sv)) * 0.006 - spin) * (1 - Math.exp(-dt * 3));

      const r = panel.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        const w = r.width;
        const h = r.height;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
          cv.width = Math.round(w * dpr);
          cv.height = Math.round(h * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        const inside = fine && mIn && mxp > r.left && mxp < r.right && myp > r.top && myp < r.bottom;
        const narrow = w < 700;
        // Resting focus is dead centre now that the copy is centred: the band
        // peaks at mid-radius, so the streaks ring the text instead of crossing it.
        const tx = inside ? (mxp - r.left) / w : 0.5;
        const ty = inside ? (myp - r.top) / h : 0.5;
        const e = 1 - Math.exp(-dt * (inside ? 5 : 2.2));
        cx += (tx - cx) * e;
        cy += (ty - cy) * e;

        const grow = out(cl((vh - r.top) / (vh * 0.9)));
        const R = Math.min(w, h) * (narrow ? 0.5 : 0.44) * (0.75 + 0.25 * grow);
        const ox = cx * w;
        const oy = cy * h;
        const rMin = R * 0.08;
        const rMax = R * 1.35;
        const ys = 0.86 + 0.06 * Math.sin(T * 0.3);
        const flow = reduced ? 0 : dt * (0.11 + spin * 1.6);
        ctx.lineCap = "round";

        for (const p of pts) {
          if (p.u == null) p.u = (p.th * 7.13 + p.ph) % 1;
          p.u += flow * p.sp;
          if (p.u >= 1) {
            p.u -= 1;
            p.th = Math.random() * Math.PI * 2;
          }
          const th = p.th + T * 0.04 + 0.25 * p.u;
          const ease = p.u * p.u * (3 - 2 * p.u) * 0.35 + p.u * 0.65;
          const rr = rMin + (rMax - rMin) * ease + R * 0.04 * Math.sin(3 * th + T * 0.8);
          const ct = Math.cos(th);
          const st = Math.sin(th) * ys;
          const band = Math.pow(Math.sin(Math.PI * p.u), 1.4);
          const tw = reduced ? 1 : 0.6 + 0.4 * Math.sin(T * 2.4 + p.tw);
          const alpha = Math.min(1, band * (0.35 + 0.75 * (1 - p.u * 0.4)) * tw * grow);
          if (alpha < 0.03) continue;
          const L = (p.len * 0.45 + 7 * p.u) * (1 + spin * 6);
          const dl = Math.hypot(ct, st) || 1;
          const dx = ((ct / dl) * L) / 2;
          const dy = ((st / dl) * L) / 2;
          const px = ox + ct * rr;
          const py = oy + st * rr;
          ctx.strokeStyle = `rgba(${p.c},${alpha.toFixed(3)})`;
          ctx.lineWidth = 1.2 + p.u * 1.1;
          ctx.beginPath();
          ctx.moveTo(px - dx, py - dy);
          ctx.lineTo(px + dx, py + dy);
          ctx.stroke();
        }
      }

      if (caret) caret.style.opacity = reduced ? "1" : Math.floor(now / 530) % 2 ? "0" : "1";

      if (letters.length && wrap) {
        const wr = wrap.getBoundingClientRect();
        if (flT == null && wr.top < vh * 0.95) flT = now;
        // Letters lean toward the cursor while it is near the wordmark line.
        const near = fine && mIn && !reduced && myp > wr.top - 80 && myp < wr.bottom + 40;
        letters.forEach((el, i) => {
          const k = reduced ? 1 : flT == null ? 0 : out(cl((now - flT - i * 70) / 950));
          let want = 0;
          if (near) {
            const lr = el.getBoundingClientRect();
            want = Math.max(0, 1 - Math.abs(mxp - (lr.left + lr.width / 2)) / (lr.width * 1.5));
          }
          const cur = (lift.get(el) ?? 0) + (want - (lift.get(el) ?? 0)) * (1 - Math.exp(-dt * 7));
          lift.set(el, cur);
          const idle = reduced || i > 1 ? 0 : (2 + 2 * Math.sin(T * 1.3 + i * 1.1)) * k;
          const y = (1 - k) * 105 - cur * 14 - idle;
          el.style.transform = `translate3d(0,${y}%,0) rotate(${-cur * 3 * (i % 2 ? 1 : -1)}deg)`;
        });
      }
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return null;
}
