"use client";

import { RefObject, useEffect } from "react";

/**
 * Scroll map (0 → 1 across the 320vh section), ported from the design's frame():
 * 0.00–0.30  headline holds, stickers drift, terminal waits below
 * 0.30–0.76  stickers arc into the sync log, terminal rises and fills the panel
 * 0.77–0.93  log swaps to the live assessment, camera pushes into the screen
 * 0.93–1.00  closing frame and CTA
 *
 * The animation runs over the first HOLD_AT of the section; the rest is a hold
 * on the closing frame, which scrolls on like the rest of the page.
 * On phones there is no track: the section is one screen, and the first swipe down
 * plays the whole map in PLAY_SECONDS while the page waits, the closing frame rests
 * for REST_SECONDS, and after that it scrolls like any other section.
 *
 * `cx`/`cy` are the bezier control points each sticker arcs through on its way
 * into the log row with the same index.
 */
const CO = [
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

type Spot = { x: number; y: number; cx: number; cy: number; r: number };
type Layout = {
  w: number;
  h: number;
  mode: "d" | "t" | "m";
  n: number;
  s0: number;
  s1: number;
  P: Spot[];
  rowPts: [number, number][];
  stag: number;
  dur: number;
  bs: number;
  cy0: number;
  cy1: number;
  sZ: number;
  lastEnd: number;
};

const OA_SECONDS = 2699;
/** Share of the section's scroll spent animating; the remainder holds the closing frame. */
const HOLD_AT = 0.74;
/** Phones: how long one swipe's playback takes, and where in the map it starts. */
const PLAY_SECONDS = 3.5;
/** Phones: how long the closing frame then stays put before a swipe can move on. */
const REST_SECONDS = 1.5;
const PLAY_FROM = 0.25;
const PHONE = "(max-width: 759px)";

export function useCinematicHero(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const q = (s: string) => el.querySelector(s) as HTMLElement;
    const qa = (s: string) => Array.from(el.querySelectorAll(s)) as HTMLElement[];
    const E = {
      panel: q(".cine-panel"),
      bg: q(".cine-bg"),
      noise: q(".cine-noise"),
      dim: q(".cine-dim"),
      vig: q(".cine-vig"),
      head: q(".cine-head"),
      st: qa(".cine-sticker"),
      term: q(".cine-term"),
      glow: q(".cine-glow"),
      rim: q(".cine-rim"),
      log: q(".cine-log"),
      wait: q(".cine-wait"),
      load: q(".cine-load"),
      rows: qa(".cine-row"),
      loaded: q(".cine-loaded"),
      launch: q(".cine-launch"),
      c1: q(".cine-cur1"),
      c2: q(".cine-cur2"),
      ui: q(".cine-ui"),
      flash: q(".cine-flash"),
      scan: q(".cine-scan"),
      hero: q(".cine-final"),
      timer: q(".cine-timer"),
      caret: q(".cine-caret"),
    };
    if (!E.panel || !E.term || !E.log) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const swipe = !reduced && window.matchMedia(PHONE).matches;
    el.style.height = reduced ? "220vh" : swipe ? "100vh" : "400vh";

    // Phones: one swipe down at the top of the page plays the sequence. The page is
    // held while it plays and for a short rest on the closing frame, then scrolls
    // freely. Opened part-way down, the hero is simply finished.
    let playAt = swipe && window.scrollY > 8 ? -1e9 : 0;
    let touchY = 0;
    const playing = () => playAt > 0 && performance.now() - playAt < (PLAY_SECONDS + REST_SECONDS) * 1000;
    const start = () => {
      if (playAt || window.scrollY > 8) return false;
      playAt = performance.now();
      return true;
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const down = touchY - (e.touches[0]?.clientY ?? touchY) > 6;
      if (down && (start() || playing()) && e.cancelable) e.preventDefault();
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && (start() || playing())) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key) && (start() || playing())) e.preventDefault();
    };
    if (swipe) {
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey);
    }

    // Film grain, generated once rather than shipped as an asset.
    const nc = document.createElement("canvas");
    nc.width = nc.height = 140;
    const nx = nc.getContext("2d");
    if (nx) {
      const d = nx.createImageData(140, 140);
      for (let i = 0; i < d.data.length; i += 4) {
        const v = Math.random() * 255;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
        d.data[i + 3] = 255;
      }
      nx.putImageData(d, 0, 0);
      E.noise.style.backgroundImage = `url(${nc.toDataURL()})`;
    }

    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;
    const onMove = (e: MouseEvent) => {
      const r = E.panel.getBoundingClientRect();
      tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tmy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let L: Layout | null = null;
    const layout = () => {
      const w = E.panel.clientWidth;
      const h = E.panel.clientHeight;
      if (!w || !h) return;
      const mode: Layout["mode"] = w < 640 ? "m" : w >= 1100 || (w >= 860 && w / h > 1.25) ? "d" : "t";
      const set = mode === "d" ? CO.map((c) => [c.x, c.y] as [number, number]) : mode === "t" ? TABLET : MOBILE;
      const n = set.length;
      const W = mode === "d" ? Math.min(0.52 * w, 960) : mode === "t" ? 0.74 * w : 0.92 * w;
      const s0 = W / 1120;
      const s1 = Math.min(s0 * 1.32, (0.94 * w) / 1120, (0.74 * h) / 672);
      const P: Spot[] = set.map((xy, i) => {
        if (mode === "d") return { x: xy[0], y: xy[1], cx: CO[i].cx, cy: CO[i].cy, r: CO[i].r };
        // Off-desktop the control points are mirrored around the centre instead.
        const mxp = (xy[0] + 0.5) / 2;
        const myp = (xy[1] + 0.5) / 2;
        const dx = 0.5 - xy[0];
        const dy = 0.5 - xy[1];
        const sg = i % 2 ? 1 : -1;
        return { x: xy[0], y: xy[1], cx: mxp - (dy * h * 0.35 * sg) / w, cy: myp + (dx * w * 0.35 * sg) / h, r: CO[i].r * 0.8 };
      });
      E.st.forEach((s, i) => {
        s.style.left = "0";
        s.style.top = "0";
        s.style.display = i < n ? "" : "none";
      });
      const k = mode === "m" ? 1.55 : mode === "t" ? 1.2 : 1;
      E.log.style.transform = `scale(${k})`;
      E.log.style.width = `${1120 / k}px`;
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
        P,
        rowPts,
        stag,
        dur,
        bs: mode === "m" ? 0.85 : mode === "t" ? 0.92 : 1,
        cy0: (mode === "m" ? 0.73 : 0.7) * h + 336 * s0,
        cy1: (mode === "m" ? 0.52 : 0.55) * h,
        sZ: Math.max(w / 1120, h / 672) * 1.9,
        lastEnd: 0.3 + (n - 1) * stag + dur,
      };
    };

    layout();
    if (document.fonts) document.fonts.ready.then(layout);
    const ro = new ResizeObserver(layout);
    ro.observe(E.panel);

    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const rp = (a: number, b: number, p: number) => cl((p - a) / (b - a));
    const sm = (t: number) => t * t * (3 - 2 * t);
    const lp = (a: number, b: number, t: number) => a + (b - a) * t;
    const io = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const t0 = performance.now();
    let cur: number | null = null;
    let last = 0;
    let tstr = "";
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!L) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const T = now / 1000;
      const rect = el.getBoundingClientRect();
      const tot = rect.height - window.innerHeight;
      const tg = swipe
        ? playAt
          ? PLAY_FROM + (1 - PLAY_FROM) * cl((now - playAt) / 1000 / PLAY_SECONDS)
          : 0
        : tot > 0
          ? cl(-rect.top / tot / (reduced ? 1 : HOLD_AT))
          : 0;
      if (cur == null) cur = tg;
      cur += (tg - cur) * (1 - Math.exp(-dt * 7));
      if (Math.abs(tg - cur) < 1e-4) cur = tg;
      const p = cur;
      const { w, h } = L;

      const mp = fine && L.mode !== "m";
      const me = 1 - Math.exp(-dt * 4);
      mx += ((mp ? tmx : 0) - mx) * me;
      my += ((mp ? tmy : 0) - my) * me;

      const rem = Math.max(0, OA_SECONDS - Math.floor((now - t0) / 1000));
      const nextT = `${String(Math.floor(rem / 60)).padStart(2, "0")}:${String(rem % 60).padStart(2, "0")}`;
      if (nextT !== tstr) {
        tstr = nextT;
        if (E.timer) E.timer.textContent = nextT;
      }
      const blink = Math.floor(T * 1.8) % 2 ? 0 : 1;
      if (E.caret) E.caret.style.opacity = String(blink);

      if (reduced) {
        const hr = sm(rp(0.35, 0.6, p));
        E.term.style.transform = `translate3d(${w / 2 - 560}px,${L.cy0 - 336}px,0) scale(${L.s0 * (1 - 0.02 * hr)})`;
        E.term.style.opacity = String(1 - hr);
        E.head.style.opacity = String(1 - hr);
        E.log.style.opacity = "0";
        E.ui.style.opacity = "1";
        E.st.forEach((s, i) => {
          if (i >= L!.n) return;
          const c = L!.P[i];
          s.style.opacity = String(1 - hr);
          s.style.transform = `translate3d(${c.x * w}px,${c.y * h}px,0) translate(-50%,-50%) rotate(${c.r}deg) scale(${L!.bs})`;
        });
        E.hero.style.opacity = String(hr);
        E.hero.style.transform = `scale(${0.98 + 0.02 * hr})`;
        E.hero.style.pointerEvents = hr > 0.9 ? "auto" : "none";
        return;
      }

      const a = sm(rp(0.15, 0.3, p));
      const b = io(rp(0.3, 0.76, p));
      const z = io(rp(0.77, 0.93, p));
      const mf = 1 - rp(0.1, 0.3, p);

      E.bg.style.transform = `translate3d(${mx * 2 * mf}px,${my * 2 * mf - 40 * rp(0, 0.9, p)}px,0) scale(${1 + 0.05 * b + 0.1 * z})`;
      E.dim.style.opacity = String((0.55 * sm(rp(0.28, 0.76, p)) + 0.3 * z) * (1 - rp(0.93, 0.99, p)));

      const hf = sm(rp(0.3, 0.52, p));
      E.head.style.transform = `translate3d(${-mx * 1.5 * mf}px,${-22 * a - 80 * hf}px,0) scale(${1 - 0.04 * hf})`;
      E.head.style.opacity = String((1 - 0.25 * a) * (1 - sm(rp(0.3, 0.5, p))));
      const hb = 5 * rp(0.32, 0.52, p);
      E.head.style.filter = hb > 0.05 ? `blur(${hb}px)` : "none";

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
      E.term.style.transform = `translate3d(${cx - 560}px,${cy - 336}px,0) perspective(1800px) rotateX(${rx}deg) scale(${s})`;
      E.term.style.opacity = String(1 - rp(0.955, 0.99, p));
      E.glow.style.opacity = String((0.35 + 0.45 * b + 0.3 * pulse) * (1 - z));
      E.rim.style.opacity = String(0.12 + 0.5 * pulse * (1 - z));

      E.wait.style.opacity = String(1 - rp(0.29, 0.31, p));
      E.load.style.opacity = String(rp(0.29, 0.31, p));
      E.c1.style.opacity = String(p < 0.3 ? blink : 0);
      E.rows.forEach((row, i) => {
        const rv = sm(rp(0.86, 1, tv[Math.min(i, L!.n - 1)]));
        row.style.opacity = String(rv);
        row.style.transform = `translateX(${(rv - 1) * 10}px)`;
      });
      const le = L.lastEnd;
      E.loaded.style.opacity = String(rp(le + 0.002, le + 0.012, p));
      E.launch.style.opacity = String(rp(le + 0.01, le + 0.02, p));
      E.c2.style.opacity = String(p > le + 0.02 && p < 0.78 ? blink : 0);
      E.log.style.opacity = String(1 - rp(0.755, 0.785, p));
      E.ui.style.opacity = String(rp(0.755, 0.8, p) * (1 - rp(0.905, 0.955, p)));
      const ub = 1.6 * rp(0.88, 0.95, p);
      E.ui.style.filter = ub > 0.05 ? `blur(${ub}px)` : "none";
      const fl = sm(rp(0.87, 0.935, p)) * (1 - rp(0.95, 0.99, p));
      E.flash.style.opacity = String(fl * 0.9);
      E.scan.style.opacity = String(fl * 0.7);
      E.vig.style.opacity = String(sm(rp(0.8, 0.9, p)) * (1 - rp(0.955, 0.995, p)));

      const hr = sm(rp(0.935, 1, p));
      E.hero.style.opacity = String(hr);
      E.hero.style.transform = `translate3d(0,${(1 - hr) * 28}px,0) scale(${1.04 - 0.04 * hr})`;
      const hbl = (1 - hr) * 8;
      E.hero.style.filter = hr > 0 && hbl > 0.05 ? `blur(${hbl}px)` : "none";
      E.hero.style.pointerEvents = hr > 0.9 ? "auto" : "none";

      for (let i = 0; i < L.n; i++) {
        const node = E.st[i];
        const c = L.P[i];
        const t = tv[i];
        const amp = 2 + ((i * 37) % 5);
        const sp = 0.55 + ((i * 53) % 7) * 0.06;
        const ph = i * 1.7;
        const x0 = c.x * w + mx * 4 * mf;
        const y0 = c.y * h - 14 * a + my * 4 * mf;
        const sy = y0 + amp * Math.sin(T * sp * 2 + ph) * (1 - t);
        let x = x0;
        let y = sy;
        let rot = c.r + 1.1 * Math.sin(T * sp * 1.3 + ph * 1.3) * (1 - t);
        let sc = L.bs;
        let op = 1;
        let bl = 0;
        if (t > 0) {
          // Quadratic bezier from the drift spot, through the control point, into the row.
          const te = Math.pow(t, 2.2);
          const u = 1 - te;
          const rpt = L.rowPts[i];
          const px = cx + (rpt[0] - 560) * s;
          const py = cy + (rpt[1] - 336) * s;
          const qx = c.cx * w;
          const qy = c.cy * h;
          x = u * u * x0 + 2 * u * te * qx + te * te * px;
          y = u * u * sy + 2 * u * te * qy + te * te * py;
          const tx = 2 * u * (qx - x0) + 2 * te * (px - qx);
          const ty = 2 * u * (qy - sy) + 2 * te * (py - qy);
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
        node.style.filter = bl > 0.05 ? `blur(${bl}px)` : "none";
      }
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [root]);
}
