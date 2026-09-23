"use client";

import { RefObject, useEffect } from "react";

/**
 * Scroll map (0 → 1 across the sticky section):
 * 0.00–0.30  headline + company stickers drifting, terminal waiting below
 * 0.30–0.76  stickers fly into the sync log, terminal rises and fills the frame
 * 0.76–0.93  log swaps to the live assessment, camera pushes into the screen
 * 0.93–1.00  closing line + CTA
 *
 * Positions are fractions of the panel box so the whole scene reflows at any size.
 * `cx`/`cy` are the bezier control points each sticker arcs through on its way
 * into the log row with the same index.
 */
type Spot = { x: number; y: number; cx: number; cy: number; r: number };

const DESKTOP: Spot[] = [
  { x: 0.215, y: 0.245, cx: 0.62, cy: 0.3, r: -5 },
  { x: 0.787, y: 0.245, cx: 0.48, cy: 0.34, r: 4 },
  { x: 0.07, y: 0.465, cx: 0.3, cy: 0.6, r: -7 },
  { x: 0.867, y: 0.48, cx: 0.97, cy: 0.78, r: 6 },
  { x: 0.235, y: 0.665, cx: 0.18, cy: 0.3, r: -3 },
  { x: 0.9, y: 0.305, cx: 0.7, cy: 0.1, r: 5 },
  { x: 0.13, y: 0.34, cx: 0.4, cy: 0.18, r: -4 },
  { x: 0.778, y: 0.573, cx: 0.62, cy: 0.44, r: 3 },
  { x: 0.185, y: 0.47, cx: 0.04, cy: 0.8, r: -6 },
  { x: 0.8, y: 0.43, cx: 0.93, cy: 0.62, r: 4 },
  { x: 0.16, y: 0.585, cx: 0.4, cy: 0.5, r: -2 },
  { x: 0.845, y: 0.665, cx: 0.72, cy: 0.34, r: 5 },
];

const TABLET: [number, number][] = [
  [0.1, 0.15],
  [0.3, 0.195],
  [0.52, 0.135],
  [0.72, 0.2],
  [0.9, 0.15],
  [0.1, 0.625],
  [0.3, 0.665],
  [0.5, 0.64],
  [0.7, 0.665],
  [0.9, 0.625],
];

const MOBILE: [number, number][] = [
  [0.16, 0.15],
  [0.52, 0.125],
  [0.85, 0.17],
  [0.32, 0.215],
  [0.7, 0.225],
  [0.14, 0.645],
  [0.5, 0.675],
  [0.86, 0.64],
];

const TERM_W = 1120;
const TERM_H = 672;
const OA_SECONDS = 2699;

type Layout = {
  w: number;
  h: number;
  mode: "d" | "t" | "m";
  n: number;
  s0: number;
  s1: number;
  spots: Spot[];
  rowPts: [number, number][];
  stag: number;
  dur: number;
  bs: number;
  cy0: number;
  cy1: number;
  sZ: number;
  lastEnd: number;
};

export function useCinematicHero(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Markup is owned by Hero.tsx, so every hook below is guaranteed to exist.
    const q = (s: string) => el.querySelector(s) as HTMLElement;
    const qa = (s: string) => Array.from(el.querySelectorAll(s)) as HTMLElement[];

    const E = {
      panel: q(".cine-panel"),
      grid: q(".cine-grid"),
      dim: q(".cine-dim"),
      head: q(".cine-head"),
      term: q(".cine-term"),
      glow: q(".cine-glow"),
      rim: q(".cine-rim"),
      log: q(".cine-log"),
      wait: q(".cine-wait"),
      load: q(".cine-load"),
      loaded: q(".cine-loaded"),
      launch: q(".cine-launch"),
      cur1: q(".cine-cur1"),
      cur2: q(".cine-cur2"),
      ui: q(".cine-ui"),
      flash: q(".cine-flash"),
      scan: q(".cine-scan"),
      vig: q(".cine-vig"),
      final: q(".cine-final"),
      timer: q(".cine-timer"),
      caret: q(".cine-caret"),
      rows: qa(".cine-row"),
      st: qa(".cine-sticker"),
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    el.style.height = (reduced ? 200 : 320) + "vh";

    let L: Layout | null = null;
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;
    let cur: number | null = null;
    let last = 0;
    let navOp = -1;
    let clock = "";
    const t0 = performance.now();

    const layout = () => {
      const w = E.panel.clientWidth;
      const h = E.panel.clientHeight;
      if (!w || !h) return;

      const mode: Layout["mode"] = w < 640 ? "m" : w >= 1100 || (w >= 860 && w / h > 1.25) ? "d" : "t";
      const set = mode === "d" ? DESKTOP.map((c) => [c.x, c.y] as [number, number]) : mode === "t" ? TABLET : MOBILE;
      const n = set.length;

      // Wide enough to read, never wider than the panel can frame.
      const width = mode === "d" ? Math.min(0.52 * w, 960) : mode === "t" ? 0.74 * w : 0.92 * w;
      const s0 = width / TERM_W;
      const s1 = Math.min(s0 * 1.32, (0.94 * w) / TERM_W, (0.74 * h) / TERM_H);

      const spots: Spot[] = set.map((xy, i) => {
        if (mode === "d") return DESKTOP[i];
        // Bend the arc away from the straight line so tablet/mobile paths still curve.
        const mid = [(xy[0] + 0.5) / 2, (xy[1] + 0.5) / 2];
        const dx = 0.5 - xy[0];
        const dy = 0.5 - xy[1];
        const sg = i % 2 ? 1 : -1;
        return {
          x: xy[0],
          y: xy[1],
          cx: mid[0] - (dy * h * 0.35 * sg) / w,
          cy: mid[1] + (dx * w * 0.35 * sg) / h,
          r: DESKTOP[i].r * 0.8,
        };
      });

      E.st.forEach((s, i) => {
        s.style.display = i < n ? "" : "none";
      });

      // The log is authored at 1120px wide, then scaled up on smaller panels so it stays legible.
      const k = mode === "m" ? 1.55 : mode === "t" ? 1.2 : 1;
      E.log.style.transform = `scale(${k})`;
      E.log.style.width = TERM_W / k + "px";

      const rowPts = E.rows.map((r) => [r.offsetLeft * k + 60 * k, 40 + (r.offsetTop + r.offsetHeight / 2) * k] as [number, number]);
      const stag = mode === "d" ? 0.028 : mode === "t" ? 0.032 : 0.04;
      const dur = mode === "d" ? 0.13 : mode === "t" ? 0.135 : 0.14;

      L = {
        w,
        h,
        mode,
        n,
        s0,
        s1,
        spots,
        rowPts,
        stag,
        dur,
        bs: mode === "m" ? 0.85 : mode === "t" ? 0.92 : 1,
        cy0: (mode === "m" ? 0.73 : 0.7) * h + (TERM_H / 2) * s0,
        cy1: (mode === "m" ? 0.52 : 0.55) * h,
        sZ: Math.max(w / TERM_W, h / TERM_H) * 1.9,
        lastEnd: 0.3 + (n - 1) * stag + dur,
      };
    };

    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const rp = (a: number, b: number, p: number) => cl((p - a) / (b - a));
    const sm = (t: number) => t * t * (3 - 2 * t);
    const lp = (a: number, b: number, t: number) => a + (b - a) * t;
    const io = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const blur = (node: HTMLElement, amount: number) => {
      node.style.filter = amount > 0.05 ? `blur(${amount}px)` : "none";
    };

    const frame = (now: number) => {
      if (!L) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const T = now / 1000;
      const { w, h } = L;

      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      // In dev, `window.__oaP = 0.9` pins one beat of the sequence for inspection.
      const forced = process.env.NODE_ENV === "production" ? undefined : (window as { __oaP?: number }).__oaP;
      const target = forced != null ? cl(forced) : span > 0 ? cl(-rect.top / span) : 0;
      if (cur == null) cur = target;
      cur += (target - cur) * (1 - Math.exp(-dt * 7));
      if (Math.abs(target - cur) < 1e-4) cur = target;
      const p = cur;

      const parallax = fine && !reduced && L.mode !== "m";
      const ease = 1 - Math.exp(-dt * 4);
      mx += ((parallax ? tmx : 0) - mx) * ease;
      my += ((parallax ? tmy : 0) - my) * ease;

      const left = Math.max(0, OA_SECONDS - Math.floor((now - t0) / 1000));
      const stamp = String(Math.floor(left / 60)).padStart(2, "0") + ":" + String(left % 60).padStart(2, "0");
      if (stamp !== clock) {
        clock = stamp;
        E.timer.textContent = stamp;
      }
      const blink = reduced ? 1 : Math.floor(T * 1.8) % 2 ? 0 : 1;
      E.caret.style.opacity = String(blink);

      if (reduced) {
        const hr = sm(rp(0.35, 0.6, p));
        E.term.style.transform = `translate3d(${w / 2 - TERM_W / 2}px,${L.cy0 - TERM_H / 2}px,0) scale(${L.s0})`;
        E.term.style.opacity = String(1 - hr);
        E.head.style.opacity = String(1 - hr);
        E.log.style.opacity = "0";
        E.ui.style.opacity = "1";
        E.st.forEach((s, i) => {
          if (i >= L!.n) return;
          const c = L!.spots[i];
          s.style.opacity = String(1 - hr);
          s.style.transform = `translate3d(${c.x * w}px,${c.y * h}px,0) translate(-50%,-50%) rotate(${c.r}deg) scale(${L!.bs})`;
        });
        E.final.style.opacity = String(hr);
        E.final.style.pointerEvents = hr > 0.9 ? "auto" : "none";
        return;
      }

      const a = sm(rp(0.15, 0.3, p));
      const b = io(rp(0.3, 0.76, p));
      const z = io(rp(0.77, 0.93, p));
      const mf = 1 - rp(0.1, 0.3, p);

      E.grid.style.transform = `translate3d(${mx * 2 * mf}px,${my * 2 * mf - 40 * rp(0, 0.9, p)}px,0) scale(${1 + 0.05 * b + 0.1 * z})`;
      E.dim.style.opacity = String((0.55 * sm(rp(0.28, 0.76, p)) + 0.3 * z) * (1 - rp(0.93, 0.99, p)));

      const hf = sm(rp(0.3, 0.52, p));
      E.head.style.transform = `translate3d(${-mx * 1.5 * mf}px,${-22 * a - 80 * hf}px,0) scale(${1 - 0.04 * hf})`;
      E.head.style.opacity = String((1 - 0.25 * a) * (1 - sm(rp(0.3, 0.5, p))));
      blur(E.head, 5 * rp(0.32, 0.52, p));

      // The page nav steps aside while the camera is inside the screen.
      const nav = cl(1 - sm(rp(0.8, 0.88, p)) + sm(rp(0.95, 1, p)));
      if (Math.abs(nav - navOp) > 0.01) {
        navOp = nav;
        document.documentElement.style.setProperty("--nav-op", String(nav));
      }

      const tv: number[] = [];
      let pulse = 0;
      for (let i = 0; i < L.n; i++) {
        const t = cl((p - (0.3 + i * L.stag)) / L.dur);
        tv.push(t);
        if (t > 0.85 && t < 1) pulse = Math.max(pulse, Math.sin((Math.PI * (t - 0.85)) / 0.15));
      }

      const sPre = L.s0 * (1 + 0.04 * a);
      const sB = lp(sPre, L.s1, b);
      const s = sB * Math.pow(L.sZ / sB, z);
      const cyB = lp(lp(L.cy0, L.cy0 - 0.05 * h, a), L.cy1, b);
      const cx = w / 2 - 200 * s * z + mx * 5 * mf;
      const cy = lp(cyB, h / 2 + 53 * s, z) + my * 5 * mf;
      const rx = lp(10, 3, b) * (1 - z);
      E.term.style.transform = `translate3d(${cx - TERM_W / 2}px,${cy - TERM_H / 2}px,0) perspective(1800px) rotateX(${rx}deg) scale(${s})`;
      E.term.style.opacity = String(1 - rp(0.955, 0.99, p));
      E.glow.style.opacity = String((0.35 + 0.45 * b + 0.3 * pulse) * (1 - z));
      E.rim.style.opacity = String(0.12 + 0.5 * pulse * (1 - z));

      E.wait.style.opacity = String(1 - rp(0.29, 0.31, p));
      E.load.style.opacity = String(rp(0.29, 0.31, p));
      E.cur1.style.opacity = String(p < 0.3 ? blink : 0);
      E.rows.forEach((row, i) => {
        const rv = sm(rp(0.86, 1, tv[Math.min(i, L!.n - 1)]));
        row.style.opacity = String(rv);
        row.style.transform = `translateX(${(rv - 1) * 10}px)`;
      });

      const le = L.lastEnd;
      E.loaded.style.opacity = String(rp(le + 0.002, le + 0.012, p));
      E.launch.style.opacity = String(rp(le + 0.01, le + 0.02, p));
      E.cur2.style.opacity = String(p > le + 0.02 && p < 0.78 ? blink : 0);
      E.log.style.opacity = String(1 - rp(0.755, 0.785, p));
      E.ui.style.opacity = String(rp(0.755, 0.8, p) * (1 - rp(0.905, 0.955, p)));
      blur(E.ui, 1.6 * rp(0.88, 0.95, p));

      const fl = sm(rp(0.87, 0.935, p)) * (1 - rp(0.95, 0.99, p));
      E.flash.style.opacity = String(fl * 0.9);
      E.scan.style.opacity = String(fl * 0.7);
      E.vig.style.opacity = String(sm(rp(0.8, 0.9, p)) * (1 - rp(0.955, 0.995, p)));

      const hr = sm(rp(0.935, 1, p));
      E.final.style.opacity = String(hr);
      E.final.style.transform = `translate3d(0,${(1 - hr) * 28}px,0) scale(${1.04 - 0.04 * hr})`;
      blur(E.final, (1 - hr) * 8);
      E.final.style.pointerEvents = hr > 0.9 ? "auto" : "none";

      for (let i = 0; i < L.n; i++) {
        const node = E.st[i];
        const c = L.spots[i];
        const t = tv[i];
        const amp = 2 + ((i * 37) % 5);
        const sp = 0.55 + ((i * 53) % 7) * 0.06;
        const ph = i * 1.7;
        const x0 = c.x * w + mx * 4 * mf;
        const y0 = c.y * h - 14 * a + my * 4 * mf;

        let x = x0;
        let y = y0 + amp * Math.sin(T * sp * 2 + ph) * (1 - t);
        let rot = c.r + 1.1 * Math.sin(T * sp * 1.3 + ph * 1.3) * (1 - t);
        let sc = L.bs;
        let op = 1;
        let bl = 0;

        if (t > 0) {
          const te = Math.pow(t, 2.2);
          const u = 1 - te;
          const pt = L.rowPts[i];
          const px = cx + (pt[0] - TERM_W / 2) * s;
          const py = cy + (pt[1] - TERM_H / 2) * s;
          const qx = c.cx * w;
          const qy = c.cy * h;
          x = u * u * x0 + 2 * u * te * qx + te * te * px;
          y = u * u * y + 2 * u * te * qy + te * te * py;
          const tx = 2 * u * (qx - x0) + 2 * te * (px - qx);
          const ty = 2 * u * (qy - y0) + 2 * te * (py - qy);
          let ang = (Math.atan2(ty, tx) * 180) / Math.PI;
          if (ang > 90) ang -= 180;
          if (ang < -90) ang += 180;
          rot = lp(rot, ang * 0.3, sm(rp(0, 0.6, t)));
          sc = L.bs * lp(1, 0.5, te);
          bl = 1.8 * sm(rp(0.45, 0.95, t));
          op = 1 - sm(rp(0.8, 1, t));
        }

        node.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`;
        node.style.opacity = String(op);
        blur(node, bl);
      }
    };

    const onMove = (e: MouseEvent) => {
      const r = E.panel.getBoundingClientRect();
      tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tmy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onResize = () => layout();

    layout();
    frame(performance.now());
    el.classList.add("is-live");
    if (document.fonts) document.fonts.ready.then(layout);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    let raf = 0;
    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      document.documentElement.style.removeProperty("--nav-op");
    };
  }, [root]);
}
